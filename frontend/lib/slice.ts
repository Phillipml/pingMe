import { API_BASE_URL } from "@/utils/api-utils";
import { LoginRegisterResponse, LoginRequest, RegisterRequest, User } from "@/utils/api-interfaces";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: "include",
  }),
  tagTypes: ["User", "Post"],
  endpoints: (builder) => ({
    login: builder.mutation<LoginRegisterResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login/",
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation<LoginRegisterResponse,RegisterRequest>({
      query: (userData)=>({
        url:"/auth/register/",
        method:"POST",
        body:userData
      })
    }),
    getProfile: builder.query<User, void>({
      query: () => "/auth/profile/",
    })
  }),
});

export const { useLoginMutation,useRegisterMutation, useGetProfileQuery } = apiSlice;
