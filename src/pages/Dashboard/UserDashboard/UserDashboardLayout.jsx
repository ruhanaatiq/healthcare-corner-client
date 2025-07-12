import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { FaUser, FaMoneyCheckAlt, FaHome } from 'react-icons/fa';
import useAuth from '../../../hooks/useAuth';

const UserDashboardLayout = () => {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-red-500 shadow-md p-6">
        <h2 className="text-xl font-bold mb-6">User Dashboard</h2>
        <div className="space-y-3">
          <NavLink to="/" className="flex items-center gap-2 hover:text-blue-600">
            <FaHome /> Home
          </NavLink>
          <NavLink to="/dashboard/payment-history" className="flex items-center gap-2 hover:text-blue-600">
            <FaMoneyCheckAlt /> Payment History
          </NavLink>
          <NavLink to="/dashboard/profile" className="flex items-center gap-2 hover:text-blue-600">
            <FaUser /> My Profile
          </NavLink>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 bg-gray-100">
        <h1 className="text-2xl font-semibold mb-4 text-red-600">Welcome, {user?.displayName || 'User'}!</h1>
        <Outlet />
      </main>
    </div>
  );
};

export default UserDashboardLayout;
