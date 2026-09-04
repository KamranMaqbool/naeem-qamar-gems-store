from decimal import Decimal

from rest_framework import serializers

from apps.orders.models import Cart, CartItem, Order, OrderItem


class CartItemSerializer(serializers.ModelSerializer):
    product_title = serializers.CharField(source='product.title', read_only=True)
    product_sku = serializers.CharField(source='product.sku', read_only=True)
    product_price = serializers.DecimalField(
        source='product.sale_price',
        max_digits=12,
        decimal_places=2,
        read_only=True,
    )
    line_total = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = [
            'id', 'product', 'product_title', 'product_sku',
            'product_price', 'quantity', 'line_total', 'added_at',
        ]

    def get_line_total(self, obj):
        price = obj.product.sale_price or obj.product.base_price
        return str(price * obj.quantity)


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'items', 'total', 'created_at', 'updated_at']

    def get_total(self, obj):
        total = Decimal('0.00')
        for item in obj.items.select_related('product').all():
            price = item.product.sale_price or item.product.base_price
            total += price * item.quantity
        return str(total)


class AddToCartSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1, default=1)


class OrderItemSerializer(serializers.ModelSerializer):
    product_title = serializers.CharField(
        source='product.title', read_only=True, default='Deleted product',
    )

    class Meta:
        model = OrderItem
        fields = [
            'id', 'product', 'product_title', 'unit_price_at_purchase',
            'quantity', 'gemstone_snapshot',
        ]


class OrderListSerializer(serializers.ModelSerializer):
    items_count = serializers.IntegerField(source='items.count', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'order_status', 'total_amount',
            'items_count', 'created_at',
        ]


class OrderDetailSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'user', 'guest_email', 'guest_phone',
            'shipping_address', 'billing_address', 'subtotal',
            'discount_amount', 'tax_amount', 'shipping_cost',
            'total_amount', 'order_status', 'tracking_number',
            'carrier_name', 'discount_code', 'items',
            'created_at', 'updated_at',
        ]


class CheckoutSerializer(serializers.Serializer):
    shipping_address = serializers.DictField()
    billing_address = serializers.DictField()
    guest_email = serializers.EmailField(required=False, allow_blank=True, default='')
    guest_phone = serializers.CharField(required=False, allow_blank=True, default='')
    discount_code = serializers.CharField(required=False, allow_blank=True, default='')


class AdminOrderSerializer(serializers.ModelSerializer):
    """Used by admins to update status and tracking info."""

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'order_status', 'tracking_number',
            'carrier_name', 'total_amount', 'created_at', 'updated_at',
            'customer_name', 'customer_email', 'items_count',
        ]
        read_only_fields = ['id', 'order_number', 'total_amount', 'created_at', 'updated_at']

    customer_name = serializers.SerializerMethodField()
    customer_email = serializers.SerializerMethodField()
    items_count = serializers.IntegerField(source='items.count', read_only=True)

    def get_customer_name(self, obj):
        return obj.user.get_full_name() or obj.user.username if obj.user else 'Guest'

    def get_customer_email(self, obj):
        return obj.user.email if obj.user else obj.guest_email


class AdminOrderCreateSerializer(serializers.Serializer):
    """Validate the compact order form used by the admin console."""

    customer_name = serializers.CharField(max_length=255)
    customer_email = serializers.EmailField()
    customer_phone = serializers.CharField(required=False, allow_blank=True)
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)
    address = serializers.CharField()
    city = serializers.CharField()
    postal_code = serializers.CharField(required=False, allow_blank=True)
    country = serializers.CharField()
    notes = serializers.CharField(required=False, allow_blank=True)
