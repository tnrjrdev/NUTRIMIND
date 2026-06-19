# Walkthrough: Feed de Refeições (Diário Alimentar)

A nova funcionalidade de Feed estilo Instagram foi completamente implementada no frontend e backend. Com ela, os usuários podem enviar fotos de seus pratos, e a equipe de nutrição (ou os próprios pacientes na rede) podem deixar uma curtida.

## Resumo das Modificações

### 1. Backend (Spring Boot)
- **Tabelas Geradas Dinamicamente:** Atualizamos a propriedade `spring.jpa.hibernate.ddl-auto` para `update` no [application.properties](file:///f:/Dev/NUTRIMIND-1/spring_backend/src/main/resources/application.properties), de forma que a nova tabela `refeicao_enviada` será criada sem precisarmos de migrações complexas manuais no Prisma.
- **Entidade `RefeicaoEnviada`:** Foi criada no pacote de entidades, registrando o ID do usuário que enviou, a URL da foto, uma descrição opcional e o estado de "curtido" (bool). [RefeicaoEnviada.java](file:///f:/Dev/NUTRIMIND-1/spring_backend/src/main/java/com/nutrimind/entity/RefeicaoEnviada.java)
- **Controller & API:** Um novo controller foi criado para permitir a listagem das refeições do feed, a postagem de um novo prato (identificando automaticamente o ID do usuário logado via JWT Token do Spring Security), e a ação de **curtir/descurtir**. [RefeicaoEnviadaController.java](file:///f:/Dev/NUTRIMIND-1/spring_backend/src/main/java/com/nutrimind/web/RefeicaoEnviadaController.java)

### 2. Frontend (React/Vite)
- **Integração com a API:** Um novo arquivo [refeicoesService.ts](file:///f:/Dev/NUTRIMIND-1/src/services/refeicoesService.ts) realiza as requisições GET, POST e PATCH no backend.
- **Página de Diário Alimentar:** A interface em [RefeicoesPage.tsx](file:///f:/Dev/NUTRIMIND-1/src/features/refeicoes/pages/RefeicoesPage.tsx) foi construída. Ela possui:
  - Um formulário limpo para inserir a **URL da Imagem** e uma descrição rápida do que foi comido.
  - Um feed listando todas as refeições, trazendo a foto em destaque.
  - Um botão de coração estilo Instagram para **curtir**, utilizando atualizações otimistas (muda de cor instantaneamente para o usuário sem esperar a resposta lenta do servidor).
- **Acesso pelo Menu Principal:** O atalho "Diário Alimentar" foi adicionado diretamente na tela de [Home](file:///f:/Dev/NUTRIMIND-1/src/features/feature/home/pages/HomePage.tsx) utilizando um ícone de câmera configurado manualmente.

> [!TIP]
> Se a interface do backend estivesse rodando antes das mudanças, o Spring Boot deve ser **reiniciado** para que ele possa capturar a nova entidade `RefeicaoEnviada` e criar a tabela no banco SQLite. Após o restart, a nova página estará 100% funcional.

## Como testar
1. Reinicie o backend Spring Boot que já estava rodando (`Ctrl + C` no terminal dele e rode novamente `.\mvnw.cmd spring-boot:run`).
2. Acesse a aplicação no frontend.
3. Na tela principal, encontre a nova opção **Diário Alimentar** com ícone de câmera.
4. Cole a URL de qualquer imagem (ex: `https://images.unsplash.com/photo-1546069901-ba9599a7e63c`) e poste.
5. Brinque de clicar no coração para curtir e descurtir.
