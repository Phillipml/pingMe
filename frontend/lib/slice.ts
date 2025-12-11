import { API_BASE_URL } from '@/utils/api-utils'
import {
  LoginRegisterResponse,
  LoginRequest,
  RegisterRequest,
  User,
  LogoutResponse,
  Profile,
  Logout,
  SearchUsersResponse,
  FollowRequest,
  FollowResponse,
  FollowersResponse,
  MessageResponse,
  PostResponse,
  CreatePost,
  FeedResponse,
  LikeResponse
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
    }),
    searchUsers: builder.query<SearchUsersResponse, string>({
      query: (searchQuery) => ({
        url: '/auth/users/',
        params: searchQuery ? { q: searchQuery } : {}
      })
    }),
    getPublicProfile: builder.query<User, string | void>({
      query: (id) => ({
        url: `/auth/profile/${id}/`
      })
    }),
    follow: builder.mutation<FollowResponse, FollowRequest>({
      query: (followData) => ({
        url: '/follows/follow/',
        method: 'POST',
        body: followData
      })
    }),
    unfollow: builder.mutation<FollowResponse, FollowRequest>({
      query: (unfollowData) => ({
        url: '/follows/unfollow/',
        method: 'DELETE',
        body: unfollowData
      })
    }),
    getMyFollowers: builder.query<FollowersResponse, void>({
      query: () => '/follows/my-followers/'
    }),
    getMyFollowing: builder.query<MessageResponse, void>({
      query: () => '/follows/my-following/'
    }),
    createPost: builder.mutation<PostResponse, CreatePost>({
      query: (postData) => ({
        url: '/posts/create/',
        method: 'POST',
        body: postData
      })
    }),
    feed: builder.query<FeedResponse, void>({
      query: () => '/posts/'
    }),
    likePost: builder.mutation<LikeResponse, number>({
      query: (id) => ({
        url: `/posts/${id}/like/`,
        method: 'POST'
      })
    }),
    getUserPost: builder.query<FeedResponse, { id: number; page?: number }>({
      query: ({ id, page = 1 }) => ({
        url: `/posts/user/${id}/`,
        params: { page }
      })
    }),
    deletePost: builder.mutation<MessageResponse,number>({
      query:(id)=>({
        url:`/post/${id}/delete/`,
        method:'DELETE'
      })
    })
  })
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
  useLogoutMutation,
  useUpdateProfileMutation,
  useSearchUsersQuery,
  useGetPublicProfileQuery,
  useFollowMutation,
  useUnfollowMutation,
  useGetMyFollowersQuery,
  useGetMyFollowingQuery,
  useCreatePostMutation,
  useFeedQuery,
  useLikePostMutation,
  useGetUserPostQuery,
  useDeletePostMutation
} = apiSlice
