from django.urls import path
from . import views

urlpatterns = [
    # Path for creating a new user
    path('register/', views.UserRegistrationView.as_view(), name='user_register'),
    
    # Path for the logged-in user to get their own profile
    path('me/', views.get_user_profile, name='user_profile'),
    
    # Path for admins to get a list of all users (with optional role filtering)
    path('', views.UserListView.as_view(), name='user_list'),
    
    # --- NEW PATH for getting and updating a single user by their ID ---
    path('<int:pk>/', views.UserDetailView.as_view(), name='user_detail'),
]

