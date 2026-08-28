from rest_framework import serializers

from apps.inventory.models import Inventory, StockLog


class InventorySerializer(serializers.ModelSerializer):
    product_title = serializers.CharField(source='product.title', read_only=True)
    product_sku = serializers.CharField(source='product.sku', read_only=True)

    class Meta:
        model = Inventory
        fields = [
            'id',
            'product',
            'product_title',
            'product_sku',
            'current_stock',
            'low_stock_threshold',
            'stock_status',
        ]
        read_only_fields = ['stock_status']


class StockLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockLog
        fields = [
            'id',
            'product',
            'quantity_change',
            'reason',
            'admin_user',
            'notes',
            'timestamp',
        ]


class ReceiveStockSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)
    reason = serializers.ChoiceField(choices=StockLog.Reason.choices)
    notes = serializers.CharField(required=False, allow_blank=True, default='')
