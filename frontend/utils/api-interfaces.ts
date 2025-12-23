export interface LoginRequest {
  email: string
  password: string
}

export interface Tokens {
  refresh: string
  access: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface Profile {
  first_name?: string
  last_name?: string
  bio?: string
  avatar?: string | null
  status?: number
}

export interface LogoutRequest {
  refresh?: string
}

export interface BaseUser {
  id: number
  username: string
  email: string
  created_at: string
  avatar: string | null
}

export interface UserWithSince extends BaseUser {
  since: string
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface User {
  id: number
  username: string
  email: string
  created_at: string
  info: Profile
}

export interface MessageResponse {
  message: string
}

export interface LoginRegisterResponse extends MessageResponse {
  user: User
  access?: string
  refresh?: string
}

export interface FollowRequest {
  following: number
}

export interface ContentRequest {
  content: string
}

export interface Post {
  id: number
  author: BaseUser
  content: string
  created_at: string
  updated_at: string
  likes_count: number
  comments_count: number
  is_liked: boolean
}

export interface PostCreateResponse extends MessageResponse {
  post: Post
}

export interface LikeResponse extends MessageResponse {
  liked: boolean
  likes_count: number
}

export interface Comment {
  id: number
  post: number
  author: BaseUser
  content: string
  created_at: string
  updated_at: string
}

export interface CommentCreateResponse extends MessageResponse {
  comment: Comment
}

export type FeedResponse = PaginatedResponse<Post>
export type SearchUsersResponse = PaginatedResponse<BaseUser>
export type FollowersResponse = PaginatedResponse<UserWithSince>
export type FollowingResponse = PaginatedResponse<UserWithSince>
export type CommentResponse = PaginatedResponse<Comment>
export type CreatePost = ContentRequest
export type CreateComment = ContentRequest
export type CommentUpdateResponse = CommentCreateResponse
