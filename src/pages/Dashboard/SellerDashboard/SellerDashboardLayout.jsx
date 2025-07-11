import { NavLink, Outlet } from 'react-router-dom';

const SellerDashboardLayout = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-red-800 text-white p-5 space-y-4">
        <h2 className="text-2xl font-bold mb-6">Seller Panel</h2>
        <nav className="flex flex-col space-y-2">
          <NavLink
            to="/seller-dashboard/medicines"
            className={({ isActive }) =>
              isActive ? 'bg-white text-red-800 px-4 py-2 rounded' : 'hover:bg-red-700 px-4 py-2 rounded'
            }
          >
            Manage Medicines
          </NavLink>
          <NavLink
            to="/seller-dashboard/payments"
            className={({ isActive }) =>
              isActive ? 'bg-white text-red-800 px-4 py-2 rounded' : 'hover:bg-red-700 px-4 py-2 rounded'
            }
          >
            Payment History
          </NavLink>
          <NavLink
            to="/seller-dashboard/ads"
            className={({ isActive }) =>
              isActive ? 'bg-white text-red-800 px-4 py-2 rounded' : 'hover:bg-red-700 px-4 py-2 rounded'
            }
          >
            Advertisement Requests
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-50 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default SellerDashboardLayout;
