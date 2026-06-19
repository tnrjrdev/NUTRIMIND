# Nutrimind

SaaS de gestão de pacientes, receitas, produtos, fornecedores e conteúdos para nutricionistas.
Frontend em **React + Vite** e backend em **Java + Spring Boot**, com **SQLite** em desenvolvimento
e **PostgreSQL** disponível para produção.

---

## Stack

### Frontend
- **React 19** + **Vite 8** (dev server na porta `5173`)
- **Tailwind CSS 4**
- **React Router 7**
- **Axios** (cliente HTTP centralizado em `src/services/api.ts`)

### Backend
- **Java 21** + **Spring Boot 3.3** (Web, Data JPA, Security)
- **JWT** (jjwt) para autenticação — token Bearer com claim `id`
- **BCrypt** para hash de senha (compatível com os hashes legados `$2a$/$2b$`)
- Servidor de dev na porta `8000`
- Código em [`spring_backend/`](spring_backend/) (ver o [README do backend](spring_backend/README.md))

### Banco
- **SQLite** (`dev.db`, na raiz) em desenvolvimento — schema criado pelo Prisma
- **PostgreSQL 15** via `docker-compose.yml` para produção

---

## Como rodar localmente

### Pré-requisitos
- Node.js 18+
- Java 21+ (o Maven pode ser dispensado usando o wrapper `./mvnw`)

### 1. Instalar dependências do frontend
```bash
npm install
```

### 2. Subir o backend (Spring Boot)
Em um terminal, a partir de `spring_backend/`:
```bash
cd spring_backend
./mvnw spring-boot:run      # Linux/Mac
mvnw.cmd spring-boot:run    # Windows
```
O backend usa o `dev.db` da raiz (caminho padrão `../dev.db`) e sobe em `http://localhost:8000`.

### 3. Subir o frontend (Vite)
Em outro terminal, na raiz:
```bash
npm run dev
```

### 4. Acessar
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
| GET/POST/PUT/DELETE | `/api/receitas` + `/api/receitas/categorias` | CRUD de receitas (com `ingredientes`/`modosPreparo` aninhados) e categorias. |
| ... | `/api/produtos`, `/api/fornecedores`, `/api/chas`, `/api/ifood`, `/api/substituicoes`, `/api/bem-estar`, `/api/dicas` | Mesmo padrão (cada um com sua sub-rota `/categorias` quando aplicável). |

Listagens com chave estrangeira aceitam filtro por querystring, ex.: `GET /api/receitas?categoriaId=2`.
Detalhes do contrato e variáveis de ambiente em [`spring_backend/README.md`](spring_backend/README.md).

---

## Produção (PostgreSQL via Docker)

1. Subir o Postgres:
   ```bash
   docker-compose up -d
   ```
2. Apontar o backend para o Postgres (trocar driver/dialeto/datasource em
   `spring_backend/src/main/resources/application.properties` ou via variáveis de ambiente) e
   migrar os dados do SQLite.
3. Build do frontend:
   ```bash
   npm run build   # saída em dist/
   ```
4. Empacotar o backend: `cd spring_backend && ./mvnw clean package` (gera o `.jar` em `target/`).

---

## Estrutura de diretórios

```
.
├── src/                          # Frontend (React + Vite)
│   ├── features/                 # Domínios: auth, admin, recipes, products, etc.
│   ├── services/api.ts           # Cliente axios + interceptors
│   └── routes.tsx                # Rotas
├── spring_backend/               # Backend (Java + Spring Boot)
│   ├── src/main/java/com/nutrimind/
│   │   ├── entity/               # Entidades JPA (mapeiam as tabelas do dev.db)
│   │   ├── repository/           # Spring Data JPA
│   │   ├── web/                  # Controllers (CRUD genérico + agregados + auth)
│   │   ├── security/             # JWT + filtro de autenticação
│   │   └── config/               # Segurança, CORS, Jackson
│   └── pom.xml
├── dev.db                        # SQLite de desenvolvimento (compartilhado)
└── docker-compose.yml            # Postgres para produção
```
