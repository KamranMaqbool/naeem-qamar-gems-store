from django.urls import path

from apps.orders.views import CartItemDeleteView, CartView

urlpatterns = [
    path('', CartView.as_view(), name='cart'),
    path('items/', CartView.as_view(), name='cart-add-item'),
    path('items/<int:pk>/', CartItemDeleteView.as_view(), name='cart-item-delete'),
]
