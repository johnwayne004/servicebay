from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    TicketViewSet, 
    NotificationListView, 
    MarkAllAsReadView, 
    DashboardStatsView
)

# The router automatically generates the URLs for the TicketViewSet
# (e.g., /api/tickets/, /api/tickets/{id}/)
router = DefaultRouter()
router.register(r'tickets', TicketViewSet, basename='ticket')

# We define the other URL paths manually
urlpatterns = [
    # This includes all the ticket URLs from the router (like /tickets/)
    path('', include(router.urls)),
    
    # Path for getting a list of notifications
    path('notifications/', NotificationListView.as_view(), name='notification-list'),
    
    # Path for marking all notifications as read
    path('notifications/mark_all_as_read/', MarkAllAsReadView.as_view(), name='notification-mark-all-read'),
    
    # Path for getting the admin dashboard statistics
    path('dashboard-stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
]

