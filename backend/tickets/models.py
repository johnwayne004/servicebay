from django.db import models
from django.conf import settings

class Ticket(models.Model):
    STATUS_CHOICES = [('Open', 'Open'), ('Scheduled', 'Scheduled'), ('In Progress', 'In Progress'), ('Awaiting Parts', 'Awaiting Parts'), ('Completed', 'Completed'), ('Cancelled', 'Cancelled')]
    PRIORITY_CHOICES = [('Routine', 'Routine'), ('Standard', 'Standard'), ('Urgent', 'Urgent'), ('Critical', 'Critical')]
    CATEGORY_CHOICES = [('Engine', 'Engine Services'), ('Brakes', 'Brake Services'), ('Tires', 'Tire Services'), ('Suspension', 'Suspension & Steering'), ('Electrical', 'Electrical System'), ('Maintenance', 'Routine Maintenance'), ('Diagnostics', 'Diagnostics'), ('Bodywork', 'Bodywork/Cosmetic'), ('Other', 'Other Service')]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Open')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='Standard')
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Maintenance')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='tickets')
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, related_name='assigned_tickets', blank=True, null=True, limit_choices_to={'user_role__in': ['technician', 'admin']})
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    closed_at = models.DateTimeField(blank=True, null=True)
    vehicle_make = models.CharField(max_length=50, blank=True, null=True)
    vehicle_model = models.CharField(max_length=50, blank=True, null=True)
    vehicle_year = models.IntegerField(blank=True, null=True)
    license_plate = models.CharField(max_length=20, blank=True, null=True)
    vin = models.CharField(max_length=17, blank=True, null=True)
    
    # --- THIS FIELD WAS MISSING ---
    customer_ticket_id = models.PositiveIntegerField(blank=True, null=True)

    def __str__(self):
        return f"Ticket #{self.id}: {self.title}"

    def save(self, *args, **kwargs):
        if not self.pk and not self.customer_ticket_id:
            customer_tickets_count = Ticket.objects.filter(created_by=self.created_by).count()
            self.customer_ticket_id = customer_tickets_count + 1
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['-created_at']
        unique_together = ('created_by', 'customer_ticket_id')

class Notification(models.Model):
    # --- ALL OF THESE FIELDS WERE MISSING ---
    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='notifications'
    )
    ticket = models.ForeignKey(
        Ticket, 
        on_delete=models.CASCADE, 
        related_name='notifications', 
        null=True, 
        blank=True
    )
    message = models.CharField(max_length=255)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification for {self.recipient.email}: {self.message}"

    class Meta:
        ordering = ['-created_at']

