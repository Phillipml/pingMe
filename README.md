# PingMe

Uma API backend de rede social construída com Django REST Framework, incluindo autenticação de usuários, posts, curtidas, comentários e funcionalidade de seguir.

## 🚀 Funcionalidades

- **Autenticação de Usuários**: Modelo de usuário personalizado com autenticação JWT
- **Perfis de Usuário**: Informações estendidas do perfil com bio e avatar
- **Recursos Sociais**:
  - Criar e gerenciar posts
  - Curtir e comentar em posts
  - Seguir/deixar de seguir outros usuários
- **API RESTful** construída com Django REST Framework
- **Autenticação JWT** com refresh de token (`POST /api/auth/token/refresh/`) e logout (`POST /api/auth/logout/`)
- **Suporte CORS** para integração com frontend
- **Suporte Docker** com PostgreSQL e Redis
- **Tarefas Assíncronas** com Celery

## 📁 Estrutura do Projeto

```
pingMe/
├── backend/              # API Django REST
│   ├── authentication/  # App de autenticação
│   │   ├── models.py    # Modelos User & Profile personalizados
│   │   ├── views.py     # Views da API
│   │   ├── serializers.py # Serializers para validação
│   │   └── urls.py      # Rotas de autenticação
│   ├── posts/          # App de posts (Post, Like, Comment)
│   │   ├── models.py    # Modelos de posts
│   │   ├── views.py     # Views da API
│   │   ├── serializers.py # Serializers
│   │   └── urls.py      # Rotas de posts
│   ├── follows/        # Relacionamentos de seguir
│   │   ├── models.py    # Modelo Follow
│   │   ├── views.py     # Views da API
│   │   ├── serializers.py # Serializers
│   │   └── urls.py      # Rotas de seguir
│   ├── db.sqlite3      # Banco de dados local
│   ├── manage.py
│   ├── pyproject.toml  # Dependências Poetry
│   └── docker-compose.yml
├── frontend/            # (A ser implementado)
├── Makefile
└── README.md
```

## 🛠️ Stack Tecnológica

### Backend
- **Django 5.2** - Framework web
- **Django REST Framework** - Kit de ferramentas para API
- **Simple JWT** - Autenticação JWT
- **Pillow** - Processamento de imagens (upload de avatar)
- **Celery** - Fila de tarefas assíncronas
- **Redis** - Cache e message broker
- **PostgreSQL** - Banco de dados de produção
- **SQLite** - Banco de dados de desenvolvimento
- **Poetry** - Gerenciamento de dependências

### Ferramentas de Desenvolvimento
- **pytest** - Framework de testes
- **black** - Formatador de código
- **flake8** - Linter
- **mypy** - Verificação de tipos
- **pre-commit** - Git hooks

## 🚀 Início Rápido

### Pré-requisitos

- **Python 3.13+**
- **Poetry** (recomendado)
- **PostgreSQL** (para produção)
- **Redis** (para cache e Celery)
- **Docker & Docker Compose** (opcional)

### Instalação

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

3. **Configure o Banco de Dados**
   ```bash
   # Do diretório raiz (pingMe/)
   make check          # Verifica se está tudo OK
   make migrations      # Cria e aplica migrações
   ```

4. **Criar Superusuário**
   ```bash
   make createsuperuser
   ```

5. **Executar Servidor de Desenvolvimento**
   ```bash
   # Do diretório raiz (pingMe/)
   make dev-backend
   ```

6. **Acessar a aplicação**
   - API Backend: http://127.0.0.1:8000/
   - Painel Admin: http://127.0.0.1:8000/admin/
   - Media files: http://127.0.0.1:8000/media/

### Usando Docker

1. **Iniciar serviços** (PostgreSQL + Redis)
   ```bash
   make docker-up
   ```

2. **Executar migrações**
   ```bash
   make migrations
   ```

3. **Executar o servidor**
   ```bash
   make dev-backend
   ```

## 📚 Estrutura da API

### Apps

#### **authentication** - Gerenciamento de Usuários
- Modelo `User` (estende AbstractUser)
- Modelo `Profile` (OneToOne com User)
- Autenticação baseada em email (`USERNAME_FIELD = 'email'`)
- Grupos e permissões personalizados com nomes relacionados únicos
- Autenticação JWT configurada
- Upload de avatar (imagem) para perfil de usuário

#### **posts** - Gerenciamento de Conteúdo
- `Post` - Posts de usuários com conteúdo e imagens
- `Like` - Curtidas de usuários em posts (restrição única)
- `Comment` - Comentários de usuários em posts

