# PingMe Backend

API REST Django para aplicação de rede social. Gerencia autenticação, posts, curtidas, comentários e sistema de seguir usuários.

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

posts - Gerencia conteúdo
- Modelo Post (texto e imagem)
- Modelo Like (curtidas)
- Modelo Comment (comentários)

follows - Gerencia relacionamentos
- Modelo Follow (seguir usuários)

## Como Começar

### Pré-requisitos

- Python 3.13+
- Poetry
- Docker (opcional)

### Instalação

1. Instale as dependências
   ```bash
   cd backend
   poetry install
   ```

2. Execute as migrações (do diretório raiz)
   ```bash
   cd ..
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
- http://localhost:8000
- Admin: http://localhost:8000/admin/
- Media: http://localhost:8000/media/

## Modelos do Banco de Dados

User - Modelo de usuário
- Estende AbstractUser do Django
- Autenticação por email
- Campos: email, username, created_at, updated_at

Profile - Perfil do usuário
- Um usuário tem um perfil (OneToOne)
- Campos: first_name, last_name, bio, avatar
- Avatar suporta upload de imagem (JPG, PNG, etc.)
- Imagens salvam em backend/media/avatars/

Post - Postagem
- Autor: ForeignKey para User
- Campos: content, image (URL), created_at, updated_at

Like - Curtida
- Usuário: ForeignKey para User
- Post: ForeignKey para Post
- Um usuário só pode curtir um post uma vez

Comment - Comentário
- Post: ForeignKey para Post
- Autor: ForeignKey para User
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
make format
make lint
make type-check
make quality
```

### Testes

```bash
# Do diretório raiz
make test
make test-auth
make test-coverage

# Manualmente
cd backend
poetry run pytest
```

### Qualidade de Código

```bash
# Do diretório raiz (recomendado)
make format
make lint
make quality
```

## Docker

### Iniciar Serviços

```bash
cd backend
docker-compose up -d
```

### Usando PostgreSQL

Edite backend/backend/settings.py:

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

## Configuração

### Variáveis de Ambiente

Crie um arquivo .env:

```env
SECRET_KEY=sua-chave-secreta
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3
```

### Configurações Principais

- AUTH_USER_MODEL = 'authentication.User'
- CORS habilitado para frontend
- JWT configurado
- Refresh token: POST /api/auth/token/refresh/
- Logout: POST /api/auth/logout/
- Paginação: 20 itens por página
- Media files configurados

## Segurança

- Autenticação JWT
- CORS configurado
- Validação de senhas
- Upload seguro (apenas autenticados)

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

## Dependências

Principais:
- Django 5.2.7
- Django REST Framework 3.16.1
- Simple JWT 5.5.1
- Pillow 12.0.0
- Poetry

Desenvolvimento:
- pytest
- black, flake8
- mypy
- bandit

## Contribuindo

1. Crie uma branch
2. Faça suas alterações
3. Rode os testes
4. Abra um Pull Request

## Licença

MIT
