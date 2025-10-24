from django.contrib.auth.backends import ModelBackend
from registry.models import Usuario

class EmailBackend(ModelBackend):
    def authenticate(self, request, email=None, password=None, **kwargs):
            print(f"[DEBUG] EmailBackend.authenticate called with email={email}")
            try:
                user = Usuario.objects.get(email=email)
            except Usuario.DoesNotExist:
                print(f"[DEBUG] Usuario with email={email} does not exist.")
                return None
            if user.check_password(password):
                print(f"[DEBUG] Password correct for user {email}")
                return user
            print(f"[DEBUG] Password incorrect for user {email}")
            return None
