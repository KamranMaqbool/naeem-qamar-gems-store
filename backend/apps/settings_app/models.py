from django.db import models


class StoreSettings(models.Model):
    """Singleton model for global store configuration."""

    store_name = models.CharField(max_length=255, default="Virtuoso's Gems")
    contact_email = models.EmailField(blank=True)
    contact_phone = models.CharField(max_length=20, blank=True)
    default_currency = models.CharField(max_length=10, default='USD')
    tax_rate_percentage = models.DecimalField(
        max_digits=5, decimal_places=2, default=8.5,
    )
    free_shipping_threshold = models.DecimalField(
        max_digits=12, decimal_places=2, default=500,
    )
    order_prefix = models.CharField(max_length=20, default='GEM-')
    logo_url = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'store settings'
        verbose_name_plural = 'store settings'

    def __str__(self):
        return self.store_name

    def save(self, *args, **kwargs):
        # Ensure only one instance exists (singleton pattern)
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        """Return the singleton instance, creating it if needed."""
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj
