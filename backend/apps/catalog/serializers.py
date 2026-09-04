from rest_framework import serializers

from .models import Category, GemstoneAttributes, Product, ProductImage


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'parent', 'image', 'created_at']


class GemstoneAttributesSerializer(serializers.ModelSerializer):
    class Meta:
        model = GemstoneAttributes
        exclude = ['product']


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        exclude = ['product']


class ProductListSerializer(serializers.ModelSerializer):
    category = serializers.CharField(source='category.name', read_only=True, default=None)
    primary_image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'title', 'slug', 'sku', 'base_price', 'sale_price',
            'is_featured', 'status', 'category', 'primary_image', 'tags',
        ]

    def get_primary_image(self, obj):
        image = obj.images.filter(is_primary=True).first()
        if image:
            return ProductImageSerializer(image).data
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
    gemstone_attributes = GemstoneAttributesSerializer(required=False)
    images = ProductImageSerializer(many=True, required=False)
    inventory_stock = serializers.SerializerMethodField()
    inventory_status = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'title', 'slug', 'sku', 'description', 'base_price',
            'sale_price', 'is_featured', 'status', 'category',
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