#### **follows** - Relacionamentos Sociais
- `Follow` - Relacionamentos de seguir entre usuários (restrição única)

### Status da Configuração

✅ **Concluído:**
- Django REST Framework configurado
- Autenticação JWT com Simple JWT
- Headers CORS para integração com frontend
- Modelo de usuário personalizado com gerenciamento adequado de campos
- Migrações de banco de dados aplicadas
- Interface de admin configurada
- Serializers implementados
- Views da API implementadas
- URLs configuradas
- Upload de arquivos de imagem (avatar de perfil)
- Configuração de media files (imagens uploadadas)

## 🧪 Testes

```bash
# Executar todos os testes (do diretório raiz)
make test

# Executar testes de app específico
make test-auth

# Testes com cobertura
make test-coverage
```

## 🛠️ Desenvolvimento

### Comandos Makefile (Use do diretório raiz!)

Todos os comandos devem ser executados do diretório raiz (`pingMe/`). O Makefile já configura o ambiente Poetry automaticamente.

```bash
# Iniciar servidor de desenvolvimento
make dev-backend

# Verificar configuração Django
make check

# Criar migrações
make makemigrations

# Aplicar migrações
make migrate

# Criar e aplicar migrações (comando combinado)
make migrations

# Criar superusuário
make createsuperuser

# Executar testes
make test              # Todos os testes
make test-auth         # Testes de autenticação
make test-coverage     # Testes com cobertura

# Qualidade de código
make format            # Formatar com black
make lint              # Verificar com flake8
make type-check        # Verificar tipos com mypy
make quality           # Executa format, lint e type-check

# Docker
make docker-up         # Iniciar containers
make docker-down       # Parar containers
make docker-logs       # Ver logs
```

**Importante:** O Makefile já usa `poetry run` automaticamente, então não precisa ativar o shell do Poetry manualmente!

## 📝 Configuração

### Configuração Atual
- **SQLite** para desenvolvimento local (veja `db.sqlite3`)
- **PostgreSQL** para produção (configurado em `docker-compose.yml`)
- **Redis** para cache e Celery (configurado em `docker-compose.yml`)
- **Media Files**: Upload de imagens armazenadas em `backend/media/`

### Configurações Principais
- **AUTH_USER_MODEL**: `authentication.User` (modelo de usuário personalizado)
- **Tokens JWT**: 60min de acesso, 7 dias de refresh com rotação
- **Origens CORS**: `http://localhost:3000`, `http://127.0.0.1:3000`
- **Paginação**: 20 itens por página
- **Permissões Padrão**: `IsAuthenticated` (protege todos os endpoints)
- **Media URL**: `/media/` - Arquivos de imagem são servidos através desta URL
- **Media Root**: `backend/media/` - Local onde as imagens são armazenadas

### Variáveis de Ambiente (Prontas)
O projeto está configurado para usar variáveis de ambiente com `python-decouple`:
```env
SECRET_KEY=sua-chave-secreta
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3
```

Atualize `backend/backend/settings.py` para configurações de produção.

## 🔐 Segurança

- **Autenticação JWT**: Autenticação stateless com tokens de acesso/refresh
- **Segurança de Token**: Tokens de acesso de 60 minutos, tokens de refresh de 7 dias com rotação
- **Endpoint de Refresh**: `POST /api/auth/token/refresh/` para renovar access tokens
- **Endpoint de Logout**: `POST /api/auth/logout/` para invalidar refresh tokens (blacklist)
- **Proteção CORS**: Configurado para origens específicas do frontend
- **Modelo de Usuário Personalizado**: Gerenciamento seguro de campos com nomes relacionados únicos
- **Validação de Senha**: Validadores de senha integrados do Django
- **Proteção CSRF**: Habilitada para requisições baseadas em sessão
- **Variáveis de Ambiente**: Suporte com python-decouple (pronto para produção)

## 🤝 Contribuindo

1. Faça um fork do repositório
2. Crie uma branch de feature (`git checkout -b feature/feature-incrivel`)
3. Faça suas alterações
4. Execute testes e linting
5. Commit suas alterações (`git commit -m 'Adicionar feature incrível'`)
6. Push para a branch (`git push origin feature/feature-incrivel`)
7. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👤 Autor

**Phillip Menezes**
- Email: contato.phillip.menezes@gmail.com
- GitHub: [@Phillipml](https://github.com/phillipml)