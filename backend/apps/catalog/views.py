import os
import uuid

from django.conf import settings
from django.core.files.storage import default_storage
import django_filters
from rest_framework import filters as drf_filters, generics, status
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from .filters import ProductFilter
from .models import Category, Product
from .serializers import (
    AdminProductSerializer,
    CategorySerializer,
    ProductDetailSerializer,
    ProductListSerializer,
)


# ---------------------------------------------------------------------------
# Public views
# ---------------------------------------------------------------------------


class PublicProductListView(generics.ListAPIView):
    """Public product listing -- only PUBLISHED products."""

    serializer_class = ProductListSerializer
    permission_classes = [AllowAny]
    filterset_class = ProductFilter
    filter_backends = [
        django_filters.rest_framework.DjangoFilterBackend,
        drf_filters.OrderingFilter,
    ]
    ordering_fields = ['base_price', 'created_at', 'is_featured', 'gemstone_attributes__carat_weight']
    ordering = ['-is_featured', '-created_at']

    def get_queryset(self):
        return Product.objects.filter(
            status=Product.Status.PUBLISHED,
        ).select_related('category', 'gemstone_attributes').prefetch_related('images')


class PublicProductDetailView(generics.RetrieveAPIView):
    """Public product detail by slug -- only PUBLISHED products."""

    serializer_class = ProductDetailSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'

    def get_queryset(self):
        return Product.objects.filter(
            status=Product.Status.PUBLISHED,
        ).select_related('category', 'gemstone_attributes').prefetch_related('images')


class PublicCategoryListView(generics.ListAPIView):
    """Public list of all categories."""

    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    queryset = Category.objects.all()


# ---------------------------------------------------------------------------
# Admin views
# ---------------------------------------------------------------------------


class AdminProductListCreateView(generics.ListCreateAPIView):
    """Admin product list / create."""

    serializer_class = AdminProductSerializer
    permission_classes = [IsAdminUser]
    filterset_class = ProductFilter
    queryset = Product.objects.select_related(
        'category', 'gemstone_attributes',
    ).prefetch_related('images')


class AdminProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Admin product detail / update / delete."""

    serializer_class = AdminProductSerializer
    permission_classes = [IsAdminUser]
    queryset = Product.objects.select_related(
        'category', 'gemstone_attributes',
    ).prefetch_related('images')


class AdminProductImageUploadView(APIView):
    """Upload an image and return its media URL for a product payload."""

    permission_classes = [IsAdminUser]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        image = request.FILES.get('image')
        if not image:
            return Response({'message': 'An image file is required.'}, status=status.HTTP_400_BAD_REQUEST)
        if not image.content_type or not image.content_type.startswith('image/'):
            return Response({'message': 'Only image files are supported.'}, status=status.HTTP_400_BAD_REQUEST)
        if image.size > 10 * 1024 * 1024:
            return Response({'message': 'Images must be 10 MB or smaller.'}, status=status.HTTP_400_BAD_REQUEST)
        extension = os.path.splitext(image.name)[1].lower() or '.jpg'
        name = default_storage.save(f'products/{uuid.uuid4().hex}{extension}', image)
        return Response({'image_url': f'{settings.MEDIA_URL}{name}'}, status=status.HTTP_201_CREATED)
