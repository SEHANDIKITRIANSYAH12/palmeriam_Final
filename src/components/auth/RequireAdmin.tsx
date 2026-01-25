import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getAuth } from "@/lib/auth";

export default function RequireAdmin() {
  const location = useLocation();
  const auth = getAuth();

  if (!auth?.token) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  if (auth.user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
