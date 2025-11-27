# Documentação da API PingMe

Documentação completa da API REST. Explica como usar todos os endpoints para autenticação, posts, curtidas, comentários e seguir usuários.

## Índice

- [Começando](#começando)
- [Autenticação](#autenticação)
- [Perfil do Usuário](#perfil-do-usuário)
- [Usuários](#usuários)
- [Seguir Usuários](#seguir-usuários)
- [Posts](#posts)
- [Exemplos Práticos](#exemplos-práticos)
- [Tratamento de Erros](#tratamento-de-erros)

---

## Começando

### Base URL

```
http://localhost:8000/api/
```

### Como Funciona a Autenticação

A API usa JWT (JSON Web Tokens) com suporte a **cookies HttpOnly** e **tokens no body**. Para usar endpoints protegidos, você precisa enviar o token no header:

```
Authorization: Bearer seu-token-aqui
```

**Nota:** Os tokens também são salvos automaticamente em cookies HttpOnly (`accessToken` e `refreshToken`) para uso em navegadores. Para uso em ferramentas como Postman, você pode usar o token diretamente do body da resposta.

### Passo a Passo

1. Registrar um usuário (POST /api/auth/register/)
2. Fazer login e receber os tokens (POST /api/auth/login/)
3. Usar o access token nas requisições
4. Quando o access token expirar, renovar com o refresh token (POST /api/auth/token/refresh/)
5. Fazer logout quando precisar (POST /api/auth/logout/)

### Sobre os Tokens

- Access Token: Válido por 60 minutos, use em todas as requisições autenticadas
- Refresh Token: Válido por 7 dias, use só para renovar o access token

---

## Autenticação

### 1. Registrar Usuário

Cria uma nova conta no sistema.

**Endpoint:** `POST /api/auth/register/`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "username": "joaosilva",
  "email": "joao@email.com",
  "password": "senhaSegura123"
}
```

**Campos necessários:**
- username: Nome de usuário (único, obrigatório)
- email: Email do usuário (único, obrigatório)
- password: Senha (mínimo 8 caracteres, obrigatório)

**Resposta quando dá certo (201):**
```json
{
  "message": "Usuário criado com sucesso",
  "user": {
    "id": 1,
    "username": "joaosilva",
    "email": "joao@email.com",
    "created_at": "2024-01-01T10:00:00Z",
    "info": {
      "first_name": "",
      "last_name": "",
      "bio": "",
      "avatar": null,
      "status": 0
    }
  }
}
```

**Erros que podem acontecer:**
- 400: Email ou username já existem, ou algum campo está inválido
- Campos obrigatórios faltando

**Exemplo com cURL:**
```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "joaosilva",
    "email": "joao@email.com",
    "password": "senhaSegura123"
  }'
```

**Exemplo com JavaScript (Fetch):**
```javascript
const response = await fetch('http://localhost:8000/api/auth/register/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'joaosilva',
    email: 'joao@email.com',
    password: 'senhaSegura123'
  })
});

const data = await response.json();
console.log(data);
```

---

### 2. Fazer Login

Autentica o usuário e retorna os tokens JWT.

**Endpoint:** `POST /api/auth/login/`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "email": "joao@email.com",
  "password": "senhaSegura123"
}
```

**Resposta de Sucesso (200):**
```json
{
  "message": "Login realizado com sucesso",
  "user": {
    "id": 1,
    "username": "joaosilva",
    "email": "joao@email.com",
    "created_at": "2024-01-01T10:00:00Z",
    "info": {
      "first_name": "João",
      "last_name": "Silva",
      "bio": "Desenvolvedor apaixonado por tecnologia",
      "avatar": "/media/avatars/joaosilva_avatar.jpg",
      "status": 1
    }
  },
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**IMPORTANTE:** 
- Os tokens são retornados diretamente no body da resposta (`access` e `refresh`)
- Os tokens também são salvos automaticamente em cookies HttpOnly (`accessToken` e `refreshToken`) para uso em navegadores
- Guarde os tokens em local seguro! O `access` é usado nas requisições e o `refresh` para renovar o access quando expirar

**Erros Possíveis:**
- `401`: Email ou senha incorretos

**Exemplo com JavaScript:**
```javascript
const response = await fetch('http://localhost:8000/api/auth/login/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', // Importante para receber cookies
  body: JSON.stringify({
    email: 'joao@email.com',
    password: 'senhaSegura123'
  })
});

const data = await response.json();

if (response.ok) {
  // Tokens também estão disponíveis no body
  localStorage.setItem('accessToken', data.access);
  localStorage.setItem('refreshToken', data.refresh);
  localStorage.setItem('user', JSON.stringify(data.user));
  // Cookies são salvos automaticamente pelo navegador
}
```

**Exemplo com Postman:**
1. Faça a requisição POST para `/api/auth/login/` com email e password
2. Na resposta, você verá os tokens `access` e `refresh` no body JSON
3. Copie o token `access` e use no header `Authorization: Bearer <token>` nas próximas requisições
4. Os cookies também são salvos automaticamente (visíveis na aba Cookies do Postman)

---

### 3. Renovar Access Token

Quando o access token expira (após 60 minutos), use este endpoint para obter um novo.

**Endpoint:** `POST /api/auth/token/refresh/`

**Headers:**
```
Content-Type: application/json
```

**Body (opcional se usar cookie):**
```json
{
  "refresh": "seu-refresh-token-aqui"
}
```

**Nota:** O refresh token pode ser enviado no body ou será lido automaticamente do cookie `refreshToken` se disponível.

**Resposta de Sucesso (200):**
```json
{
  "access": "novo-access-token-aqui"
}
```

**Erros Possíveis:**
- `400`: Refresh token não fornecido
- `401`: Refresh token inválido ou expirado

**Exemplo - Função para Renovar Token:**
```javascript
async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refreshToken');
  
  const response = await fetch('http://localhost:8000/api/auth/token/refresh/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      refresh: refreshToken
    })
  });

  if (response.ok) {
    const data = await response.json();
    localStorage.setItem('accessToken', data.access);
    return data.access;
  } else {
    throw new Error('Token inválido');
  }
}
```

---

### 4. Fazer Logout

Invalida o refresh token, impedindo que seja usado novamente.

**Endpoint:** `POST /api/auth/logout/`

**Headers:**
```
Content-Type: application/json
```

**Body (opcional se usar cookie):**
```json
{
  "refresh": "seu-refresh-token-aqui"
}
```

**Nota:** O refresh token pode ser enviado no body ou será lido automaticamente do cookie `refreshToken` se disponível. Os cookies também são removidos automaticamente.

**Resposta de Sucesso (200):**
```json
{
  "message": "Logout realizado com sucesso"
}
```

**Nota:** Após o logout, você não poderá mais usar o refresh token. O usuário precisará fazer login novamente.

---

### 5. Usando a API no Postman

**Passo a Passo:**

1. **Fazer Login:**
   - Método: `POST`
   - URL: `http://localhost:8000/api/auth/login/`
   - Body (raw JSON):
   ```json
   {
     "email": "seu@email.com",
     "password": "suasenha"
   }
   ```
   - Envie a requisição

