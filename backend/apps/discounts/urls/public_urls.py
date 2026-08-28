from django.urls import path

from apps.discounts.views import ValidateDiscountView

urlpatterns = [
    path('validate/', ValidateDiscountView.as_view(), name='discount-validate'),
]
