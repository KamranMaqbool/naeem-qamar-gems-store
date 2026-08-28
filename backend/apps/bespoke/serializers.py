from rest_framework import serializers

from apps.bespoke.models import BespokeAttachment, BespokeInquiry


class BespokeAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = BespokeAttachment
        fields = ['id', 'file_url', 'uploaded_at']


class BespokeInquirySerializer(serializers.ModelSerializer):
    """Read serializer with nested attachments."""

    attachments = BespokeAttachmentSerializer(many=True, read_only=True)

    class Meta:
        model = BespokeInquiry
        fields = [
            'id', 'customer_name', 'email', 'phone',
            'gemstone_preference', 'jewelry_type', 'precious_metal',
            'budget_min', 'budget_max', 'description',
            'status', 'attachments', 'created_at',
        ]


class BespokeCreateSerializer(serializers.ModelSerializer):
    """Write serializer — accepts attachments as a list of URLs."""

    attachments = serializers.ListField(
        child=serializers.URLField(),
        required=False,
        write_only=True,
    )

    class Meta:
        model = BespokeInquiry
        fields = [
            'customer_name', 'email', 'phone',
            'gemstone_preference', 'jewelry_type', 'precious_metal',
            'budget_min', 'budget_max', 'description', 'attachments',
        ]

    def create(self, validated_data):
        attachment_urls = validated_data.pop('attachments', [])
        inquiry = BespokeInquiry.objects.create(**validated_data)
        for url in attachment_urls:
            BespokeAttachment.objects.create(inquiry=inquiry, file_url=url)
        return inquiry


class AdminBespokeSerializer(serializers.ModelSerializer):
    """Admin serializer — allows status updates."""

    attachments = BespokeAttachmentSerializer(many=True, read_only=True)

    class Meta:
        model = BespokeInquiry
        fields = [
            'id', 'customer_name', 'email', 'phone',
            'gemstone_preference', 'jewelry_type', 'precious_metal',
            'budget_min', 'budget_max', 'description',
            'status', 'attachments', 'created_at',
        ]
