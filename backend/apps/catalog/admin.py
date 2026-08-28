from django.contrib import admin

from .models import Category, GemstoneAttributes, Product, ProductImage


class GemstoneAttributesInline(admin.StackedInline):
    model = GemstoneAttributes
    extra = 0


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'parent', 'created_at']
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ['name']
    list_filter = ['parent']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['title', 'sku', 'base_price', 'sale_price', 'status', 'is_featured', 'category']
    list_filter = ['status', 'is_featured', 'category']
    search_fields = ['title', 'sku', 'description']
    prepopulated_fields = {'slug': ('title',)}
    inlines = [GemstoneAttributesInline, ProductImageInline]


@admin.register(GemstoneAttributes)
class GemstoneAttributesAdmin(admin.ModelAdmin):
    list_display = ['product', 'carat_weight', 'cut_shape', 'color_grade', 'clarity_grade', 'origin_country']
    search_fields = ['product__title', 'origin_country']
    list_filter = ['cut_shape', 'certification_lab']


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ['product', 'alt_text', 'display_order', 'is_primary']
    list_filter = ['is_primary']
    search_fields = ['product__title', 'alt_text']
