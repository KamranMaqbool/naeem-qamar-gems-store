from django.db import models


class BespokeInquiry(models.Model):
    """Custom jewelry design request from a customer."""

    class Status(models.TextChoices):
        NEW = 'NEW', 'New'
        IN_CONSULTATION = 'IN_CONSULTATION', 'In Consultation'
        QUOTE_SENT = 'QUOTE_SENT', 'Quote Sent'
        COMPLETED = 'COMPLETED', 'Completed'

    customer_name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    gemstone_preference = models.CharField(max_length=100)
    jewelry_type = models.CharField(max_length=100)
    precious_metal = models.CharField(max_length=100)
    budget_min = models.DecimalField(
        max_digits=12, decimal_places=2, null=True, blank=True,
    )
    budget_max = models.DecimalField(
        max_digits=12, decimal_places=2, null=True, blank=True,
    )
    description = models.TextField()
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.NEW,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'bespoke inquiries'

    def __str__(self):
        return f'{self.customer_name} — {self.jewelry_type} ({self.status})'


class BespokeAttachment(models.Model):
    """File attachment (inspiration images, etc.) for a bespoke inquiry."""

    inquiry = models.ForeignKey(
        BespokeInquiry,
        on_delete=models.CASCADE,
        related_name='attachments',
    )
    file_url = models.URLField(max_length=500)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Attachment for inquiry #{self.inquiry_id}'
