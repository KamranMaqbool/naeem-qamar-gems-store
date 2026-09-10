from django.contrib.auth import get_user_model
from rest_framework import generics, status
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Address, CustomerNote, LoginActivity
from .serializers import (
    AddressSerializer,
    CustomerDetailSerializer,
    CustomerListSerializer,
    CustomerNoteSerializer,
    RegisterSerializer,
    UserProfileSerializer,
    PasswordChangeSerializer,
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


class PasswordChangeView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PasswordChangeSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        request.user.set_password(serializer.validated_data['new_password'])
        request.user.save(update_fields=['password'])
        return Response({'message': 'Password updated successfully.'})


class ProfileAvatarView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        upload = request.FILES.get('avatar')
        if not upload or not upload.content_type.startswith('image/'):
            return Response({'message': 'Please upload an image file.'}, status=status.HTTP_400_BAD_REQUEST)
        from django.core.files.storage import default_storage
        path = default_storage.save(f'avatars/{request.user.pk}_{upload.name}', upload)
        request.user.avatar = default_storage.url(path)
        request.user.save(update_fields=['avatar'])
        return Response({'avatar': request.user.avatar})


class LoginActivityView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        return Response([{'id': item.id, 'created_at': item.created_at, 'ip_address': item.ip_address, 'user_agent': item.user_agent} for item in LoginActivity.objects.filter(user=request.user)[:10]])


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
