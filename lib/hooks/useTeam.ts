"use client";

import { useState, useEffect } from "react";
import { useUser } from "./useUser";
import type { Team } from "@/lib/types/team";

/**
 * Hook to get user's team information
 */
export function useTeam() {
  const { user, isAuthenticated } = useUser();
  const [team, setTeam] = useState<Team | null>(null);
  const [userRole, setUserRole] = useState<"owner" | "admin" | "member" | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setTeam(null);
      setUserRole(null);
      setIsLoading(false);
      return;
    }

    const fetchTeam = async () => {
      try {
        const response = await fetch("/api/teams");
        if (response.ok) {
          const data = await response.json();
          if (data.team) {
            setTeam(data.team);
            setUserRole(data.userRole);
          } else {
            setTeam(null);
            setUserRole(null);
          }
        }
      } catch (error) {
        console.error("Failed to fetch team:", error);
        setTeam(null);
        setUserRole(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeam();
  }, [user, isAuthenticated]);

  return {
    team,
    userRole,
    isLoading,
    isInTeam: !!team,
    isOwner: userRole === "owner",
    isAdmin: userRole === "admin" || userRole === "owner",
  };
}
