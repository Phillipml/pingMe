# PingMe

API backend de rede social feita com Django REST Framework. Permite criar posts, curtir, comentar e seguir outros usuários.

## O que tem nesse projeto

- Autenticação de usuários com JWT
- Perfil de usuário com bio e avatar (upload de imagem)
- Criar posts com texto e imagem
- Curtir e descurtir posts
- Comentar em posts
- Seguir e deixar de seguir outros usuários
- API REST completa
- Suporte CORS para frontend
- Configuração Docker (PostgreSQL e Redis)

## Estrutura do Projeto

```
pingMe/
├── backend/              # API Django REST
│   ├── authentication/  # App de autenticação
│   ├── posts/          # App de posts
│   ├── follows/        # App de relacionamentos
│   ├── db.sqlite3      # Banco de dados
│   ├── manage.py
│   └── pyproject.toml  # Dependências
├── frontend/            # (A ser implementado)
├── Makefile
└── README.md
```

## Tecnologias Usadas

Backend:
- Django 5.2
- Django REST Framework
- Simple JWT (autenticação)
- Pillow (upload de imagens)
- Poetry (gerenciamento de dependências)
- SQLite (desenvolvimento) / PostgreSQL (produção)

Ferramentas:
- pytest (testes)
- black (formatação)
- flake8 (lint)
- mypy (verificação de tipos)

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

Se quiser usar PostgreSQL e Redis com Docker:

```bash
make docker-up
make migrations
make dev-backend
```

## Estrutura da API

A API está dividida em 3 apps principais:

authentication - Gerencia usuários e autenticação
- Cadastro e login
- Perfil com bio e avatar
- Upload de foto de perfil

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

Banco de dados:
- SQLite para desenvolvimento
- PostgreSQL para produção (Docker)

JWT:
- Token de acesso: 60 minutos
- Token de refresh: 7 dias
- Endpoint refresh: POST /api/auth/token/refresh/
- Endpoint logout: POST /api/auth/logout/

Outros:
- Imagens salvam em backend/media/avatars/
- CORS configurado para http://localhost:3000
- Endpoints protegidos (exceto login e registro)
- Paginação: 20 itens por página

## Variáveis de Ambiente

Você pode criar um arquivo .env na raiz do projeto:

```env
SECRET_KEY=sua-chave-secreta
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3
```

Para produção, edite o arquivo backend/backend/settings.py.

## Segurança

- Autenticação JWT com tokens com expiração
- CORS configurado para origens específicas
- Validação de senhas integrada do Django
- Blacklist de tokens no logout

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