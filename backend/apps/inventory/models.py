from django.conf import settings
from django.db import models


class Inventory(models.Model):
    """Tracks stock levels for each product."""

    class StockStatus(models.TextChoices):
        IN_STOCK = 'IN_STOCK', 'In Stock'
        LOW_STOCK = 'LOW_STOCK', 'Low Stock'
        OUT_OF_STOCK = 'OUT_OF_STOCK', 'Out of Stock'

    product = models.OneToOneField(
        'catalog.Product',
        on_delete=models.CASCADE,
        related_name='inventory',
    )
    current_stock = models.IntegerField(default=0)
    low_stock_threshold = models.IntegerField(default=5)
    stock_status = models.CharField(
        max_length=20,
        choices=StockStatus.choices,
        default=StockStatus.OUT_OF_STOCK,
    )

    class Meta:
        verbose_name_plural = 'inventories'

    def __str__(self):
        return f'{self.product.title} — {self.stock_status}'


class StockLog(models.Model):
    """Audit trail for every stock change."""

    class Reason(models.TextChoices):
        RECEIVE_STOCK = 'RECEIVE_STOCK', 'Receive Stock'
        ORDER_FULFILLMENT = 'ORDER_FULFILLMENT', 'Order Fulfillment'
        MANUAL_ADJUSTMENT = 'MANUAL_ADJUSTMENT', 'Manual Adjustment'
        RETURN = 'RETURN', 'Return'

    product = models.ForeignKey(
        'catalog.Product',
        on_delete=models.CASCADE,
        related_name='stock_logs',
    )
    quantity_change = models.IntegerField()
    reason = models.CharField(
        max_length=30,
        choices=Reason.choices,
    )
    admin_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='stock_logs',
    )
    notes = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f'{self.product.title}: {self.quantity_change:+d} ({self.reason})'
