from django.urls import path
from . import views

urlpatterns = [
    path('auth/login/', views.login, name='login'),
    path('auth/register/', views.register, name='register'),
    path('auth/profile/', views.user_profile, name='profile'),
    path('hogares-temporales/', views.crear_hogar_temporal, name='crear_hogar_temporal'),
    path('admin/users/', views.UserListAdminView.as_view(), name='admin_user_list'),
    path('admin/users/<int:pk>/', views.UserDetailAdminView.as_view(), name='admin_user_detail'),
    path('admin/refugios/', views.RefugioListCreateView.as_view(), name='admin_refugio_list_create'),
    path('admin/refugios/<int:pk>/', views.RefugioDetailView.as_view(), name='admin_refugio_detail'),
    path('animales/', views.AnimalListCreateView.as_view(), name='animal_list_create'),
    path('animales/<int:pk>/', views.AnimalDetailView.as_view(), name='animal_detail'),
    path('public/postulacion-refugio/', views.PostulacionRefugioListCreateView.as_view(), name='public_postulacion_refugio'),
    path('public/postulacion-refugio/<int:pk>/', views.PostulacionRefugioUpdateView.as_view(), name='public_postulacion_refugio_update'),
    path('public/refugios/', views.RefugioPublicListView.as_view(), name='public_refugios_list'),
    path('public/refugios/<int:pk>/', views.RefugioPublicDetailView.as_view(), name='public_refugios_detail'),
    path('public/animales/', views.AnimalPublicListView.as_view(), name='public_animales_list'),
    path('public/animales/<int:pk>/', views.AnimalPublicDetailView.as_view(), name='public_animales_detail'),
]