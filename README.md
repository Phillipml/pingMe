# PingMe - API Backend

API REST Django para aplicação de rede social. Gerencia autenticação, posts, curtidas, comentários e sistema de seguir usuários.

## 🚀 Instalação Rápida

### Pré-requisitos

- Python 3.13+
- Poetry
- MySQL (ou use SQLite para desenvolvimento)

### Passos

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd pingMe
   ```

2. **Instale as dependências**
   ```bash
   cd backend
   poetry install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp env.example backend/.env
   ```
   
   Edite `backend/.env` com suas configurações:
   ```env
   SECRET_KEY=sua-chave-secreta-aqui
   DEBUG=True
   ALLOWED_HOSTS=localhost,127.0.0.1
   DB_NAME=pingMe
   DB_USER=root
   DB_PASSWORD=sua-senha
   DB_HOST=localhost
   DB_PORT=3306
   CORS_ALLOWED_ORIGINS=http://localhost:3000
   ```
   
   **Gerar SECRET_KEY:**
   ```bash
   cd ..
   make get_secret_keys
   ```

4. **Execute as migrações**
   ```bash
   make migrations
   ```

5. **Crie um superusuário**
   ```bash
   make createsuperuser
   ```

6. **Inicie o servidor**
   ```bash
   make dev-backend
   ```

A API estará em: http://localhost:8000

## 📁 Estrutura do Projeto

```
pingMe/
├── backend/                 # API Django REST
│   ├── authentication/      # Autenticação e perfis
│   ├── posts/               # Posts, curtidas e comentários
│   ├── follows/             # Relacionamentos (seguir)
│   ├── backend/             # Configurações Django
│   └── manage.py
├── frontend/                # (A ser implementado)
├── Makefile                 # Comandos de automação
├── env.example              # Exemplo de variáveis de ambiente
└── README.md
```

## 🛠️ Comandos Úteis

```bash
# Desenvolvimento
make dev-backend           # Inicia servidor
make check                 # Verifica configuração

# Banco de dados
make migrations            # Cria e aplica migrações
make createsuperuser      # Cria usuário admin

# Testes
make test                 # Roda todos os testes
make test-auth            # Só testes de autenticação
make test-coverage        # Com cobertura

# Qualidade
make format               # Formata código (black)
make lint                 # Verifica erros (flake8)
make quality              # Roda format + lint + type-check
```

## 🔑 API Endpoints

### Autenticação (`/api/auth/`)
- `POST /api/auth/register/` - Registrar usuário
- `POST /api/auth/login/` - Login (retorna JWT tokens)
- `POST /api/auth/logout/` - Logout
- `POST /api/auth/token/refresh/` - Renovar token
- `GET /api/auth/profile/` - Meu perfil
- `PUT /api/auth/profile/update/` - Atualizar perfil
- `GET /api/auth/profile/<id>/` - Ver perfil de outro usuário
- `PUT /api/auth/change-password/` - Alterar senha

### Posts (`/api/posts/`)
- `GET /api/posts/` - Listar posts (feed)
- `POST /api/posts/create/` - Criar post
- `GET /api/posts/<id>/` - Ver post específico
- `PUT /api/posts/<id>/update/` - Editar post
- `DELETE /api/posts/<id>/delete/` - Deletar post
- `POST /api/posts/<id>/like/` - Curtir/descurtir post
- `GET /api/posts/<id>/likes/` - Ver curtidas do post
- `GET /api/posts/<id>/comments/` - Ver comentários
- `POST /api/posts/<id>/comments/create/` - Criar comentário

### Follows (`/api/follows/`)
- `POST /api/follows/follow/` - Seguir usuário
- `DELETE /api/follows/unfollow/<id>/` - Deixar de seguir
- `GET /api/follows/my-followers/` - Meus seguidores
- `GET /api/follows/my-following/` - Quem eu sigo

## 🔒 Autenticação

A API usa JWT (JSON Web Tokens). Após fazer login:

1. Você receberá `access_token` e `refresh_token`
2. Use o `access_token` no header de todas as requisições:
   ```
   Authorization: Bearer {access_token}
   ```
3. Quando o `access_token` expirar (60 minutos), use o `refresh_token` para renovar:
   ```
   POST /api/auth/token/refresh/
   Body: { "refresh": "seu_refresh_token" }
   ```

## 📦 Tecnologias

- **Django** 5.2.7
- **Django REST Framework** 3.16.1
- **Simple JWT** 5.5.1 (autenticação)
- **Pillow** 12.0.0 (imagens)
- **python-decouple** 3.8 (variáveis de ambiente)
- **MySQL** / SQLite

## 🌐 Deploy no PythonAnywhere

Veja o guia completo em [DEPLOY.md](DEPLOY.md)

### Resumo rápido:

1. Clone o repositório no PythonAnywhere
2. Instale dependências: `poetry install`
3. Configure o arquivo `.env` com as credenciais do MySQL
4. Execute migrações: `python3.10 manage.py migrate`
5. Colete arquivos estáticos: `python3.10 manage.py collectstatic --noinput`
6. Configure o WSGI file no painel do PythonAnywhere
7. Configure Static Files e Media Files
8. Clique em "Reload"

## 📝 Variáveis de Ambiente

Copie `env.example` para `backend/.env` e configure:

- `SECRET_KEY` - Chave secreta do Django (obrigatória)
- `DEBUG` - Modo debug (True/False)
- `ALLOWED_HOSTS` - Hosts permitidos (separados por vírgula)
- `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT` - Configurações do banco
- `CORS_ALLOWED_ORIGINS` - Origens permitidas para CORS

## 🧪 Testes

```bash
make test              # Todos os testes
make test-auth         # Apenas autenticação
make test-coverage     # Com cobertura de código
```

## 📄 Licença

MIT

## 👤 Autor

Phillip Menezes
- Email: contato.phillip.menezes@gmail.com
- GitHub: [@Phillipml](https://github.com/phillipml)
