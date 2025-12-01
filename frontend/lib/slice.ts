import { API_BASE_URL } from '@/utils/api-utils'
import {
  LoginRegisterResponse,
  LoginRequest,
  RegisterRequest,
  User,
  LogoutResponse,
  Profile,
  Logout
} from '@/utils/api-interfaces'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token =
        typeof window !== 'undefined'
          ? localStorage.getItem('accessToken')
          : null

      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }

      return headers
    }
  }),
  tagTypes: ['User', 'Post'],
  endpoints: (builder) => ({
    login: builder.mutation<LoginRegisterResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login/',
        method: 'POST',
        body: credentials
      })
    }),
    register: builder.mutation<LoginRegisterResponse, RegisterRequest>({
      query: (userData) => ({
        url: '/auth/register/',
        method: 'POST',
        body: userData
      })
    }),
    getProfile: builder.query<User, void>({
      query: () => '/auth/profile/'
    }),
    logout: builder.mutation<LogoutResponse, Logout>({
      query: () => ({
        url: '/auth/logout/',
        method: 'POST',
        body: {}
      })
    }),
    updateProfile: builder.mutation<Profile, Profile | FormData>({
      query: (profileData) => ({
        url: '/auth/profile/update/',
        method: 'PUT',
        body: profileData
      })
    })
  })
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
  useLogoutMutation,
  useUpdateProfileMutation
} = apiSlice
