import { Outlet, NavLink } from 'react-router-dom';

const AdminDashboardLayout = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-red-600 p-6 text-white">
        <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
        <ul className="space-y-4">
          <li>
            <NavLink
              to="/"
              className="block hover:text-blue-200 transition duration-200"
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="users"
              className="block hover:text-blue-200 transition duration-200"
            >
              Manage Users
            </NavLink>
          </li>
          <li>
            <NavLink
              to="orders"
              className="block hover:text-blue-200 transition duration-200"
            >
              Manage Orders
            </NavLink>
          </li>
          <li>
            <NavLink
              to="categories"
              className="block hover:text-blue-200 transition duration-200"
            >
              Manage Categories
            </NavLink>
          </li>
          <li>
            <NavLink
              to="payments"
              className="block hover:text-blue-200 transition duration-200"
            >
              Manage Payments
            </NavLink>
          </li>
          <li>
            <NavLink
              to="banner-management"
              className="block hover:text-blue-200 transition duration-200"
            >
              Banner Management
            </NavLink>
          </li>
          <li>
            <NavLink
              to="sales-report"
              className="block hover:text-blue-200 transition duration-200"
            >
              Sales Report
            </NavLink>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-gray-50 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboardLayout;
