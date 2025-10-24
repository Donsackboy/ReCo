from django.urls import path
from . import views

urlpatterns = [
    path('auth/login/', views.login, name='login'),
    path('auth/register/', views.register, name='register'),
    path('auth/profile/', views.user_profile, name='profile'),
    path('hogares-temporales/', views.crear_hogar_temporal, name='crear_hogar_temporal'),
]