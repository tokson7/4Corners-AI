"use client";

import { useState, useEffect } from "react";
import { useUser } from "./useUser";
import type { SubscriptionStatus } from "@/lib/subscription";

/**
 * Hook to get user subscription status
 * TODO: Replace with actual API call to fetch subscription from database
 */
export function useSubscription() {
  const { user, isAuthenticated } = useUser();
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setSubscription({ plan: "free", status: "active" });
      setIsLoading(false);
      return;
    }

    // TODO: Fetch actual subscription from API
    // For now, return free tier
    const fetchSubscription = async () => {
      try {
        // const response = await fetch("/api/user/subscription");
        // const data = await response.json();
        // setSubscription(data);
        
        // Placeholder: Default to free
        setSubscription({ plan: "free", status: "active" });
      } catch (error) {
        console.error("Failed to fetch subscription:", error);
        setSubscription({ plan: "free", status: "active" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscription();
  }, [user, isAuthenticated]);

  return {
    subscription,
    isLoading,
    isPro: subscription?.plan === "pro" && subscription?.status === "active",
    isTeam: subscription?.plan === "team" && subscription?.status === "active",
  };
}
