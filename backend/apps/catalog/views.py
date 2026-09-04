from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAdminUser

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

    def get_queryset(self):
        return Product.objects.filter(
            status=Product.Status.PUBLISHED,
        ).select_related('category').prefetch_related('images')


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
