# PingMe

**Projeto Pessoal** - Rede social completa com backend Django REST Framework e frontend Next.js. Permite criar posts, curtir, comentar e seguir outros usuários.

## Funcionalidades

### Backend
- Autenticação de usuários com JWT
- Validação de username único (não permite usernames duplicados)
- Perfil de usuário com bio e avatar (upload de imagem)
- Criar posts com texto (apenas texto, sem imagens)
- Curtir e descurtir posts
- Comentar em posts
- Seguir e deixar de seguir outros usuários
- API REST completa
- Suporte CORS para frontend
- Configuração Docker (MySQL 8.0 e Redis 7.2)
- Configuração flexível de banco de dados (DATABASE_URL > variáveis individuais > SQLite)

### Frontend
- Interface moderna com Next.js 16 e React 19
- Autenticação completa (login e registro)
- Gerenciamento de estado e requisições com Redux Toolkit Query (RTK Query)
- Proteção de rotas baseada em autenticação e status do perfil
- Fluxo de completar perfil com upload de avatar
- Página de perfil com visualização e edição completa (username, nome, sobrenome, bio, avatar)
- **Deletar conta do usuário** com confirmação
- **Paginação de posts no perfil** com controles de navegação (anterior/próxima)
- **Feed principal com criação de posts e visualização do feed**
- **Curtir e descurtir posts** (toggle like) com atualização em tempo real
- **Página de busca de usuários**
- **Página de perfil de outros usuários com funcionalidade de seguir/deixar de seguir**
- Header com navegação, avatar do usuário e campo de busca
- Design responsivo com Tailwind CSS
- Integração com API backend via Axios com interceptors
- Renovação automática de tokens JWT
- Armazenamento de tokens em localStorage e cookies HttpOnly

## Estrutura do Projeto

```
pingMe/
├── backend/                    # API Django REST
│   ├── authentication/         # App de autenticação e perfis
│   │   ├── models.py           # User e Profile
│   │   ├── views.py            # Endpoints de autenticação
│   │   ├── serializers.py      # Serializers de usuário e perfil
│   │   ├── urls.py             # Rotas de autenticação
│   │   └── tests.py            # Testes de autenticação
│   ├── posts/                  # App de posts, curtidas e comentários
│   │   ├── models.py           # Post, Like, Comment
│   │   ├── views.py            # Endpoints de posts
│   │   ├── serializers.py      # Serializers de posts
│   │   ├── urls.py             # Rotas de posts
│   │   └── tests.py            # Testes de posts
│   ├── follows/                # App de relacionamentos
│   │   ├── models.py           # Follow
│   │   ├── views.py            # Endpoints de seguir/deixar de seguir
│   │   ├── serializers.py      # Serializers de follow
│   │   ├── urls.py             # Rotas de follows
│   │   └── tests.py            # Testes de follows
│   ├── backend/                # Configurações do Django
│   │   ├── settings.py         # Configurações principais
│   │   ├── urls.py             # URLs raiz
│   │   ├── wsgi.py             # WSGI config
│   │   └── asgi.py             # ASGI config
│   ├── tests/                  # Testes do projeto
│   ├── media/                  # Arquivos de mídia (avatares)
│   ├── db.sqlite3              # Banco de dados SQLite (dev)
│   ├── manage.py               # Script de gerenciamento Django
│   ├── pyproject.toml          # Dependências (Poetry) e configurações
│   ├── .flake8                 # Configuração do flake8
│   ├── requirements.txt        # Dependências (pip)
│   ├── docker-compose.yml      # Configuração Docker (MySQL + Redis)
│   ├── Dockerfile              # Dockerfile do backend
│   └── env.example             # Exemplo de variáveis de ambiente
├── frontend/                   # Frontend Next.js
│   ├── app/                    # Rotas e páginas (App Router)
│   │   ├── page.tsx            # Página inicial (verifica auth e redireciona)
│   │   ├── login/              # Página de login
│   │   ├── register/           # Página de registro
│   │   ├── feed/               # Feed principal (criar posts e visualizar feed)
│   │   ├── profile/            # Página de perfil (visualização e edição)
│   │   ├── user-profile/[id]/ # Página de perfil de outros usuários
│   │   ├── search/             # Página de busca de usuários
│   │   ├── complete-profile/   # Completar perfil (upload avatar)
│   │   └── user-created/       # Confirmação de criação de conta
│   ├── components/             # Componentes reutilizáveis
│   │   ├── layout/             # Componentes de layout
│   │   │   ├── Header.tsx      # Barra de navegação superior
│   │   │   ├── Container.tsx   # Container responsivo
│   │   │   ├── CenterContainer.tsx # Container centralizado
│   │   │   ├── Form.tsx        # Wrapper de formulário
│   │   │   └── Card/           # Componentes de card
│   │   │       ├── FeedCard.tsx # Card para posts no feed
│   │   │       └── UserPostCard.tsx # Card para posts do usuário
│   │   └── ui/                 # Componentes de UI
│   │       ├── Button.tsx      # Botão reutilizável
│   │       ├── Input.tsx       # Campo de entrada
│   │       └── Logo.tsx        # Logo da aplicação
│   ├── lib/                    # Configurações (Redux, Axios)
│   │   ├── slice.ts            # RTK Query API slice
│   │   ├── store.ts            # Store Redux
│   │   └── axios.ts            # Instâncias Axios com interceptors
│   ├── hooks/                  # Custom hooks
│   │   └── useAuth.ts          # Hook de autenticação
│   ├── providers/              # Providers React
│   │   └── AppProvider.tsx     # Provider Redux
│   └── utils/                  # Utilitários e interfaces
│       ├── api-interfaces.ts   # Interfaces TypeScript
│       └── api-utils.ts        # Constantes da API
├── Makefile                    # Comandos de automação
├── LICENSE                     # Licença MIT
├── README.md                   # Documentação principal
└── API_DOCUMENTATION.md        # Documentação completa da API
```

