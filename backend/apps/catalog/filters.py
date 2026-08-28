import django_filters
from django.db import models

from .models import Product


class ProductFilter(django_filters.FilterSet):
    category = django_filters.CharFilter(
        field_name='category__slug',
        lookup_expr='exact',
    )
    min_price = django_filters.NumberFilter(
        field_name='base_price',
        lookup_expr='gte',
    )
    max_price = django_filters.NumberFilter(
        field_name='base_price',
        lookup_expr='lte',
    )
    carat_min = django_filters.NumberFilter(
        field_name='gemstone_attributes__carat_weight',
        lookup_expr='gte',
    )
    carat_max = django_filters.NumberFilter(
        field_name='gemstone_attributes__carat_weight',
        lookup_expr='lte',
    )
    cut_shape = django_filters.CharFilter(
        field_name='gemstone_attributes__cut_shape',
        lookup_expr='iexact',
    )
    status = django_filters.CharFilter(
        field_name='status',
        lookup_expr='exact',
    )
    is_featured = django_filters.BooleanFilter(
        field_name='is_featured',
    )
    search = django_filters.CharFilter(method='filter_search')

    class Meta:
        model = Product
        fields = [
            'category', 'min_price', 'max_price',
            'carat_min', 'carat_max', 'cut_shape',
            'status', 'is_featured', 'search',
        ]

    def filter_search(self, queryset, name, value):
        return queryset.filter(
            models.Q(title__icontains=value)
            | models.Q(description__icontains=value)
        )
