from rest_framework.authentication import TokenAuthentication
import logging

class LoggingTokenAuthentication(TokenAuthentication):
    def authenticate(self, request):
        logger = logging.getLogger(__name__)
        auth = super().authenticate(request)
        if auth is None:
            logger.warning(f'LoggingTokenAuthentication: No token provided or invalid for path {request.path}')
        else:
            user, token = auth
            logger.warning(f'LoggingTokenAuthentication: Usuario autenticado: {getattr(user, "username", None)}, token={token.key}')
        return auth
