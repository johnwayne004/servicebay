from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed
from .models import CustomUser
from rest_framework.validators import UniqueValidator # <-- THIS IS THE CRITICAL FIX (Import)

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        token['user_role'] = user.user_role
        token['first_name'] = user.first_name
        return token

    def validate(self, attrs):
        try:
            data = super().validate(attrs)
        except AuthenticationFailed as e:
            raise AuthenticationFailed(
                'No active account found with the given credentials. Please try again.',
                'no_active_account'
            ) from e
        return data

class CustomUserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        # --- THIS IS THE CRITICAL FIX (Usage) ---
        # We now use the correctly imported 'UniqueValidator'
        validators=[UniqueValidator(
            queryset=CustomUser.objects.all(),
            message="A user with this email already exists."
        )]
    )

    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'first_name', 'last_name', 'phone_number', 'user_role', 'password', 'is_active')
        read_only_fields = ('id',)

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            phone_number=validated_data.get('phone_number', ''),
            user_role=validated_data.get('user_role', 'customer')
        )
        return user

