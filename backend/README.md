# PingMe Backend

**Projeto Pessoal** - API REST Django para aplicação de rede social. Gerencia autenticação, posts, curtidas, comentários e sistema de seguir usuários.

## Estrutura do Projeto

```
backend/
├── authentication/      # App de autenticação
├── posts/              # App de posts
├── follows/            # App de relacionamentos
├── backend/            # Configurações do Django
├── manage.py
├── pyproject.toml      # Dependências
└── db.sqlite3         # Banco de dados
```

## Visão Geral dos Apps

authentication - Gerencia usuários
- Modelo User personalizado
- Modelo Profile com avatar (upload de imagem)
- Autenticação por email
- Validação de username único (não permite duplicatas)
- Endpoints: register, login, logout, token refresh, profile, change password, user search/list, delete account

posts - Gerencia conteúdo
- Modelo Post (apenas texto)
- Modelo Like (curtidas) - toggle like/unlike
- Modelo Comment (comentários)
- Endpoints: feed, criar, editar, deletar, curtir, listar likes, comentários (CRUD completo)

follows - Gerencia relacionamentos
- Modelo Follow (seguir usuários)

## Como Começar

### Pré-requisitos

- Python 3.13+
- Poetry
- Docker (opcional)

### Instalação

1. Instale as dependências (do diretório raiz)
   ```bash
   make install-backend
   ```

2. Execute as migrações
   ```bash
   make migrations
   ```

3. Crie um superusuário
   ```bash
   make createsuperuser
   ```

4. Inicie o servidor
   ```bash
   make dev-backend
   ```

A API estará em:
- http://localhost:8000 (ou http://127.0.0.1:8000)
- Admin: http://localhost:8000/admin/
- Media: http://localhost:8000/media/

**Nota:** O servidor está configurado para escutar em `0.0.0.0:8000`, permitindo acesso de outros dispositivos na mesma rede. Veja a seção "Acesso via Celular/Dispositivos Móveis" abaixo.

## Modelos do Banco de Dados

User - Modelo de usuário
- Estende AbstractUser do Django
- Autenticação por email
- Campos: email, username, created_at, updated_at
- Validação: username deve ser único (verificado no serializer)

Profile - Perfil do usuário
- Um usuário tem um perfil (OneToOne)
- Campos: first_name, last_name, bio, avatar, status
- Avatar suporta upload de imagem (JPG, PNG, etc.)
- Imagens salvam em backend/media/avatars/
- Status: 0 = primeiro login, 1 = perfil atualizado

Post - Postagem
- Autor: ForeignKey para User
- Campos: content (texto), created_at, updated_at
- Nota: Posts aceitam apenas texto, não suportam imagens

Like - Curtida
- Usuário: ForeignKey para User
- Post: ForeignKey para Post
- Um usuário só pode curtir um post uma vez

Comment - Comentário
- Post: ForeignKey para Post
- Autor: ForeignKey para User (sempre o usuário que criou o comentário, não o autor do post)
- Campos: content, created_at, updated_at

Follow - Relacionamento de seguir
- Follower: quem está seguindo
- Following: quem está sendo seguido
- Um usuário só pode seguir outro uma vez

## Desenvolvimento

### Comandos Make

Importante: execute todos os comandos do diretório raiz, não de dentro de backend/.

```bash
# Servidor
make dev-backend

# Banco de dados
make check
make migrations

# Testes
make test
make test-auth
make test-coverage

# Qualidade
make back-format     # Formata código (black - 88 caracteres)
make back-lint       # Verifica erros (flake8 - 88 caracteres, alinhado com black)
make type-check      # Verifica tipos (mypy com django-stubs)
make quality         # Roda tudo (format + lint + type-check)
```

### Testes

Execute do diretório raiz:

```bash
# Todos os testes
make test

# Apenas testes de autenticação
make test-auth

# Testes com cobertura de código
make test-coverage
```

Para executar manualmente:

```bash
cd backend
poetry run pytest
```

