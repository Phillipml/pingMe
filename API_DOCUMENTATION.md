# 📚 Documentação da API PingMe

Esta documentação descreve todos os endpoints disponíveis na API PingMe.

## 🔐 Autenticação

A API usa autenticação JWT. Para acessar endpoints protegidos, inclua o token no header:

```
Authorization: Bearer <seu-token-jwt>
```

## 📍 Base URL

```
http://localhost:8000/api/
```

---

## 🔑 Autenticação (`/api/auth/`)

### Registrar Usuário
```http
POST /api/auth/register/
```

**Body:**
```json
{
  "username": "usuario123",
  "email": "usuario@email.com",
  "password": "senha123"
}
```

**Resposta:**
```json
{
  "message": "Usuário criado com sucesso",
  "user": {
    "id": 1,
    "username": "usuario123",
    "email": "usuario@email.com",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### Fazer Login
```http
POST /api/auth/login/
```

**Body:**
```json
{
  "email": "usuario@email.com",
  "password": "senha123"
}
```

**Resposta:**
```json
{
  "message": "Login realizado com sucesso",
  "user": {
    "id": 1,
    "username": "usuario123",
    "email": "usuario@email.com",
    "created_at": "2024-01-01T00:00:00Z"
  },
  "tokens": {
    "refresh": "token-refresh",
    "access": "token-acesso"
  }
}
```

### Renovar Access Token
```http
POST /api/auth/token/refresh/
```

**Body:**
```json
{
  "refresh": "token-refresh"
}
```

**Resposta:**
```json
{
  "access": "novo-token-acesso"
}
```

**Erros:**
- `400`: Refresh token é obrigatório
- `401`: Token inválido ou expirado

### Fazer Logout
```http
POST /api/auth/logout/
```

**Body:**
```json
{
  "refresh": "token-refresh"
}
```

**Resposta:**
```json
{
  "message": "Logout realizado com sucesso"
}
```

**Erros:**
- `400`: Refresh token é obrigatório ou inválido

**Nota:** Este endpoint invalida o refresh token adicionando-o à blacklist, impedindo que seja usado para gerar novos access tokens.

### Ver Perfil
```http
GET /api/auth/profile/
Authorization: Bearer <token>
```

**Resposta:**
```json
{
  "first_name": "João",
  "last_name": "Silva",
  "bio": "Desenvolvedor apaixonado por tecnologia",
  "avatar": "/media/avatars/usuario123_avatar.jpg"
}
```

**Nota:** Se o avatar foi feito upload, retorna o caminho relativo. A imagem pode ser acessada em `http://localhost:8000/media/avatars/nome-do-arquivo.jpg`.

