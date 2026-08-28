from django.urls import path

from apps.catalog import views

app_name = 'catalog-public'

urlpatterns = [
    path('', views.PublicProductListView.as_view(), name='public_product_list'),
    path('categories/', views.PublicCategoryListView.as_view(), name='public_category_list'),
    path('<slug:slug>/', views.PublicProductDetailView.as_view(), name='public_product_detail'),
]
