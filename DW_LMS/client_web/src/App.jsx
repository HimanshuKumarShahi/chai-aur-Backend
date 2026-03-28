import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Assignments from "./pages/Assignments";
import Downloads from "./pages/Downloads";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import Layout from "./components/Layout";
import { SignIn, SignUp, useUser } from "@clerk/clerk-react";
import { dark } from "@clerk/themes"; // 🔥 Import the dark theme
import SyncUser from "./components/SyncUser";

// 🎨 Helper Component to wrap Auth with LMS Theme
function AuthWrapper({ children }) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-600/10 blur-[120px] rounded-full -z-10" />
      {children}
    </div>
  );
}

function Protected({ children }) {
  const { isSignedIn, isLoaded } = useUser();
  
  if (!isLoaded) return null; // Wait for Clerk to load

  // If not signed in, show the styled login instead of a white page
  return isSignedIn ? children : (
    <AuthWrapper>
      <SignIn appearance={{ baseTheme: dark }} />
    </AuthWrapper>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <SyncUser />

      <Routes>
        {/* 🔓 Public Route */}
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />

        {/* 🔐 Protected Routes */}
        <Route path="/courses" element={<Protected><Layout><Courses /></Layout></Protected>} />
        <Route path="/admin" element={<Protected><Layout><Admin /></Layout></Protected>} />
        <Route path="/course/:id" element={<Protected><Layout><CourseDetail /></Layout></Protected>} />
        <Route path="/assignments" element={<Protected><Layout><Assignments /></Layout></Protected>} />
        <Route path="/downloads" element={<Protected><Layout><Downloads /></Layout></Protected>} />
        <Route path="/profile" element={<Protected><Layout><Profile /></Layout></Protected>} />

        {/* 🔑 Auth Routes (Wrapped in styled AuthWrapper) */}
        <Route 
          path="/login/*" 
          element={
            <AuthWrapper>
              <SignIn routing="path" path="/login" signUpUrl="/signup" appearance={{ baseTheme: dark }} />
            </AuthWrapper>
          } 
        />
        
        <Route 
          path="/signup/*" 
          element={
            <AuthWrapper>
              <SignUp routing="path" path="/signup" signInUrl="/login" appearance={{ baseTheme: dark }} />
            </AuthWrapper>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}