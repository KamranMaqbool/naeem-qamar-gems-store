from django.urls import path

from apps.accounts import views

app_name = 'users'

urlpatterns = [
    path('me/', views.UserProfileView.as_view(), name='user_profile'),
    path('me/password/', views.PasswordChangeView.as_view(), name='password_change'),
    path('me/avatar/', views.ProfileAvatarView.as_view(), name='avatar_upload'),
    path('me/login-activity/', views.LoginActivityView.as_view(), name='login_activity'),
    path('addresses/', views.AddressListCreateView.as_view(), name='address_list_create'),
    path('addresses/<int:pk>/', views.AddressDetailView.as_view(), name='address_detail'),
]
