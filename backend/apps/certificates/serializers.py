from rest_framework import serializers

from apps.certificates.models import Certificate


class CertificateSerializer(serializers.ModelSerializer):
    product_title = serializers.CharField(source='product.title', read_only=True)

    class Meta:
        model = Certificate
        fields = [
            'id', 'product', 'product_title', 'order',
            'lab_name', 'certificate_number', 'pdf_file', 'issue_date',
        ]
