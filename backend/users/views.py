from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from .serializers import CustomUserSerializer
from .models import CustomUser
from django.db.models import Q # Import Q for complex 'OR' queries

# --- Pagination Class ---
class StandardPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class UserRegistrationView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    user = request.user
    serializer = CustomUserSerializer(user)
    return Response(serializer.data)

class UserListView(generics.ListCreateAPIView):
    serializer_class = CustomUserSerializer
    permission_classes = [IsAdminUser]
    pagination_class = StandardPagination

    def get_queryset(self):
        """
        This view returns a list of users, filterable by role AND search term.
        """
        queryset = CustomUser.objects.all()
        
        # 1. Filter by Role
        role = self.request.query_params.get('role')
        if role is not None:
            queryset = queryset.filter(user_role=role)
        
        # --- THIS IS THE DEFINITIVE FIX ---
        # 2. Filter by Search Term
        search = self.request.query_params.get('search')
        if search is not None and search != '':
            queryset = queryset.filter(
                Q(email__icontains=search) |
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search)
            )
        # --- END FIX ---
        
        return queryset.order_by('id')

class UserDetailView(generics.RetrieveUpdateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [IsAdminUser]
    pagination_class = None

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance == request.user:
            if 'is_active' in request.data and instance.is_active != request.data['is_active']:
                return Response({'error': 'You cannot deactivate your own account.'}, status=status.HTTP_403_FORBIDDEN)
            if 'user_role' in request.data and instance.user_role != request.data['user_role']:
                return Response({'error': 'You cannot change your own role.'}, status=status.HTTP_403_FORBIDDEN)
        
        return super().update(request, *args, **kwargs)

