import django_filters
from django.db import models

from .models import Product


class ProductFilter(django_filters.FilterSet):
    gemstone_type = django_filters.CharFilter(method='filter_gemstone_type')
    carat_ranges = django_filters.CharFilter(method='filter_carat_ranges')
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
    stock_status = django_filters.CharFilter(
        field_name='inventory__stock_status', lookup_expr='exact',
    )
    search = django_filters.CharFilter(method='filter_search')

    class Meta:
        model = Product
        fields = [
            'category', 'min_price', 'max_price',
            'carat_min', 'carat_max', 'cut_shape',
            'status', 'is_featured', 'search', 'stock_status',
            'gemstone_type', 'carat_ranges',
        ]

    def filter_search(self, queryset, name, value):
        return queryset.filter(
            models.Q(title__icontains=value)
            | models.Q(sku__icontains=value)
            | models.Q(description__icontains=value)
        )

    def filter_gemstone_type(self, queryset, name, value):
        types = [item.strip() for item in value.split(',') if item.strip()]
        if not types:
            return queryset
        query = models.Q()
        for item in types:
            query |= models.Q(category__name__icontains=item) | models.Q(title__icontains=item) | models.Q(tags__icontains=item)
        return queryset.filter(query)

    def filter_carat_ranges(self, queryset, name, value):
        ranges = [item.strip() for item in value.split(',')]
        query = models.Q()
        for item in ranges:
            if item == 'under': query |= models.Q(gemstone_attributes__carat_weight__lt=1)
            elif item == 'one_two': query |= models.Q(gemstone_attributes__carat_weight__gte=1, gemstone_attributes__carat_weight__lte=2)
            elif item == 'two_five': query |= models.Q(gemstone_attributes__carat_weight__gt=2, gemstone_attributes__carat_weight__lte=5)
            elif item == 'over': query |= models.Q(gemstone_attributes__carat_weight__gt=5)
        return queryset.filter(query) if query else queryset
