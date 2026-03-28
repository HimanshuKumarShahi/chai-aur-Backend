import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SignIn, SignUp, useUser } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";

// Components & Pages
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Assignments from "./pages/Assignments";
import Downloads from "./pages/Downloads";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import Layout from "./components/Layout";
import SyncUser from "./components/SyncUser";

// Centered Auth Layout for Login/Signup
function AuthWrapper({ children }) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-600/10 blur-[120px] rounded-full -z-10" />
      {children}
    </div>
  );
}

// Protected Route Guard
function Protected({ children }) {
  const { isSignedIn, isLoaded } = useUser();
  
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isSignedIn) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      {/* 🔄 Keeps MongoDB in sync with Clerk automatically */}
      <SyncUser />

      <Routes>
        {/* --- 🔓 PUBLIC --- */}
        <Route path="/" element={<Layout><Home /></Layout>} />

        {/* --- 🔑 AUTH (No Layout) --- */}
        <Route path="/login/*" element={
          <AuthWrapper>
            <SignIn 
              routing="path" 
              path="/login" 
              signUpUrl="/signup" 
              fallbackRedirectUrl="/" 
              appearance={{ baseTheme: dark }} 
            />
          </AuthWrapper>
        } />
        
        <Route path="/signup/*" element={
          <AuthWrapper>
            <SignUp 
              routing="path" 
              path="/signup" 
              signInUrl="/login" 
              fallbackRedirectUrl="/" 
              appearance={{ baseTheme: dark }} 
            />
          </AuthWrapper>
        } />

        {/* --- 🔐 PROTECTED (Requires Login) --- */}
        <Route path="/courses" element={<Protected><Layout><Courses /></Layout></Protected>} />
        <Route path="/admin" element={<Protected><Layout><Admin /></Layout></Protected>} />
        <Route path="/course/:id" element={<Protected><Layout><CourseDetail /></Layout></Protected>} />
        <Route path="/assignments" element={<Protected><Layout><Assignments /></Layout></Protected>} />
        <Route path="/downloads" element={<Protected><Layout><Downloads /></Layout></Protected>} />
        <Route path="/profile" element={<Protected><Layout><Profile /></Layout></Protected>} />

        {/* --- 🛑 CATCH-ALL --- */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}