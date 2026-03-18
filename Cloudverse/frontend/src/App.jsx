import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react";

function App() {
  // useUser() lets us grab the logged-in user's details
  const { user } = useUser(); 

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      
      {/* --- THE NAVBAR --- */}
      <header style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
        <h2>Cloudverse</h2>
        
        {/* What to show when the user is NOT logged in */}
        <SignedOut>
          <SignInButton mode="modal">
            <button style={{ padding: '8px 16px', cursor: 'pointer', background: 'black', color: 'white' }}>
              Log In
            </button>
          </SignInButton>
        </SignedOut>

        {/* What to show when the user IS logged in */}
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main style={{ marginTop: '20px' }}>
        <SignedIn>
          {/* We can dynamically display their name from their Google account */}
          <h1>Welcome back to Cloudverse, {user?.firstName}!</h1>
          <p>Ready to order some food?</p>
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