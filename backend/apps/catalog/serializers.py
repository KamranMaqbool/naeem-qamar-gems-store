from django.conf import settings
from rest_framework import serializers

from .models import Category, GemstoneAttributes, Product, ProductImage


class CategorySerializer(serializers.ModelSerializer):
    # Categories do not require a separate image upload: use the first
    # published product image as a live storefront collection cover when the
    # optional category image is not set.
    cover_image = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'parent', 'image', 'cover_image', 'created_at']

    def get_cover_image(self, obj):
        if obj.image:
            return obj.image
        product = obj.products.filter(status=Product.Status.PUBLISHED).prefetch_related('images').first()
        if not product:
            return ''
        image = product.images.filter(is_primary=True).first() or product.images.first()
        if not image:
            return ''
        return ProductImageSerializer(image, context=self.context).data.get('image_url', '')


class AdminCategorySerializer(CategorySerializer):
    class Meta(CategorySerializer.Meta):
        read_only_fields = ['id', 'created_at']


class GemstoneAttributesSerializer(serializers.ModelSerializer):
    class Meta:
        model = GemstoneAttributes
        exclude = ['product']


class ProductImageSerializer(serializers.ModelSerializer):
    # Images uploaded by the admin are served from this application's media
    # path (for example, /media/products/...). A CharField accepts both those
    # relative paths and existing absolute CDN URLs.
    image_url = serializers.CharField(max_length=500)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')
        if request and not settings.DEBUG and data.get('image_url', '').startswith('/'):
            data['image_url'] = request.build_absolute_uri(data['image_url'])
        return data

    class Meta:
        model = ProductImage
        exclude = ['product']


class ProductListSerializer(serializers.ModelSerializer):
    category = serializers.CharField(source='category.name', read_only=True, default=None)
    primary_image = serializers.SerializerMethodField()
    images = ProductImageSerializer(many=True, read_only=True)
    gemstone_attributes = GemstoneAttributesSerializer(read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'title', 'slug', 'sku', 'base_price', 'sale_price',
            'is_featured', 'status', 'category', 'primary_image', 'images', 'gemstone_attributes', 'tags',
        ]

    def get_primary_image(self, obj):
        image = obj.images.filter(is_primary=True).first() or obj.images.first()
        if image:
            # Preserve the request context so production responses use the
            # Railway media origin rather than a relative /media URL that
            # would otherwise resolve against the Vercel frontend domain.
            return ProductImageSerializer(image, context=self.context).data
        return None


class ProductDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    gemstone_attributes = GemstoneAttributesSerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'title', 'slug', 'sku', 'description', 'base_price',
            'sale_price', 'is_featured', 'status', 'category',
            'tags', 'gemstone_attributes', 'images',
            'created_at', 'updated_at',
        ]


class AdminProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True, default='')
    gemstone_attributes = GemstoneAttributesSerializer(required=False)
    images = ProductImageSerializer(many=True, required=False)
    inventory_stock = serializers.SerializerMethodField()
    inventory_status = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'title', 'slug', 'sku', 'description', 'base_price',
            'sale_price', 'is_featured', 'status', 'category', 'category_name',
            'tags', 'gemstone_attributes', 'images',
            'inventory_stock', 'inventory_status',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        gemstone_data = validated_data.pop('gemstone_attributes', None)
        images_data = validated_data.pop('images', [])

        product = Product.objects.create(**validated_data)

        if gemstone_data:
            GemstoneAttributes.objects.create(product=product, **gemstone_data)

        for image_data in images_data:
            ProductImage.objects.create(product=product, **image_data)

        return product

    def get_inventory_stock(self, obj):
        return getattr(getattr(obj, 'inventory', None), 'current_stock', 0)

    def get_inventory_status(self, obj):
        return getattr(getattr(obj, 'inventory', None), 'stock_status', 'OUT_OF_STOCK')

    def update(self, instance, validated_data):
        gemstone_data = validated_data.pop('gemstone_attributes', None)
        images_data = validated_data.pop('images', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if gemstone_data is not None:
            GemstoneAttributes.objects.update_or_create(
                product=instance,
                defaults=gemstone_data,
            )

        if images_data is not None:
            instance.images.all().delete()
            for image_data in images_data:
                ProductImage.objects.create(product=instance, **image_data)

        return instance