2. **Copiar o Token:**
   - Na resposta JSON, copie o valor do campo `access`
   - Exemplo: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

3. **Configurar Header de Autenticação:**
   - Crie uma nova requisição (ex: `GET /api/auth/profile/`)
   - Vá na aba **Headers**
   - Adicione:
     - **Key:** `Authorization`
     - **Value:** `Bearer <cole_o_token_aqui>`
   - Envie a requisição

4. **Gerenciar Cookies (Opcional):**
   - O Postman salva cookies automaticamente após o login
   - Para ver: Clique no ícone de cookies (canto inferior direito)
   - Para usar cookies automaticamente: Settings → General → Cookies → "Automatically manage cookies"

**Dica:** Crie uma variável de ambiente no Postman para o `accessToken` e use `Bearer {{accessToken}}` no header Authorization.

---

## Perfil do Usuário

### 1. Ver Meu Perfil

Retorna as informações do perfil do usuário autenticado. **O perfil é criado automaticamente se não existir.**

**Endpoint:** `GET /api/auth/profile/`

**Headers:**
```
Authorization: Bearer seu-access-token
```

**Resposta de Sucesso (200):**
```json
{
  "id": 1,
  "username": "joaosilva",
  "email": "joao@email.com",
  "created_at": "2024-01-01T10:00:00Z",
  "info": {
    "first_name": "João",
    "last_name": "Silva",
    "bio": "Desenvolvedor apaixonado por tecnologia",
    "avatar": "/media/avatars/joaosilva_avatar.jpg",
    "status": 1
  }
}
```