## Tecnologias Usadas

Backend:
- Django 5.2.7
- Django REST Framework 3.16.1
- Simple JWT 5.5.1 (autenticação JWT)
- Pillow 12.0.0 (processamento de imagens)
- Celery 5.5.3 (tarefas assíncronas)
- Redis 7.2 (broker de mensagens e cache)
- PyMySQL 1.1.0 (driver MySQL)
- python-decouple 3.8 (gerenciamento de variáveis de ambiente)
- dj-database-url 2.1.0 (configuração flexível de banco via URL)
- Poetry (gerenciamento de dependências)
- SQLite (fallback) / MySQL 8.0 (via Docker ou produção)

Frontend:
- Next.js 16.0.1 (React framework com App Router)
- React 19.2.0
- TypeScript 5
- Redux Toolkit 2.10.1 + RTK Query (gerenciamento de estado e requisições)
- React Redux 9.2.0 (bindings Redux)
- Axios 1.13.2 (requisições HTTP com interceptors)
- Tailwind CSS 4 (estilização)
- React Icons 5.5.0 (ícones)

Ferramentas de Desenvolvimento:
- pytest 8.4.2 + pytest-django 4.11.1 + pytest-cov 7.0.0 (testes)
- black 25.9.0 (formatação de código - linha 88 caracteres)
- flake8 7.3.0 (lint - configurado para 88 caracteres, alinhado com black)
- mypy 1.18.2 + django-stubs 5.2.7 (verificação de tipos)
- bandit 1.8.6 (análise de segurança)
- isort 7.0.0 (organização de imports)
- pre-commit 4.3.0 (hooks de pré-commit)

## Como Começar

### O que você precisa

- Python 3.13 ou superior
- Poetry
- Docker (opcional)

### Passo a passo

1. Clone o repositório
   ```bash
   git clone https://github.com/Phillipml/pingMe.git
   cd pingMe
   ```

2. Instale as dependências
   ```bash
   make install
   ```

3. Configure o banco de dados
   ```bash
   make check
   make migrations
   ```

4. Crie um superusuário
   ```bash
   make createsuperuser
   ```

5. Inicie o servidor backend
   ```bash
   make dev-backend
   ```

6. Em outro terminal, inicie o frontend
   ```bash
   make dev-frontend
   ```

Pronto! A aplicação estará rodando:

- **Frontend**: http://localhost:3000
- **API**: http://127.0.0.1:8000/
- **Admin**: http://127.0.0.1:8000/admin/
- **Media**: http://127.0.0.1:8000/media/

### Acessar via Celular/Dispositivos Móveis

Para acessar a aplicação de outros dispositivos na mesma rede Wi-Fi:

1. **Descubra o IP da sua máquina:**
   - Windows: Abra PowerShell e execute `ipconfig`, procure por "IPv4 Address"
   - Linux/Mac: Execute `ifconfig` ou `ip addr`, procure pelo IP da sua interface Wi-Fi
   - Exemplo: `192.168.0.18`

2. **Configure o backend (`backend/.env`):**
   ```env
   SECRET_KEY=sua-chave-secreta-aqui
   DEBUG=True
   ALLOWED_HOSTS=localhost,127.0.0.1,192.168.0.18
   DATABASE_URL=mysql://postgres:postgres@localhost:3306/pingme
   CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://192.168.0.18:3000
   ```
   **Importante:** Substitua `192.168.0.18` pelo IP real da sua máquina.

3. **Configure o frontend (`frontend/.env.local`):**
   ```env
   NEXT_PUBLIC_API_URL=http://192.168.0.18:8000/api
   NEXT_PUBLIC_BACKEND_URL=http://192.168.0.18:8000
   ```
   **Importante:** Substitua `192.168.0.18` pelo IP real da sua máquina.

