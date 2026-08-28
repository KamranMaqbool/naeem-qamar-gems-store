from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.orders.models import Order
from apps.payments.models import Payment
from apps.payments.serializers import InitiatePaymentSerializer, PaymentSerializer


class InitiatePaymentView(APIView):
    """POST: create a Payment record for an order."""

    def post(self, request):
        serializer = InitiatePaymentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        order_id = serializer.validated_data['order_id']
        payment_method = serializer.validated_data['payment_method']
        currency = serializer.validated_data['currency']

        try:
            order = Order.objects.get(pk=order_id)
        except Order.DoesNotExist:
            return Response(
                {'error': True, 'message': 'Order not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        payment = Payment.objects.create(
            order=order,
            payment_method=payment_method,
            amount=order.total_amount,
            currency=currency,
        )

        return Response(
            PaymentSerializer(payment).data,
            status=status.HTTP_201_CREATED,
        )


class PaymentWebhookView(APIView):
    """POST: webhook endpoint to update payment status.

    In production this would verify the gateway signature.
    """

    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        transaction_id = request.data.get('transaction_id')
        payment_status = request.data.get('status')

        if not transaction_id or not payment_status:
            return Response(
                {'error': True, 'message': 'transaction_id and status are required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            payment = Payment.objects.get(transaction_id=transaction_id)
        except Payment.DoesNotExist:
            return Response(
                {'error': True, 'message': 'Payment not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        payment.status = payment_status
        payment.gateway_response = request.data
        payment.save()

        # Sync order status when payment is confirmed
        if payment_status == Payment.Status.PAID:
            payment.order.order_status = Order.Status.PROCESSING
            payment.order.save()

        return Response({'success': True}, status=status.HTTP_200_OK)
