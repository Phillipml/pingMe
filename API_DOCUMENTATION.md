# Documentação Completa da API PingMe

Esta é a documentação completa da API REST do PingMe, uma rede social com autenticação, posts, curtidas, comentários e sistema de seguir usuários.

## Índice

- [Começando](#começando)
- [Autenticação](#autenticação)
- [Perfil do Usuário](#perfil-do-usuário)
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

### Autenticação JWT

A API usa tokens JWT (JSON Web Tokens) para autenticação. Você precisa incluir o token de acesso no header de todas as requisições protegidas:

```
Authorization: Bearer seu-token-aqui
```

### Fluxo de Autenticação

1. **Registrar** um novo usuário (`POST /api/auth/register/`)
2. **Fazer login** e receber tokens (`POST /api/auth/login/`)
3. Usar o **access token** nas requisições protegidas
4. Quando o access token expirar, **renovar** usando o refresh token (`POST /api/auth/token/refresh/`)
5. **Fazer logout** quando necessário (`POST /api/auth/logout/`)

### Tipos de Tokens

- **Access Token**: Válido por 60 minutos, usado em todas as requisições autenticadas
- **Refresh Token**: Válido por 7 dias, usado apenas para renovar o access token

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

**Campos:**
- `username` (obrigatório): Nome de usuário único
- `email` (obrigatório): Email único
- `password` (obrigatório): Senha mínima de 8 caracteres

**Resposta de Sucesso (201):**
```json
{
  "message": "Usuário criado com sucesso",
  "user": {
    "id": 1,
    "username": "joaosilva",
    "email": "joao@email.com",
    "created_at": "2024-01-01T10:00:00Z"
  }
}
```

**Erros Possíveis:**
- `400`: Email ou username já existem, ou campos inválidos
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
    "created_at": "2024-01-01T10:00:00Z"
  },
  "tokens": {
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
  }
}
```

**IMPORTANTE:** Guarde os tokens em local seguro! O `access` é usado nas requisições e o `refresh` para renovar o access quando expirar.

**Erros Possíveis:**
- `401`: Email ou senha incorretos

**Exemplo com JavaScript:**
```javascript
const response = await fetch('http://localhost:8000/api/auth/login/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'joao@email.com',
    password: 'senhaSegura123'
  })
});

const data = await response.json();

if (response.ok) {
  localStorage.setItem('accessToken', data.tokens.access);
  localStorage.setItem('refreshToken', data.tokens.refresh);
  localStorage.setItem('user', JSON.stringify(data.user));
}
```

---

### 3. Renovar Access Token

Quando o access token expira (após 60 minutos), use este endpoint para obter um novo.

**Endpoint:** `POST /api/auth/token/refresh/`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "refresh": "seu-refresh-token-aqui"
}
```

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

**Body:**
```json
{
  "refresh": "seu-refresh-token-aqui"
}
```

**Resposta de Sucesso (200):**
```json
{
  "message": "Logout realizado com sucesso"
}
```

**Nota:** Após o logout, você não poderá mais usar o refresh token. O usuário precisará fazer login novamente.

---

## Perfil do Usuário

### 1. Ver Meu Perfil

Retorna as informações do perfil do usuário autenticado.

**Endpoint:** `GET /api/auth/profile/`

**Headers:**
```
Authorization: Bearer seu-access-token
```

**Resposta de Sucesso (200):**
```json
{
  "first_name": "João",
  "last_name": "Silva",
  "bio": "Desenvolvedor apaixonado por tecnologia",
  "avatar": "/media/avatars/joaosilva_avatar.jpg"
}
```

**Campos:**
- `first_name`: Primeiro nome (opcional)
- `last_name`: Sobrenome (opcional)
- `bio`: Biografia do usuário (opcional)
- `avatar`: URL da foto de perfil (opcional)

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

Permite atualizar foto de perfil, nome e bio. Todos os campos são opcionais - você pode atualizar apenas o que desejar.

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
  "avatar": "/media/avatars/joaosilva_avatar.jpg"
}
```

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
  "avatar": "/media/avatars/maria_avatar.jpg"
}
```

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

### 3. Listar Seguidores de um Usuário

Lista quem está seguindo um usuário específico.

**Endpoint:** `GET /api/follows/followers/{user_id}/?page=1`

**Headers:**
```
Authorization: Bearer seu-access-token
```