4. **Reinicie os servidores:**
   - Backend: O servidor já está configurado para escutar em `0.0.0.0:8000` (todas as interfaces)
   - Frontend: Certifique-se de que está rodando com `-H 0.0.0.0` para aceitar conexões externas

5. **Configure o Firewall (Windows):**
   ```powershell
   # Execute como Administrador
   New-NetFirewallRule -DisplayName "Django Backend" -Direction Inbound -LocalPort 8000 -Protocol TCP -Action Allow
   New-NetFirewallRule -DisplayName "Next.js Frontend" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
   ```

6. **Acesse no celular:**
   - Frontend: `http://192.168.0.18:3000`
   - Backend: `http://192.168.0.18:8000`
   - Admin: `http://192.168.0.18:8000/admin/`

**Nota:** Se o IP da sua máquina mudar, atualize os arquivos `.env` com o novo IP.

### Usando Docker (opcional)

Se quiser usar MySQL e Redis com Docker:

```bash
# Inicia MySQL e Redis em containers
make docker-up

# Configure o DATABASE_URL no .env ou use as variáveis DB_*
# Exemplo para MySQL: DATABASE_URL=mysql://postgres:postgres@localhost:3306/pingme
# Ou configure individualmente com DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT

# Execute as migrações
make migrations

# Inicia o servidor
make dev-backend
```

**Nota**: Por padrão, o Docker configura:
- MySQL 8.0 na porta 3306 (database: `pingme`, user: `postgres`, password: `postgres`)
- Redis 7.2 na porta 6379

Para parar os containers:

```bash
make docker-down
```

## Estrutura da API

A API está dividida em 3 apps principais:

### Authentication
Gerencia usuários e autenticação:
- Cadastro e login
- Validação de username único (não permite duplicatas)
- Perfil com bio e avatar
- Upload de foto de perfil
- Alterar senha
- Deletar conta
- Listar usuários (apenas admin)

### Posts
Gerencia o conteúdo:
- Criar, editar e deletar posts
- Curtir posts
- Comentar em posts
- Ver feed

### Follows
Gerencia relacionamentos:
- Seguir outros usuários
- Ver seguidores e quem você segue

## Rodando Testes

```bash
make test           # Todos os testes
make test-auth      # Só autenticação
make test-coverage  # Com cobertura
```

## Comandos Úteis

```bash
# Desenvolvimento
make dev-backend       # Inicia servidor backend
make dev-frontend      # Inicia servidor frontend

# Banco de dados
make check             # Verifica configuração
make migrations        # Cria e aplica migrações
make createsuperuser   # Cria usuário admin

# Testes
make test              # Roda todos
make test-auth         # Só autenticação
make test-coverage     # Com cobertura

# Qualidade de código
make back-format      # Formata backend (black)
make back-lint        # Verifica erros backend (flake8)
make type-check       # Verifica tipos backend (mypy)
make front-format     # Formata frontend (prettier)
make front-lint       # Verifica erros frontend (eslint)
make quality          # Roda tudo (backend: format + lint + type-check)

# Docker
make docker-up         # Inicia containers
make docker-down       # Para containers
```

**Importante:** Não precisa ativar o shell do Poetry manualmente. O Makefile já faz isso automaticamente.

**Nota sobre Qualidade de Código:**
- O comando `make quality` executa: `back-format` (black), `back-lint` (flake8) e `type-check` (mypy)
- Black e flake8 estão configurados para 88 caracteres por linha (padrão recomendado do Black)
- Arquivos de migração são automaticamente excluídos das verificações (gerados automaticamente pelo Django)
- O mypy está configurado para Django com django-stubs e ignora erros comuns do framework
- Configurações estão em `backend/.flake8` e `backend/pyproject.toml`

## Configurações

### Banco de Dados
O sistema suporta configuração flexível de banco de dados com três níveis de prioridade:

1. **DATABASE_URL** (Recomendado - mais portátil)
   - Formato: `mysql://usuario:senha@host:porta/banco`
   - Exemplo: `DATABASE_URL=mysql://postgres:postgres@localhost:3306/pingme`

2. **Variáveis Individuais** (Alternativa)
   - Configure `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`
   - Usado quando `DATABASE_URL` não está definido

3. **SQLite** (Fallback automático)
   - Usado quando nenhuma configuração está presente
   - Ideal para desenvolvimento rápido

- **Desenvolvimento**: SQLite (fallback) ou MySQL via Docker
- **Produção**: MySQL (via Docker ou DATABASE_URL)
  - Docker: `make docker-up` inicia MySQL 8.0 e Redis 7.2
  - Configure via `.env` usando `DATABASE_URL` ou variáveis `DB_*`

