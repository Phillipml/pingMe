export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

export interface Tokens {
  refresh: string;
  access: string;
}

export interface LoginResponse {
  message: string;
  user: User;
}
export interface RegisterRequest {
  username: string;
  email:string,
  password:string
}
export interface RegisterResponse extends LoginResponse{}
