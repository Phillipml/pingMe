import { API_BASE_URL } from '@/utils/api-utils'
import {
  LoginRegisterResponse,
  LoginRequest,
  RegisterRequest,
  User,
  MessageResponse,
  Profile,
  LogoutRequest,
  SearchUsersResponse,
  FollowRequest,
  FollowersResponse,
  FollowingResponse,
  PostCreateResponse,
  CreatePost,
  CommentResponse,
  CommentCreateResponse,
  CreateComment,
  FeedResponse,
  LikeResponse,
  Post,
  CommentUpdateResponse
} from '@/utils/api-interfaces'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { FetchArgs } from '@reduxjs/toolkit/query'

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers) => {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null

    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    return headers
  }
})

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)
  if (result.error && result.error.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      window.location.href = '/login'
    }
  }

  return result
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Post'],
  endpoints: (builder) => ({
    login: builder.mutation<LoginRegisterResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login/',
        method: 'POST',
        body: credentials
      }),
      invalidatesTags: ['User', 'Post']
    }),
    register: builder.mutation<LoginRegisterResponse, RegisterRequest>({
      query: (userData) => ({
        url: '/auth/register/',
        method: 'POST',
        body: userData
      }),
      invalidatesTags: ['User']
    }),
    getProfile: builder.query<User, void>({
      query: () => '/auth/profile/',
      providesTags: ['User']
    }),
    logout: builder.mutation<MessageResponse, LogoutRequest>({
      query: (logoutData) => ({
        url: '/auth/logout/',
        method: 'POST',
        body: logoutData
      }),
      invalidatesTags: ['User', 'Post']
    }),
    updateProfile: builder.mutation<Profile, Profile | FormData>({
      query: (profileData) => ({
        url: '/auth/profile/update/',
        method: 'PUT',
        body: profileData
      }),
      invalidatesTags: ['User']
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
    follow: builder.mutation<MessageResponse, FollowRequest>({
      query: (followData) => ({
        url: '/follows/follow/',
        method: 'POST',
        body: followData
      })
    }),
    unfollow: builder.mutation<MessageResponse, FollowRequest>({
      query: (unfollowData) => ({
        url: '/follows/unfollow/',
        method: 'DELETE',
        body: unfollowData
      })
    }),
    getMyFollowers: builder.query<FollowersResponse, void>({
      query: () => '/follows/my-followers/'
    }),
    getMyFollowing: builder.query<FollowingResponse, void>({
      query: () => '/follows/my-following/'
    }),
    createPost: builder.mutation<PostCreateResponse, CreatePost>({
      query: (postData) => ({
        url: '/posts/create/',
        method: 'POST',
        body: postData
      }),
      invalidatesTags: ['Post']
    }),
    feed: builder.query<FeedResponse, void>({
      query: () => '/posts/',
      providesTags: ['Post']
    }),
    likePost: builder.mutation<LikeResponse, number>({
      query: (id) => ({
        url: `/posts/${id}/like/`,
        method: 'POST'
      }),
      invalidatesTags: ['Post']
    }),
    getUserPost: builder.query<
      FeedResponse,
      { id: number | string; page?: number }
    >({
      query: ({ id, page = 1 }) => ({
        url: `/posts/user/${id}/`,
        params: { page }
      }),
      providesTags: ['Post']
    }),
    deletePost: builder.mutation<MessageResponse, number>({
      query: (id) => ({
        url: `/posts/${id}/delete/`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Post']
    }),
    updatePost: builder.mutation<
      PostCreateResponse,
      { postId: number | string; data: CreatePost }
    >({
      query: ({ postId, data }) => ({
        url: `/posts/${postId}/update/`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['Post']
    }),
    getPost: builder.query<Post, number | string>({
      query: (id) => ({
        url: `/posts/${id}/`
      })
    }),
    getComments: builder.query<CommentResponse, number | string>({
      query: (id) => ({
        url: `/posts/${id}/comments/`
      })
    }),
    createComment: builder.mutation<
      CommentCreateResponse,
      { postId: number | string; data: CreateComment }
    >({
      query: ({ postId, data }) => ({
        url: `/posts/${postId}/comments/create/`,
        method: 'POST',
        body: data
      })
    }),
    updateComment: builder.mutation<
      CommentUpdateResponse,
      { commentId: number | string; data: CreateComment }
    >({
      query: ({ commentId, data }) => ({
        url: `/posts/comments/${commentId}/update/`,
        method: 'PUT',
        body: data
      })
    }),
    deleteComment: builder.mutation<MessageResponse, number | string>({
      query: (id) => ({
        url: `/posts/comments/${id}/delete/`,
        method: 'DELETE'
      })
    }),
    deleteUser: builder.mutation<MessageResponse, void>({
      query: () => ({
        url: '/auth/users/me/delete/',
        method: 'DELETE'
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
  useDeletePostMutation,
  useUpdatePostMutation,
  useGetPostQuery,
  useGetCommentsQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useDeleteUserMutation
} = apiSlice
