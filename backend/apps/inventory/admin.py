from django.contrib import admin

from apps.inventory.models import Inventory, StockLog


@admin.register(Inventory)
class InventoryAdmin(admin.ModelAdmin):
    list_display = ['product', 'current_stock', 'low_stock_threshold', 'stock_status']
    list_filter = ['stock_status']
    search_fields = ['product__title', 'product__sku']


@admin.register(StockLog)
class StockLogAdmin(admin.ModelAdmin):
    list_display = ['product', 'quantity_change', 'reason', 'admin_user', 'timestamp']
    list_filter = ['reason']
    search_fields = ['product__title']
    readonly_fields = ['timestamp']
