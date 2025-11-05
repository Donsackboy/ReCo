from rest_framework import permissions

class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.tipo_usuario == 'admin'

class IsRefugio(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.tipo_usuario == 'refugio'

class IsRefugioOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        import logging
        logger = logging.getLogger(__name__)
        logger.warning(f'IsRefugioOrAdmin: user={getattr(request.user, "username", None)}, tipo={getattr(request.user, "tipo_usuario", None)}, auth={request.user.is_authenticated}')
        return request.user.is_authenticated and request.user.tipo_usuario in ['refugio', 'admin']
