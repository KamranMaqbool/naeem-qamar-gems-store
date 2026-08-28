from django.urls import path

from apps.orders.views import CheckoutView, MyOrdersView, OrderDetailView

urlpatterns = [
    path('my-orders/', MyOrdersView.as_view(), name='my-orders'),
    path('checkout/', CheckoutView.as_view(), name='checkout'),
    path('<str:order_number>/', OrderDetailView.as_view(), name='order-detail'),
]
