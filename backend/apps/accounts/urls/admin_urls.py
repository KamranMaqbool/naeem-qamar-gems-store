from django.urls import path

from apps.accounts import views

app_name = 'admin-customers'

urlpatterns = [
    path('', views.AdminCustomerListView.as_view(), name='admin_customer_list'),
    path('<int:pk>/', views.AdminCustomerDetailView.as_view(), name='admin_customer_detail'),
    path('<int:pk>/notes/', views.AdminCustomerNoteCreateView.as_view(), name='admin_customer_note_create'),
]
