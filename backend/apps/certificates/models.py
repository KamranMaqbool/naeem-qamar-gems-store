from django.db import models


class Certificate(models.Model):
    """Lab certificate attached to a gemstone product."""

    product = models.ForeignKey(
        'catalog.Product',
        on_delete=models.CASCADE,
        related_name='certificates',
    )
    order = models.ForeignKey(
        'orders.Order',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='certificates',
    )
    lab_name = models.CharField(max_length=100)
    certificate_number = models.CharField(max_length=100, unique=True)
    pdf_file = models.URLField(max_length=500)
    issue_date = models.DateField()

    class Meta:
        ordering = ['-issue_date']

    def __str__(self):
        return f'{self.lab_name} — {self.certificate_number}'
