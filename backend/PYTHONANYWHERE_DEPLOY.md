# 🚀 Deploy no PythonAnywhere

**Projeto Pessoal** - Este guia explica como fazer deploy do backend PingMe no PythonAnywhere.

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
git clone https://github.com/Phillipml/pingMe.git
cd pingMe/backend
```

#### B. Instalar Dependências

```bash
cd ~/pingMe
make install-prod
```

**OU** manualmente:

```bash
cd ~/pingMe/backend
pip3.10 install --user poetry
poetry install --only=main
```

Se precisar criar requirements.txt:

```bash
cd ~/pingMe/backend
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
ALLOWED_HOSTS=Phillipml.pythonanywhere.com,www.Phillipml.pythonanywhere.com

# ============================================================================
# Configuração de Banco de Dados
# Prioridade: DATABASE_URL > Variáveis Individuais > SQLite (fallback)
# ============================================================================

# Opção 1: DATABASE_URL (RECOMENDADO - mais fácil e portátil)
DATABASE_URL=mysql://Phillipml:sua-senha-mysql@Phillipml.mysql.pythonanywhere-services.com:3306/Phillipml$nome-do-banco

# Opção 2: Variáveis Individuais (alternativa)
# Use apenas se não quiser usar DATABASE_URL
# DB_NAME=Phillipml$nome-do-banco
# DB_USER=Phillipml
# DB_PASSWORD=sua-senha-mysql
# DB_HOST=Phillipml.mysql.pythonanywhere-services.com
# DB_PORT=3306

# ============================================================================
# Configurações de CORS
# ============================================================================
CORS_ALLOWED_ORIGINS=https://seu-frontend.com,http://localhost:3000
```

**Gerar SECRET_KEY:**
```bash
cd ~/pingMe
make get_secret_key
```

**Obter informações do MySQL:**
1. Acesse a aba "Databases" no Python Anywhere
2. Se ainda não criou, crie um novo banco MySQL
3. Anote o nome do banco (formato: `Phillipml$nome-do-banco`)
4. Use seu usuário e senha do Python Anywhere
5. O host será: `Phillipml.mysql.pythonanywhere-services.com`

**Importante:** O projeto usa `dj-database-url` para interpretar o `DATABASE_URL`. O formato é:
- MySQL: `mysql://usuario:senha@host:porta/nome-do-banco`

**Nota sobre Qualidade de Código:**
- O projeto usa Black (88 caracteres), flake8 (88 caracteres) e mypy para qualidade de código
- Execute `make quality` antes de fazer deploy para garantir que o código está formatado e sem erros

#### D. Executar Migrações

```bash
cd ~/pingMe
make migrate
```

**Importante:** Execute também as migrações do token_blacklist manualmente se necessário.

#### E. Coletar Arquivos Estáticos

```bash
cd ~/pingMe/backend
python3.10 manage.py collectstatic --noinput
```

#### F. Criar Superusuário (Opcional)

```bash
cd ~/pingMe
make createsuperuser
```

### 3. Configurar o Web App

#### A. Acesse a aba "Web"

No painel do PythonAnywhere, vá até a aba "Web".

#### B. Configure o WSGI file

Edite o arquivo WSGI (`/var/www/Phillipml_pythonanywhere_com_wsgi.py`):

```python
import os
import sys

path = '/home/Phillipml/pingMe/backend'
if path not in sys.path:
    sys.path.append(path)

os.environ['DJANGO_SETTINGS_MODULE'] = 'backend.settings'

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
```

#### C. Configurar Static Files

Na aba "Web", vá em "Static files":
- URL: `/static/`
- Directory: `/home/Phillipml/pingMe/backend/staticfiles`

E para media:
- URL: `/media/`
- Directory: `/home/Phillipml/pingMe/backend/media`

#### D. Reload Web App

Clique em "Reload" na aba "Web"

### 4. Testar

Acesse:
- API: `https://Phillipml.pythonanywhere.com/api/`
- Admin: `https://Phillipml.pythonanywhere.com/admin/`

### 5. Configurar CORS (Frontend)

Se seu frontend estiver em outro domínio, atualize no `.env`:

```env
CORS_ALLOWED_ORIGINS=https://seu-frontend.vercel.app,https://seu-frontend.netlify.app
```

### 6. Atualizações Futuras

Quando fizer alterações:

```bash
cd ~/pingMe
git pull
make install-prod
make migrate
cd backend
python3.10 manage.py collectstatic --noinput
```

**Importante:** Antes de fazer deploy, certifique-se de que o código está formatado e sem erros:
```bash
cd ~/pingMe
make quality
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
- Domínio: `Phillipml.pythonanywhere.com`
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

## Sobre o Projeto

Este é um projeto pessoal desenvolvido para fins de aprendizado e portfólio.