### Atualizar Perfil
```http
PUT /api/auth/profile/update/
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body (Form Data):**
```
first_name: João
last_name: Silva
bio: Nova bio atualizada
avatar: [arquivo de imagem]
```

**Resposta:**
```json
{
  "first_name": "João",
  "last_name": "Silva",
  "bio": "Nova bio atualizada",
  "avatar": "/media/avatars/usuario123_avatar.jpg"
}
```

**Nota:** O campo `avatar` aceita upload direto de arquivo de imagem. A imagem será salva em `backend/media/avatars/` e servida via `/media/avatars/nome-do-arquivo.jpg`.

---

## 👥 Seguir Usuários (`/api/follows/`)

### Seguir Usuário
```http
POST /api/follows/follow/
Authorization: Bearer <token>
```

**Body:**
```json
{
  "following": 2
}
```

**Resposta:**
```json
{
  "message": "Você começou a seguir usuario456",
  "follow": {
    "id": 1,
    "follower": {
      "id": 1,
      "username": "usuario123",
      "email": "usuario@email.com",
      "created_at": "2024-01-01T00:00:00Z"
    },
    "following": {
      "id": 2,
      "username": "usuario456",
      "email": "usuario456@email.com",
      "created_at": "2024-01-01T00:00:00Z"
    },
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### Deixar de Seguir
```http
DELETE /api/follows/unfollow/2/
Authorization: Bearer <token>
```

**Resposta:**
```json
{
  "message": "Você deixou de seguir usuario456"
}
```

### Listar Seguidores de um Usuário
```http
GET /api/follows/followers/2/?page=1
Authorization: Bearer <token>
```

**Resposta:**
```json
{
  "count": 5,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "follower": {
        "id": 1,
        "username": "usuario123",
        "email": "usuario@email.com",
        "created_at": "2024-01-01T00:00:00Z"
      },
      "following": {
        "id": 2,
        "username": "usuario456",
        "email": "usuario456@email.com",
        "created_at": "2024-01-01T00:00:00Z"
      },
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

**Nota:** Retorna 20 seguidores por página.

### Listar Quem um Usuário Segue
```http
GET /api/follows/following/2/?page=1
Authorization: Bearer <token>
```

**Resposta:**
```json
{
  "count": 10,
  "next": null,
  "previous": null,
  "results": [...]
}
```

**Nota:** Retorna 20 itens por página.

### Meus Seguidores
```http
GET /api/follows/my-followers/?page=1
Authorization: Bearer <token>
```

**Resposta:**
```json
{
  "count": 30,
  "next": "http://localhost:8000/api/follows/my-followers/?page=2",
  "previous": null,
  "results": [...]
}
```

**Nota:** Retorna 20 seguidores por página.

### Quem Estou Seguindo
```http
GET /api/follows/my-following/?page=1
Authorization: Bearer <token>
```

**Resposta:**
```json
{
  "count": 12,
  "next": null,
  "previous": null,
  "results": [...]
}
```

**Nota:** Retorna 20 itens por página.

---

## 📝 Posts (`/api/posts/`)

### Feed Principal
```http
GET /api/posts/?page=1
Authorization: Bearer <token>
```

**Resposta:**
```json
{
  "count": 10,
  "next": "http://localhost:8000/api/posts/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "author": {
        "id": 1,
        "username": "usuario123",
        "email": "usuario@email.com",
        "created_at": "2024-01-01T00:00:00Z"
      },
      "content": "Meu primeiro post!",
      "image": "https://exemplo.com/imagem.jpg",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z",
      "likes_count": 5,
      "comments_count": 3,
      "is_liked": true
    }
  ]
}
```

**Nota:** Este endpoint retorna 20 posts por página. Use `?page=` para navegar entre páginas.

### Criar Post
```http
POST /api/posts/create/
Authorization: Bearer <token>
```

**Body:**
```json
{
  "content": "Conteúdo do meu post",
  "image": "https://exemplo.com/imagem.jpg"
}
```

### Detalhes do Post
```http
GET /api/posts/1/
Authorization: Bearer <token>
```

### Editar Post
```http
PUT /api/posts/1/update/
Authorization: Bearer <token>
```

**Body:**
```json
{
  "content": "Conteúdo atualizado",
  "image": "https://exemplo.com/nova-imagem.jpg"
}
```

### Deletar Post
```http
DELETE /api/posts/1/delete/
Authorization: Bearer <token>
```

### Curtir/Descurtir Post
```http
POST /api/posts/1/like/
Authorization: Bearer <token>
```

**Resposta:**
```json
{
  "message": "Post curtido com sucesso",
  "liked": true,
  "likes_count": 6
}
```

### Listar Quem Curtiu
```http
GET /api/posts/1/likes/?page=1
Authorization: Bearer <token>
```

**Resposta:**
```json
{
  "count": 50,
  "next": "http://localhost:8000/api/posts/1/likes/?page=2",
  "previous": null,
  "results": [...]
}
```

**Nota:** Retorna 20 itens por página.

### Listar Comentários
```http
GET /api/posts/1/comments/?page=1
Authorization: Bearer <token>
```

**Resposta:**
```json
{
  "count": 3,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "post": 1,
      "author": {
        "id": 2,
        "username": "usuario456",
        "email": "usuario456@email.com",
        "created_at": "2024-01-01T00:00:00Z"
      },
      "content": "Ótimo post!",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Criar Comentário
```http
POST /api/posts/1/comments/create/
Authorization: Bearer <token>
```

**Body:**
```json
{
  "content": "Meu comentário no post"
}
```

### Editar Comentário
```http
PUT /api/posts/comments/1/update/
Authorization: Bearer <token>
```

**Body:**
```json
{
  "content": "Comentário atualizado"
}
```

### Deletar Comentário
```http
DELETE /api/posts/comments/1/delete/
Authorization: Bearer <token>
```

### Posts de um Usuário
```http
GET /api/posts/user/2/?page=1
Authorization: Bearer <token>
```

**Resposta:**
```json
{
  "count": 25,
  "next": "http://localhost:8000/api/posts/user/2/?page=2",
  "previous": null,
  "results": [...]
}
```

**Nota:** Retorna 20 posts por página.

### Meus Posts
```http
GET /api/posts/my-posts/?page=1
Authorization: Bearer <token>
```

**Resposta:**
```json
{
  "count": 15,
  "next": null,
  "previous": null,
  "results": [...]
}
```

**Nota:** Retorna 20 posts por página.

---

## ❌ Códigos de Erro

### 400 - Bad Request
```json
{
  "error": "Dados inválidos",
  "details": {
    "field": ["Este campo é obrigatório"]
  }
}
```

### 401 - Unauthorized
```json
{
  "error": "Credenciais inválidas"
}
```

### 403 - Forbidden
```json
{
  "error": "Você só pode editar seus próprios posts"
}
```

### 404 - Not Found
```json
{
  "error": "Post não encontrado"
}
```

---

## 🔧 Exemplos de Uso

### Fluxo Completo de Uso

1. **Registrar usuário**
2. **Fazer login** (obter token)
3. **Atualizar perfil**
4. **Seguir outros usuários**
5. **Criar posts**
6. **Curtir e comentar**
7. **Ver feed**
8. **Renovar access token** (quando necessário)
9. **Fazer logout** (invalidar refresh token)

### Exemplo com cURL

```bash
# Registrar
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"username": "teste", "email": "teste@email.com", "password": "senha123"}'

# Login
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "teste@email.com", "password": "senha123"}'

# Renovar access token
curl -X POST http://localhost:8000/api/auth/token/refresh/ \
  -H "Content-Type: application/json" \
  -d '{"refresh": "seu-refresh-token"}'

# Logout (invalidar refresh token)
curl -X POST http://localhost:8000/api/auth/logout/ \
  -H "Content-Type: application/json" \
  -d '{"refresh": "seu-refresh-token"}'

# Atualizar perfil com upload de avatar
curl -X PUT http://localhost:8000/api/auth/profile/update/ \
  -H "Authorization: Bearer <seu-token>" \
  -F "avatar=@/caminho/para/sua/foto.jpg" \
  -F "first_name=João" \
  -F "last_name=Silva" \
  -F "bio=Minha bio"

# Criar post (usando token do login)
curl -X POST http://localhost:8000/api/posts/create/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <seu-token>" \
  -d '{"content": "Meu primeiro post!"}'
```

---

## 📝 Notas Importantes

- Todos os endpoints de posts, follows e comentários requerem autenticação
- Apenas o autor pode editar/deletar seus posts e comentários
- Não é possível seguir a si mesmo
- O feed mostra apenas posts de usuários que você segue + seus próprios posts
- Likes são toggle (curtir/descurtir com o mesmo endpoint)
- **Paginação**: Todos os endpoints que retornam listas estão paginados com 20 itens por página. Use `?page=` para navegar entre páginas.
- **Upload de Imagens**: O avatar do perfil aceita upload direto de arquivos de imagem (JPG, PNG, GIF, etc.)
- Imagens são salvas em `backend/media/avatars/` e servidas via `/media/avatars/`
- Use `Content-Type: multipart/form-data` ao fazer upload de imagens
- **Blacklist de Tokens**: Para usar o endpoint de logout, é necessário rodar as migrações do `token_blacklist`: `python manage.py migrate token_blacklist`