**Campos:**
- `id`: ID do usuário (integer)
- `username`: Nome de usuário (string)
- `email`: Email do usuário (string)
- `created_at`: Data de criação (string, formato ISO 8601)
- `info`: Objeto com informações do perfil
  - `first_name`: Primeiro nome (opcional, string)
  - `last_name`: Sobrenome (opcional, string)
  - `bio`: Biografia do usuário (opcional, string)
  - `avatar`: URL da foto de perfil (opcional, string ou null)
  - `status`: Status do perfil (integer, 0 = primeiro login, 1 = perfil atualizado)

**Nota:** Se o perfil não existir, ele será criado automaticamente com valores padrão (campos vazios e status = 0).

**Exemplo:**
```javascript
const response = await fetch('http://localhost:8000/api/auth/profile/', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  }
});

const profile = await response.json();
```

---

### 2. Atualizar Perfil

Permite atualizar foto de perfil, nome e bio. Todos os campos são opcionais - você pode atualizar apenas o que desejar. **O perfil é criado automaticamente se não existir.**

**Endpoint:** `PUT /api/auth/profile/update/`

**Headers:**
```
Authorization: Bearer seu-access-token
Content-Type: multipart/form-data
```

**Body (Form Data):**
```
first_name: João
last_name: Silva
bio: Minha nova biografia
avatar: [arquivo de imagem]
```

**IMPORTANTE:**
- Use `multipart/form-data` quando incluir imagem
- Use `application/json` se for apenas texto:
```json
{
  "first_name": "João",
  "bio": "Nova biografia"
}
```

**Resposta de Sucesso (200):**
```json
{
  "first_name": "João",
  "last_name": "Silva",
  "bio": "Nova biografia",
  "avatar": "/media/avatars/joaosilva_avatar.jpg",
  "status": 1
}
```

**Nota:** O campo `status` é atualizado automaticamente para `1` quando o perfil é atualizado pela primeira vez.

**Exemplo com FormData (com imagem):**
```javascript
const formData = new FormData();
formData.append('first_name', 'João');
formData.append('last_name', 'Silva');
formData.append('bio', 'Minha bio');
formData.append('avatar', fileInput.files[0]);

const response = await fetch('http://localhost:8000/api/auth/profile/update/', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  },
  body: formData
});
```

**Exemplo com JSON (sem imagem):**
```javascript
const response = await fetch('http://localhost:8000/api/auth/profile/update/', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  },
  body: JSON.stringify({
    first_name: 'João',
    bio: 'Nova bio'
  })
});
```

**Formatos de Imagem Aceitos:** JPG, PNG, GIF, WebP

---

### 3. Ver Perfil de Outro Usuário

Visualiza o perfil público de qualquer usuário pelo ID.

**Endpoint:** `GET /api/auth/profile/{user_id}/`

**Headers:**
```
Authorization: Bearer seu-access-token
```

**Resposta de Sucesso (200):**
```json
{
  "user": {
    "id": 2,
    "username": "maria",
    "email": "maria@email.com",
    "created_at": "2024-01-01T10:00:00Z"
  },
  "first_name": "Maria",
  "last_name": "Santos",
  "bio": "Outra desenvolvedora",
  "avatar": "/media/avatars/maria_avatar.jpg",
  "status": 1
}
```

**Erros Possíveis:**
- `404`: Usuário ou perfil não encontrado

---

### 4. Alterar Senha

Permite alterar a senha do usuário autenticado.

**Endpoint:** `PUT /api/auth/change-password/`

**Headers:**
```
Authorization: Bearer seu-access-token
Content-Type: application/json
```

**Body:**
```json
{
  "old_password": "senhaAntiga123",
  "new_password": "novaSenha456"
}
```

**Campos:**
- `old_password` (obrigatório): Senha atual para validação
- `new_password` (obrigatório): Nova senha (mínimo 8 caracteres)

**Resposta de Sucesso (200):**
```json
{
  "message": "Senha alterada com sucesso"
}
```

**Erros Possíveis:**
- `400`: Senha atual incorreta ou nova senha muito curta
- `400`: Campos obrigatórios faltando

