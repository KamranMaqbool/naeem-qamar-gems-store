from django.urls import path

from apps.catalog import views

app_name = 'admin-catalog'

urlpatterns = [
    path('', views.AdminProductListCreateView.as_view(), name='admin_product_list_create'),
    path('<int:pk>/', views.AdminProductDetailView.as_view(), name='admin_product_detail'),
]
