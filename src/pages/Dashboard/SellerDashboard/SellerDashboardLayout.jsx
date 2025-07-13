import { NavLink, Outlet } from 'react-router-dom';

const SellerDashboardLayout = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-red-800 text-white p-5 space-y-4">
        <h2 className="text-2xl font-bold mb-6">Seller Panel</h2>
        <nav className="flex flex-col space-y-2">
           <li>
            <NavLink
              to="/"
              className="block hover:text-blue-200 transition duration-200"
            >
              Home
            </NavLink>
          </li>
          <NavLink
            to="medicines"
            className={({ isActive }) =>
              isActive
                ? 'bg-white text-red-800 font-semibold px-4 py-2 rounded'
                : 'hover:bg-red-700 px-4 py-2 rounded transition'
            }
          >
            Manage Medicines
          </NavLink>
          <NavLink
            to="payments"
            className={({ isActive }) =>
              isActive
                ? 'bg-white text-red-800 font-semibold px-4 py-2 rounded'
                : 'hover:bg-red-700 px-4 py-2 rounded transition'
            }
          >
            Payment History
          </NavLink>
          <NavLink
            to="ads"
            className={({ isActive }) =>
              isActive
                ? 'bg-white text-red-800 font-semibold px-4 py-2 rounded'
                : 'hover:bg-red-700 px-4 py-2 rounded transition'
            }
          >
            Advertisement Requests
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export default SellerDashboardLayout;
