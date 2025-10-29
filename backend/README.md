# PingMe Backend

API REST Django para aplicação de rede social com autenticação, posts, curtidas, comentários e funcionalidade de seguir.

## 📁 Estrutura do Projeto

```
backend/
├── authentication/      # App de autenticação
│   ├── models.py       # Modelos User & Profile personalizados
│   ├── admin.py        # Configuração Django admin
│   ├── views.py        # Views da API
│   ├── serializers.py  # Serializers para validação
│   ├── urls.py         # Rotas de autenticação
│   └── migrations/     # Migrações do banco de dados
├── posts/              # App de posts
│   ├── models.py       # Modelos Post, Like, Comment
│   ├── views.py        # Views da API
│   ├── serializers.py  # Serializers
│   ├── urls.py         # Rotas de posts
│   └── migrations/
├── follows/            # Relacionamentos de seguir
│   ├── models.py       # Modelo Follow
│   ├── views.py        # Views da API
│   ├── serializers.py  # Serializers
│   ├── urls.py         # Rotas de seguir
│   └── migrations/
├── backend/            # Configurações do projeto Django
│   ├── settings.py     # Configuração do projeto
│   ├── urls.py         # Roteamento de URLs
│   ├── asgi.py         # Aplicação ASGI
│   └── wsgi.py         # Aplicação WSGI
├── manage.py
├── pyproject.toml      # Dependências Poetry
├── db.sqlite3         # Banco de dados de desenvolvimento
├── docker-compose.yml # Serviços Docker
└── Dockerfile
```

## 🗂️ Visão Geral dos Apps

### authentication
- **User**: Modelo de usuário personalizado estendendo AbstractUser com autenticação por email
- **Profile**: Perfil estendido com first_name, last_name, bio, avatar

### posts
- **Post**: Posts de usuários com conteúdo e URL de imagem opcional
- **Like**: Curtidas de usuários em posts (restrição única)
- **Comment**: Comentários de usuários em posts

### follows
- **Follow**: Relacionamentos de seguir entre usuários (restrição única)

## 🚀 Começando

### Pré-requisitos

- Python 3.13+
- Poetry (recomendado)
- PostgreSQL (produção) ou SQLite (desenvolvimento)
- Redis (opcional, para Celery)

### Instalação

1. **Instalar dependências**
   ```bash
   cd backend
   poetry install
   ```

2. **Ativar ambiente virtual**
   ```bash
   poetry shell
   ```

3. **Executar migrações**
   ```bash
   make migrations
   # ou
   python manage.py migrate
   ```

4. **Criar superusuário**
   ```bash
   python manage.py createsuperuser
   ```

5. **Executar servidor de desenvolvimento**
   ```bash
   make dev-backend
   # ou
   poetry run uvicorn backend.asgi:application --reload --host 0.0.0.0 --port 8000
   ```

A API estará disponível em http://localhost:8000

## 🗄️ Modelos do Banco de Dados

### Modelo User
- Estende `AbstractUser` do Django
- Autenticação baseada em email (`USERNAME_FIELD = 'email'`)
- Grupos e permissões personalizados com nomes relacionados únicos
- Campos adicionais: `email`, `is_active`, `create_at`, `updated_at`

### Modelo Profile
- Relacionamento OneToOne com User
- Campos: `first_name`, `last_name`, `bio`, `avatar`, `created_at`, `updated_at`
- Acesso via `user.profile`

### Modelo Post
- Autor: ForeignKey para User
- Conteúdo: TextField
- Imagem: URLField opcional
- Timestamps: `created_at`, `updated_at`

### Modelo Like
- Usuário: ForeignKey para User (related_name='likes')
- Post: ForeignKey para Post (related_name='likes')
- Restrição única em (user, post)

### Modelo Comment
- Post: ForeignKey para Post (related_name='comments')
- Autor: ForeignKey para User (related_name='comments')
- Conteúdo: TextField
- Timestamps: `created_at`, `updated_at`

### Modelo Follow
- Seguidor: ForeignKey para User (related_name='following')
- Seguindo: ForeignKey para User (related_name='followers')
- Restrição única em (follower, following)

## 🛠️ Desenvolvimento

### Comandos Make Disponíveis

```bash
# Executar servidor de desenvolvimento com uvicorn
make dev-backend

# Executar migrações
make migrations

# Executar testes
make pytest-authentication
```

### Executando Testes

```bash
# Executar todos os testes
pytest

# Executar testes de app específico
pytest authentication/tests/ -v

# Com cobertura
pytest --cov=. --cov-report=html
```

### Qualidade do Código

```bash
# Formatar código
poetry run black .

# Linter
poetry run flake8

# Verificação de tipos
poetry run mypy

# Ordenar imports
poetry run isort .

# Verificação de segurança
poetry run bandit -r .
```

## 🐳 Suporte Docker

### Iniciar Serviços (PostgreSQL + Redis)

```bash
# Do diretório backend
docker-compose up -d

# Verificar serviços
docker-compose ps

# Parar serviços
docker-compose down
```

### Usando PostgreSQL

Atualize `backend/backend/settings.py`:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'pingme',
        'USER': 'postgres',
        'PASSWORD': 'postgres',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

## 📝 Configuração

### Variáveis de Ambiente

O projeto usa `python-decouple` para configuração. Crie um arquivo `.env`:

```env
SECRET_KEY=sua-chave-secreta
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3
```

### Pontos Principais das Configurações

- `AUTH_USER_MODEL = 'authentication.User'`
- CORS habilitado para integração com frontend
- Django REST Framework configurado
- Autenticação JWT pronta (Simple JWT)

## 🔐 Recursos de Segurança

- Modelo de usuário personalizado com gerenciamento seguro de campos
- Suporte à autenticação JWT
- Headers CORS configurados
- Validadores de senha habilitados
- Debug toolbar para desenvolvimento

## 📦 Dependências

### Dependências Principais
- Django 5.2.7
- Django REST Framework 3.16.1
- Simple JWT 5.5.1
- Celery 5.5.3
- Redis 7.0.0
- Adaptador PostgreSQL (psycopg2-binary)
- Uvicorn 0.38.0

### Dependências de Desenvolvimento
- pytest & pytest-django
- black, flake8, isort
- mypy & django-stubs
- bandit (segurança)
- pre-commit

## 🤝 Contribuindo

1. Crie uma branch de feature
2. Faça suas alterações
3. Execute testes e linting
4. Submeta um pull request

## 📄 Licença

Licença MIT
