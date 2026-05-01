from django.db import models

class Usuario(models.Model):
    id = models.AutoField(primary_key=True)
    nome = models.CharField(max_length=255)
    email = models.CharField(max_length=255, unique=True)
    senha_hash = models.CharField(max_length=255)
    ativo = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def is_authenticated(self):
        return True

    class Meta:
        managed = False
        db_table = 'usuarios'

class CategoriaReceita(models.Model):
    id = models.AutoField(primary_key=True)
    nome = models.CharField(max_length=255)
    descricao = models.TextField(null=True, blank=True)
    ordemExibicao = models.IntegerField(default=0)
    ativo = models.BooleanField(default=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    class Meta:
        managed = False
        db_table = 'CategoriaReceita'

class Receita(models.Model):
    id = models.AutoField(primary_key=True)
    categoria = models.ForeignKey(CategoriaReceita, on_delete=models.CASCADE, db_column='categoriaId', related_name='receitas')
    nome = models.CharField(max_length=255)
    descricao = models.TextField(null=True, blank=True)
    imagem = models.TextField(null=True, blank=True)
    tempoPreparo = models.CharField(max_length=255, null=True, blank=True)
    ativo = models.BooleanField(default=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    class Meta:
        managed = False
        db_table = 'Receita'

class Ingrediente(models.Model):
    id = models.AutoField(primary_key=True)
    receita = models.ForeignKey(Receita, on_delete=models.CASCADE, db_column='receitaId', related_name='ingredientes')
    descricao = models.TextField()
    ordemExibicao = models.IntegerField(default=0)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    class Meta:
        managed = False
        db_table = 'Ingrediente'

class ModoPreparo(models.Model):
    id = models.AutoField(primary_key=True)
    receita = models.ForeignKey(Receita, on_delete=models.CASCADE, db_column='receitaId', related_name='modosPreparo')
    numeroPasso = models.IntegerField()
    descricao = models.TextField()
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    class Meta:
        managed = False
        db_table = 'ModoPreparo'

class CategoriaProduto(models.Model):
    id = models.AutoField(primary_key=True)
    nome = models.CharField(max_length=255)
    descricao = models.TextField(null=True, blank=True)
    imagem = models.TextField(null=True, blank=True)
    ordemExibicao = models.IntegerField(default=0)
    ativo = models.BooleanField(default=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    class Meta:
        managed = False
        db_table = 'CategoriaProduto'

class Produto(models.Model):
    id = models.AutoField(primary_key=True)
    categoria = models.ForeignKey(CategoriaProduto, on_delete=models.CASCADE, db_column='categoriaId', related_name='produtos')
    nome = models.CharField(max_length=255)
    marca = models.CharField(max_length=255, null=True, blank=True)
    descricao = models.TextField(null=True, blank=True)
    imagem = models.TextField(null=True, blank=True)
    recomendado = models.BooleanField(default=False)
    semAcucar = models.BooleanField(default=False)
    semGluten = models.BooleanField(default=False)
    semLactose = models.BooleanField(default=False)
    fonteProteina = models.BooleanField(default=False)
    fonteGorduraBoa = models.BooleanField(default=False)
    fonteFibra = models.BooleanField(default=False)
    observacao = models.TextField(null=True, blank=True)
    ordemExibicao = models.IntegerField(default=0)
    ativo = models.BooleanField(default=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    class Meta:
        managed = False
        db_table = 'Produto'

class CategoriaFornecedor(models.Model):
    id = models.AutoField(primary_key=True)
    nome = models.CharField(max_length=255)
    descricao = models.TextField(null=True, blank=True)
    ordemExibicao = models.IntegerField(default=0)
    ativo = models.BooleanField(default=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    class Meta:
        managed = False
        db_table = 'CategoriaFornecedor'

class Fornecedor(models.Model):
    id = models.AutoField(primary_key=True)
    categoria = models.ForeignKey(CategoriaFornecedor, on_delete=models.CASCADE, db_column='categoriaId', related_name='fornecedores')
    nome = models.CharField(max_length=255)
    descricaoCurta = models.TextField(null=True, blank=True)
    descricaoDetalhada = models.TextField(null=True, blank=True)
    endereco = models.TextField(null=True, blank=True)
    telefone = models.CharField(max_length=255, null=True, blank=True)
    whatsapp = models.CharField(max_length=255, null=True, blank=True)
    instagram = models.CharField(max_length=255, null=True, blank=True)
    site = models.CharField(max_length=255, null=True, blank=True)
    ordemExibicao = models.IntegerField(default=0)
    ativo = models.BooleanField(default=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    class Meta:
        managed = False
        db_table = 'Fornecedor'

class CupomDesconto(models.Model):
    id = models.AutoField(primary_key=True)
    fornecedor = models.ForeignKey(Fornecedor, on_delete=models.CASCADE, db_column='fornecedorId', related_name='cupons')
    codigo = models.CharField(max_length=255)
    descricao = models.TextField(null=True, blank=True)
    validade = models.DateTimeField(null=True, blank=True)
    ativo = models.BooleanField(default=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    class Meta:
        managed = False
        db_table = 'CupomDesconto'

class CategoriaIfood(models.Model):
    id = models.AutoField(primary_key=True)
    nome = models.CharField(max_length=255)
    descricao = models.TextField(null=True, blank=True)
    ordemExibicao = models.IntegerField(default=0)
    ativo = models.BooleanField(default=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    class Meta:
        managed = False
        db_table = 'CategoriaIfood'

class RestauranteIfood(models.Model):
    id = models.AutoField(primary_key=True)
    categoria = models.ForeignKey(CategoriaIfood, on_delete=models.CASCADE, db_column='categoriaId', related_name='restaurantes')
    nome = models.CharField(max_length=255)
    descricao = models.TextField(null=True, blank=True)
    telefone = models.CharField(max_length=255, null=True, blank=True)
    linkExterno = models.TextField(null=True, blank=True)
    ordemExibicao = models.IntegerField(default=0)
    ativo = models.BooleanField(default=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    class Meta:
        managed = False
        db_table = 'RestauranteIfood'

class CategoriaCha(models.Model):
    id = models.AutoField(primary_key=True)
    nome = models.CharField(max_length=255)
    descricao = models.TextField(null=True, blank=True)
    imagem = models.TextField(null=True, blank=True)
    ordemExibicao = models.IntegerField(default=0)
    ativo = models.BooleanField(default=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    class Meta:
        managed = False
        db_table = 'CategoriaCha'

class Cha(models.Model):
    id = models.AutoField(primary_key=True)
    categoria = models.ForeignKey(CategoriaCha, on_delete=models.CASCADE, db_column='categoriaId', related_name='chas')
    nome = models.CharField(max_length=255)
    formaUtilizacao = models.TextField(null=True, blank=True)
    posologia = models.TextField(null=True, blank=True)
    contraindicacoes = models.TextField(null=True, blank=True)
    observacoes = models.TextField(null=True, blank=True)
    ordemExibicao = models.IntegerField(default=0)
    ativo = models.BooleanField(default=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    class Meta:
        managed = False
        db_table = 'Cha'

class CategoriaSubstituicao(models.Model):
    id = models.AutoField(primary_key=True)
    nome = models.CharField(max_length=255)
    descricao = models.TextField(null=True, blank=True)
    ordemExibicao = models.IntegerField(default=0)
    ativo = models.BooleanField(default=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    class Meta:
        managed = False
        db_table = 'CategoriaSubstituicao'

class ItemSubstituicao(models.Model):
    id = models.AutoField(primary_key=True)
    categoria = models.ForeignKey(CategoriaSubstituicao, on_delete=models.CASCADE, db_column='categoriaId', related_name='itens')
    nome = models.CharField(max_length=255)
    descricao = models.TextField(null=True, blank=True)
    equivalencia = models.TextField(null=True, blank=True)
    ordemExibicao = models.IntegerField(default=0)
    ativo = models.BooleanField(default=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    class Meta:
        managed = False
        db_table = 'ItemSubstituicao'

class BemEstarItem(models.Model):
    id = models.AutoField(primary_key=True)
    nome = models.CharField(max_length=255)
    descricaoCurta = models.TextField(null=True, blank=True)
    descricaoDetalhada = models.TextField(null=True, blank=True)
    instagram = models.CharField(max_length=255, null=True, blank=True)
    site = models.CharField(max_length=255, null=True, blank=True)
    midiaUrl = models.TextField(null=True, blank=True)
    ordemExibicao = models.IntegerField(default=0)
    ativo = models.BooleanField(default=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    class Meta:
        managed = False
        db_table = 'BemEstarItem'

class Dica(models.Model):
    id = models.AutoField(primary_key=True)
    texto = models.TextField()
    icone = models.CharField(max_length=255, null=True, blank=True)
    ordemExibicao = models.IntegerField(default=0)
    ativo = models.BooleanField(default=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    class Meta:
        managed = False
        db_table = 'Dica'
