import random
import string

from django.db import models


class Category(models.Model):
    """Product category with optional parent for subcategories."""

    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    parent = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='children',
    )
    image = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']
        verbose_name_plural = 'categories'

    def __str__(self):
        return self.name


class Product(models.Model):
    """Gemstone product listing."""

    class Status(models.TextChoices):
        DRAFT = 'DRAFT', 'Draft'
        PUBLISHED = 'PUBLISHED', 'Published'
        ARCHIVED = 'ARCHIVED', 'Archived'

    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    sku = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    base_price = models.DecimalField(max_digits=12, decimal_places=2)
    sale_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True,
    )
    is_featured = models.BooleanField(default=False)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.DRAFT,
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='products',
    )
    tags = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.sku:
            self.sku = self._generate_sku()
        super().save(*args, **kwargs)

    @staticmethod
    def _generate_sku():
        """Generate a SKU in the format LUX-XX-NNN."""
        letters = ''.join(random.choices(string.ascii_uppercase, k=2))
        digits = ''.join(random.choices(string.digits, k=3))
        return f'LUX-{letters}-{digits}'


class GemstoneAttributes(models.Model):
    """Detailed gemstone-specific attributes for a product."""

    product = models.OneToOneField(
        Product,
        on_delete=models.CASCADE,
        related_name='gemstone_attributes',
    )
    carat_weight = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        null=True,
        blank=True,
    )
    cut_shape = models.CharField(max_length=50, blank=True)
    color_grade = models.CharField(max_length=100, blank=True)
    clarity_grade = models.CharField(max_length=50, blank=True)
    origin_country = models.CharField(max_length=100, blank=True)
    lab_certification_number = models.CharField(max_length=100, blank=True)
    certification_lab = models.CharField(max_length=50, blank=True)
    precious_metal = models.CharField(max_length=100, blank=True)
    treatment = models.CharField(max_length=100, blank=True)

    class Meta:
        verbose_name_plural = 'gemstone attributes'

    def __str__(self):
        return f'Attributes for {self.product.title}'


class ProductImage(models.Model):
    """Image associated with a product."""

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='images',
    )
    image_url = models.URLField()
    alt_text = models.CharField(max_length=255, blank=True)
    display_order = models.IntegerField(default=0)
    is_primary = models.BooleanField(default=False)

    class Meta:
        ordering = ['display_order']

    def __str__(self):
        return f'Image for {self.product.title} (order={self.display_order})'
