from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Address, CustomerNote

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    phone_number = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'phone_number']

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'phone_number', 'avatar',
            'role', 'is_vip', 'total_lifetime_spend', 'date_joined',
        ]
        read_only_fields = ['id', 'email', 'role', 'is_vip', 'total_lifetime_spend', 'date_joined']


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = [
            'id', 'street_address', 'city', 'state', 'postal_code',
            'country', 'is_default_shipping', 'is_default_billing',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class CustomerNoteSerializer(serializers.ModelSerializer):
    author_email = serializers.EmailField(source='author.email', read_only=True)

    class Meta:
        model = CustomerNote
        fields = ['id', 'content', 'author', 'author_email', 'created_at']
        read_only_fields = ['id', 'author', 'author_email', 'created_at']


class CustomerListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'phone_number',
            'is_vip', 'total_lifetime_spend', 'date_joined',
        ]


class CustomerDetailSerializer(serializers.ModelSerializer):
    addresses = AddressSerializer(many=True, read_only=True)
    notes = CustomerNoteSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'phone_number', 'avatar',
            'role', 'is_vip', 'total_lifetime_spend', 'date_joined',
            'addresses', 'notes',
        ]
