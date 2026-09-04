from django.urls import path

from apps.inventory.views import AdminInventoryDetailView, AdminInventoryListView, AdminReceiveStockView

urlpatterns = [
    path('', AdminInventoryListView.as_view(), name='admin-inventory-list'),
    path('<int:pk>/', AdminInventoryDetailView.as_view(), name='admin-inventory-detail'),
    path('receive-stock/', AdminReceiveStockView.as_view(), name='admin-receive-stock'),
]
