from rest_framework import serializers
from .models import Ticket, Notification

class TicketSerializer(serializers.ModelSerializer):
    # We replace the email field with the user's full name.
    created_by_email = serializers.ReadOnlyField(source='created_by.email') # Keep for admin/customer
    created_by_name = serializers.SerializerMethodField() # NEW: Field for customer's full name
    assigned_to_email = serializers.ReadOnlyField(source='assigned_to.email')

    class Meta:
        model = Ticket
        fields = [
            'id', 
            'customer_ticket_id',
            'title', 'description', 'status', 'priority', 'category',
            'created_by', 'created_by_email', 'created_by_name', # <-- ADDED 'created_by_name'
            'assigned_to', 'assigned_to_email',
            'created_at', 'updated_at', 'closed_at',
            'vehicle_make', 'vehicle_model', 'vehicle_year', 'license_plate', 'vin',
            
        ]
        read_only_fields = ('id', 'created_by', 'created_at', 'updated_at', 'closed_at', 'customer_ticket_id', 'created_by_name')

    def get_created_by_name(self, obj):
        """
        Returns the full name of the user who created the ticket.
        """
        return obj.created_by.get_full_name() or obj.created_by.email

# --- NotificationSerializer remains the same ---
class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = [
            'id',
            'recipient',
            'ticket',
            'message',
            'is_read',
            'created_at'
        ]
        read_only_fields = ('id', 'created_at')

