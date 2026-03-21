import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useUser, useAuth, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react"; // <-- Import RedirectToSignIn

import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const { user } = useUser(); 
  const { getToken } = useAuth(); 

  // Background Sync
  useEffect(() => {
    const syncUser = async () => {
      if (user) {
        try {
          const token = await getToken();
          await fetch('http://localhost:5000/api/users/sync', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: user.primaryEmailAddress?.emailAddress,
              firstName: user.firstName, lastName: user.lastName
            })
          });
        } catch (error) { console.error("Sync failed:", error); }
      }
    };
    syncUser();
  }, [user, getToken]);

  return (
    <BrowserRouter>
      {/* Dev Menu */}
      <div className="bg-gray-800 text-white p-2 text-center text-sm flex gap-4 justify-center">
        <span>Dev Menu:</span>
        <Link to="/" className="hover:text-red-400 underline">Customer View (Home)</Link>
        <Link to="/admin" className="hover:text-red-400 underline">Admin View</Link>
      </div>

      <Routes>
        {/* Public Route: Anyone can see the home page */}
        <Route path="/" element={<Home />} />
        
        {/* Protected Route: Only logged-in users can see the Admin Dashboard */}
        <Route path="/admin" element={
          <>
            <SignedIn>
              <AdminDashboard />
            </SignedIn>
            <SignedOut>
              {/* If they aren't logged in, instantly redirect them to the Clerk login */}
              <RedirectToSignIn />
            </SignedOut>
          </>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;