**Estrutura de Testes:**
- `authentication/tests.py`: Testes de registro, login, logout, refresh token, perfil, alterar senha, listar usuários, deletar conta
- `posts/tests.py`: Testes de posts, curtidas, comentários (inclui validação de autor correto do comentário e URLs de avatar)
- `follows/tests.py`: Testes de seguir/deixar de seguir (inclui validação de URLs de avatar)

**Nota**: Execute os comandos `make` sempre do diretório raiz do projeto, não de dentro de `backend/`. O Makefile já gerencia o caminho corretamente.

### Qualidade de Código

```bash
# Do diretório raiz (recomendado)
make back-format     # Formata código (black - 88 caracteres)
make back-lint       # Verifica erros (flake8 - 88 caracteres, alinhado com black)
make type-check      # Verifica tipos (mypy com django-stubs)
make quality         # Roda tudo (format + lint + type-check)
```

**Configuração:**
- Black e flake8 configurados para 88 caracteres por linha (padrão recomendado do Black)
- Arquivos de migração são automaticamente excluídos das verificações
- O mypy está configurado para Django com django-stubs e ignora erros comuns do framework
- Configurações estão em `backend/.flake8` e `backend/pyproject.toml`

## Docker

O projeto inclui configuração Docker para MySQL e Redis.

### Iniciar Serviços

```bash
make docker-up
```

Ou manualmente:

```bash
cd backend
docker-compose up -d
```

### Parar Serviços

```bash
make docker-down
```

### Ver Logs

```bash
make docker-logs
```

### Serviços Disponíveis

- **MySQL 8.0**: Porta 3306
  - Database: `pingme`
  - User: `postgres`
  - Password: `postgres`
  - Root Password: `rootpassword`

- **Redis 7.2**: Porta 6379

## Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` no diretório `backend/` baseado no `env.example`:

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

**Para gerar uma SECRET_KEY automaticamente (do diretório raiz):**

```bash
make get_secret_key
```

### Acesso via Celular/Dispositivos Móveis

Para acessar a API de outros dispositivos na mesma rede Wi-Fi:

1. **Descubra o IP da sua máquina:**
   - Windows: Abra PowerShell e execute `ipconfig`, procure por "IPv4 Address"
   - Linux/Mac: Execute `ifconfig` ou `ip addr`
   - Exemplo: `192.168.0.18`

2. **Atualize o `.env` do backend (`backend/.env`):**
   ```env
   ALLOWED_HOSTS=localhost,127.0.0.1,192.168.0.18
   CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://192.168.0.18:3000
   ```
   **Importante:** Substitua `192.168.0.18` pelo IP real da sua máquina.

3. **Reinicie o servidor backend:**
   ```bash
   make dev-backend
   ```
   O servidor já está configurado para escutar em `0.0.0.0:8000` (todas as interfaces).

4. **Configure o Firewall (Windows):**
   ```powershell
   # Execute como Administrador
   New-NetFirewallRule -DisplayName "Django Backend" -Direction Inbound -LocalPort 8000 -Protocol TCP -Action Allow
   ```

5. **Acesse no celular:**
   - API: `http://192.168.0.18:8000`
   - Admin: `http://192.168.0.18:8000/admin/`

**Nota:** Se o IP da sua máquina mudar, atualize o `.env` com o novo IP e reinicie o servidor.

### Configurações Principais

- **AUTH_USER_MODEL**: `authentication.User` (modelo customizado)
- **Autenticação**: JWT via Simple JWT
  - Access token: 60 minutos de validade
  - Refresh token: 7 dias de validade
  - Rotação de tokens habilitada
  - Blacklist de tokens no logout
  - Cookies HttpOnly: Tokens também salvos em cookies para uso em navegadores
- **CORS**: Habilitado para frontend (configurável via `CORS_ALLOWED_ORIGINS`)
  - Para acesso via celular, adicione o IP da sua máquina em `CORS_ALLOWED_ORIGINS`
