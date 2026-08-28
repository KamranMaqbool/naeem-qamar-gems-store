from django.urls import path

from apps.inventory.views import AdminInventoryListView, AdminReceiveStockView

urlpatterns = [
    path('', AdminInventoryListView.as_view(), name='admin-inventory-list'),
    path('receive-stock/', AdminReceiveStockView.as_view(), name='admin-receive-stock'),
]
