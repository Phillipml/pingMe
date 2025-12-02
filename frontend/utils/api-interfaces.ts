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
export interface SearchUserResult {
  id: number
  username: string
  email: string
  created_at: string
}
export interface User extends SearchUserResult {
  info: Profile
}
export interface LoginRegisterResponse {
  message: string
  user: User
  access?: string
  refresh?: string
}
export interface SearchUsersResponse {
  count: number
  next: string | null
  previous: string | null
  results: SearchUserResult[]
}