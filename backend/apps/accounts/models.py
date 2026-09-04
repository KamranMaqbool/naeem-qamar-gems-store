from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Custom user model for Virtuoso's Gems."""

    class Role(models.TextChoices):
        CUSTOMER = 'CUSTOMER', 'Customer'
        STAFF = 'STAFF', 'Staff'
        SUPER_ADMIN = 'SUPER_ADMIN', 'Super Admin'

    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20, blank=True)
    avatar = models.URLField(max_length=500, blank=True)
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.CUSTOMER,
    )
    is_vip = models.BooleanField(default=False)
    total_lifetime_spend = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    class Meta:
        ordering = ['-date_joined']

    def __str__(self):
        return self.email


class Address(models.Model):
    """Shipping / billing address tied to a user."""

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='addresses',
    )
    street_address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100)
    is_default_shipping = models.BooleanField(default=False)
    is_default_billing = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'addresses'

    def __str__(self):
        return f'{self.street_address}, {self.city}'


class CustomerNote(models.Model):
    """Staff notes attached to a customer account."""

    customer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='notes',
    )
    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='authored_notes',
    )
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'Note on {self.customer.email} by {self.author.email}'
