import { Outlet, NavLink } from 'react-router-dom';

const AdminDashboardLayout = () => {
  return (
    <div className="flex">
      <aside className="w-64 h-screen bg-red-600 p-4">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <ul>
          <li><NavLink to="users" className="block mb-2">Manage Users</NavLink></li>
          <li><NavLink to="orders" className="block">Manage Orders</NavLink></li>
        </ul>
      </aside>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboardLayout;
