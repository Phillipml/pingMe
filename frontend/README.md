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
│   └── user-created/        # Confirmação de criação de conta
│       └── page.tsx
├── components/              # Componentes reutilizáveis
│   ├── layout/              # Componentes de layout
│   │   ├── Header.tsx       # Barra de navegação superior
│   │   ├── CenterContainer.tsx
│   │   ├── Container.tsx
│   │   └── Form.tsx
│   └── ui/                  # Componentes de UI
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Logo.tsx
├── lib/                      # Configurações e utilitários
│   ├── axios.ts             # Instâncias do Axios com interceptors
│   ├── slice.ts             # Redux Toolkit API slice
│   └── store.ts             # Configuração da store Redux
├── hooks/                    # Custom hooks
│   └── useAuth.ts           # Hook para autenticação
├── providers/                # Providers React
│   └── AppProvider.tsx     # Provider do Redux
├── utils/                    # Utilitários
│   ├── api-interfaces.ts    # Interfaces TypeScript para API
│   └── api-utils.ts         # Funções utilitárias da API
├── public/                   # Arquivos estáticos
├── package.json             # Dependências e scripts
├── tsconfig.json            # Configuração TypeScript
├── next.config.ts           # Configuração Next.js
└── tailwind.config.js       # Configuração Tailwind CSS
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
   - Feed principal com posts (em desenvolvimento)

5. **Perfil (`/profile`)**:
   - Visualização e edição do perfil do usuário autenticado
   - Exibe: username, nome, sobrenome, bio e avatar
   - Modo de edição com formulário completo
   - Campos editáveis: username, first_name, last_name, bio e avatar
   - Upload de nova foto de perfil com preview
   - Botão de editar que alterna entre visualização e edição
   - Ícone de câmera (TbPhotoEdit) para alterar avatar no modo de edição

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

8. **Logout (`/logout`)**:
   - Página de logout (em desenvolvimento)

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
```

## Configuração

### Variáveis de Ambiente

Crie um arquivo `.env.local` no diretório `frontend/` (opcional):

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### API Base URL

A URL base da API está configurada em `frontend/utils/api-utils.ts`:

```typescript
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
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
- **Mutations** (operações que modificam dados):
  - `useLoginMutation`: Login de usuário
  - `useRegisterMutation`: Registro de novo usuário
  - `useLogoutMutation`: Logout de usuário
  - `useUpdateProfileMutation`: Atualização de perfil (suporta FormData para upload)
- **Queries** (operações de leitura):
  - `useGetProfileQuery`: Buscar perfil do usuário autenticado

**Características:**

- Cache automático de requisições
- Invalidação de cache quando necessário
- Tags para controle de cache (`User`, `Post`)
- Credentials incluídos automaticamente (`credentials: 'include'`)
- Headers de autenticação configurados automaticamente via `prepareHeaders`

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

- `POST /api/auth/login/` - Login (via `useLoginMutation`)
- `POST /api/auth/register/` - Registro (via `useRegisterMutation`)
- `GET /api/auth/profile/` - Obter perfil (via `useGetProfileQuery`)
- `PUT /api/auth/profile/update/` - Atualizar perfil (via `useUpdateProfileMutation`)
- `POST /api/auth/logout/` - Logout (via `useLogoutMutation`)
- `POST /api/auth/token/refresh/` - Renovar token (automático via interceptor Axios)

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
  - `feed/`: Feed principal (em desenvolvimento)
  - `complete-profile/`: Página para completar perfil
  - `user-created/`: Confirmação de criação de conta
  - `logout/`: Página de logout (em desenvolvimento)
- **components/**: Componentes React reutilizáveis
  - `layout/`: Componentes de layout (CenterContainer, Container, Form)
  - `ui/`: Componentes de UI (Button, Input, Logo)
- **lib/**: Configurações e utilitários
  - `slice.ts`: RTK Query API slice com todos os endpoints
  - `store.ts`: Configuração da store Redux
  - `axios.ts`: Instâncias do Axios com interceptors
- **hooks/**: Custom hooks React
  - `useAuth.ts`: Hook para verificar autenticação via RTK Query
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

✅ **Arquitetura**

- RTK Query para gerenciamento de estado e requisições
- TypeScript com interfaces bem definidas
- Componentes reutilizáveis
- Interceptors Axios configurados

✅ **Componentes de Layout**

- Header implementado com integração RTK Query
- Sistema de containers responsivos
- Formulários reutilizáveis

## Próximos Passos

- [ ] Implementar página de feed completa
- [ ] Adicionar funcionalidade de posts (criar, editar, deletar)
- [ ] Adicionar funcionalidade de seguir usuários
- [ ] Adicionar funcionalidade de curtidas e comentários
- [ ] Implementar busca de usuários
- [ ] Implementar página de logout funcional
- [ ] Adicionar notificações
- [ ] Melhorar tratamento de erros
- [ ] Adicionar testes unitários e de integração
- [ ] Implementar loading states mais elaborados
- [ ] Adicionar validação de formulários mais robusta
- [ ] Adicionar validação de username único na edição de perfil

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
