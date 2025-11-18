


from django.urls import path
from .views import UploadImageView
from . import views
from rest_framework.routers import DefaultRouter



from .views_especie import EspecieViewSet

router = DefaultRouter()
router.register(r'especies', EspecieViewSet, basename='especie')
router.register(r'animales/(?P<animal_id>[^/.]+)/vacunas', views.VacunaViewSet, basename='vacuna-animal')
router.register(r'vacunas', views.VacunaViewSet, basename='vacuna')
router.register(r'listas-vacunas-animal', views.ListaVacunasAnimalViewSet, basename='listas-vacunas-animal')
router.register(r'listas-vacunas-especie', views.ListaVacunasEspecieViewSet, basename='listas-vacunas-especie')

urlpatterns = [
    path('donaciones-medicas/<int:pk>/respuesta/', views.DonacionMedicaRespuestaView.as_view(), name='donacion_medica_respuesta'),
    path('donaciones-medicas/<int:donacion_id>/descartar/', views.descartar_donacion_medica, name='descartar_donacion_medica'),
    path('upload-image/', UploadImageView.as_view(), name='upload-image'),
    path('registrar_donacion_vacuna/', views.registrar_donacion_vacuna, name='registrar_donacion_vacuna'),
    path('fichamedica/<int:animal_id>/', views.FichaMedicaRetrieveUpdateView.as_view(), name='ficha_medica_retrieve_update'),
    path('refugio/historial-solicitudes-adopcion/', views.historial_solicitudes_adopcion_refugio, name='historial_solicitudes_adopcion_refugio'),
        path('refugio/<int:id_refugio>/donaciones-medicas/', views.DonacionesMedicasRefugioView.as_view(), name='donaciones_medicas_refugio'),
    path('donaciones-medicas-usuario/<int:id_usuario>/', views.DonacionesMedicasUsuarioView.as_view(), name='donaciones_medicas_usuario'),
    path('refugio/solicitud-adopcion/<int:pk>/', views.actualizar_solicitud_adopcion, name='actualizar_solicitud_adopcion'),
    path('auth/login/', views.login, name='login'),
    path('auth/register/', views.register, name='register'),
    path('auth/profile/', views.user_profile, name='profile'),
    path('auth/logout/', views.logout, name='logout'),
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
    path('necesidades-refugio/', views.NecesidadRefugioListCreateView.as_view(), name='necesidad_refugio_list_create'),
    path('necesidades-refugio/<int:pk>/', views.NecesidadRefugioDetailView.as_view(), name='necesidad_refugio_detail'),
    path('webpay/iniciar/', views.iniciar_donacion_webpay, name='iniciar_donacion_webpay'),
]

urlpatterns += router.urls