**Exemplo:**
```javascript
const response = await fetch('http://localhost:8000/api/auth/change-password/', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  },
  body: JSON.stringify({
    old_password: 'senhaAntiga123',
    new_password: 'novaSenha456'
  })
});
```

---

### 5. Deletar Conta

Remove permanentemente a conta do usuário autenticado.

**Endpoint:** `DELETE /api/auth/users/me/delete/`

**Headers:**
```
Authorization: Bearer seu-access-token
```

**Resposta de Sucesso (200):**
```json
{
  "message": "Usuário deletado com sucesso"
}
```

**IMPORTANTE:** Esta ação é irreversível. Todos os dados do usuário serão removidos.

---

## Usuários

### 1. Listar Todos os Usuários

Lista todos os usuários do sistema. **Apenas administradores podem acessar.**

**Endpoint:** `GET /api/auth/users/?page=1`

**Headers:**
```
Authorization: Bearer seu-access-token
```

**Resposta de Sucesso (200):**
```json
{
  "count": 100,
  "next": "http://localhost:8000/api/auth/users/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "username": "joaosilva",
      "email": "joao@email.com",
      "created_at": "2024-01-01T10:00:00Z"
    }
  ]
}
```

**Erros Possíveis:**
- `403`: Acesso negado. Apenas administradores podem acessar esta lista.

**Paginação:** 20 itens por página. Use `?page=2` para próxima página.

---

## Seguir Usuários

### 1. Seguir um Usuário

Começa a seguir outro usuário.

**Endpoint:** `POST /api/follows/follow/`

**Headers:**
```
Authorization: Bearer seu-access-token
Content-Type: application/json
```

**Body:**
```json
{
  "following": 2
}
```

**Campo:**
- `following` (obrigatório): ID do usuário que você quer seguir

**Resposta de Sucesso (201):**
```json
{
  "message": "Você começou a seguir maria",
  "follow": {
    "id": 1,
    "follower": {
      "id": 1,
      "username": "joaosilva",
      "email": "joao@email.com"
    },
    "following": {
      "id": 2,
      "username": "maria",
      "email": "maria@email.com"
    },
    "created_at": "2024-01-01T10:00:00Z"
  }
}
```

**Erros Possíveis:**
- `400`: Tentando seguir a si mesmo
- `400`: Já está seguindo este usuário

---

### 2. Deixar de Seguir

Para de seguir um usuário.

**Endpoint:** `DELETE /api/follows/unfollow/{user_id}/`

**Headers:**
```
Authorization: Bearer seu-access-token
```

**Resposta de Sucesso (200):**
```json
{
  "message": "Você deixou de seguir maria"
}
```

**Erros Possíveis:**
- `404`: Você não está seguindo este usuário

---

### 3. Meus Seguidores

Lista quem está seguindo você.

**Endpoint:** `GET /api/follows/my-followers/?page=1`

**Headers:**
```
Authorization: Bearer seu-access-token
```

**Resposta de Sucesso (200):**
```json
{
  "count": 25,
  "next": "http://localhost:8000/api/follows/my-followers/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "follower": {
        "id": 1,
        "username": "joaosilva",
        "email": "joao@email.com"
      },
      "following": {
        "id": 2,
        "username": "maria",
        "email": "maria@email.com"
      },
      "created_at": "2024-01-01T10:00:00Z"
    }
  ]
}
```

**Paginação:** 20 itens por página. Use `?page=2` para próxima página.

---

### 4. Quem Estou Seguindo

Lista os usuários que você está seguindo.

**Endpoint:** `GET /api/follows/my-following/?page=1`

**Headers:**
```
Authorization: Bearer seu-access-token
```

**Resposta de Sucesso (200):**
```json
{
  "count": 15,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "follower": {
        "id": 1,
        "username": "joaosilva",
        "email": "joao@email.com"
      },
      "following": {
        "id": 2,
        "username": "maria",
        "email": "maria@email.com"
      },
      "created_at": "2024-01-01T10:00:00Z"
    }
  ]
}
```

**Paginação:** 20 itens por página. Use `?page=2` para próxima página.

---

## Posts

### 1. Feed Principal

Retorna o feed com posts das pessoas que você segue + seus próprios posts, ordenados por data (mais recentes primeiro).

