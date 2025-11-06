"use client";

import { useEffect, useState } from "react";
import { useGetProfileQuery } from "@/lib/slice";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const hasToken =
    typeof window !== "undefined" && !!localStorage.getItem("accessToken");

  const {
    data: user,
    isLoading: queryLoading,
    error,
  } = useGetProfileQuery(undefined, { skip: !hasToken });

  const isLoading = hasToken ? queryLoading : false;

  useEffect(() => {
    if (!hasToken) {
      setIsAuthenticated(false);
      return;
    }

    if (error) {
      setIsAuthenticated(false);
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
      }
      return;
    }

    if (user) {
      setIsAuthenticated(true);
      return;
    }
  }, [user, error, hasToken]);

  return {
    isAuthenticated,
    isLoading,
    user,
  };
}
