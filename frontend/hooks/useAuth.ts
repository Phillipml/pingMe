"use client";

import { useGetProfileQuery } from "@/lib/slice";

export function useAuth() {
  const {
    data: user,
    isLoading: queryLoading,
    error,
  } = useGetProfileQuery();

  const isAuthenticated = !error && !!user;

  return {
    isAuthenticated,
    isLoading: queryLoading,
    user,
  };
}