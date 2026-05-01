from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import AuthenticationFailed
from .models import Usuario

class CustomJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        try:
            user_id = validated_token.get('id')
            user = Usuario.objects.get(id=user_id)
            if not user.ativo:
                raise AuthenticationFailed('Usuário inativo')
            return user
        except Usuario.DoesNotExist:
            raise AuthenticationFailed('Usuário não encontrado', code='user_not_found')
