from rest_framework import serializers

from apps.catalog.serializers import ProductImageSerializer
from apps.inventory.models import Inventory, StockLog


class InventorySerializer(serializers.ModelSerializer):
    product_title = serializers.CharField(source='product.title', read_only=True)
    product_sku = serializers.CharField(source='product.sku', read_only=True)
    product_category = serializers.CharField(source='product.category.name', read_only=True, default='Loose Gems')
    product_image = serializers.SerializerMethodField()

    def get_product_image(self, obj):
        image = obj.product.images.filter(is_primary=True).first() or obj.product.images.first()
        if not image:
            return ''
        # Keep the request context so a relative /media/... upload becomes
        # an absolute backend URL in production. Otherwise the Vercel admin
        # app tries to load it from its own domain and receives a 404.
        return ProductImageSerializer(image, context=self.context).data.get('image_url', '')

    class Meta:
        model = Inventory
        fields = [
            'id',
            'product',
            'product_title',
            'product_sku',
            'product_category',
            'product_image',
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
