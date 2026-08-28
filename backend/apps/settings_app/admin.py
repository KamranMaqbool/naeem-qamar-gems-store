from django.contrib import admin

from apps.settings_app.models import StoreSettings


@admin.register(StoreSettings)
class StoreSettingsAdmin(admin.ModelAdmin):
    list_display = ['store_name', 'contact_email', 'default_currency', 'tax_rate_percentage']

    def has_add_permission(self, request):
        # Only allow one instance
        return not StoreSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False
