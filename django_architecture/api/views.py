from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
import bcrypt

from .models import *
from .serializers import *

# ==========================================
# AUTHENTICATION
# ==========================================

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({'message': 'Usuário e senha são obrigatórios'}, status=status.HTTP_400_BAD_REQUEST)
        
    try:
        user = Usuario.objects.get(email=username)
        if not user.ativo:
            return Response({'message': 'Credenciais inválidas'}, status=status.HTTP_401_UNAUTHORIZED)
            
        # Verificar o hash do bcrypt
        # O banco salva no formato "$2a$..." ou "$2b$..." do bcrypt
        password_is_valid = bcrypt.checkpw(password.encode('utf-8'), user.senha_hash.encode('utf-8'))
        
        if not password_is_valid:
            return Response({'message': 'Credenciais inválidas'}, status=status.HTTP_401_UNAUTHORIZED)
            
        # Gerar tokens JWT
        refresh = RefreshToken()
        refresh['id'] = user.id # custom claim
        
        return Response({
            'auth': True,
            'token': str(refresh.access_token),
            'user': UsuarioSerializer(user).data
        })
        
    except Usuario.DoesNotExist:
        return Response({'message': 'Credenciais inválidas'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me_view(request):
    # DRF_SimpleJWT insere o token decodificado no request.auth
    user_id = request.auth.payload.get('id')
    try:
        user = Usuario.objects.get(id=user_id)
        if not user.ativo:
            return Response({'auth': False, 'message': 'Usuário inativo'}, status=status.HTTP_404_NOT_FOUND)
            
        return Response({
            'auth': True,
            'user': UsuarioSerializer(user).data
        })
    except Usuario.DoesNotExist:
        return Response({'auth': False, 'message': 'Usuário não encontrado'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([AllowAny])
def registro_view(request):
    nome = request.data.get('nome')
    email = request.data.get('email')
    senha = request.data.get('senha')

    if not nome or not email or not senha:
        return Response({'message': 'Nome, email e senha são obrigatórios.'}, status=status.HTTP_400_BAD_REQUEST)

    if Usuario.objects.filter(email=email).exists():
        return Response({'message': 'Já existe um usuário com este email.'}, status=status.HTTP_409_CONFLICT)

    senha_hash = bcrypt.hashpw(senha.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    user = Usuario.objects.create(nome=nome, email=email, senha_hash=senha_hash, ativo=True)
    
    # Gerar token logo após o cadastro para auto-login se necessário
    refresh = RefreshToken()
    refresh['id'] = user.id
    
    return Response({
        'auth': True,
        'token': str(refresh.access_token),
        'user': UsuarioSerializer(user).data
    }, status=status.HTTP_201_CREATED)

# ==========================================
# DB SCHEMA INSPECTION (TEMP)
# ==========================================
from django.db import connection

@api_view(['GET'])
@permission_classes([AllowAny])
def db_schema_view(request):
    with connection.cursor() as cursor:
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        
        schema = {}
        for table in tables:
            tname = table[0]
            cursor.execute(f"PRAGMA table_info('{tname}')")
            cols = cursor.fetchall()
            schema[tname] = [{"cid": c[0], "name": c[1], "type": c[2]} for c in cols]
            
    return Response(schema)

# ==========================================
# VIEWSETS (CRUD Automático para cada Modelo)
# ==========================================

def create_model_viewset(model_class, serializer_class_param):
    class CustomViewSet(viewsets.ModelViewSet):
        queryset = model_class.objects.all()
        serializer_class = serializer_class_param
        # Se desejar proteger todas as rotas de API, descomente a linha abaixo:
        # permission_classes = [IsAuthenticated]
    return CustomViewSet

# Registro de ViewSets base
UsuarioViewSet = create_model_viewset(Usuario, UsuarioSerializer)
CategoriaReceitaViewSet = create_model_viewset(CategoriaReceita, CategoriaReceitaSerializer)
ReceitaViewSet = create_model_viewset(Receita, ReceitaSerializer)
IngredienteViewSet = create_model_viewset(Ingrediente, IngredienteSerializer)
ModoPreparoViewSet = create_model_viewset(ModoPreparo, ModoPreparoSerializer)
CategoriaProdutoViewSet = create_model_viewset(CategoriaProduto, CategoriaProdutoSerializer)
ProdutoViewSet = create_model_viewset(Produto, ProdutoSerializer)
CategoriaFornecedorViewSet = create_model_viewset(CategoriaFornecedor, CategoriaFornecedorSerializer)
FornecedorViewSet = create_model_viewset(Fornecedor, FornecedorSerializer)
CupomDescontoViewSet = create_model_viewset(CupomDesconto, CupomDescontoSerializer)
CategoriaIfoodViewSet = create_model_viewset(CategoriaIfood, CategoriaIfoodSerializer)
RestauranteIfoodViewSet = create_model_viewset(RestauranteIfood, RestauranteIfoodSerializer)
CategoriaChaViewSet = create_model_viewset(CategoriaCha, CategoriaChaSerializer)
ChaViewSet = create_model_viewset(Cha, ChaSerializer)
CategoriaSubstituicaoViewSet = create_model_viewset(CategoriaSubstituicao, CategoriaSubstituicaoSerializer)
ItemSubstituicaoViewSet = create_model_viewset(ItemSubstituicao, ItemSubstituicaoSerializer)
BemEstarItemViewSet = create_model_viewset(BemEstarItem, BemEstarItemSerializer)
DicaViewSet = create_model_viewset(Dica, DicaSerializer)
