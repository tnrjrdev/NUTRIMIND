# Nutrimind

SaaS de gestão de pacientes, receitas, produtos, fornecedores e conteúdos para nutricionistas. Frontend em React + Vite e backend em Django REST Framework, com SQLite em desenvolvimento e PostgreSQL em produção.

---

## Stack

### Frontend
- **React 19** + **Vite 8** (dev server na porta `5173`)
- **Tailwind CSS 4**
- **React Router 7**
- **Axios** (cliente HTTP centralizado em `src/services/api.ts`)

### Backend
- **Django 5** + **Django REST Framework**
- **djangorestframework-simplejwt** para autenticação JWT
- **django-cors-headers** para liberar requisições do frontend
- **bcrypt** para hash de senha (compatível com hashes legados do backend Node antigo)
- Servidor de dev na porta `8000`

### Banco
- **SQLite** (`dev.db`) em desenvolvimento
- **PostgreSQL 15** via `docker-compose.yml` em produção

---

## Como rodar localmente

### Pré-requisitos
- Node.js 18+
- Python 3.11+

### 1. Instalar dependências do frontend
```bash
npm install
```

### 2. Preparar o backend Django
```bash
cd django_architecture
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
```

### 3. Sincronizar o banco
O `dev.db` na raiz é compartilhado pelo Django. Se for a primeira vez ou se vier de uma versão antiga (criada pelo backend Node/Prisma), rode o script de migração — ele adiciona colunas faltantes e converte timestamps Prisma (Unix ms) para ISO:
```bash
python migrate_schema.py
```

Em seguida, aplique as migrations internas do Django (auth, sessions, etc):
```bash
python manage.py migrate
```

### 4. Subir backend e frontend
Em terminais separados:

**Backend** (na pasta `django_architecture`, com venv ativado):
```bash
python manage.py runserver
```

**Frontend** (na raiz):
```bash
npm run dev
```

### 5. Acessar
- App: http://localhost:5173
- API: http://localhost:8000/api

---

## Endpoints principais

Todas as rotas exigem `Authorization: Bearer <token>` exceto as marcadas como públicas.

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/login` | Login (público). Retorna `token` JWT. |
| POST | `/api/usuarios/registro` | Cadastro (público). |
| GET | `/api/me` | Dados do usuário autenticado. |
| GET/POST/PUT/DELETE | `/api/receitas` | CRUD de receitas. |
| GET/POST/PUT/DELETE | `/api/receitas/categorias` | CRUD de categorias. |
| ... | `/api/produtos`, `/api/fornecedores`, `/api/chas`, `/api/ifood`, `/api/substituicoes`, `/api/bem-estar`, `/api/dicas` | Mesmo padrão. |

URLs aceitam barra final opcional (`/receitas` e `/receitas/` funcionam).

---

## Produção (PostgreSQL via Docker)

1. Subir o Postgres:
   ```bash
   docker-compose up -d
   ```

2. Apontar o Django para o Postgres editando `django_architecture/nutrimind_backend/settings.py` (bloco `DATABASES`) ou via variável de ambiente:
   ```env
   DATABASE_URL=postgresql://admin:supersecretpassword@localhost:5432/nutrimind_prod
   ```

3. Rodar migrations contra o Postgres:
   ```bash
   python manage.py migrate
   ```

4. Build do frontend:
   ```bash
   npm run build
   ```
   Saída em `dist/`.

5. Servir Django via gunicorn/uvicorn por trás de um reverse proxy.

---

## Estrutura de diretórios

```
.
├── src/                          # Frontend (React + Vite)
│   ├── features/                 # Domínios: auth, admin, recipes, products, etc.
│   ├── services/api.ts           # Cliente axios + interceptors
│   └── routes.tsx                # Rotas
├── django_architecture/          # Backend (Django + DRF)
│   ├── api/                      # App principal: models, views, serializers, urls
│   ├── nutrimind_backend/        # Settings, urls raiz, wsgi/asgi
│   ├── migrate_schema.py         # Migração one-time do schema Prisma → Django
│   └── manage.py
├── dev.db                        # SQLite de desenvolvimento (compartilhado)
└── docker-compose.yml            # Postgres para produção
```
