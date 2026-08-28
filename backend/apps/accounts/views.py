from django.contrib.auth import get_user_model
from rest_framework import generics, status
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Address, CustomerNote
from .serializers import (
    AddressSerializer,
    CustomerDetailSerializer,
    CustomerListSerializer,
    CustomerNoteSerializer,
    RegisterSerializer,
    UserProfileSerializer,
)

User = get_user_model()


# ---------------------------------------------------------------------------
# Public / authenticated user views
# ---------------------------------------------------------------------------


class RegisterView(generics.CreateAPIView):
    """Register a new user and return JWT tokens."""

    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                'user': RegisterSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                },
            },
            status=status.HTTP_201_CREATED,
        )


class UserProfileView(generics.RetrieveUpdateAPIView):
    """GET / PATCH the authenticated user's own profile."""

    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class AddressListCreateView(generics.ListCreateAPIView):
    """List / create addresses for the authenticated user."""

    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class AddressDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve / update / delete a specific address for the authenticated user."""

    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)


# ---------------------------------------------------------------------------
# Admin / CRM views
# ---------------------------------------------------------------------------


class AdminCustomerListView(generics.ListAPIView):
    """Admin-only paginated customer list with search & ordering."""

    serializer_class = CustomerListSerializer
    permission_classes = [IsAdminUser]
    queryset = User.objects.all()
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['username', 'email']
    ordering_fields = ['total_lifetime_spend', 'date_joined']
    ordering = ['-date_joined']

    def get_queryset(self):
        qs = super().get_queryset()
        is_vip = self.request.query_params.get('is_vip')
        if is_vip is not None:
            qs = qs.filter(is_vip=is_vip.lower() in ('true', '1', 'yes'))
        return qs


class AdminCustomerDetailView(generics.RetrieveAPIView):
    """Admin-only customer detail with addresses and notes."""

    serializer_class = CustomerDetailSerializer
    permission_classes = [IsAdminUser]
    queryset = User.objects.all()


class AdminCustomerNoteCreateView(generics.CreateAPIView):
    """Admin-only endpoint to create a note on a customer."""

    serializer_class = CustomerNoteSerializer
    permission_classes = [IsAdminUser]

    def perform_create(self, serializer):
        customer = User.objects.get(pk=self.kwargs['pk'])
        serializer.save(author=self.request.user, customer=customer)
