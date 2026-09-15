from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from apps.settings_app.models import StoreSettings
from apps.settings_app.currency import CurrencyConversionError, convert_store_money
from apps.settings_app.serializers import (
    AdminStoreSettingsSerializer,
    PublicStoreSettingsSerializer,
)


class PublicSettingsView(APIView):
    """GET: public store settings (no auth required)."""

    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request):
        settings_obj = StoreSettings.load()
        return Response(PublicStoreSettingsSerializer(settings_obj).data)


class AdminSettingsView(APIView):
    """GET/PUT: admin store settings management."""

    permission_classes = [IsAdminUser]

    def get(self, request):
        settings_obj = StoreSettings.load()
        return Response(AdminStoreSettingsSerializer(settings_obj).data)

    def put(self, request):
        settings_obj = StoreSettings.load()
        serializer = AdminStoreSettingsSerializer(
            settings_obj, data=request.data, partial=True,
        )
        serializer.is_valid(raise_exception=True)
        target_currency = serializer.validated_data.get(
            'default_currency', settings_obj.default_currency,
        ).upper().strip()
        source_currency = (settings_obj.pricing_currency or settings_obj.default_currency).upper().strip()
        if target_currency != source_currency:
            try:
                convert_store_money(source_currency, target_currency)
            except CurrencyConversionError as exc:
                return Response({'message': str(exc)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
            settings_obj.pricing_currency = target_currency
        serializer.save()
        return Response(serializer.data)
