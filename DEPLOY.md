# 🚀 Deploy no PythonAnywhere

Guia passo a passo para fazer deploy do backend PingMe no PythonAnywhere.

## 📋 Pré-requisitos

1. Conta no PythonAnywhere (free ou paid)
2. Projeto no GitHub ou acesso via Git

## 🔧 Passo a Passo

### 1. Preparar o Projeto Localmente

Antes de fazer deploy, certifique-se de que tudo está funcionando localmente.

### 2. No PythonAnywhere

#### A. Clonar o Repositório

1. Acesse o PythonAnywhere e vá em **Consoles**
2. Crie um novo console **Bash**
3. Execute:
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

**OU** se preferir usar pip diretamente:
```bash
pip3.10 install --user -r requirements.txt
```

#### C. Configurar Variáveis de Ambiente

1. Crie o arquivo `.env`:
   ```bash
   nano ~/pingMe/backend/.env
   ```

2. Cole o seguinte conteúdo (ajuste com seus dados):
   ```env
   SECRET_KEY=sua-chave-secreta-gerada
   DEBUG=False
   ALLOWED_HOSTS=seu-usuario.pythonanywhere.com,www.seu-usuario.pythonanywhere.com
   CORS_ALLOWED_ORIGINS=https://seu-frontend.com,http://localhost:3000

   DB_NAME=seu-usuario$nome-do-banco
   DB_USER=seu-usuario
   DB_PASSWORD=sua-senha-mysql
   DB_HOST=seu-usuario.mysql.pythonanywhere-services.com
   DB_PORT=3306
   ```

3. **Gerar SECRET_KEY:**
   ```bash
   python3.10 -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
   ```
   Copie o resultado e cole no `.env` no lugar de `sua-chave-secreta-gerada`.

4. **Obter informações do MySQL:**
   - Acesse a aba **"Databases"** no PythonAnywhere
   - Se ainda não criou, crie um novo banco MySQL
   - Anote o nome do banco (formato: `seu-usuario$nome-do-banco`)
   - Use seu usuário e senha do PythonAnywhere
   - O host será: `seu-usuario.mysql.pythonanywhere-services.com`

#### D. Executar Migrações

```bash
cd ~/pingMe/backend
python3.10 manage.py migrate contenttypes
python3.10 manage.py migrate authentication
python3.10 manage.py migrate
python3.10 manage.py migrate token_blacklist
```

**Importante:** Execute também as migrações do `token_blacklist`!

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

No painel do PythonAnywhere, clique em **"Web"**.

#### B. Configure o WSGI File

1. Clique no link do arquivo WSGI (`/var/www/seu-usuario_pythonanywhere_com_wsgi.py`)
2. **Apague todo o conteúdo** e cole:
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
3. **Substitua `seu-usuario`** pelo seu username do PythonAnywhere
4. Salve o arquivo

#### C. Configurar Source Code e Working Directory

Na seção **"Code"**:
- **Source code:** `/home/seu-usuario/pingMe/backend`
- **Working directory:** `/home/seu-usuario/pingMe/backend`

#### D. Configurar Virtualenv

1. No console Bash, execute para encontrar o caminho do virtualenv:
   ```bash
   poetry env info --path
   ```
2. Copie o caminho retornado (exemplo: `/home/seu-usuario/.cache/pypoetry/virtualenvs/backend-XXXXX-py3.13`)
3. Cole no campo **"Enter path to a virtualenv"** na seção **"Code"**

#### E. Configurar Static Files e Media Files

Na seção **"Static files"**:

1. **Static files:**
   - URL: `/static/`
   - Directory: `/home/seu-usuario/pingMe/backend/staticfiles`

2. **Media files:**
   - URL: `/media/`
   - Directory: `/home/seu-usuario/pingMe/backend/media`

#### F. Reload Web App

Clique no botão verde **"Reload"** no canto superior direito da página.

### 4. Testar

Acesse:
- API: `https://seu-usuario.pythonanywhere.com/api/`
- Admin: `https://seu-usuario.pythonanywhere.com/admin/`

## 🔄 Atualizações Futuras

Quando fizer alterações no código:

```bash
cd ~/pingMe/backend
git pull
poetry install
python3.10 manage.py migrate
python3.10 manage.py collectstatic --noinput
```

Depois, clique em **"Reload"** na aba **"Web"**.

## 🐛 Solução de Problemas

### Erro 500

1. Verifique os logs em **"Web"** > **"Error log"**
2. Confirme que todas as migrações foram executadas
3. Verifique se o `.env` está correto e no local correto (`~/pingMe/backend/.env`)

### Static files não carregam

1. Execute `collectstatic` novamente:
   ```bash
   cd ~/pingMe/backend
   python3.10 manage.py collectstatic --noinput
   ```
2. Verifique se configurou corretamente na aba **"Web"** > **"Static files"**
3. Certifique-se de que o caminho está correto: `/home/seu-usuario/pingMe/backend/staticfiles`

### Database errors

1. Verifique se as credenciais do banco estão corretas no `.env`
2. Confirme que o banco foi criado no PythonAnywhere (aba **"Databases"**)
3. Teste a conexão:
   ```bash
   python3.10 manage.py check --database default
   ```

### Import errors

1. Verifique se todas as dependências foram instaladas:
   ```bash
   poetry install
   ```
2. Use `python3.10` especificamente (não apenas `python3`)
3. Verifique se o virtualenv está configurado corretamente

### Erro de migrações

Se houver problemas com migrações:

```bash
cd ~/pingMe/backend
python3.10 manage.py migrate contenttypes
python3.10 manage.py migrate authentication
python3.10 manage.py migrate --fake-initial
python3.10 manage.py migrate
```

## 📝 Notas Importantes

- PythonAnywhere usa Python 3.10 por padrão
- Sempre use `python3.10` nos comandos (não apenas `python3`)
- O caminho do projeto deve ser exato: `~/pingMe/backend/`
- O arquivo `.env` deve estar em: `~/pingMe/backend/.env`
- Media files: crie a pasta manualmente se necessário:
  ```bash
  mkdir -p ~/pingMe/backend/media/avatars
  ```

## ⚠️ Limitações do Plano Free

- Apenas 1 web app
- MySQL disponível (não PostgreSQL)
- Domínio: `seu-usuario.pythonanywhere.com`
- App dorme após 90 dias de inatividade (precisa acessar para "acordar")

## 🔒 Segurança

**NUNCA** commite o arquivo `.env` no Git!

Certifique-se de que o `.gitignore` inclui:
```
.env
*.pyc
__pycache__/
db.sqlite3
media/
staticfiles/
logs/
```

