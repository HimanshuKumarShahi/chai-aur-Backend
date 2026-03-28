import { useUser } from "@clerk/clerk-react";
import { useEffect, useRef } from "react";
import axios from "axios";

export default function SyncUser() {
  const { user, isLoaded, isSignedIn } = useUser();
  const hasSynced = useRef(false); // Prevents duplicate calls in Strict Mode

  useEffect(() => {
    // 1. Wait until Clerk is fully loaded and user is signed in
    if (isLoaded && isSignedIn && user && !hasSynced.current) {
      
      const syncToDB = async () => {
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/user/sync`,
            {
              clerkId: user.id,
              email: user.primaryEmailAddress?.emailAddress,
              // 2. FALLBACK: MongoDB requires 'name'. 
              // If fullName is missing, use username or a default string.
              name: user.fullName || user.username || "Anonymous User",
            }
          );

          if (response.status === 200 || response.status === 201) {
            console.log("✅ User synced to MongoDB");
            hasSynced.current = true; // Mark as successfully synced
          }
        } catch (error) {
          // 3. LOGGING: Helpful for debugging 404s or 500s
          console.error("❌ Sync failed:", error.response?.data || error.message);
        }
      };

      syncToDB();
    }
  }, [user, isLoaded, isSignedIn]);

  return null;
}