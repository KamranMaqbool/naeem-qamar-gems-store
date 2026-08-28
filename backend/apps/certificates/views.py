from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response

from apps.certificates.models import Certificate
from apps.certificates.serializers import CertificateSerializer


class PublicCertificateDownloadView(generics.RetrieveAPIView):
    """GET: retrieve a certificate by its certificate_number (public)."""

    serializer_class = CertificateSerializer
    permission_classes = [AllowAny]
    authentication_classes = []
    lookup_field = 'certificate_number'
    queryset = Certificate.objects.select_related('product').all()


class AdminCertificateUploadView(generics.CreateAPIView):
    """POST: create (upload) a new certificate record."""

    serializer_class = CertificateSerializer
    permission_classes = [IsAdminUser]
