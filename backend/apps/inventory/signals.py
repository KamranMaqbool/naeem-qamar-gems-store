from django.db.models.signals import pre_save
from django.dispatch import receiver

from apps.inventory.models import Inventory


@receiver(pre_save, sender=Inventory)
def update_stock_status(sender, instance, **kwargs):
    """Auto-update stock_status based on current_stock vs low_stock_threshold."""
    if instance.current_stock <= 0:
        instance.stock_status = Inventory.StockStatus.OUT_OF_STOCK
    elif instance.current_stock <= instance.low_stock_threshold:
        instance.stock_status = Inventory.StockStatus.LOW_STOCK
    else:
        instance.stock_status = Inventory.StockStatus.IN_STOCK
