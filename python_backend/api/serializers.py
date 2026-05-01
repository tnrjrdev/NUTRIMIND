from rest_framework import serializers
from .models import *

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'nome', 'email', 'ativo', 'created_at', 'updated_at']

class CategoriaReceitaSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoriaReceita
        fields = '__all__'

class ReceitaSerializer(serializers.ModelSerializer):
    categoria = CategoriaReceitaSerializer(read_only=True)
    categoriaId = serializers.PrimaryKeyRelatedField(
        queryset=CategoriaReceita.objects.all(), source='categoria', write_only=True
    )

    class Meta:
        model = Receita
        fields = '__all__'

# Para manter o tamanho do arquivo inicial simples, estou criando serializers dinamicamente para os demais modelos
# Em um cenário real, você pode querer personalizar cada um deles se houver necessidades específicas de aninhamento.

def create_model_serializer(model_class):
    class Meta:
        model = model_class
        fields = '__all__'
    
    return type(f'{model_class.__name__}Serializer', (serializers.ModelSerializer,), {'Meta': Meta})

IngredienteSerializer = create_model_serializer(Ingrediente)
ModoPreparoSerializer = create_model_serializer(ModoPreparo)
CategoriaProdutoSerializer = create_model_serializer(CategoriaProduto)
ProdutoSerializer = create_model_serializer(Produto)
CategoriaFornecedorSerializer = create_model_serializer(CategoriaFornecedor)
FornecedorSerializer = create_model_serializer(Fornecedor)
CupomDescontoSerializer = create_model_serializer(CupomDesconto)
CategoriaIfoodSerializer = create_model_serializer(CategoriaIfood)
RestauranteIfoodSerializer = create_model_serializer(RestauranteIfood)
CategoriaChaSerializer = create_model_serializer(CategoriaCha)
ChaSerializer = create_model_serializer(Cha)
CategoriaSubstituicaoSerializer = create_model_serializer(CategoriaSubstituicao)
ItemSubstituicaoSerializer = create_model_serializer(ItemSubstituicao)
BemEstarItemSerializer = create_model_serializer(BemEstarItem)
DicaSerializer = create_model_serializer(Dica)
