from django.urls import path

from apps.discounts.views import AdminDiscountDetailView, AdminDiscountListCreateView

urlpatterns = [
    path('', AdminDiscountListCreateView.as_view(), name='admin-discount-list-create'),
    path('<int:pk>/', AdminDiscountDetailView.as_view(), name='admin-discount-detail'),
]
