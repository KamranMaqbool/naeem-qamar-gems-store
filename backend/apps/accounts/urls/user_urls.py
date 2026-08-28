from django.urls import path

from apps.accounts import views

app_name = 'users'

urlpatterns = [
    path('me/', views.UserProfileView.as_view(), name='user_profile'),
    path('addresses/', views.AddressListCreateView.as_view(), name='address_list_create'),
    path('addresses/<int:pk>/', views.AddressDetailView.as_view(), name='address_detail'),
]
