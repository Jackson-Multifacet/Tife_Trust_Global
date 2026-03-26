import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { auth, db } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { GlobalLoading } from "./GlobalLoading";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "staff" | "admin";
}

export function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const [user, loading, error] = useAuthState(auth);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setRoleLoading(false);
      return;
    }

    const fetchUserRole = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));

        if (userDoc.exists()) {
          setUserRole(userDoc.data().role);
        } else {
          // Check if it's the default admin
          if (user.email === "faithjohnjackson@gmail.com") {
            setUserRole("admin");
          }
        }
      } catch (err) {
        console.error("Error fetching user role:", err);
      } finally {
        setRoleLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  if (loading || roleLoading) {
    return <GlobalLoading />;
  }

  if (error || !user) {
    return <Navigate to="/portal/login" replace />;
  }

  if (requiredRole && userRole !== requiredRole && userRole !== "admin") {
    return <Navigate to="/portal/login" replace />;
  }

  return <>{children}</>;
}