### Autenticação JWT
- **Access Token**: 60 minutos de validade
- **Refresh Token**: 7 dias de validade
- **Rotação de Tokens**: Habilitada (novo refresh token a cada renovação)
- **Blacklist**: Tokens invalidados no logout
- **Cookies HttpOnly**: Tokens também salvos em cookies para uso em navegadores
- **Endpoints**:
  - Register: `POST /api/auth/register/`
  - Login: `POST /api/auth/login/`
  - Refresh: `POST /api/auth/token/refresh/`
  - Logout: `POST /api/auth/logout/`
  - Profile: `GET /api/auth/profile/`
  - Update Profile: `PUT /api/auth/profile/update/`
  - Profile Detail: `GET /api/auth/profile/{user_id}/`
  - Change Password: `PUT /api/auth/change-password/`
  - User List: `GET /api/auth/users/` (apenas admin)
  - Delete Account: `DELETE /api/auth/users/me/delete/`

### CORS e Segurança
- CORS configurado para `http://localhost:3000` e `http://127.0.0.1:3000` (configurável via `CORS_ALLOWED_ORIGINS`)
- Para acesso via celular, adicione o IP da sua máquina em `CORS_ALLOWED_ORIGINS` (ex: `http://192.168.0.18:3000`)
- Endpoints protegidos requerem autenticação (exceto: register, login, token/refresh, logout)
- Validação de senhas do Django (mínimo 8 caracteres)
- Validação de username único (não permite usernames duplicados no registro e atualização de perfil)
- Upload de imagens apenas para avatares (JPG, PNG, GIF, WebP)

### Outros
- **Media Files**: 
  - Diretório: `backend/media/`
  - Avatares: `backend/media/avatars/`
  - Acesso via URL: `/media/avatars/nome-arquivo.jpg`
- **Paginação**: 
  - Feed e listagens gerais: 20 itens por página (padrão do DRF)
  - Posts de usuário específico: 5 itens por página
- **Timezone**: UTC
- **Language**: en-us

## Variáveis de Ambiente

### Backend (`backend/.env`)

Crie um arquivo `.env` no diretório `backend/` baseado no `backend/env.example`:

```env
# ============================================================================
# Configurações Essenciais
# ============================================================================
SECRET_KEY=sua-chave-secreta-aqui
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Para acesso via celular, adicione o IP da sua máquina:
# ALLOWED_HOSTS=localhost,127.0.0.1,192.168.0.18

# ============================================================================
# Configuração de Banco de Dados
# Prioridade: DATABASE_URL > Variáveis Individuais > SQLite (fallback)
# ============================================================================

# Opção 1: DATABASE_URL (RECOMENDADO - mais fácil e portátil)
# Desenvolvimento local (Docker MySQL):
DATABASE_URL=mysql://postgres:postgres@localhost:3306/pingme

# Produção (PythonAnywhere - substitua pelos valores reais):
# DATABASE_URL=mysql://seu-usuario:sua-senha@seu-usuario.mysql.pythonanywhere-services.com:3306/seu-usuario$nome-do-banco

# Opção 2: Variáveis Individuais (use apenas se não usar DATABASE_URL)
# Descomente as linhas abaixo caso prefira essa abordagem
# DB_NAME=pingme
# DB_USER=postgres
# DB_PASSWORD=postgres
# DB_HOST=localhost
# DB_PORT=3306

# ============================================================================
# Configurações de CORS
# ============================================================================
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Para acesso via celular, adicione o IP da sua máquina:
# CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://192.168.0.18:3000
```

**Gerar SECRET_KEY automaticamente:**

```bash
make get_secret_key
```

**Nota**: O arquivo `.env` deve estar em `backend/.env` (não na raiz do projeto). O projeto usa `python-decouple` para ler variáveis de ambiente.

### Frontend (`frontend/.env.local`)

Para desenvolvimento local, crie um arquivo `.env.local` na pasta `frontend/`:

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

## Segurança

- **Autenticação JWT**: Tokens com expiração e rotação automática
- **Blacklist de Tokens**: Tokens invalidados no logout não podem ser reutilizados
- **CORS**: Configurado para origens específicas (configurável via `CORS_ALLOWED_ORIGINS`)
- **Validação de Senhas**: Validações padrão do Django (mínimo 8 caracteres)
- **Validação de Username**: Usernames devem ser únicos (validação no registro e atualização de perfil)
- **Upload Seguro**: Upload de imagens apenas para usuários autenticados
- **Permissões**: Apenas autores podem editar/deletar seus próprios posts e comentários

## Sobre o Projeto

Este é um projeto pessoal desenvolvido para fins de aprendizado e portfólio.

## Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## Autor

Phillip Menezes
- Email: contato.phillip.menezes@gmail.com
- GitHub: [@Phillipml](https://github.com/phillipml)