# 🥑 Nutrimind

O **Nutrimind** é um SaaS premium focado na gestão completa de pacientes, receitas e rotinas para nutricionistas e profissionais de saúde. Ele oferece uma interface de alto padrão (Glassmorphism, tipografia moderna e paletas exclusivas) e um backend blindado com as melhores práticas de segurança corporativa.

---

## 🚀 Tecnologias Utilizadas

### Frontend (Interface de Alto Padrão)
*   **React 19 & Vite:** Renderização ultrarrápida e ambiente de desenvolvimento otimizado.
*   **Tailwind CSS (v4):** Estilização utilitária com identidade visual própria (Paleta *Sage Green* e *Champagne Gold*, tipografia *Outfit/Playfair*).
*   **React Router 7:** Navegação e roteamento client-side robusto.
*   **Design System:** Componentes flutuantes (Glassmorphism), scrollbars customizadas, e animações fluidas globais (`cubic-bezier`).

### Backend (Node.js API)
*   **Express.js:** Servidor RESTful modular.
*   **Prisma ORM:** Mapeamento objeto-relacional seguro contra SQL Injection.
*   **Banco de Dados Híbrido:** SQLite para desenvolvimento super rápido (`better-sqlite3`) e PostgreSQL para produção (via Docker Compose).
*   **Segurança:** Autenticação via JWT, senhas com bcrypt, `helmet` (Security HTTP Headers), `express-rate-limit` (Proteção Anti-DDoS e Força Bruta), e CORS restrito.
*   **Validação & Engenharia:** Middlewares de validação robusta com **Zod** e um Global Error Handler unificado para blindagem de vazamentos de erro (Data Leakage).
*   **Deploy (PM2):** Preparado com `ecosystem.config.cjs` para rodar em *Cluster Mode* utilizando o máximo de núcleos da CPU na nuvem.

---

## 🛠️ Como rodar o projeto localmente (Ambiente de Desenvolvimento)

### Pré-requisitos
*   Node.js (v18 ou superior)
*   NPM (geralmente instalado junto com o Node)

### Passo a Passo

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/tnrjrdev/nutrimind.git
    cd nutrimind
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Variáveis de Ambiente:**
    Verifique se existe um arquivo `.env` na raiz do projeto com o seguinte conteúdo base (crie um, se necessário):
    ```env
    PORT=3001
    SECRET_KEY=uma-chave-super-secreta-para-dev
    ```

4.  **Inicie o banco de dados e as tabelas:**
    Como estamos usando SQLite em modo Dev, as tabelas são criadas localmente. Se for sua primeira vez executando, garanta que o schema do Prisma esteja atualizado:
    ```bash
    npx prisma db push
    ```

5.  **Inicie o Frontend e o Backend simultaneamente:**
    Este comando sobe tanto o servidor Node (na porta 3001) quanto a interface React (na porta 5173).
    ```bash
    npm run dev
    ```

6.  **Acesse o sistema:**
    Abra seu navegador em: `http://localhost:5173`

---

## 🐳 Como rodar em Produção (Ambiente Definitivo)

O ambiente de produção foi desenhado para utilizar **PostgreSQL**, entregando suporte a acessos paralelos sem bloqueios (*locking*).

1.  **Suba o Banco de Dados com Docker Compose:**
    ```bash
    docker-compose up -d
    ```
    *Isso iniciará um container PostgreSQL 15 rodando em plano de fundo.*

2.  **Atualize o `.env` de Produção:**
    Modifique as variáveis no seu servidor para apontarem para o banco real:
    ```env
    NODE_ENV=production
    DATABASE_URL="postgresql://admin:supersecretpassword@localhost:5432/nutrimind_prod?schema=public"
    SECRET_KEY=sua_chave_real_muito_longa_aqui
    ```

3.  **Faça o Build do Frontend (React):**
    ```bash
    npm run build
    ```
    *Isso gerará a pasta `dist/` com arquivos HTML/JS minificados.*

4.  **Inicie a API em modo Cluster com PM2:**
    Se não tiver o PM2 instalado, instale globalmente com `npm install -g pm2`.
    ```bash
    pm2 start ecosystem.config.cjs
    ```
    *Sua API agora está rodando utilizando todos os núcleos do servidor de forma inteligente.*

---

## 🗃️ Estrutura de Diretórios (Destaques)

*   `/src`: Todo o ecossistema Frontend (React).
    *   `/features`: Divisão por domínios (Auth, Layout, iFood, Receitas, etc).
    *   `/styles`: Configurações visuais (Tailwind CSS 4, Custom Properties).
*   `/backend`: API Express RESTful completa.
    *   `/routes`: Arquivos independentes por módulo do sistema.
    *   `/middlewares`: Porteiros lógicos (Validação Zod, etc).
*   `/prisma`: Esquema de dados (Models) que geram o banco e os tipos.
*   `/scripts`: Automações internas em JS (como o `refactorRoutes.js`).

---
*Desenvolvido com foco em alta performance e Design Premium.*
