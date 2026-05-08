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

# Serializers dinamicos para os demais models. Para cada FK, expoe automaticamente
# o campo aninhado (read-only) e um <fk>Id (write-only) que o frontend usa.

def _make_basic_serializer(model_class):
    class Meta:
        model = model_class
        fields = '__all__'

    return type(
        f'{model_class.__name__}BasicSerializer',
        (serializers.ModelSerializer,),
        {'Meta': Meta},
    )


def create_model_serializer(model_class):
    extra_fields = {}
    for field in model_class._meta.fields:
        if not (field.is_relation and field.many_to_one):
            continue
        nested_serializer = _make_basic_serializer(field.related_model)
        extra_fields[field.name] = nested_serializer(read_only=True)
        extra_fields[f'{field.name}Id'] = serializers.PrimaryKeyRelatedField(
            queryset=field.related_model.objects.all(),
            source=field.name,
            write_only=True,
        )

    class Meta:
        model = model_class
        fields = '__all__'

    attrs = {'Meta': Meta, **extra_fields}
    return type(f'{model_class.__name__}Serializer', (serializers.ModelSerializer,), attrs)

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
