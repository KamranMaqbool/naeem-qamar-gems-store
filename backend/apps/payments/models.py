from django.db import models


class Payment(models.Model):
    """Tracks payment against an order."""

    class Method(models.TextChoices):
        CREDIT_CARD = 'CREDIT_CARD', 'Credit Card'
        BANK_WIRE = 'BANK_WIRE', 'Bank Wire'
        CASH_ON_DELIVERY = 'CASH_ON_DELIVERY', 'Cash on Delivery'

    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        PAID = 'PAID', 'Paid'
        FAILED = 'FAILED', 'Failed'
        REFUNDED = 'REFUNDED', 'Refunded'

    order = models.ForeignKey(
        'orders.Order',
        on_delete=models.CASCADE,
        related_name='payments',
    )
    payment_method = models.CharField(
        max_length=30,
        choices=Method.choices,
    )
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=10, default='USD')
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )
    transaction_id = models.CharField(max_length=255, blank=True, unique=True, null=True)
    gateway_response = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'Payment {self.id} — {self.order.order_number} ({self.status})'
