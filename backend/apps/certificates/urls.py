from django.urls import path

from apps.certificates.views import (
    AdminCertificateUploadView,
    PublicCertificateDownloadView,
)

urlpatterns = [
    path(
        'download/<str:certificate_number>/',
        PublicCertificateDownloadView.as_view(),
        name='certificate-download',
    ),
    path('upload/', AdminCertificateUploadView.as_view(), name='certificate-upload'),
]
