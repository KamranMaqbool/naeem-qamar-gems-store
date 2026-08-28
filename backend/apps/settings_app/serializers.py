from rest_framework import serializers

from apps.settings_app.models import StoreSettings


class PublicStoreSettingsSerializer(serializers.ModelSerializer):
    """Read-only subset of settings exposed to the public."""

    class Meta:
        model = StoreSettings
        fields = [
            'store_name', 'contact_email', 'contact_phone',
            'default_currency', 'tax_rate_percentage',
            'free_shipping_threshold', 'logo_url',
        ]
        read_only_fields = fields


class AdminStoreSettingsSerializer(serializers.ModelSerializer):
    """Full settings for admin management."""

    class Meta:
        model = StoreSettings
        fields = [
            'id', 'store_name', 'contact_email', 'contact_phone',
            'default_currency', 'tax_rate_percentage',
            'free_shipping_threshold', 'order_prefix', 'logo_url',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