- **Paginação**: 
  - Feed e listagens gerais: 20 itens por página (padrão do DRF)
  - Posts de usuário específico: 5 itens por página
- **Media Files**: 
  - URL: `/media/`
  - Diretório: `backend/media/`
  - Avatares: `backend/media/avatars/`
- **Banco de Dados**: Configuração flexível com três níveis de prioridade:
  1. **DATABASE_URL** (recomendado): formato `mysql://usuario:senha@host:porta/banco`
  2. **Variáveis Individuais**: `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`
  3. **SQLite** (fallback automático): usado quando nenhuma configuração está presente
- **Logging**: Sistema de logs configurado em `backend/logs/django.log` com rotação automática
- **Endpoints de Autenticação**:
  - `POST /api/auth/register/` - Registrar usuário
  - `POST /api/auth/login/` - Login (retorna access e refresh tokens)
  - `POST /api/auth/logout/` - Logout (invalida refresh token)
  - `POST /api/auth/token/refresh/` - Renovar access token
  - `GET /api/auth/profile/` - Ver perfil do usuário autenticado
  - `PUT /api/auth/profile/update/` - Atualizar perfil (suporta upload de avatar)
  - `GET /api/auth/profile/{user_id}/` - Ver perfil de outro usuário
  - `PUT /api/auth/change-password/` - Alterar senha
  - `GET /api/auth/users/` - Listar usuários (apenas admin)
  - `DELETE /api/auth/users/me/delete/` - Deletar conta

## Segurança

- Autenticação JWT com tokens em cookies HttpOnly e body da resposta
- CORS configurado para origens específicas
- Validação de senhas (mínimo 8 caracteres)
- Validação de username único (não permite duplicatas no registro e atualização)
- Upload seguro (apenas autenticados, formatos JPG, PNG, GIF, WebP)
- Blacklist de tokens no logout

## Upload de Imagens

O sistema permite upload de imagem para o avatar:

- Endpoint: PUT /api/auth/profile/update/
- Formato: multipart/form-data
- Campo: avatar (arquivo de imagem)
- Formatos: JPG, PNG, GIF, etc.
- Localização: backend/media/avatars/
- Acesso: /media/avatars/nome-do-arquivo.jpg

Exemplo:
```bash
curl -X PUT http://localhost:8000/api/auth/profile/update/ \
  -H "Authorization: Bearer <token>" \
  -F "avatar=@foto.jpg" \
  -F "first_name=João"
```

**Nota sobre URLs de Avatar:**
- Todas as respostas da API que incluem informações de usuário (posts, comentários, likes, follows) retornam URLs absolutas dos avatares
- As URLs são construídas automaticamente usando o contexto do request
- Se o usuário não tiver avatar, o campo `avatar` será `null`

## Dependências

Principais:
- Django 5.2.7
- Django REST Framework 3.16.1
- Simple JWT 5.5.1 (autenticação JWT)
- Pillow 12.0.0 (processamento de imagens para avatares)
- Celery 5.5.3 (tarefas assíncronas)
- Redis 7.2 (broker para Celery)
- PyMySQL 1.1.0 (driver MySQL)
- python-decouple 3.8 (variáveis de ambiente)
- dj-database-url 2.1.0 (configuração flexível de banco)
- Poetry (gerenciamento de dependências)

Desenvolvimento:
- pytest 8.4.2 + pytest-django 4.11.1 + pytest-cov 7.0.0 (testes)
- black 25.9.0 (formatação - 88 caracteres)
- flake8 7.3.0 (lint - 88 caracteres, alinhado com black)
- mypy 1.18.2 + django-stubs 5.2.7 (verificação de tipos)
- bandit 1.8.6 (análise de segurança)
- isort 7.0.0 (organização de imports)
- pre-commit 4.3.0 (hooks)

## Sobre o Projeto

Este é um projeto pessoal desenvolvido para fins de aprendizado e portfólio.

## Licença

MIT
