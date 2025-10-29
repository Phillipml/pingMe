# 🚀 Deploy no Python Everywhere

Este guia explica como fazer deploy do backend PingMe no Python Everywhere.

## 📋 Pré-requisitos

1. Conta no Python Everywhere (free ou paid)
2. Projeto no GitHub (ou repositório git)

## 🔧 Passo a Passo

### 1. Preparar o Projeto

O projeto já está configurado com:
- ✅ Variáveis de ambiente usando `python-decouple`
- ✅ Configuração flexível de banco de dados
- ✅ Suporte a MySQL/PostgreSQL ou SQLite
- ✅ STATIC_ROOT configurado
- ✅ MEDIA_ROOT configurado

### 2. No Python Everywhere

#### A. Clonar o Repositório

```bash
cd ~
git clone https://github.com/seu-usuario/pingMe.git
cd pingMe/backend
```

#### B. Instalar Dependências

```bash
pip3.10 install --user poetry
poetry install
```

**OU** se não usar Poetry:

```bash
pip3.10 install --user -r requirements.txt
```

Se precisar criar requirements.txt:

```bash
poetry export -f requirements.txt --output requirements.txt --without-hashes
```

#### C. Configurar Variáveis de Ambiente

Crie arquivo `.env` em `~/pingMe/backend/.env`:

```bash
nano ~/pingMe/backend/.env
```

Cole:

```env
SECRET_KEY=sua-chave-secreta-gerada-aqui
DEBUG=False
ALLOWED_HOSTS=seu-usuario.pythonanywhere.com,www.seu-usuario.pythonanywhere.com
CORS_ALLOWED_ORIGINS=https://seu-frontend.com,http://localhost:3000

DATABASE_URL=sqlite:///db.sqlite3
```

**Gerar SECRET_KEY:**
```bash
python3.10 -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

#### D. Configurar Banco de Dados

**Opção 1: SQLite (Mais simples)**
- Não precisa configurar nada, já funciona com o .env acima

**Opção 2: MySQL (Python Everywhere Free)**
1. Acesse a aba "Databases" no Python Everywhere
2. Crie um novo banco MySQL
3. Configure no `.env`:

```env
DB_ENGINE=django.db.backends.mysql
DB_NAME=seu-usuario$nome-do-db
DB_USER=seu-usuario
DB_PASSWORD=sua-senha
DB_HOST=seu-usuario.mysql.pythonanywhere-services.com
DB_PORT=3306
```

**Opção 3: PostgreSQL (Python Everywhere Paid)**
```env
DATABASE_URL=postgresql://usuario:senha@host:porta/nome-do-db
```

#### E. Executar Migrações

```bash
cd ~/pingMe/backend
python3.10 manage.py migrate
python3.10 manage.py migrate token_blacklist
```

**Importante:** Execute também as migrações do token_blacklist!

#### F. Coletar Arquivos Estáticos

```bash
python3.10 manage.py collectstatic --noinput
```

#### G. Criar Superusuário (Opcional)

```bash
python3.10 manage.py createsuperuser
```

### 3. Configurar o Web App

#### A. Acesse a aba "Web"

#### B. Configure o WSGI file

Edite o arquivo WSGI (`/var/www/seu-usuario_pythonanywhere_com_wsgi.py`):

```python
import os
import sys

path = '/home/seu-usuario/pingMe/backend'
if path not in sys.path:
    sys.path.append(path)

os.environ['DJANGO_SETTINGS_MODULE'] = 'backend.settings'

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
```

**Importante:** Ajuste `seu-usuario` para seu username do Python Everywhere.

#### C. Configurar Static Files

Na aba "Web", vá em "Static files":
- URL: `/static/`
- Directory: `/home/seu-usuario/pingMe/backend/staticfiles`

E para media:
- URL: `/media/`
- Directory: `/home/seu-usuario/pingMe/backend/media`

#### D. Reload Web App

Clique em "Reload" na aba "Web"

### 4. Testar

Acesse:
- API: `https://seu-usuario.pythonanywhere.com/api/`
- Admin: `https://seu-usuario.pythonanywhere.com/admin/`

### 5. Configurar CORS (Frontend)

Se seu frontend estiver em outro domínio, atualize no `.env`:

```env
CORS_ALLOWED_ORIGINS=https://seu-frontend.vercel.app,https://seu-frontend.netlify.app
```

### 6. Atualizações Futuras

Quando fizer alterações:

```bash
cd ~/pingMe/backend
git pull
poetry install  # ou pip install -r requirements.txt
python3.10 manage.py migrate
python3.10 manage.py collectstatic --noinput
```

Depois, recarregue o web app.

## 🔒 Segurança

**NUNCA** commite o arquivo `.env` no Git!

Adicione ao `.gitignore`:
```
.env
*.pyc
__pycache__/
db.sqlite3
media/
staticfiles/
```

## ⚠️ Limitações do Plano Free

- Apenas 1 web app
- MySQL disponível (não PostgreSQL)
- Domínio: `seu-usuario.pythonanywhere.com`
- App dorme após 90 dias de inatividade (precisa acessar para "acordar")

## 🐛 Troubleshooting

**Erro 500:**
- Verifique os logs em "Web" > "Error log"
- Confirme que todas as migrações foram executadas
- Verifique se o `.env` está correto

**Static files não carregam:**
- Execute `collectstatic` novamente
- Verifique se configurou corretamente na aba "Web"

**Database errors:**
- Verifique se as credenciais do banco estão corretas no `.env`
- Confirme que o banco foi criado no Python Everywhere

**Import errors:**
- Verifique se todas as dependências foram instaladas
- Use `python3.10` especificamente (não apenas `python3`)

## 📝 Notas Importantes

- Python Everywhere usa Python 3.10 por padrão
- Sempre use `python3.10` nos comandos
- O caminho do projeto deve ser exato: `~/pingMe/backend/`
- Media files: crie a pasta manualmente se necessário:
  ```bash
  mkdir -p ~/pingMe/backend/media/avatars
  ```

