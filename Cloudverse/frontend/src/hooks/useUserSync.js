import { useUser, useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import { apiFetch } from "../api/api";

export const useUserSync = () => {
  const { user } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    const syncUser = async () => {
      if (!user) return;

      const token = await getToken();

      await apiFetch(
        "/users/sync",
        "POST",
        {
          email: user.primaryEmailAddress?.emailAddress,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        token
      );
    };

    syncUser();
  }, [user]);
};