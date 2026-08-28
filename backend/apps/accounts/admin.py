from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import Address, CustomerNote, User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['email', 'username', 'role', 'is_vip', 'total_lifetime_spend', 'is_staff']
    list_filter = ['role', 'is_vip', 'is_staff', 'is_active']
    search_fields = ['email', 'username']
    ordering = ['-date_joined']

    fieldsets = BaseUserAdmin.fieldsets + (
        ('Virtuoso\'s Gems', {
            'fields': ('phone_number', 'avatar', 'role', 'is_vip', 'total_lifetime_spend'),
        }),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Virtuoso\'s Gems', {
            'fields': ('email', 'phone_number', 'role'),
        }),
    )


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ['user', 'street_address', 'city', 'country', 'is_default_shipping', 'is_default_billing']
    list_filter = ['country', 'is_default_shipping', 'is_default_billing']
    search_fields = ['street_address', 'city', 'user__email']


@admin.register(CustomerNote)
class CustomerNoteAdmin(admin.ModelAdmin):
    list_display = ['customer', 'author', 'content', 'created_at']
    list_filter = ['created_at']
    search_fields = ['content', 'customer__email', 'author__email']
    raw_id_fields = ['customer', 'author']