**Endpoint:** `GET /api/posts/?page=1`

**Headers:**
```
Authorization: Bearer seu-access-token
```

**Resposta de Sucesso (200):**
```json
{
  "count": 50,
  "next": "http://localhost:8000/api/posts/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "author": {
        "id": 2,
        "username": "maria",
        "email": "maria@email.com",
        "created_at": "2024-01-01T10:00:00Z"
      },
      "content": "Meu primeiro post!",
      "created_at": "2024-01-01T12:00:00Z",
      "updated_at": "2024-01-01T12:00:00Z",
      "likes_count": 5,
      "comments_count": 3,
      "is_liked": true
    }
  ]
}
```

**Campos na Resposta:**
- `likes_count`: Quantidade de curtidas
- `comments_count`: Quantidade de comentários
- `is_liked`: `true` se você já curtiu, `false` caso contrário

**IMPORTANTE:** O feed mostra APENAS posts de quem você segue + seus próprios posts.

**Paginação:** 20 itens por página. Use `?page=2` para próxima página.

---

### 2. Criar Post

Cria um novo post. **Apenas texto é permitido.**

**Endpoint:** `POST /api/posts/create/`

**Headers:**
```
Authorization: Bearer seu-access-token
Content-Type: application/json
```

**Body:**
```json
{
  "content": "Conteúdo do meu post aqui"
}
```

**Campos:**
- `content` (obrigatório): Texto do post

**Resposta de Sucesso (201):**
```json
{
  "message": "Post criado com sucesso",
  "post": {
    "id": 1,
    "author": {
      "id": 1,
      "username": "joaosilva",
      "email": "joao@email.com",
      "created_at": "2024-01-01T10:00:00Z"
    },
    "content": "Conteúdo do meu post aqui",
    "created_at": "2024-01-01T12:00:00Z",
    "updated_at": "2024-01-01T12:00:00Z",
    "likes_count": 0,
    "comments_count": 0,
    "is_liked": false
  }
}
```

**Erros Possíveis:**
- `400`: Campo `content` é obrigatório

---

### 3. Ver Detalhes de um Post

Retorna informações completas de um post específico.

**Endpoint:** `GET /api/posts/{post_id}/`

**Headers:**
```
Authorization: Bearer seu-access-token
```

**Resposta de Sucesso (200):**
```json
{
  "id": 1,
  "author": {
    "id": 2,
    "username": "maria",
    "email": "maria@email.com",
    "created_at": "2024-01-01T10:00:00Z"
  },
  "content": "Conteúdo do post",
  "created_at": "2024-01-01T12:00:00Z",
  "updated_at": "2024-01-01T12:00:00Z",
  "likes_count": 5,
  "comments_count": 3,
  "is_liked": true
}
```

**Erros Possíveis:**
- `404`: Post não encontrado

---

### 4. Editar Post

Atualiza um post que você criou. **Apenas texto é permitido.**

**Endpoint:** `PUT /api/posts/{post_id}/update/`

**Headers:**
```
Authorization: Bearer seu-access-token
Content-Type: application/json
```

**Body:**
```json
{
  "content": "Conteúdo atualizado"
}
```

**Campos:**
- `content` (obrigatório): Novo texto do post

**Resposta de Sucesso (200):**
```json
{
  "message": "Post atualizado com sucesso",
  "post": {
    "id": 1,
    "author": {...},
    "content": "Conteúdo atualizado",
    "created_at": "2024-01-01T12:00:00Z",
    "updated_at": "2024-01-01T12:30:00Z",
    "likes_count": 5,
    "comments_count": 3,
    "is_liked": true
  }
}
```

**IMPORTANTE:** Apenas o autor do post pode editá-lo.

**Erros Possíveis:**
- `403`: Você não tem permissão para editar este post
- `404`: Post não encontrado
- `400`: Campo `content` é obrigatório

---

### 5. Deletar Post

Remove um post que você criou.

**Endpoint:** `DELETE /api/posts/{post_id}/delete/`

**Headers:**
```
Authorization: Bearer seu-access-token
```

**Resposta de Sucesso (200):**
```json
{
  "message": "Post deletado com sucesso"
}
```

**IMPORTANTE:** Apenas o autor do post pode deletá-lo.

