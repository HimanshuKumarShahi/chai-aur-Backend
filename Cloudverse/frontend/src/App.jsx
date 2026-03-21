import { useEffect } from "react"; // <-- 1. Import useEffect
import { SignedIn, SignedOut, SignInButton, UserButton, useUser, useAuth } from "@clerk/clerk-react";

function App() {
  const { user } = useUser(); 
  const { getToken } = useAuth(); 

  // --- NEW: Automatically sync user to MongoDB when they log in ---
  useEffect(() => {
    const syncUserToDatabase = async () => {
      // Only run this if the user is actually logged in
      if (user) {
        try {
          const token = await getToken();
          
          // Call the backend to save the user
          await fetch('http://localhost:5000/api/users/sync', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: user.primaryEmailAddress?.emailAddress,
              firstName: user.firstName,
              lastName: user.lastName
            })
          });
          
          console.log("User sync request sent to backend!");
        } catch (error) {
          console.error("Failed to sync user:", error);
        }
      }
    };

    syncUserToDatabase();
  }, [user, getToken]); // This runs every time the 'user' logs in

  // --- The function to test the backend connection ---
  const testBackendConnection = async () => {
    try {
      const token = await getToken();
      console.log("MY CLERK TOKEN:", token);

      const response = await fetch('http://localhost:5000/api/users/test-auth', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        alert("✅ Connection Secure! Check console for token.");
        console.log("Backend response:", data);
      } else {
        alert("❌ Unauthorized!");
      }

    } catch (error) {
      console.error("Error testing backend:", error);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      
      {/* --- THE NAVBAR --- */}
      <header style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
        <h2>Cloudverse</h2>
        
        <SignedOut>
          <SignInButton mode="modal">
            <button style={{ padding: '8px 16px', cursor: 'pointer', background: 'black', color: 'white' }}>
              Log In
            </button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main style={{ marginTop: '20px' }}>
        <SignedIn>
          <h1>Welcome back to Cloudverse, {user?.firstName}!</h1>
          <p>Ready to order some food?</p>
          
          <br />
          <button 
            onClick={testBackendConnection} 
            style={{ padding: '10px 20px', background: 'blue', color: 'white', cursor: 'pointer', border: 'none', borderRadius: '5px' }}
          >
            Test Secure Backend Connection
          </button>

        </SignedIn>

        <SignedOut>
          <h1>Welcome to Cloudverse</h1>
          <p>Please log in to view the menu and place an order.</p>
        </SignedOut>
      </main>

    </div>
  );
}

export default App;