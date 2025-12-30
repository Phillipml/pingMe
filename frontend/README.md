# PingMe Frontend

Frontend da aplicação PingMe desenvolvido com Next.js 16, React 19 e TypeScript. Interface moderna e responsiva para rede social com autenticação, feed de posts, perfis de usuário e interações sociais.

## Tecnologias

- **Next.js 16.0.1** - Framework React com App Router
- **React 19.2.0** - Biblioteca UI
- **TypeScript 5** - Tipagem estática
- **Redux Toolkit 2.10.1** - Gerenciamento de estado global
- **Axios 1.13.2** - Cliente HTTP com interceptors
- **Tailwind CSS 4** - Framework CSS utilitário
- **React Icons 5.5.0** - Biblioteca de ícones

## Estrutura do Projeto

```
frontend/
├── app/                      # App Router do Next.js
│   ├── page.tsx             # Página inicial (redireciona baseado em autenticação)
│   ├── layout.tsx           # Layout raiz da aplicação
│   ├── globals.css          # Estilos globais
│   ├── login/               # Página de login
│   │   └── page.tsx
│   ├── register/            # Página de registro
│   │   └── page.tsx
│   ├── feed/                # Feed principal
│   │   └── page.tsx
│   ├── profile/             # Página de perfil do usuário
│   │   └── page.tsx
│   ├── complete-profile/    # Completar perfil
│   │   └── page.tsx
│   ├── user-created/        # Confirmação de criação de conta
│   │   └── page.tsx
│   ├── search/              # Página de busca de usuários
│   │   └── page.tsx
│   ├── user-profile/        # Perfil público de outros usuários
│   │   └── [id]/
│   │       └── page.tsx
│   └── comments/            # Página de comentários de um post
│       └── [id]/
│           └── page.tsx
├── components/              # Componentes reutilizáveis
│   ├── layout/              # Componentes de layout
│   │   ├── Header.tsx       # Barra de navegação superior
│   │   ├── CenterContainer.tsx
│   │   ├── Container.tsx
│   │   ├── Form.tsx
│   │   └── Card/            # Componentes de card
│   │       ├── FeedCard.tsx # Card para posts no feed
│   │       └── UserPostCard.tsx # Card para posts do usuário
│   └── ui/                  # Componentes de UI
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Logo.tsx
├── lib/                      # Configurações e utilitários
│   ├── axios.ts             # Instâncias do Axios com interceptors
│   ├── slice.ts             # Redux Toolkit API slice
│   └── store.ts             # Configuração da store Redux
├── hooks/                    # Custom hooks
│   ├── useAuth.ts           # Hook para autenticação
│   ├── useComments.ts       # Hook para gerenciar comentários
│   └── useNavigation.ts     # Hook para navegação
├── providers/                # Providers React
│   └── AppProvider.tsx     # Provider do Redux
├── utils/                    # Utilitários
│   ├── api-interfaces.ts    # Interfaces TypeScript para API
│   └── api-utils.ts         # Funções utilitárias da API
├── public/                   # Arquivos estáticos
├── package.json             # Dependências e scripts
├── tsconfig.json            # Configuração TypeScript
├── next.config.ts           # Configuração Next.js
└── postcss.config.mjs       # Configuração PostCSS (Tailwind CSS 4)
```

## Funcionalidades

### Autenticação

- **Login**: Autenticação com email e senha
- **Registro**: Criação de nova conta
- **Gerenciamento de Tokens**: Tokens JWT armazenados em localStorage e cookies HttpOnly
- **Refresh Automático**: Interceptor Axios renova tokens automaticamente quando expiram
- **Proteção de Rotas**: Redirecionamento automático baseado em autenticação e status do perfil
- **Fluxo Inteligente**: Verifica status do perfil (0 = primeiro login, 1 = perfil completo) e redireciona adequadamente

### Páginas

