"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";
  const user = session?.user;

  const login = () => router.push("/login");
  
  const logout = async () => {
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
  };
}
