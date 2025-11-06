"use client";

import { useEffect, useState } from "react";
import { useGetProfileQuery } from "@/lib/slice";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const {
    data: user,
    isLoading: queryLoading,
    error,
  } = useGetProfileQuery();

  useEffect(() => {
    if (error) {
      setIsAuthenticated(false);
      return;
    }

    if (user) {
      setIsAuthenticated(true);
      return;
    }
  }, [user, error]);

  return {
    isAuthenticated,
    isLoading: queryLoading,
    user,
  };
}
