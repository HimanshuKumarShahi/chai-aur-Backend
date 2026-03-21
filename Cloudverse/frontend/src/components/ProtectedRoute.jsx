import { useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children, role }) {
  const { isSignedIn, getToken } = useAuth();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchRole = async () => {
      const token = await getToken();

      const res = await fetch("http://localhost:5000/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setUserRole(data.role);
    };

    fetchRole();
  }, []);

  if (!isSignedIn) return <Navigate to="/" />;
  if (role && userRole === null) return <p>Loading...</p>;
  if (role && userRole !== role) return <Navigate to="/" />;

  return children;
}