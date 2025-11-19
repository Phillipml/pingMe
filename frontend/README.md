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
│   ├── complete-profile/    # Completar perfil
│   │   └── page.tsx
│   └── user-created/        # Confirmação de criação de conta
│       └── page.tsx
├── components/              # Componentes reutilizáveis
│   ├── layout/              # Componentes de layout
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
- **Gerenciamento de Tokens**: Tokens JWT armazenados em cookies HttpOnly
- **Refresh Automático**: Interceptor Axios renova tokens automaticamente
- **Proteção de Rotas**: Redirecionamento automático baseado em autenticação

### Páginas

1. **Página Inicial (`/`)**: 
   - Verifica autenticação via cookies
   - Redireciona para `/login` se não autenticado
   - Redireciona para `/feed` se autenticado

2. **Login (`/login`)**:
   - Formulário de login com email e senha
   - Validação de erros
   - Redirecionamento para feed após login bem-sucedido
   - Link para página de registro

3. **Registro (`/register`)**:
   - Formulário de criação de conta
   - Campos: username, email, password
   - Validação de erros
   - Redirecionamento para confirmação após registro

4. **Feed (`/feed`)**:
   - Feed principal com posts (em desenvolvimento)

5. **Completar Perfil (`/complete-profile`)**:
   - Formulário para completar informações do perfil (em desenvolvimento)

6. **Usuário Criado (`/user-created`)**:
   - Página de confirmação após registro
   - Link para página de login

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
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
```

## Autenticação

### Fluxo de Autenticação

1. **Login/Registro**: 
   - Usuário faz login ou cria conta
   - Tokens JWT são recebidos no body da resposta
   - Tokens são automaticamente salvos em cookies HttpOnly pelo backend

2. **Requisições Autenticadas**:
   - Axios envia cookies automaticamente (`withCredentials: true`)
   - Interceptor renova tokens quando necessário (401)
   - Redireciona para login se refresh falhar

3. **Proteção de Rotas**:
   - Página inicial verifica cookies no servidor
   - Redireciona baseado na presença de tokens

### Redux Toolkit

O projeto usa Redux Toolkit Query (RTK Query) para gerenciar estado e requisições:

- **API Slice** (`lib/slice.ts`): Define endpoints da API
- **Mutations**: `useLoginMutation`, `useRegisterMutation`
- **Queries**: `useGetProfileQuery`

## Componentes Principais

### Layout Components

- **CenterContainer**: Container centralizado para páginas
- **Container**: Container genérico
- **Form**: Wrapper de formulário

### UI Components

- **Button**: Botão reutilizável com variantes
- **Input**: Campo de entrada de texto
- **Logo**: Componente de logo da aplicação

## Estilização

O projeto usa **Tailwind CSS 4** para estilização:

- Classes utilitárias para layout e design
- Tema customizado com cores violeta (border-violet-600)
- Design responsivo e moderno

## Integração com Backend

### Endpoints Utilizados

- `POST /api/auth/login/` - Login
- `POST /api/auth/register/` - Registro
- `GET /api/auth/profile/` - Obter perfil
- `POST /api/auth/token/refresh/` - Renovar token (automático)

### Cookies

- `accessToken`: Token de acesso (HttpOnly)
- `refreshToken`: Token de refresh (HttpOnly)

Os cookies são gerenciados automaticamente pelo navegador e enviados em todas as requisições.

## Desenvolvimento

### Estrutura de Pastas

- **app/**: Rotas e páginas (App Router do Next.js)
- **components/**: Componentes React reutilizáveis
- **lib/**: Configurações (Redux, Axios)
- **hooks/**: Custom hooks React
- **providers/**: Context providers
- **utils/**: Funções utilitárias e interfaces TypeScript

### Boas Práticas

- Use TypeScript para tipagem forte
- Componentes funcionais com hooks
- RTK Query para requisições à API
- Tailwind CSS para estilização
- Server Components quando possível (Next.js 16)

## Próximos Passos

- [ ] Implementar página de feed completa
- [ ] Implementar página de completar perfil
- [ ] Adicionar funcionalidade de posts
- [ ] Adicionar funcionalidade de seguir usuários
- [ ] Adicionar funcionalidade de curtidas e comentários
- [ ] Implementar busca de usuários
- [ ] Adicionar notificações
- [ ] Melhorar tratamento de erros
- [ ] Adicionar testes

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
