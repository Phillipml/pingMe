# PingMe

API backend de rede social feita com Django REST Framework. Permite criar posts, curtir, comentar e seguir outros usuários.

## O que tem nesse projeto

- Autenticação de usuários com JWT
- Perfil de usuário com bio e avatar (upload de imagem)
- Criar posts com texto (apenas texto, sem imagens)
- Curtir e descurtir posts
- Comentar em posts
- Seguir e deixar de seguir outros usuários
- API REST completa
- Suporte CORS para frontend
- Configuração Docker (MySQL 8.0 e Redis 7.2)
- Configuração flexível de banco de dados (DATABASE_URL > variáveis individuais > SQLite)

## Estrutura do Projeto

```
pingMe/
├── backend/                    # API Django REST
│   ├── authentication/         # App de autenticação e perfis
│   │   ├── models.py           # User e Profile
│   │   ├── views.py            # Endpoints de autenticação
│   │   ├── serializers.py      # Serializers de usuário e perfil
│   │   ├── urls.py             # Rotas de autenticação
│   │   └── tests.py             # Testes de autenticação
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
│   ├── pyproject.toml          # Dependências (Poetry)
│   ├── requirements.txt        # Dependências (pip)
│   ├── docker-compose.yml      # Configuração Docker (MySQL + Redis)
│   ├── Dockerfile              # Dockerfile do backend
│   └── env.example             # Exemplo de variáveis de ambiente
├── frontend/                   # (A ser implementado)
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
- dj-database-url 2.3.0 (configuração flexível de banco via URL)
- Poetry (gerenciamento de dependências)
- SQLite (fallback) / MySQL 8.0 (via Docker ou produção)

Ferramentas de Desenvolvimento:
- pytest 8.4.2 + pytest-django 4.11.1 + pytest-cov 7.0.0 (testes)
- black 25.9.0 (formatação de código)
- flake8 7.3.0 (lint)
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
   git clone <url-do-repositorio>
   cd pingMe
   ```

2. Instale as dependências
   ```bash
   cd backend
   poetry install
   ```

3. Configure o banco de dados
   
   Volte para o diretório raiz e execute:
   ```bash
   cd ..
   make check
   make migrations
   ```

4. Crie um superusuário
   ```bash
   make createsuperuser
   ```

5. Inicie o servidor
   ```bash
   make dev-backend
   ```

Pronto! A API estará rodando em http://127.0.0.1:8000

Links úteis:
- API: http://127.0.0.1:8000/
- Admin: http://127.0.0.1:8000/admin/
- Media: http://127.0.0.1:8000/media/

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

authentication - Gerencia usuários e autenticação
- Cadastro e login
- Perfil com bio e avatar
- Upload de foto de perfil
- Alterar senha
- Deletar conta
- Listar usuários (apenas admin)

posts - Gerencia o conteúdo
- Criar, editar e deletar posts
- Curtir posts
- Comentar em posts
- Ver feed

follows - Gerencia relacionamentos
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
make dev-backend       # Inicia servidor

# Banco de dados
make check             # Verifica configuração
make migrations        # Cria e aplica migrações
make createsuperuser   # Cria usuário admin

# Testes
make test              # Roda todos
make test-auth         # Só autenticação
make test-coverage     # Com cobertura

# Qualidade de código
make format            # Formata (black)
make lint              # Verifica erros (flake8)
make quality           # Roda tudo

# Docker
make docker-up         # Inicia containers
make docker-down       # Para containers
```

Importante: não precisa ativar o shell do Poetry manualmente. O Makefile já faz isso automaticamente.

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
- Endpoints protegidos requerem autenticação (exceto: register, login, token/refresh, logout)
- Validação de senhas do Django (mínimo 8 caracteres)
- Upload de imagens apenas para avatares (JPG, PNG, GIF, WebP)

### Outros
- **Media Files**: 
  - Diretório: `backend/media/`
  - Avatares: `backend/media/avatars/`
  - Acesso via URL: `/media/avatars/nome-arquivo.jpg`
- **Paginação**: 20 itens por página (padrão do DRF)
- **Timezone**: UTC
- **Language**: en-us

## Variáveis de Ambiente

Crie um arquivo `.env` no diretório `backend/` baseado no `backend/env.example`:

```env
# ============================================================================
# Configurações Essenciais
# ============================================================================
SECRET_KEY=sua-chave-secreta-aqui
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# ============================================================================
# Configuração de Banco de Dados
# Prioridade: DATABASE_URL > Variáveis Individuais > SQLite (fallback)
# ============================================================================

# Opção 1: DATABASE_URL (RECOMENDADO - mais fácil e portátil)
# Desenvolvimento local (Docker MySQL):
DATABASE_URL=mysql://usuario:senha@localhost:3306/pingme

# Produção (PythonAnywhere - substitua pelos valores reais):
# DATABASE_URL=mysql://seu-usuario:sua-senha@seu-usuario.mysql.pythonanywhere-services.com:3306/seu-usuario$nome-do-banco

# Opção 2: Variáveis Individuais (use apenas se não usar DATABASE_URL)
# Descomente as linhas abaixo caso prefira essa abordagem
# DB_NAME=pingme
# DB_USER=usuario
# DB_PASSWORD=senha
# DB_HOST=localhost
# DB_PORT=3306

# ============================================================================
# Configurações de CORS
# ============================================================================
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

**Gerar SECRET_KEY automaticamente:**

```bash
make get_secret_key
```

**Nota**: O arquivo `.env` deve estar em `backend/.env` (não na raiz do projeto). O projeto usa `python-decouple` para ler variáveis de ambiente.

## Segurança

- **Autenticação JWT**: Tokens com expiração e rotação automática
- **Blacklist de Tokens**: Tokens invalidados no logout não podem ser reutilizados
- **CORS**: Configurado para origens específicas (configurável via `CORS_ALLOWED_ORIGINS`)
- **Validação de Senhas**: Validações padrão do Django (mínimo 8 caracteres)
- **Upload Seguro**: Upload de imagens apenas para usuários autenticados
- **Permissões**: Apenas autores podem editar/deletar seus próprios posts e comentários

## Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça suas alterações
4. Rode os testes (`make test`)
5. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
6. Push para sua branch (`git push origin feature/nova-feature`)
7. Abra um Pull Request

## Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## Autor

Phillip Menezes
- Email: contato.phillip.menezes@gmail.com
- GitHub: [@Phillipml](https://github.com/phillipml)