**Resposta de Sucesso (200):**
```json
{
  "count": 25,
  "next": "http://localhost:8000/api/follows/followers/2/?page=2",
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

### 4. Listar Quem um Usuário Segue

Lista os usuários que um usuário específico está seguindo.

**Endpoint:** `GET /api/follows/following/{user_id}/?page=1`

**Headers:**
```
Authorization: Bearer seu-access-token
```

**Exemplo de Resposta:**
```json
{
  "count": 15,
  "next": null,
  "previous": null,
  "results": [...]
}
```

---

### 5. Meus Seguidores

Lista quem está seguindo você.

**Endpoint:** `GET /api/follows/my-followers/?page=1`

**Headers:**
```
Authorization: Bearer seu-access-token
```

---

### 6. Quem Estou Seguindo

Lista os usuários que você está seguindo.

**Endpoint:** `GET /api/follows/my-following/?page=1`

**Headers:**
```
Authorization: Bearer seu-access-token
```

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
      "image": "https://exemplo.com/imagem.jpg",
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

---

### 2. Criar Post

Cria um novo post.

**Endpoint:** `POST /api/posts/create/`

**Headers:**
```
Authorization: Bearer seu-access-token
Content-Type: application/json
```

**Body:**
```json
{
  "content": "Conteúdo do meu post aqui",
  "image": "https://exemplo.com/imagem.jpg"
}
```

**Campos:**
- `content` (obrigatório): Texto do post
- `image` (opcional): URL da imagem

**Resposta de Sucesso (201):**
```json
{
  "message": "Post criado com sucesso",
  "post": {
    "id": 1,
    "author": {...},
    "content": "Conteúdo do meu post aqui",
    "image": "https://exemplo.com/imagem.jpg",
    "created_at": "2024-01-01T12:00:00Z",
    "likes_count": 0,
    "comments_count": 0,
    "is_liked": false
  }
}
```

---

### 3. Ver Detalhes de um Post

Retorna informações completas de um post específico.

**Endpoint:** `GET /api/posts/{post_id}/`

**Headers:**
```
Authorization: Bearer seu-access-token
```

---

### 4. Editar Post

Atualiza um post que você criou.

**Endpoint:** `PUT /api/posts/{post_id}/update/`

**Headers:**
```
Authorization: Bearer seu-access-token
Content-Type: application/json
```

**Body:**
```json
{
  "content": "Conteúdo atualizado",
  "image": "https://exemplo.com/nova-imagem.jpg"
}
```

**IMPORTANTE:** Apenas o autor do post pode editá-lo.

**Erros Possíveis:**
- `403`: Você não tem permissão para editar este post

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

---

### 7. Listar Quem Curtiu

Lista os usuários que curtiram um post.

**Endpoint:** `GET /api/posts/{post_id}/likes/?page=1`

**Headers:**
```
Authorization: Bearer seu-access-token
```

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
      "email": "maria@email.com"
    },
    "content": "Ótimo post!",
    "created_at": "2024-01-01T12:30:00Z",
    "updated_at": "2024-01-01T12:30:00Z"
  }
}
```

#### Listar Comentários

**Endpoint:** `GET /api/posts/{post_id}/comments/?page=1`

#### Editar Comentário

**Endpoint:** `PUT /api/posts/comments/{comment_id}/update/`

**Body:**
```json
{
  "content": "Comentário atualizado"
}
```

**IMPORTANTE:** Apenas o autor pode editar seu comentário.

#### Deletar Comentário

**Endpoint:** `DELETE /api/posts/comments/{comment_id}/delete/`

---

### 9. Posts de um Usuário

Lista todos os posts de um usuário específico.

**Endpoint:** `GET /api/posts/user/{user_id}/?page=1`

**Headers:**
```
Authorization: Bearer seu-access-token
```

---

### 10. Meus Posts

Lista todos os seus posts.

**Endpoint:** `GET /api/posts/my-posts/?page=1`

**Headers:**
```
Authorization: Bearer seu-access-token
```

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

async function createPost(content, image = null) {
  return apiRequest('/posts/create/', {
    method: 'POST',
    body: JSON.stringify({ content, image }),
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
  
  const registrar = await fetch(`${BASE_URL}/auth/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'usuario',
      email: 'usuario@email.com',
      password: 'senha123'
    })
  });
  
  const login = await fetch(`${BASE_URL}/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'usuario@email.com',
      password: 'senha123'
    })
  });
  
  const loginData = await login.json();
  const token = loginData.tokens.access;
  
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
  
  const seguirUsuario = await fetch(`${BASE_URL}/follows/follow/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ following: 2 })
  });
  
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
      throw new Error(error.error || 'Erro ao criar post');
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

### Autenticação
- Todos os endpoints exceto `register`, `login`, `token/refresh` e `logout` requerem autenticação
- O access token expira em 60 minutos
- Use o refresh token para obter um novo access token antes que expire
- Após logout, o refresh token não pode mais ser usado

### Permissões
- Apenas o autor pode editar/deletar seus próprios posts
- Apenas o autor pode editar/deletar seus próprios comentários
- Não é possível seguir a si mesmo

### Feed
- O feed mostra apenas posts de usuários que você segue + seus próprios posts
- Posts são ordenados por data (mais recentes primeiro)

### Paginação
- Todos os endpoints de listagem retornam 20 itens por página
- Use `?page=2` para próxima página
- Resposta inclui `count`, `next`, `previous` e `results`

### Upload de Imagens
- Avatar aceita JPG, PNG, GIF, WebP
- Use `multipart/form-data` ao enviar arquivo
- Imagens são salvas em `backend/media/avatars/`
- Acesse via `/media/avatars/nome-arquivo.jpg`

### Likes
- Likes funcionam como toggle: mesma chamada curte/descurte
- Não é possível dar mais de uma curtida no mesmo post

### Validações
- Senha mínima: 8 caracteres
- Email deve ser único
- Username deve ser único

---

## Recursos Adicionais

- **Base URL Local:** `http://localhost:8000/api/`
- **Documentação Swagger:** (se disponível)
- **Suporte:** Entre em contato com o time de desenvolvimento