**Erros Possíveis:**
- `403`: Você não tem permissão para deletar este post
- `404`: Post não encontrado

---

### 6. Curtir/Descurtir Post

Curtir um post. Se já tiver curtido, remove a curtida (toggle).

**Endpoint:** `POST /api/posts/{post_id}/like/`

**Headers:**
```
Authorization: Bearer seu-access-token
```

**Resposta ao Curtir (201):**
```json
{
  "message": "Post curtido com sucesso",
  "liked": true,
  "likes_count": 6
}
```

**Resposta ao Descurtir (200):**
```json
{
  "message": "Like removido com sucesso",
  "liked": false,
  "likes_count": 5
}
```

**Erros Possíveis:**
- `404`: Post não encontrado

---

### 7. Listar Quem Curtiu

Lista os usuários que curtiram um post.

**Endpoint:** `GET /api/posts/{post_id}/likes/?page=1`

**Headers:**
```
Authorization: Bearer seu-access-token
```

**Resposta de Sucesso (200):**
```json
{
  "count": 25,
  "next": "http://localhost:8000/api/posts/1/likes/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "user": {
        "id": 2,
        "username": "maria",
        "email": "maria@email.com",
        "created_at": "2024-01-01T10:00:00Z"
      },
      "post": 1,
      "created_at": "2024-01-01T13:00:00Z"
    }
  ]
}
```

**Paginação:** 20 itens por página. Use `?page=2` para próxima página.

**Erros Possíveis:**
- `404`: Post não encontrado

---

### 8. Comentários

#### Criar Comentário

**Endpoint:** `POST /api/posts/{post_id}/comments/create/`

**Headers:**
```
Authorization: Bearer seu-access-token
Content-Type: application/json
```

**Body:**
```json
{
  "content": "Ótimo post!"
}
```

**Campos:**
- `content` (obrigatório): Texto do comentário

**Resposta de Sucesso (201):**
```json
{
  "message": "Comentário criado com sucesso",
  "comment": {
    "id": 1,
    "post": 1,
    "author": {
      "id": 2,
      "username": "maria",
      "email": "maria@email.com",
      "created_at": "2024-01-01T10:00:00Z"
    },
    "content": "Ótimo post!",
    "created_at": "2024-01-01T12:30:00Z",
    "updated_at": "2024-01-01T12:30:00Z"
  }
}
```

**Erros Possíveis:**
- `404`: Post não encontrado
- `400`: Campo `content` é obrigatório

#### Listar Comentários

**Endpoint:** `GET /api/posts/{post_id}/comments/?page=1`

**Headers:**
```
Authorization: Bearer seu-access-token
```

**Resposta de Sucesso (200):**
```json
{
  "count": 10,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "post": 1,
      "author": {
        "id": 2,
        "username": "maria",
        "email": "maria@email.com",
        "created_at": "2024-01-01T10:00:00Z"
      },
      "content": "Ótimo post!",
      "created_at": "2024-01-01T12:30:00Z",
      "updated_at": "2024-01-01T12:30:00Z"
    }
  ]
}
```

**Paginação:** 20 itens por página. Use `?page=2` para próxima página.

**Erros Possíveis:**
- `404`: Post não encontrado

#### Editar Comentário

**Endpoint:** `PUT /api/posts/comments/{comment_id}/update/`

**Headers:**
```
Authorization: Bearer seu-access-token
Content-Type: application/json
```

**Body:**
```json
{
  "content": "Comentário atualizado"
}
```

**Campos:**
- `content` (obrigatório): Novo texto do comentário

**Resposta de Sucesso (200):**
```json
{
  "message": "Comentário atualizado com sucesso",
  "comment": {
    "id": 1,
    "post": 1,
    "author": {...},
    "content": "Comentário atualizado",
    "created_at": "2024-01-01T12:30:00Z",
    "updated_at": "2024-01-01T12:35:00Z"
  }
}
```

**IMPORTANTE:** Apenas o autor pode editar seu comentário.

**Erros Possíveis:**
- `403`: Você não tem permissão para editar este comentário
- `404`: Comentário não encontrado
- `400`: Campo `content` é obrigatório

#### Deletar Comentário

**Endpoint:** `DELETE /api/posts/comments/{comment_id}/delete/`

