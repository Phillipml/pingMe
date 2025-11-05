"use client";

import { useEffect, useState } from "react";
import { useGetProfileQuery } from "@/lib/slice";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const hasToken =
    typeof window !== "undefined" && !!localStorage.getItem("accessToken");

  const {
    data: user,
    isLoading: queryLoading,
    error,
  } = useGetProfileQuery(undefined, { skip: !hasToken });

  useEffect(() => {
    if (hasToken) {
      if (user) {
        setIsAuthenticated(true);
        setIsAuthenticated(false);
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
        }
      }
    } else {
      setIsAuthenticated(false);
    }

    setIsLoading(queryLoading);
  }, [user, error, hasToken, queryLoading]);

  return {
    isAuthenticated,
    isLoading,
    user,
  };
}
