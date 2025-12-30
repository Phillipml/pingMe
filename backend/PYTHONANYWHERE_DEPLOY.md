# 🚀 Deploy no PythonAnywhere

Este guia explica como fazer deploy do backend PingMe no PythonAnywhere.

## 📋 Pré-requisitos

1. Conta no PythonAnywhere (free ou paid)
2. Projeto no GitHub (ou repositório git)

## 🔧 Passo a Passo

### 1. Preparar o Projeto

O projeto já está configurado com:
- ✅ Variáveis de ambiente usando `python-decouple`
- ✅ Configuração flexível de banco de dados (DATABASE_URL > variáveis individuais > SQLite)
- ✅ Suporte a MySQL (via DATABASE_URL ou variáveis individuais)
- ✅ SQLite como fallback para desenvolvimento
- ✅ STATIC_ROOT configurado
- ✅ MEDIA_ROOT configurado
- ✅ Sistema de logging com rotação automática

### 2. No PythonAnywhere

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
# ============================================================================
# Configurações Essenciais
# ============================================================================
SECRET_KEY=sua-chave-secreta-gerada-aqui
DEBUG=False
ALLOWED_HOSTS=seu-usuario.pythonanywhere.com,www.seu-usuario.pythonanywhere.com

# ============================================================================
# Configuração de Banco de Dados
# Prioridade: DATABASE_URL > Variáveis Individuais > SQLite (fallback)
# ============================================================================

# Opção 1: DATABASE_URL (RECOMENDADO - mais fácil e portátil)
DATABASE_URL=mysql://seu-usuario:sua-senha-mysql@seu-usuario.mysql.pythonanywhere-services.com:3306/seu-usuario$nome-do-banco

# Opção 2: Variáveis Individuais (alternativa)
# Use apenas se não quiser usar DATABASE_URL
# DB_NAME=seu-usuario$nome-do-banco
# DB_USER=seu-usuario
# DB_PASSWORD=sua-senha-mysql
# DB_HOST=seu-usuario.mysql.pythonanywhere-services.com
# DB_PORT=3306

# ============================================================================
# Configurações de CORS
# ============================================================================
CORS_ALLOWED_ORIGINS=https://seu-frontend.com,http://localhost:3000
```

**Gerar SECRET_KEY:**
```bash
python3.10 -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

**Obter informações do MySQL:**
1. Acesse a aba "Databases" no Python Anywhere
2. Se ainda não criou, crie um novo banco MySQL
3. Anote o nome do banco (formato: `seu-usuario$nome-do-banco`)
4. Use seu usuário e senha do Python Anywhere
5. O host será: `seu-usuario.mysql.pythonanywhere-services.com`

**Importante:** O projeto usa `dj-database-url` para interpretar o `DATABASE_URL`. O formato é:
- MySQL: `mysql://usuario:senha@host:porta/nome-do-banco`

**Nota sobre Qualidade de Código:**
- O projeto usa Black (88 caracteres), flake8 (88 caracteres) e mypy para qualidade de código
- Execute `make quality` antes de fazer deploy para garantir que o código está formatado e sem erros

#### D. Executar Migrações

```bash
cd ~/pingMe/backend
python3.10 manage.py migrate
python3.10 manage.py migrate token_blacklist
```

**Importante:** Execute também as migrações do token_blacklist!

#### E. Coletar Arquivos Estáticos

```bash
python3.10 manage.py collectstatic --noinput
```

#### F. Criar Superusuário (Opcional)

```bash
python3.10 manage.py createsuperuser
```

### 3. Configurar o Web App

#### A. Acesse a aba "Web"

No painel do PythonAnywhere, vá até a aba "Web".

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

**Importante:** Ajuste `seu-usuario` para seu username do PythonAnywhere.

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

**Importante:** Antes de fazer deploy, certifique-se de que o código está formatado e sem erros:
```bash
# Se estiver usando Poetry localmente
cd ~/pingMe
make quality  # Formata código, verifica lint e tipos
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
- Confirme que o banco foi criado no PythonAnywhere

**Import errors:**
- Verifique se todas as dependências foram instaladas
- Use `python3.10` especificamente (não apenas `python3`)

## 📝 Notas Importantes

- PythonAnywhere usa Python 3.10 por padrão
- Sempre use `python3.10` nos comandos
- O caminho do projeto deve ser exato: `~/pingMe/backend/`
- Media files: crie a pasta manualmente se necessário:
  ```bash
  mkdir -p ~/pingMe/backend/media/avatars
  ```

