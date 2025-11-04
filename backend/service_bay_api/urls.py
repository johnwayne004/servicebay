"""
URL configuration for service_bay_api project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
"""
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse  # for health check
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


#  Simple public health check view
def health_check(request):
    return JsonResponse({"status": "ok"}, status=200)


urlpatterns = [
    path('admin/', admin.site.urls),

    # Health check endpoint for uptime monitoring
    path('api/health/', health_check, name='health_check'),

    # JWT authentication endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # User app URLs
    path('api/users/', include('users.urls')),

    # Ticket app URLs
    path('api/', include('tickets.urls')),
]