1. **Página Inicial (`/`)**:
   - Verifica autenticação via token no localStorage
   - Busca perfil do usuário na API
   - Redireciona para `/login` se não autenticado
   - Redireciona para `/complete-profile` se status = 0 (primeiro login)
   - Redireciona para `/feed` se status = 1 (perfil completo)

2. **Login (`/login`)**:
   - Formulário de login com email e senha
   - Validação de erros
   - Armazena accessToken no localStorage após login bem-sucedido
   - Verifica status do perfil e redireciona:
     - `/complete-profile` se status = 0
     - `/feed` se status = 1
   - Link para página de registro

3. **Registro (`/register`)**:
   - Formulário de criação de conta
   - Campos: username, email, password
   - Validação de erros
   - Redirecionamento para `/user-created` após registro bem-sucedido

4. **Feed (`/feed`)**:
   - Feed principal com posts de usuários seguidos + próprios posts
   - Formulário para criar novos posts (Pings)
   - Visualização de posts com autor, conteúdo, data, contadores de likes e comentários
   - **Funcionalidade de curtir/descurtir posts** com atualização em tempo real
   - Indicador visual de sucesso ao criar post
   - Loading state durante carregamento do feed
   - Atualização otimista do estado de likes usando RTK Query cache

5. **Perfil (`/profile`)**:
   - Visualização e edição do perfil do usuário autenticado
   - Exibe: username, nome, sobrenome, bio e avatar
   - Modo de edição com formulário completo
   - Campos editáveis: username, first_name, last_name, bio e avatar
   - Upload de nova foto de perfil com preview
   - Botão de editar que alterna entre visualização e edição
   - Ícone de câmera (TbPhotoEdit) para alterar avatar no modo de edição
   - **Botão para deletar conta** com confirmação e redirecionamento automático após deleção
   - **Listagem de posts do usuário com paginação** (5 posts por página)
   - Controles de navegação (anterior/próxima) para navegar entre páginas
   - Exibição de contador de posts e página atual

6. **Completar Perfil (`/complete-profile`)**:
   - Formulário completo para atualizar informações do perfil
   - Campos: first_name (obrigatório), last_name, bio, avatar (obrigatório)
   - Upload de imagem de perfil (avatar)
   - Atualiza status do perfil para 1 após conclusão
   - Redireciona para `/feed` após atualização bem-sucedida

7. **Usuário Criado (`/user-created`)**:
   - Página de confirmação após registro
   - Mensagem de boas-vindas
   - Link para página de login

8. **Busca (`/search`)**:
   - Página de busca de usuários
   - Busca via query parameter `?q=termo`
   - Exibe resultados com avatar, username e link para perfil
   - Redireciona para feed se busca vazia ou muito curta (< 2 caracteres)
   - Mensagem quando nenhum usuário é encontrado

9. **Perfil de Usuário (`/user-profile/[id]`)**:
   - Visualização de perfil público de outros usuários
   - Exibe avatar, username e bio
   - Botão para seguir/deixar de seguir
   - Verifica automaticamente se já está seguindo o usuário
   - Loading states durante requisições

10. **Comentários (`/comments/[id]`)**:
    - Visualização completa de um post com todos os seus comentários
    - Exibe informações do autor do post (avatar, username, data)
    - Formulário para criar novos comentários
    - Listagem de todos os comentários do post
    - **Edição de comentários próprios** com modo inline
    - **Exclusão de comentários próprios** com confirmação
    - Indicadores visuais de estado (criando, criado com sucesso)
    - Atualização otimista do cache RTK Query
    - Contadores de comentários atualizados automaticamente no feed e no post
    - Loading states durante carregamento
    - Validação de campos obrigatórios

## Como Começar

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação

1. Instale as dependências:

   ```bash
   cd frontend
   npm install
   ```

2. Configure a URL da API (se necessário):
   - Edite `frontend/utils/api-utils.ts` para alterar `API_BASE_URL`
   - Por padrão: `http://localhost:8000/api`

