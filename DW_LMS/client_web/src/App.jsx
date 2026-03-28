import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Assignments from "./pages/Assignments";
import Downloads from "./pages/Downloads";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";

import Layout from "./components/Layout";

import { SignIn, SignUp, useUser } from "@clerk/clerk-react";
import SyncUser from "./components/SyncUser";

function Protected({ children }) {
  const { isSignedIn } = useUser();
  return isSignedIn ? children : <SignIn />;
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
        <Route
          path="/courses"
          element={
            <Protected>
              <Layout>
                <Courses />
              </Layout>
            </Protected>
          }
        />
        <Route
          path="/admin"
          element={
            <Protected>
              <Layout>
                <Admin />
              </Layout>
            </Protected>
          }
        />

        <Route
          path="/course/:id"
          element={
            <Protected>
              <Layout>
                <CourseDetail />
              </Layout>
            </Protected>
          }
        />

        <Route
          path="/assignments"
          element={
            <Protected>
              <Layout>
                <Assignments />
              </Layout>
            </Protected>
          }
        />

        <Route
          path="/downloads"
          element={
            <Protected>
              <Layout>
                <Downloads />
              </Layout>
            </Protected>
          }
        />

        <Route
          path="/profile"
          element={
            <Protected>
              <Layout>
                <Profile />
              </Layout>
            </Protected>
          }
        />

        {/* Auth Pages (NO NAVBAR) */}
        <Route path="/login" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}
