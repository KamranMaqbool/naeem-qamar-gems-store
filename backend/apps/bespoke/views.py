from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response

from apps.bespoke.models import BespokeInquiry
from apps.bespoke.serializers import (
    AdminBespokeSerializer,
    BespokeCreateSerializer,
    BespokeInquirySerializer,
)


class PublicBespokeCreateView(generics.CreateAPIView):
    """POST: submit a bespoke inquiry (public, no auth required)."""

    serializer_class = BespokeCreateSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        inquiry = serializer.save()
        return Response(
            BespokeInquirySerializer(inquiry).data,
            status=status.HTTP_201_CREATED,
        )


class AdminBespokeListView(generics.ListAPIView):
    """GET: list all bespoke inquiries, filterable by status."""

    serializer_class = AdminBespokeSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        qs = BespokeInquiry.objects.prefetch_related('attachments').all()
        inquiry_status = self.request.query_params.get('status')
        if inquiry_status:
            qs = qs.filter(status=inquiry_status)
        return qs


class AdminBespokeDetailView(generics.RetrieveUpdateAPIView):
    """GET/PATCH: view or update a bespoke inquiry."""

    serializer_class = AdminBespokeSerializer
    permission_classes = [IsAdminUser]
    queryset = BespokeInquiry.objects.prefetch_related('attachments').all()