3. Inicie o servidor de desenvolvimento:

   ```bash
   # Do diretório raiz do projeto
   make dev-frontend

   # Ou diretamente do diretório frontend
   cd frontend
   npm run dev
   ```

4. Acesse a aplicação:
   - Abra [http://localhost:3000](http://localhost:3000) no navegador

## Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Produção
npm run build        # Cria build de produção
npm run start        # Inicia servidor de produção

# Qualidade
npm run lint         # Executa ESLint e corrige erros
npm run format       # Formata código com Prettier
```

**Nota:** Para executar os comandos do diretório raiz, use o Makefile:
```bash
make dev-frontend    # Inicia servidor frontend
make front-lint      # Executa lint do frontend
make front-format    # Formata código do frontend
```

## Configuração

### Variáveis de Ambiente

Crie um arquivo `.env.local` no diretório `frontend/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

**Para acesso via celular**, use o IP da sua máquina:

```env
NEXT_PUBLIC_API_URL=http://192.168.0.18:8000/api
NEXT_PUBLIC_BACKEND_URL=http://192.168.0.18:8000
```

**Importante:** Substitua `192.168.0.18` pelo IP real da sua máquina. Reinicie o servidor do frontend após alterar essas variáveis.

### API Base URL

A URL base da API está configurada em `frontend/utils/api-utils.ts`:

```typescript
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
export const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'
```

## Autenticação

### Fluxo de Autenticação

1. **Login/Registro**:
   - Usuário faz login ou cria conta via RTK Query mutations
   - Tokens JWT são recebidos no body da resposta (`access` e `refresh`)
   - Access token é salvo no localStorage para uso imediato
   - Tokens também são automaticamente salvos em cookies HttpOnly pelo backend
   - Sistema verifica o status do perfil (`user.info.status`):
     - `0`: Primeiro login, redireciona para `/complete-profile`
     - `1`: Perfil completo, redireciona para `/feed`

2. **Requisições Autenticadas**:
   - RTK Query usa `prepareHeaders` para adicionar token do localStorage
   - Axios envia cookies automaticamente (`withCredentials: true`)
   - Interceptor Axios renova tokens quando necessário (401)
   - Redireciona para login se refresh falhar

3. **Proteção de Rotas**:
   - Página inicial (`/`) verifica token no localStorage
   - Busca perfil na API para verificar autenticação e status
   - Redireciona baseado no estado:
     - Sem token ou erro 401 → `/login`
     - Status 0 → `/complete-profile`
     - Status 1 → `/feed`

4. **Completar Perfil**:
   - Usuário preenche informações (nome, sobrenome, bio, avatar)
   - Upload de avatar via FormData
   - Atualização via `useUpdateProfileMutation`
   - Após sucesso, redireciona para `/feed`

### Redux Toolkit Query (RTK Query)

O projeto usa Redux Toolkit Query (RTK Query) para gerenciar estado e requisições à API:

- **API Slice** (`lib/slice.ts`): Define todos os endpoints da API
- **Store** (`lib/store.ts`): Configuração da store Redux com middleware RTK Query
- **Implementação Simplificada**: O RTK Query gerencia cache e refetch automaticamente baseado nos argumentos da query, sem necessidade de configurações complexas de `serializeQueryArgs`, `merge` ou `forceRefetch`
- **Mutations** (operações que modificam dados):
  - `useLoginMutation`: Login de usuário
  - `useRegisterMutation`: Registro de novo usuário
  - `useLogoutMutation`: Logout de usuário
  - `useUpdateProfileMutation`: Atualização de perfil (suporta FormData para upload)
  - `useFollowMutation`: Seguir um usuário
  - `useUnfollowMutation`: Deixar de seguir um usuário
  - `useCreatePostMutation`: Criar um novo post
  - `useLikePostMutation`: Curtir/descurtir um post (toggle like)
  - `useDeletePostMutation`: Deletar um post próprio
  - `useCreateCommentMutation`: Criar um comentário em um post
  - `useUpdateCommentMutation`: Atualizar um comentário próprio
  - `useDeleteCommentMutation`: Deletar um comentário próprio
  - `useDeleteUserMutation`: Deletar conta do usuário autenticado
- **Queries** (operações de leitura):
  - `useGetProfileQuery`: Buscar perfil do usuário autenticado
  - `useGetPublicProfileQuery`: Buscar perfil público de outro usuário
  - `useSearchUsersQuery`: Buscar usuários por termo
  - `useGetMyFollowersQuery`: Listar seguidores
  - `useGetMyFollowingQuery`: Listar usuários seguidos
  - `useFeedQuery`: Buscar feed de posts
  - `useGetUserPostQuery`: Buscar posts de um usuário específico com paginação
  - `useGetPostQuery`: Buscar um post específico por ID
  - `useGetCommentsQuery`: Buscar comentários de um post

**Características:**

- Cache automático de requisições baseado nos argumentos da query
- Refetch automático quando os argumentos mudam (ex: mudança de página na paginação)
- Tags para controle de cache (`User`, `Post`)
- Credentials incluídos automaticamente (`credentials: 'include'`)
- Headers de autenticação configurados automaticamente via `prepareHeaders`
- **Paginação simplificada**: RTK Query gerencia cache e refetch automaticamente quando parâmetros de paginação mudam

## Componentes Principais

### Layout Components

- **Header**: Barra de navegação superior da aplicação
  - Localização: `components/layout/Header.tsx`
  - Funcionalidades:
    - Exibe avatar e username do usuário autenticado (lado esquerdo)
    - Mostra logo da aplicação no centro (link para home)
    - Campo de busca no lado direito
  - Características técnicas:
    - Usa `useGetProfileQuery()` do RTK Query para buscar dados do perfil
    - Utiliza `getMediaUrl()` para construir URL do avatar com fallback
    - Mostra estado de loading enquanto busca dados
    - Layout responsivo em 3 colunas (flex com justify-around)
    - Background violeta (bg-violet-600) seguindo o tema da aplicação
  - Dependências:
    - `Container`: Container responsivo
    - `Logo`: Componente de logo
    - `Input`: Campo de busca
    - `useGetProfileQuery`: Hook RTK Query para buscar perfil
    - `getMediaUrl`: Função utilitária para URLs de mídia

- **CenterContainer**: Container centralizado vertical e horizontalmente
  - Usado para páginas de login, registro e formulários
  - Altura mínima de 100vh com flexbox para centralização

- **Container**: Container responsivo com largura máxima
  - Largura máxima de 1400px
  - Centralizado horizontalmente
  - Padding padrão de 1rem

- **Form**: Wrapper de formulário com layout flexível
  - Layout em coluna (flex-col)
  - Suporta todas as props padrão de form HTML

### UI Components

- **Button**: Botão reutilizável com estilo padrão
  - Background violeta (bg-violet-800) com hover (bg-violet-600)
  - Transição suave
  - Suporta todas as props padrão de button HTML (onClick, type, disabled, etc.)
  - Props são passadas corretamente via spread operator

- **Input**: Campo de entrada de texto reutilizável
  - Estilização padrão com borda violeta (border-violet-600)
  - Suporta todas as props padrão de input HTML
  - Customizável via className

- **Logo**: Componente de logo da aplicação
  - Ícone GiEyestalk do react-icons
  - Texto "PingMe" opcional (controlado via prop `showText`)
  - Props customizáveis: `iconClassName`, `textClassName`, `showText`

## Estilização

O projeto usa **Tailwind CSS 4** para estilização:

- Classes utilitárias para layout e design
- Tema customizado com cores violeta (border-violet-600)
- Design responsivo e moderno

## Uso dos Componentes

### Header

O componente Header é usado para exibir a barra de navegação superior. Ele busca automaticamente os dados do perfil do usuário autenticado:

```tsx
import Header from '@/components/layout/Header'

export default function Layout() {
  return (
    <>
      <Header />
      {/* Resto do conteúdo */}
    </>
  )
}
```

**Características:**

- Busca dados do perfil via `useGetProfileQuery()` automaticamente
- Exibe avatar com fallback para imagem padrão se não houver
- Mostra username do usuário (oculto durante loading)
- Logo centralizado que redireciona para home
- Campo de busca no lado direito (funcionalidade a ser implementada)

### Custom Hooks

#### useComments()

Hook customizado para gerenciar operações de comentários em um post:

```tsx
import { useComments } from '@/hooks/useComments'

// Em um componente
const {
  createComment,
  updateComment,
  deleteComment,
  isCreating,
  isUpdating,
  isDeleting
} = useComments(postId)

// Criar comentário
await createComment({ content: 'Meu comentário' })

// Atualizar comentário
await updateComment(commentId, { content: 'Comentário atualizado' })

// Deletar comentário
await deleteComment(commentId)
```

**Características:**

- Atualização otimista do cache RTK Query
- Atualiza múltiplas queries simultaneamente (feed, post, comentários)
- Estados de loading para cada operação
- Tratamento de erros com mensagens amigáveis
- Confirmação antes de deletar comentário

### Utilitários

#### getMediaUrl()

Função para construir URLs de mídia (imagens, avatares) com fallback:

```tsx
import { getMediaUrl } from '@/utils/api-utils'

// Em um componente
;<img src={getMediaUrl(user.info.avatar)} alt="Avatar" />
```

**Comportamento:**

- Se `path` for `null` ou `undefined`: retorna avatar padrão
- Se `path` já for uma URL completa (começa com 'http'): retorna como está
- Caso contrário: concatena com `BACKEND_BASE_URL`

## Integração com Backend

### Endpoints Utilizados

**Autenticação:**

- `POST /api/auth/login/` - Login (via `useLoginMutation`)
- `POST /api/auth/register/` - Registro (via `useRegisterMutation`)
- `GET /api/auth/profile/` - Obter perfil (via `useGetProfileQuery`)
- `GET /api/auth/profile/{id}/` - Obter perfil público (via `useGetPublicProfileQuery`)
- `PUT /api/auth/profile/update/` - Atualizar perfil (via `useUpdateProfileMutation`)
- `DELETE /api/auth/users/me/delete/` - Deletar conta (via `useDeleteUserMutation`)
- `GET /api/auth/users/?q=termo` - Buscar usuários (via `useSearchUsersQuery`)
- `POST /api/auth/logout/` - Logout (via `useLogoutMutation`)
- `POST /api/auth/token/refresh/` - Renovar token (automático via interceptor Axios)

**Seguir Usuários:**

- `POST /api/follows/follow/` - Seguir usuário (via `useFollowMutation`)
- `DELETE /api/follows/unfollow/` - Deixar de seguir (via `useUnfollowMutation`)
- `GET /api/follows/my-followers/` - Listar seguidores (via `useGetMyFollowersQuery`)
- `GET /api/follows/my-following/` - Listar seguindo (via `useGetMyFollowingQuery`)

**Posts:**

- `GET /api/posts/` - Feed de posts (via `useFeedQuery`)
- `POST /api/posts/create/` - Criar post (via `useCreatePostMutation`)
- `POST /api/posts/{id}/like/` - Curtir/descurtir post (via `useLikePostMutation`)
- `GET /api/posts/user/{id}/?page=1` - Posts de um usuário com paginação (via `useGetUserPostQuery`)
- `GET /api/posts/{id}/` - Obter um post específico (via `useGetPostQuery`)
- `DELETE /api/posts/{id}/delete/` - Deletar post próprio (via `useDeletePostMutation`)

**Comentários:**

- `GET /api/posts/{id}/comments/` - Listar comentários de um post (via `useGetCommentsQuery`)
- `POST /api/posts/{postId}/comments/create/` - Criar comentário (via `useCreateCommentMutation`)
- `PUT /api/posts/comments/{commentId}/update/` - Atualizar comentário próprio (via `useUpdateCommentMutation`)
- `DELETE /api/posts/comments/{id}/delete/` - Deletar comentário próprio (via `useDeleteCommentMutation`)

### Armazenamento de Tokens

O projeto usa uma estratégia híbrida para armazenamento de tokens:

- **localStorage**: Access token armazenado para uso imediato em headers
  - Chave: `accessToken`
  - Usado por RTK Query via `prepareHeaders`
  - Verificado na página inicial para redirecionamento

- **Cookies HttpOnly**: Tokens gerenciados automaticamente pelo backend
  - `accessToken`: Token de acesso (HttpOnly)
  - `refreshToken`: Token de refresh (HttpOnly)
  - Enviados automaticamente em todas as requisições (`withCredentials: true`)
  - Usados pelo interceptor Axios para renovação automática

**Vantagens:**

- localStorage permite acesso rápido ao token para headers
- Cookies HttpOnly são mais seguros e gerenciados pelo backend
- Interceptor Axios usa cookies para renovação automática
- Sistema funciona mesmo se localStorage for limpo (usa cookies)

## Desenvolvimento

### Estrutura de Pastas

- **app/**: Rotas e páginas (App Router do Next.js)
  - `page.tsx`: Página inicial com lógica de redirecionamento
  - `login/`: Página de login
  - `register/`: Página de registro
  - `feed/`: Feed principal
  - `complete-profile/`: Página para completar perfil
  - `user-created/`: Confirmação de criação de conta
  - `search/`: Página de busca de usuários
  - `user-profile/[id]/`: Perfil público de outros usuários
  - `comments/[id]/`: Página de comentários de um post
- **components/**: Componentes React reutilizáveis
  - `layout/`: Componentes de layout (CenterContainer, Container, Form)
  - `ui/`: Componentes de UI (Button, Input, Logo)
- **lib/**: Configurações e utilitários
  - `slice.ts`: RTK Query API slice com todos os endpoints
  - `store.ts`: Configuração da store Redux
  - `axios.ts`: Instâncias do Axios com interceptors
- **hooks/**: Custom hooks React
  - `useAuth.ts`: Hook para verificar autenticação via RTK Query
  - `useComments.ts`: Hook customizado para gerenciar operações de comentários (criar, editar, deletar) com atualização otimista do cache
  - `useNavigation.ts`: Hook para navegação
- **providers/**: Context providers
  - `AppProvider.tsx`: Provider do Redux store
- **utils/**: Funções utilitárias e interfaces TypeScript
  - `api-interfaces.ts`: Interfaces TypeScript para requisições e respostas
  - `api-utils.ts`: Constantes e utilitários da API
    - `API_BASE_URL`: URL base da API (configurável via `NEXT_PUBLIC_API_URL`)
    - `BACKEND_BASE_URL`: URL base do backend (configurável via `NEXT_PUBLIC_BACKEND_URL`)
    - `getMediaUrl()`: Função para construir URLs de mídia (imagens, avatares) com fallback para avatar padrão

### Boas Práticas

- **TypeScript**: Tipagem forte em todas as interfaces e componentes
- **RTK Query**: Use mutations e queries do RTK Query ao invés de fetch direto
- **Componentes Funcionais**: Use hooks React (useState, useEffect, etc.)
- **Client Components**: Use `'use client'` quando necessário (interatividade, hooks)
- **Tailwind CSS**: Estilização via classes utilitárias
- **Error Handling**: Trate erros adequadamente com try/catch e mensagens amigáveis
- **Loading States**: Mostre estados de carregamento durante requisições
- **Form Validation**: Validação básica com HTML5 (required) e validação de erros da API

## Funcionalidades Implementadas

✅ **Autenticação Completa**

- Login e registro funcionais
- Gerenciamento de tokens (localStorage + cookies)
- Renovação automática de tokens
- Proteção de rotas baseada em autenticação

✅ **Fluxo de Perfil**

- Verificação de status do perfil
- Página de completar perfil com upload de avatar
- Página de perfil com visualização e edição completa
- Edição de username, nome, sobrenome, bio e avatar
- Preview de avatar ao selecionar nova imagem
- Redirecionamento inteligente baseado em status
- Visualização de perfil público de outros usuários
- **Deletar conta do usuário** com confirmação e limpeza automática de dados (localStorage e redirecionamento)

✅ **Feed e Posts**

- Feed principal com posts de usuários seguidos + próprios posts
- Criação de posts (Pings) com formulário
- Visualização de posts com autor, conteúdo, data
- **Curtir e descurtir posts** (toggle like) - implementado
- Contadores de likes e comentários atualizados em tempo real
- Indicador visual de sucesso ao criar post
- Loading states durante carregamento
- Atualização otimista do estado de likes usando RTK Query cache
- **Paginação de posts no perfil** com controles de navegação (anterior/próxima)
- Exibição de contador de posts e página atual
- Navegação entre páginas com atualização automática via RTK Query
- Deletar posts próprios

✅ **Sistema de Comentários**

- Página dedicada para visualizar post e seus comentários (`/comments/[id]`)
- Criar comentários em posts
- Visualizar todos os comentários de um post
- **Editar comentários próprios** com modo inline de edição
- **Deletar comentários próprios** com confirmação
- Atualização otimista do cache RTK Query em múltiplas queries (feed, post, comentários)
- Contadores de comentários atualizados automaticamente
- Indicadores visuais de estado (criando, criado com sucesso)
- Loading states durante operações
- Validação de campos obrigatórios
- Interface responsiva e moderna

✅ **Sistema de Seguir Usuários**

- Busca de usuários com resultados em tempo real
- Visualização de perfil público de outros usuários
- Funcionalidade de seguir/deixar de seguir
- Verificação automática de status de seguimento
- Listagem de seguidores e seguindo

✅ **Arquitetura**

- RTK Query para gerenciamento de estado e requisições
- TypeScript com interfaces bem definidas
- Componentes reutilizáveis
- Interceptors Axios configurados

✅ **Componentes de Layout**

- Header implementado com integração RTK Query e campo de busca
- Sistema de containers responsivos
- Formulários reutilizáveis

## Próximos Passos

- [x] Adicionar funcionalidade de comentários (criar, visualizar, editar, deletar)
- [x] Implementar edição e deleção de posts próprios
- [x] Adicionar paginação de posts no perfil do usuário
- [ ] Adicionar paginação no feed
- [ ] Melhorar UI/UX do feed com animações e transições
- [ ] Implementar página de logout funcional
- [ ] Adicionar notificações
- [ ] Melhorar tratamento de erros com mensagens mais amigáveis
- [ ] Adicionar testes unitários e de integração
- [ ] Implementar loading states mais elaborados (skeleton loaders)
- [ ] Adicionar validação de formulários mais robusta
- [ ] Adicionar validação de username único na edição de perfil
- [ ] Implementar infinite scroll no feed
- [ ] Adicionar filtros e ordenação no feed
- [ ] Adicionar visualização de quem curtiu um post

## Troubleshooting

### Erro de CORS

Certifique-se de que o backend está configurado para aceitar requisições de `http://localhost:3000`:

```env
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### Tokens não funcionam

- Verifique se `withCredentials: true` está configurado no Axios
- Verifique se o backend está retornando cookies corretamente
- Verifique se a URL da API está correta

### Erro 401 em requisições

- O interceptor deve renovar o token automaticamente
- Se persistir, verifique se o refresh token está válido
- Verifique se os cookies estão sendo enviados

## Licença

MIT

## Autor

Phillip Menezes

- Email: contato.phillip.menezes@gmail.com
- GitHub: [@Phillipml](https://github.com/phillipml)
