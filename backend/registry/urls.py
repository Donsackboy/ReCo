from django.urls import path
from . import views
from django.urls import path
from . import views

urlpatterns = [
    path('refugio/historial-solicitudes-adopcion/', views.historial_solicitudes_adopcion_refugio, name='historial_solicitudes_adopcion_refugio'),
    path('refugio/solicitud-adopcion/<int:pk>/', views.actualizar_solicitud_adopcion, name='actualizar_solicitud_adopcion'),
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
    path('public/animales/count/', views.AnimalPublicCountView.as_view(), name='public_animales_count'),
    path('public/animales/carousel/', views.AnimalPublicCarouselView.as_view(), name='public_animales_carousel'),
    path('cirugias/', views.CirugiaListCreateView.as_view(), name='cirugia_list_create'),
    path('cirugias/<int:pk>/', views.CirugiaRetrieveUpdateDestroyView.as_view(), name='cirugia_detail'),
    path('tratamientos/', views.TratamientoListCreateView.as_view(), name='tratamiento_list_create'),
    path('tratamientos/<int:pk>/', views.TratamientoRetrieveUpdateDestroyView.as_view(), name='tratamiento_detail'),
    path('refugio/solicitudes-adopcion-pendientes/', views.solicitudes_adopcion_pendientes_refugio, name='solicitudes_adopcion_pendientes_refugio'),
    path('refugio/adopciones-pendientes/', views.adopciones_pendientes_refugio, name='adopciones_pendientes_refugio'),
    path('adopciones/', views.SolicitudAdopcionListCreateView.as_view(), name='solicitud_adopcion_list_create'),
    path('animales/<int:animal_id>/alergias-condiciones/', views.AlergiaCondicionListCreateView.as_view(), name='alergia_condicion_list_create'),
    path('refugio/me', views.refugio_me, name='refugio_me'),
        path('animales/<int:animal_id>/ficha-medica/', views.FichaMedicaListCreateView.as_view(), name='ficha_medica_list_create'),
]