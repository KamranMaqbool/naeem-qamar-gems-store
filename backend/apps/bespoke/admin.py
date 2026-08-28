from django.contrib import admin

from apps.bespoke.models import BespokeAttachment, BespokeInquiry


class BespokeAttachmentInline(admin.TabularInline):
    model = BespokeAttachment
    extra = 0


@admin.register(BespokeInquiry)
class BespokeInquiryAdmin(admin.ModelAdmin):
    list_display = [
        'customer_name', 'email', 'jewelry_type', 'gemstone_preference',
        'status', 'created_at',
    ]
    list_filter = ['status', 'jewelry_type']
    search_fields = ['customer_name', 'email']
    inlines = [BespokeAttachmentInline]
