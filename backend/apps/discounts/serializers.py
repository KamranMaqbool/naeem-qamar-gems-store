from rest_framework import serializers

from apps.discounts.models import DiscountCode


class DiscountCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiscountCode
        fields = [
            'id', 'code', 'discount_type', 'value',
            'min_purchase_amount', 'max_discount_amount',
            'start_date', 'end_date', 'max_uses', 'current_uses',
            'is_active', 'created_at',
        ]


class ValidateDiscountSerializer(serializers.Serializer):
    code = serializers.CharField(max_length=50)
    cart_total = serializers.DecimalField(max_digits=12, decimal_places=2)
