from decimal import Decimal

from django.utils import timezone
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.discounts.models import DiscountCode
from apps.discounts.serializers import (
    DiscountCodeSerializer,
    ValidateDiscountSerializer,
)


class ValidateDiscountView(APIView):
    """POST: validate a discount code against a cart total."""

    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = ValidateDiscountSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        code = serializer.validated_data['code'].upper()
        cart_total = serializer.validated_data['cart_total']
        now = timezone.now()

        try:
            discount = DiscountCode.objects.get(code=code)
        except DiscountCode.DoesNotExist:
            return Response(
                {'error': True, 'message': 'Invalid discount code.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Validity checks
        if not discount.is_active:
            return Response(
                {'error': True, 'message': 'This discount code is no longer active.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if now < discount.start_date or now > discount.end_date:
            return Response(
                {'error': True, 'message': 'This discount code has expired or is not yet valid.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if discount.max_uses > 0 and discount.current_uses >= discount.max_uses:
            return Response(
                {'error': True, 'message': 'This discount code has reached its maximum uses.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if cart_total < discount.min_purchase_amount:
            return Response(
                {'error': True, 'message': f'Minimum purchase of ${discount.min_purchase_amount} required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Calculate discount
        if discount.discount_type == DiscountCode.DiscountType.PERCENTAGE:
            discount_amount = cart_total * discount.value / Decimal('100')
        else:
            discount_amount = discount.value

        # Cap at max_discount_amount if set
        if discount.max_discount_amount and discount_amount > discount.max_discount_amount:
            discount_amount = discount.max_discount_amount

        return Response({
            'valid': True,
            'code': discount.code,
            'discount_type': discount.discount_type,
            'discount_amount': str(discount_amount),
            'new_total': str(cart_total - discount_amount),
        })


class AdminDiscountListCreateView(generics.ListCreateAPIView):
    """GET: list all discount codes, POST: create a new one."""

    serializer_class = DiscountCodeSerializer
    permission_classes = [IsAdminUser]
    queryset = DiscountCode.objects.all()


class AdminDiscountDetailView(generics.RetrieveUpdateDestroyAPIView):
    """GET/PUT/DELETE a single discount code."""

    serializer_class = DiscountCodeSerializer
    permission_classes = [IsAdminUser]
    queryset = DiscountCode.objects.all()
