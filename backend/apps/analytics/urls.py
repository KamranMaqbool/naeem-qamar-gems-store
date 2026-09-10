from django.urls import path

from apps.analytics.views import (
    DashboardKPIsView,
    RevenueChartView,
    SalesByGemstoneView,
    TopProductsView,
    SalesChannelsView,
)

urlpatterns = [
    path('dashboard-kpis/', DashboardKPIsView.as_view(), name='dashboard-kpis'),
    path('revenue-chart/', RevenueChartView.as_view(), name='revenue-chart'),
    path('sales-by-gemstone/', SalesByGemstoneView.as_view(), name='sales-by-gemstone'),
    path('top-products/', TopProductsView.as_view(), name='top-products'),
    path('sales-channels/', SalesChannelsView.as_view(), name='sales-channels'),
]
