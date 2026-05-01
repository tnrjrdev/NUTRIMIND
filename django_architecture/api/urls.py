from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter(trailing_slash=False)
router.register(r'usuarios', UsuarioViewSet, basename='usuario')
router.register(r'receitas/categorias', CategoriaReceitaViewSet, basename='categoriareceita')
router.register(r'receitas', ReceitaViewSet, basename='receita')
router.register(r'ingredientes', IngredienteViewSet, basename='ingrediente')
router.register(r'modos-preparo', ModoPreparoViewSet, basename='modopreparo')
router.register(r'produtos/categorias', CategoriaProdutoViewSet, basename='categoriaproduto')
router.register(r'produtos', ProdutoViewSet, basename='produto')
router.register(r'fornecedores/categorias', CategoriaFornecedorViewSet, basename='categoriafornecedor')
router.register(r'fornecedores', FornecedorViewSet, basename='fornecedor')
router.register(r'cupons', CupomDescontoViewSet, basename='cupomdesconto')
router.register(r'ifood/categorias', CategoriaIfoodViewSet, basename='categoriaifood')
router.register(r'ifood', RestauranteIfoodViewSet, basename='restauranteifood')
router.register(r'chas/categorias', CategoriaChaViewSet, basename='categoriacha')
router.register(r'chas', ChaViewSet, basename='cha')
router.register(r'substituicoes/categorias', CategoriaSubstituicaoViewSet, basename='categoriasubstituicao')
router.register(r'substituicoes', ItemSubstituicaoViewSet, basename='itemsubstituicao')
router.register(r'bem-estar', BemEstarItemViewSet, basename='bemestar')
router.register(r'dicas', DicaViewSet, basename='dica')

urlpatterns = [
    # Rotas de Autenticação Customizadas
    path('login', login_view, name='api-login'),
    path('me', me_view, name='api-me'),
    path('schema', db_schema_view, name='api-schema'),
    path('usuarios/registro', registro_view, name='api-registro'),
    
    # Rotas do CRUD (ViewSets)
    path('', include(router.urls)),
]
