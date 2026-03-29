import { useUser } from "@clerk/clerk-react";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import WelcomeModal from "./WelcomeModal"; // 🔥 Make sure to create this file

export default function SyncUser() {
  const { user, isLoaded, isSignedIn } = useUser();
  const hasSynced = useRef(false); 
  const [showWelcome, setShowWelcome] = useState(false); // 🔥 Controls the welcome overlay

  useEffect(() => {
    // 1. Logic check: Is Clerk ready and have we not synced yet?
    if (isLoaded && isSignedIn && user && !hasSynced.current) {
      
      const syncToDB = async () => {
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/user/sync`,
            {
              clerkId: user.id,
              email: user.primaryEmailAddress?.emailAddress,
              name: user.fullName || user.username || "New User",
            }
          );

          if (response.status === 200 || response.status === 201) {
            console.log("✅ User synced to MongoDB");
            hasSynced.current = true; 

            // 🛡️ TRIGGER WELCOME: Only if the backend confirms this is a brand new user
            if (response.data.isNewUser) {
              setShowWelcome(true);
            }
          }
        } catch (error) {
          console.error("❌ Sync failed:", error.response?.data || error.message);
        }
      };

      syncToDB();
    }
  }, [user, isLoaded, isSignedIn]);

  // Render the modal. It stays "closed" (returns null) if showWelcome is false.
  return (
    <WelcomeModal 
      isOpen={showWelcome} 
      onClose={() => setShowWelcome(false)} 
      userName={user?.fullName || user?.username} 
    />
  );
}