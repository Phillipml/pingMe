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
export interface LogoutResponse {
  message: string
}
export interface Logout {
  refresh?: string
}

export interface LogoutRequest {
  refresh?: string
}
export interface BaseUserResult {
  id: number
  username: string
  email: string
  created_at: string
  avatar: string | null
}

export interface UserResultWithSince extends BaseUserResult {
  since: string
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export type SearchUserResult = BaseUserResult

export type FollowersFollowingResult = UserResultWithSince

export interface User {
  id: number
  username: string
  email: string
  created_at: string
  info: Profile
}

export interface LoginRegisterResponse {
  message: string
  user: User
  access?: string
  refresh?: string
}

export type SearchUsersResponse = PaginatedResponse<SearchUserResult>

export type FollowersResponse = PaginatedResponse<FollowersFollowingResult>

export type FollowingResponse = PaginatedResponse<FollowersFollowingResult>

export interface FollowRequest {
  following: number
}

export interface FollowResponse {
  message: string
}
export interface CreatePost {
  content: string
}
export interface Post {
  id: number
  author: BaseUserResult
  content: string
  created_at: string
  updated_at: string
  likes_count: number
  comments_count: number
  is_liked: boolean
}
export interface PostResponse {
  message: string
  post: Post[]
}
export type FeedResponse = PaginatedResponse<Post>
export interface LikeResponse {
  message: string
  liked: boolean
  likes_count: number
}
