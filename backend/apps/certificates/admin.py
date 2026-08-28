from django.contrib import admin

from apps.certificates.models import Certificate


@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
    list_display = ['certificate_number', 'lab_name', 'product', 'issue_date']
    search_fields = ['certificate_number', 'lab_name', 'product__title']
    list_filter = ['lab_name']
