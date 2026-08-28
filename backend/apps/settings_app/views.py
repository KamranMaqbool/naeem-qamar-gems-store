from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.settings_app.models import StoreSettings
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
        serializer.save()
        return Response(serializer.data)
