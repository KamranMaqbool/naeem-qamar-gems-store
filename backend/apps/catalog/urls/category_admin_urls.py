from django.urls import path
from rest_framework import generics
from rest_framework.permissions import IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend

from apps.catalog.models import Category
from apps.catalog.serializers import AdminCategorySerializer


class AdminCategoryListCreateView(generics.ListCreateAPIView):
    serializer_class = AdminCategorySerializer
    permission_classes = [IsAdminUser]
    queryset = Category.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['parent']

    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.query_params.get('search')
        if search:
            from django.db.models import Q
            queryset = queryset.filter(Q(name__icontains=search) | Q(slug__icontains=search))
        return queryset


class AdminCategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AdminCategorySerializer
    permission_classes = [IsAdminUser]
    queryset = Category.objects.all()


urlpatterns = [
    path('', AdminCategoryListCreateView.as_view()),
    path('<int:pk>/', AdminCategoryDetailView.as_view()),
]
