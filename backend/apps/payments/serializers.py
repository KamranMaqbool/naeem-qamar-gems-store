from rest_framework import serializers

from apps.payments.models import Payment


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = [
            'id', 'order', 'payment_method', 'amount', 'currency',
            'status', 'transaction_id', 'gateway_response',
            'created_at', 'updated_at',
        ]


class InitiatePaymentSerializer(serializers.Serializer):
    order_id = serializers.IntegerField()
    payment_method = serializers.ChoiceField(choices=Payment.Method.choices)
    currency = serializers.CharField(max_length=10, required=False, default='USD')
