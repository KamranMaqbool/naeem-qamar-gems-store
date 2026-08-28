from rest_framework import generics, status
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.catalog.models import Product
from apps.inventory.models import Inventory, StockLog
from apps.inventory.serializers import (
    InventorySerializer,
    ReceiveStockSerializer,
)


class AdminInventoryListView(generics.ListAPIView):
    """GET: List all inventory records, filterable by stock_status."""

    serializer_class = InventorySerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        qs = Inventory.objects.select_related('product').all()
        stock_status = self.request.query_params.get('stock_status')
        if stock_status:
            qs = qs.filter(stock_status=stock_status)
        return qs


class AdminReceiveStockView(APIView):
    """POST: Receive stock — updates inventory and creates a log entry."""

    permission_classes = [IsAdminUser]

    def post(self, request):
        serializer = ReceiveStockSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        product_id = serializer.validated_data['product_id']
        quantity = serializer.validated_data['quantity']
        reason = serializer.validated_data['reason']
        notes = serializer.validated_data['notes']

        try:
            product = Product.objects.get(pk=product_id)
        except Product.DoesNotExist:
            return Response(
                {'error': True, 'message': 'Product not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        inventory, _ = Inventory.objects.get_or_create(product=product)
        inventory.current_stock += quantity
        inventory.save()

        StockLog.objects.create(
            product=product,
            quantity_change=quantity,
            reason=reason,
            admin_user=request.user,
            notes=notes,
        )

        return Response(
            InventorySerializer(inventory).data,
            status=status.HTTP_200_OK,
        )
