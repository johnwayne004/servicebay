from rest_framework import viewsets, permissions, generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from .models import Ticket, Notification
from users.models import CustomUser # We need to import the CustomUser model
from .serializers import TicketSerializer, NotificationSerializer

# --- Pagination Class (No changes) ---
class StandardPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

# --- Notification Views (No changes) ---
class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None
    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user).order_by('-created_at')

class MarkAllAsReadView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        Notification.objects.filter(recipient=request.user, is_read=False).update(is_read=True)
        return Response(status=status.HTTP_204_NO_CONTENT)

# --- THIS IS THE FIX ---
class DashboardStatsView(APIView):
    """
    A dedicated, high-performance endpoint for fetching
    all dashboard statistics in a single request.
    Only accessible by admins.
    """
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        # Calculate all stats efficiently on the server
        total_tickets = Ticket.objects.count()
        open_tickets = Ticket.objects.filter(status='Open').count()
        in_progress_tickets = Ticket.objects.filter(status='In Progress').count()
        total_customers = CustomUser.objects.filter(user_role='customer').count()
        total_technicians = CustomUser.objects.filter(user_role='technician').count()
        total_admins = CustomUser.objects.filter(user_role='admin').count() # <-- THIS LINE WAS MISSING
        
        # Return all stats as a single JSON object
        stats = {
            'total_tickets': total_tickets,
            'open_tickets': open_tickets,
            'in_progress_tickets': in_progress_tickets,
            'total_customers': total_customers,
            'total_technicians': total_technicians,
            'total_admins': total_admins, # <-- THIS LINE WAS MISSING
        }
        return Response(stats, status=status.HTTP_200_OK)
# --- END FIX ---


# --- Ticket Views (No changes) ---
class TicketPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated
    def has_object_permission(self, request, view, obj):
        user = request.user
        if user.user_role == 'admin': return True
        if user.user_role == 'technician':
            if obj.assigned_to != user: return False
            if request.method in permissions.SAFE_METHODS: return True
            if obj.status in ['Completed', 'Cancelled']: return False
            return True
        if user.user_role == 'customer':
            if request.method in permissions.SAFE_METHODS: return obj.created_by == user
        return False

class TicketViewSet(viewsets.ModelViewSet):
    serializer_class = TicketSerializer
    permission_classes = [TicketPermission]
    pagination_class = StandardPagination

    def get_queryset(self):
        user = self.request.user
        if user.user_role == 'technician' or user.user_role == 'customer':
            self.pagination_class = None
        else:
            self.pagination_class = StandardPagination

        if user.user_role == 'admin':
            return Ticket.objects.all().order_by('-created_at')
        elif user.user_role == 'technician':
            return Ticket.objects.filter(assigned_to=user).order_by('-created_at')
        else:
            return Ticket.objects.filter(created_by=user).order_by('-created_at')
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def perform_update(self, serializer):
        old_instance = self.get_object()
        old_status = old_instance.status
        old_assigned_to = old_instance.assigned_to
        new_instance = serializer.save()
        new_status = new_instance.status
        new_assigned_to = new_instance.assigned_to
        if old_status != new_status and new_instance.created_by != self.request.user:
            message = f"The status of your ticket '#{new_instance.id}: {new_instance.title}' was updated to '{new_status}'."
            Notification.objects.create(recipient=new_instance.created_by, ticket=new_instance, message=message)
        if old_assigned_to != new_assigned_to and new_assigned_to is not None and new_assigned_to != self.request.user:
            message = f"You have been assigned a new ticket: '#{new_instance.id}: {new_instance.title}'."
            Notification.objects.create(recipient=new_assigned_to, ticket=new_instance, message=message)

