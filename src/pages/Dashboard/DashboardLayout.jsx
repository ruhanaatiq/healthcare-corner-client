import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import useRole from "../../hooks/useRole";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role, loading } = useRole();

  useEffect(() => {
    if (loading) return;
    // Only redirect when landing on /dashboard root
    if (location.pathname === "/dashboard" && role) {
      if (role === "admin") {
        navigate("/dashboard/admin", { replace: true });
      } else if (role === "seller") {
        navigate("/dashboard/seller", { replace: true });
      } else {
        navigate("/dashboard/user/payment-history", { replace: true });
      }
    }
  }, [role, loading, navigate, location.pathname]);

  if (loading) return <div className="text-center mt-10">Loading Dashboard...</div>;

  // Render nested routes like /dashboard/update-profile
  return (
    <div className="min-h-screen flex">
      {/* sidebar/header here if you have them */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
