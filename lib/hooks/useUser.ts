"use client";

import { useUser as useClerkUser } from "@clerk/nextjs";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
}

export function useUser() {
  const { user: clerkUser, isLoaded, isSignedIn } = useClerkUser();

  const user: User | null = clerkUser
    ? {
        id: clerkUser.id,
        email: clerkUser.emailAddresses?.[0]?.emailAddress || '',
        name: clerkUser.fullName || clerkUser.firstName || null,
        image: clerkUser.imageUrl || null,
      }
    : null;

  const authStatus: AuthStatus =
    !isLoaded
      ? "loading"
      : isSignedIn
      ? "authenticated"
      : "unauthenticated";

  return {
    user,
    status: authStatus,
    isLoading: authStatus === "loading",
    isAuthenticated: authStatus === "authenticated",
  };
}
