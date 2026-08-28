from django.contrib import admin

from apps.discounts.models import DiscountCode


@admin.register(DiscountCode)
class DiscountCodeAdmin(admin.ModelAdmin):
    list_display = [
        'code', 'discount_type', 'value', 'is_active',
        'current_uses', 'max_uses', 'start_date', 'end_date',
    ]
    list_filter = ['discount_type', 'is_active']
    search_fields = ['code']
