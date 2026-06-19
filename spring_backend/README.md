# Nutrimind — Backend (Spring Boot)

Porte do backend Django/DRF para **Java 21 + Spring Boot 3.3**, mantendo o mesmo
contrato de API consumido pelo frontend React/Vite e o **mesmo banco SQLite `dev.db`**
(criado originalmente pelo Prisma).

## Stack
- **Java 21** + **Spring Boot 3.3** (Web, Data JPA, Security)
- **SQLite** via `org.xerial:sqlite-jdbc` + dialeto `hibernate-community-dialects`
- **JWT** (jjwt) com claim custom `id` — compatível com o token que o frontend já armazena
- **BCrypt** (`spring-security-crypto`) — compatível com os hashes legados `$2a$/$2b$`
- Servidor de dev na porta **8000** (igual ao Django)

## Como rodar

O banco `dev.db` fica na **raiz do repositório** (um nível acima desta pasta). O caminho
padrão é `../dev.db`; rode os comandos a partir de `spring_backend/`.

### Com Maven instalado
```bash
cd spring_backend
mvn spring-boot:run
```

### Com o Maven Wrapper (não precisa instalar Maven)
```bash
cd spring_backend
./mvnw spring-boot:run      # Linux/Mac
mvnw.cmd spring-boot:run    # Windows
```

API disponível em `http://localhost:8000/api`.

### Variáveis de ambiente (opcionais)
| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `NUTRIMIND_DB_PATH` | `../dev.db` | Caminho do arquivo SQLite |
| `NUTRIMIND_JWT_SECRET` | (dev) | Segredo HS256 do JWT (use um forte em produção) |
| `NUTRIMIND_JWT_EXPIRATION_MS` (`nutrimind.jwt.expiration-ms`) | `86400000` | Validade do token (1 dia) |

## Endpoints

| Método | Rota | Observação |
|--------|------|-----------|
| POST | `/api/login` | Público. `{username, password}` → `{auth, token, user}` |
| POST | `/api/usuarios/registro` | Público. `{nome, email, senha}` |
| GET | `/api/me` | Requer `Authorization: Bearer <token>` |
| CRUD | `/api/usuarios` | Senha enviada como `senha` é hasheada (bcrypt) |
| CRUD | `/api/receitas` + `/api/receitas/categorias` | Receita aceita/retorna `ingredientes` e `modosPreparo` aninhados; filtro `?categoriaId=` |
| CRUD | `/api/produtos` + `/api/produtos/categorias` | |
| CRUD | `/api/fornecedores` + `/api/fornecedores/categorias` | Fornecedor aceita/retorna `cupons` aninhados |
| CRUD | `/api/ifood` + `/api/ifood/categorias` | |
| CRUD | `/api/chas` + `/api/chas/categorias` | |
| CRUD | `/api/substituicoes` + `/api/substituicoes/categorias` | |
| CRUD | `/api/bem-estar`, `/api/dicas`, `/api/cupons`, `/api/ingredientes`, `/api/modos-preparo` | |

Toda rota fora de `login`/`registro` exige JWT (espelha `IsAuthenticated` do DRF).
Listagens com chave estrangeira aceitam filtro por querystring, ex.: `GET /api/receitas?categoriaId=2`.

## Arquitetura
- `entity/` — entidades JPA mapeando as tabelas existentes (`@Table` com os nomes PascalCase do Prisma + `usuarios`). `ddl-auto=none`: o schema nunca é alterado.
- `repository/` — Spring Data JPA.
- `web/CrudController` — CRUD genérico (lista/detalhe/criação/PUT/PATCH/DELETE) que resolve relações `@ManyToOne` recebidas como `<campo>Id` e filtra por querystring.
- `web/ReceitaController`, `web/FornecedorController` — agregados com filhos aninhados.
- `web/UsuarioController`, `web/AuthController` — autenticação e gestão de usuários.
- `security/` — `JwtService`, `JwtAuthFilter`, configurados em `config/SecurityConfig`.