**Headers:**
```
Authorization: Bearer seu-access-token
```

**Resposta de Sucesso (200):**
```json
{
  "message": "Comentário deletado com sucesso"
}
```

**IMPORTANTE:** Apenas o autor pode deletar seu comentário.

**Erros Possíveis:**
- `403`: Você não tem permissão para deletar este comentário
- `404`: Comentário não encontrado

---

### 9. Posts de um Usuário

Lista todos os posts de um usuário específico.

**Endpoint:** `GET /api/posts/user/{user_id}/?page=1`

**Headers:**
```
Authorization: Bearer seu-access-token
```

**Resposta de Sucesso (200):**
```json
{
  "count": 15,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "author": {...},
      "content": "Post do usuário",
      "created_at": "2024-01-01T12:00:00Z",
      "updated_at": "2024-01-01T12:00:00Z",
      "likes_count": 5,
      "comments_count": 3,
      "is_liked": false
    }
  ]
}
```

**Paginação:** 20 itens por página. Use `?page=2` para próxima página.

**Erros Possíveis:**
- `404`: Usuário não encontrado

---

### 10. Meus Posts

Lista todos os seus posts.

**Endpoint:** `GET /api/posts/my-posts/?page=1`

**Headers:**
```
Authorization: Bearer seu-access-token
```

**Resposta de Sucesso (200):**
```json
{
  "count": 10,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "author": {...},
      "content": "Meu post",
      "created_at": "2024-01-01T12:00:00Z",
      "updated_at": "2024-01-01T12:00:00Z",
      "likes_count": 5,
      "comments_count": 3,
      "is_liked": false
    }
  ]
}
```

**Paginação:** 20 itens por página. Use `?page=2` para próxima página.

---

## Exemplos Práticos

### Função Helper para Requisições Autenticadas

```javascript
async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('accessToken');
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  };

  let response = await fetch(`http://localhost:8000/api${endpoint}`, config);

  if (response.status === 401) {
    const newToken = await refreshAccessToken();
    config.headers.Authorization = `Bearer ${newToken}`;
    response = await fetch(`http://localhost:8000/api${endpoint}`, config);
  }

  return response.json();
}

async function getFeed(page = 1) {
  return apiRequest(`/posts/?page=${page}`);
}

