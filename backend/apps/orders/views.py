from decimal import Decimal

from rest_framework import generics, status
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.catalog.models import Product
from apps.orders.models import Cart, CartItem, Order, OrderItem
from apps.orders.serializers import (
    AddToCartSerializer,
    AdminOrderSerializer,
    AdminOrderCreateSerializer,
    CartSerializer,
    CheckoutSerializer,
    OrderDetailSerializer,
    OrderListSerializer,
)


# ── Helpers ──────────────────────────────────────────────────────────────

def _get_or_create_cart(request):
    """Return a cart for the current user or session."""
    if request.user.is_authenticated:
        cart, _ = Cart.objects.get_or_create(user=request.user)
    else:
        if not request.session.session_key:
            request.session.create()
        cart, _ = Cart.objects.get_or_create(session_key=request.session.session_key)
    return cart


# ── Cart ─────────────────────────────────────────────────────────────────

class CartView(APIView):
    """GET: retrieve cart, POST: add item, DELETE: clear cart."""

    def get(self, request):
        cart = _get_or_create_cart(request)
        return Response(CartSerializer(cart).data)

    def post(self, request):
        serializer = AddToCartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        product_id = serializer.validated_data['product_id']
        quantity = serializer.validated_data['quantity']

        try:
            product = Product.objects.get(pk=product_id, status='PUBLISHED')
        except Product.DoesNotExist:
            return Response(
                {'error': True, 'message': 'Product not found or not available.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        cart = _get_or_create_cart(request)
        item, created = CartItem.objects.get_or_create(
            cart=cart, product=product,
            defaults={'quantity': quantity},
        )
        if not created:
            item.quantity += quantity
            item.save()

        return Response(CartSerializer(cart).data, status=status.HTTP_200_OK)

    def delete(self, request):
        cart = _get_or_create_cart(request)
        cart.items.all().delete()
        return Response(CartSerializer(cart).data, status=status.HTTP_200_OK)


class CartItemDeleteView(APIView):
    """DELETE: remove a specific item from the cart."""

    def delete(self, request, pk):
        cart = _get_or_create_cart(request)
        deleted, _ = CartItem.objects.filter(pk=pk, cart=cart).delete()
        if not deleted:
            return Response(
                {'error': True, 'message': 'Cart item not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(CartSerializer(cart).data, status=status.HTTP_200_OK)


# ── Checkout ─────────────────────────────────────────────────────────────

class CheckoutView(APIView):
    """POST: convert cart into an order."""

    def post(self, request):
        serializer = CheckoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        cart = _get_or_create_cart(request)
        cart_items = cart.items.select_related('product', 'product__gemstone_attributes').all()

        if not cart_items.exists():
            return Response(
                {'error': True, 'message': 'Cart is empty.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Calculate subtotal
        subtotal = Decimal('0.00')
        order_items_data = []
        for ci in cart_items:
            price = ci.product.sale_price or ci.product.base_price
            gemstone_snapshot = None
            if hasattr(ci.product, 'gemstone_attributes'):
                ga = ci.product.gemstone_attributes
                gemstone_snapshot = {
                    'carat_weight': str(ga.carat_weight) if ga.carat_weight else None,
                    'cut_shape': ga.cut_shape,
                    'color_grade': ga.color_grade,
                    'clarity_grade': ga.clarity_grade,
                    'origin_country': ga.origin_country,
                    'precious_metal': ga.precious_metal,
                }
            order_items_data.append({
                'product': ci.product,
                'unit_price_at_purchase': price,
                'quantity': ci.quantity,
                'gemstone_snapshot': gemstone_snapshot,
            })
            subtotal += price * ci.quantity

        total_amount = subtotal  # discount / tax / shipping can be applied later

        order = Order.objects.create(
            user=request.user if request.user.is_authenticated else None,
            guest_email=data.get('guest_email', ''),
            guest_phone=data.get('guest_phone', ''),
            shipping_address=data['shipping_address'],
            billing_address=data['billing_address'],
            subtotal=subtotal,
            total_amount=total_amount,
            discount_code=data.get('discount_code', ''),
        )

        for item_data in order_items_data:
            OrderItem.objects.create(order=order, **item_data)

        # Clear the cart
        cart.items.all().delete()

        return Response(
            OrderDetailSerializer(order).data,
            status=status.HTTP_201_CREATED,
        )


# ── Customer order views ─────────────────────────────────────────────────

class MyOrdersView(generics.ListAPIView):
    """GET: list the authenticated user's orders."""

    serializer_class = OrderListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)


class OrderDetailView(generics.RetrieveAPIView):
    """GET: retrieve a single order by order_number."""

    serializer_class = OrderDetailSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'order_number'

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)


# ── Admin order views ────────────────────────────────────────────────────

class AdminOrderListView(generics.ListAPIView):
    """GET: list all orders, filterable by status."""

    serializer_class = AdminOrderSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        qs = Order.objects.all()
        order_status = self.request.query_params.get('status')
        if order_status:
            qs = qs.filter(order_status=order_status)
        search = self.request.query_params.get('search')
        if search:
            from django.db.models import Q
            qs = qs.filter(Q(order_number__icontains=search) | Q(guest_email__icontains=search) | Q(user__email__icontains=search) | Q(user__username__icontains=search))
        return qs

    def post(self, request, *args, **kwargs):
        serializer = AdminOrderCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        try:
            product = Product.objects.select_related('gemstone_attributes').get(
                pk=data['product_id'], status=Product.Status.PUBLISHED,
            )
        except Product.DoesNotExist:
            return Response({'message': 'Published product not found.'}, status=status.HTTP_400_BAD_REQUEST)

        price = product.sale_price or product.base_price
        subtotal = price * data['quantity']
        address = {
            'recipient_name': data['customer_name'],
            'address1': data['address'], 'city': data['city'],
            'postal_code': data.get('postal_code', ''), 'country': data['country'],
        }
        order = Order.objects.create(
            guest_email=data['customer_email'], guest_phone=data.get('customer_phone', ''),
            shipping_address=address,
            subtotal=subtotal, total_amount=subtotal,
            # Keep admin notes in the JSON address until a dedicated notes field is added.
            billing_address={**address, 'notes': data.get('notes', '')},
        )
        snapshot = None
        if hasattr(product, 'gemstone_attributes'):
            attrs = product.gemstone_attributes
            snapshot = {'cut_shape': attrs.cut_shape, 'color_grade': attrs.color_grade, 'carat_weight': str(attrs.carat_weight) if attrs.carat_weight else None}
        OrderItem.objects.create(order=order, product=product, unit_price_at_purchase=price, quantity=data['quantity'], gemstone_snapshot=snapshot)
        return Response(OrderDetailSerializer(order).data, status=status.HTTP_201_CREATED)


class AdminOrderDetailView(generics.RetrieveUpdateAPIView):
    """GET/PATCH: view or update an order (status, tracking)."""

    serializer_class = AdminOrderSerializer
    permission_classes = [IsAdminUser]
    queryset = Order.objects.all()
