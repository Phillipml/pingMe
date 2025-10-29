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
  "avatar": "https://exemplo.com/avatar.jpg"
}
```

### Atualizar Perfil
```http
PUT /api/auth/profile/update/
Authorization: Bearer <token>
```

**Body:**
```json
{
  "first_name": "João",
  "last_name": "Silva",
  "bio": "Nova bio atualizada",
  "avatar": "https://exemplo.com/novo-avatar.jpg"
}
```

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
GET /api/follows/followers/2/
Authorization: Bearer <token>
```

**Resposta:**
```json
{
  "user": "usuario456",
  "followers_count": 5,
  "followers": [
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

### Listar Quem um Usuário Segue
```http
GET /api/follows/following/2/
Authorization: Bearer <token>
```

### Meus Seguidores
```http
GET /api/follows/my-followers/
Authorization: Bearer <token>
```

### Quem Estou Seguindo
```http
GET /api/follows/my-following/
Authorization: Bearer <token>
```

---

## 📝 Posts (`/api/posts/`)

### Feed Principal
```http
GET /api/posts/
Authorization: Bearer <token>
```

**Resposta:**
```json
{
  "posts_count": 10,
  "posts": [
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
GET /api/posts/1/likes/
Authorization: Bearer <token>
```

### Listar Comentários
```http
GET /api/posts/1/comments/
Authorization: Bearer <token>
```

**Resposta:**
```json
{
  "post_id": 1,
  "comments_count": 3,
  "comments": [
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
GET /api/posts/user/2/
Authorization: Bearer <token>
```

### Meus Posts
```http
GET /api/posts/my-posts/
Authorization: Bearer <token>
```

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