async function createPost(content) {
  return apiRequest('/posts/create/', {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
}

async function likePost(postId) {
  return apiRequest(`/posts/${postId}/like/`, {
    method: 'POST',
  });
}
```

### Exemplo Completo - Fluxo de Uso

```javascript
async function exemploCompleto() {
  const BASE_URL = 'http://localhost:8000/api';
  
  // Registrar
  const registrar = await fetch(`${BASE_URL}/auth/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'usuario',
      email: 'usuario@email.com',
      password: 'senha123'
    })
  });
  
  // Login
  const login = await fetch(`${BASE_URL}/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'usuario@email.com',
      password: 'senha123'
    })
  });
  
  const loginData = await login.json();
  const token = loginData.access; // Token agora vem diretamente no body
  
  // Atualizar Perfil
  const atualizarPerfil = await fetch(`${BASE_URL}/auth/profile/update/`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      first_name: 'João',
      bio: 'Minha bio'
    })
  });
  
  // Seguir Usuário
  const seguirUsuario = await fetch(`${BASE_URL}/follows/follow/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ following: 2 })
  });
  
  // Criar Post
  const criarPost = await fetch(`${BASE_URL}/posts/create/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      content: 'Meu primeiro post!'
    })
  });
  
  // Ver Feed
  const verFeed = await fetch(`${BASE_URL}/posts/`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
}
```

---

## Tratamento de Erros

### Códigos de Status HTTP

| Código | Significado | Descrição |
|--------|-------------|-----------|
| 200 | OK | Requisição bem-sucedida |
| 201 | Created | Recurso criado com sucesso |
| 400 | Bad Request | Dados inválidos enviados |
| 401 | Unauthorized | Token inválido ou expirado |
| 403 | Forbidden | Sem permissão para a ação |
| 404 | Not Found | Recurso não encontrado |
| 500 | Internal Server Error | Erro interno do servidor |

### Exemplos de Erros

**400 - Bad Request:**
```json
{
  "error": "Senha atual incorreta"
}
```
ou
```json
{
  "content": ["Este campo é obrigatório."]
}
```

**401 - Unauthorized:**
```json
{
  "error": "Credenciais inválidas"
}
```

**403 - Forbidden:**
```json
{
  "error": "Você só pode editar seus próprios posts"
}
```

**404 - Not Found:**
```json
{
  "error": "Post não encontrado"
}
```

### Tratamento de Erros em JavaScript

```javascript
async function criarPost(content) {
  try {
    const response = await fetch('http://localhost:8000/api/posts/create/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || error.content || 'Erro ao criar post');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro:', error.message);
    throw error;
  }
}
```

---

## Notas Importantes

### Estrutura de Resposta dos Endpoints de Autenticação

Os endpoints `register`, `login` e `GET /auth/profile/` retornam a estrutura do usuário com informações do perfil aninhadas no objeto `info`:

```json
{
  "id": 1,
  "username": "joaosilva",
  "email": "joao@email.com",
  "created_at": "2024-01-01T10:00:00Z",
  "info": {
    "first_name": "João",
    "last_name": "Silva",
    "bio": "Bio do usuário",
    "avatar": "/media/avatars/foto.jpg",
    "status": 1
  }
}
```

O endpoint `PUT /auth/profile/update/` retorna apenas os campos do perfil (sem o objeto `info`):

```json
{
  "first_name": "João",
  "last_name": "Silva",
  "bio": "Nova biografia",
  "avatar": "/media/avatars/foto.jpg",
  "status": 1
}
```

### Autenticação
- Todos os endpoints exceto `register`, `login`, `token/refresh` e `logout` requerem autenticação
- O access token expira em 60 minutos
- Use o refresh token para obter um novo access token antes que expire
- Após logout, o refresh token não pode mais ser usado
- **Tokens são retornados no body da resposta** (`access` e `refresh`) e também salvos em cookies HttpOnly
- Para uso no Postman: copie o token `access` do body e use no header `Authorization: Bearer <token>`
- Para uso em navegadores: os cookies são gerenciados automaticamente, mas você também pode usar os tokens do body

### Permissões
- Apenas o autor pode editar/deletar seus próprios posts
- Apenas o autor pode editar/deletar seus próprios comentários
- Não é possível seguir a si mesmo
- Apenas administradores podem listar todos os usuários

### Posts
- **Posts aceitam APENAS texto. Imagens não são suportadas no modelo Post.**
- O feed (`GET /api/posts/`) mostra apenas posts de usuários que você segue + seus próprios posts
- Posts são ordenados por data de criação (mais recentes primeiro)
- Apenas o autor pode editar ou deletar seus próprios posts

### Paginação
- Todos os endpoints de listagem retornam 20 itens por página
- Use `?page=2` para próxima página
- Resposta inclui `count`, `next`, `previous` e `results`

### Upload de Imagens
- Avatar aceita JPG, PNG, GIF, WebP
- Use `multipart/form-data` ao enviar arquivo
- Imagens são salvas em `backend/media/avatars/`
- Acesse via `/media/avatars/nome-arquivo.jpg`
- **Posts não suportam imagens, apenas texto**

### Likes
- Likes funcionam como toggle: mesma chamada curte/descurte
- Não é possível dar mais de uma curtida no mesmo post

### Validações
- Senha mínima: 8 caracteres
- Email deve ser único
- Username deve ser único
- Campos obrigatórios devem ser enviados ou retornarão erro 400

---

## Recursos Adicionais

- **Base URL Local:** `http://localhost:8000/api/`
- **Admin Panel:** `http://localhost:8000/admin/` (requer superusuário)
- **Media Files:** `http://localhost:8000/media/`
- **Repositório:** [GitHub](https://github.com/phillipml/pingMe)
- **Autor:** Phillip Menezes - contato.phillip.menezes@gmail.com

## Tecnologias e Ferramentas

### Backend
- Django 5.2.7
- Django REST Framework 3.16.1
- Simple JWT 5.5.1
- Celery 5.5.3 (tarefas assíncronas)
- Redis 7.0.0 (broker para Celery)
- PostgreSQL (produção) / SQLite (desenvolvimento)

### Configuração
- Poetry para gerenciamento de dependências
- Docker Compose para PostgreSQL e Redis
- Variáveis de ambiente via python-decouple
