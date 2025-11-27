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

export interface LogoutRequest {
  refresh?: string
}
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