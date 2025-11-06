import { API_BASE_URL } from "@/utils/api-utils";
import { LoginRequest, LoginResponse, User } from "@/utils/api-interfaces";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: "include",
  }),
  tagTypes: ["User", "Post"],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login/",
        method: "POST",
        body: credentials,
      }),
    }),
    getProfile: builder.query<User, void>({
      query: () => "/auth/profile/",
    }),
  }),
});

export const { useLoginMutation, useGetProfileQuery } = apiSlice;
