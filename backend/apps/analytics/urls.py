from django.urls import path

from apps.analytics.views import (
    DashboardKPIsView,
    RevenueChartView,
    SalesByGemstoneView,
)

urlpatterns = [
    path('dashboard-kpis/', DashboardKPIsView.as_view(), name='dashboard-kpis'),
    path('revenue-chart/', RevenueChartView.as_view(), name='revenue-chart'),
    path('sales-by-gemstone/', SalesByGemstoneView.as_view(), name='sales-by-gemstone'),
]
