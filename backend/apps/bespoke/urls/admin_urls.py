from django.urls import path

from apps.bespoke.views import AdminBespokeDetailView, AdminBespokeListView

urlpatterns = [
    path('', AdminBespokeListView.as_view(), name='admin-bespoke-list'),
    path('<int:pk>/', AdminBespokeDetailView.as_view(), name='admin-bespoke-detail'),
]
