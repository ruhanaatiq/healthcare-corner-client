import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home/Home";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Authentication/Login/Login";
import Register from "../pages/Authentication/Register/Register";
import CategoryCardContainer from "../pages/Home/Category/CategoryCardContainer";
import CategoryDetails from "../pages/Home/Category/CategoryDetails";
import CartPage from "../pages/Cart/CartPage";
import PrivateRoute from "../routes/PrivateRoute";
import Checkout from "../pages/Checkout/Checkout";
import Invoice from "../pages/Invoice/Invoice";
import Shop from "../pages/Home/Shop";
import AdminRoute from "../routes/AdminRoute";
import SellerRoute from "../routes/SellerRoute";
import Forbidden from "../pages/Forbidden/Forbidden";

import DashboardLayout from "../pages/Dashboard/DashboardLayout";

// 🧑‍⚕️ Admin Pages
import AdminDashboardLayout from "../pages/Dashboard/AdminDashboard/AdminDashboardLayout";
import AdminUsers from "../pages/Dashboard/AdminDashboard/AdminUsers";
import AdminOrders from "../pages/Dashboard/AdminDashboard/AdminOrders";
import AdminCategories from "../pages/Dashboard/AdminDashboard/AdminCategories";
import AdminPayments from "../pages/Dashboard/AdminDashboard/AdminPayments";
import AdminSalesReport from "../pages/Dashboard/AdminDashboard/AdminSalesReport";
import AdminBannerManagement from "../pages/Dashboard/AdminDashboard/AdminBannerManagement";

// 🛒 Seller Pages
import SellerDashboardLayout from "../pages/Dashboard/SellerDashboard/SellerDashboardLayout";
import SellerMedicines from "../pages/Dashboard/SellerDashboard/SellerMedicines";
import PaymentHistory from "../pages/Dashboard/SellerDashboard/PaymentHistory";
import AdvertisementRequests from "../pages/Dashboard/SellerDashboard/AdvertisementRequests";

// 👤 User Pages
import UserDashboardLayout from "../pages/Dashboard/UserDashboard/UserDashboardLayout";
import UserPaymentHistory from "../pages/Dashboard/UserDashboard/UserPaymentHistory";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'category', element: <CategoryCardContainer /> },
      { path: 'category/:categoryId', element: <CategoryDetails /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'shop', element: <Shop /> },
      {
        path: 'checkout',
        element: <PrivateRoute><Checkout /></PrivateRoute>
      },
      {
        path: 'invoice/:id',
        element: <PrivateRoute><Invoice /></PrivateRoute>
      },
      {
        path: 'auth',
        element: <AuthLayout />,
        children: [
          { path: 'login', element: <Login /> },
          { path: 'register', element: <Register /> }
        ]
      }
    ]
  },

  // Dashboard Route
  {
    path: '/dashboard',
    element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
  },
      // Admin Routes (inside dashboard/admin)
      {
        path: '/dashboard/admin',
        element: <AdminRoute><AdminDashboardLayout /></AdminRoute>,
        children: [
          { path: 'users', element: <AdminUsers /> },
          { path: 'orders', element: <AdminOrders /> },
          { path: 'categories', element: <AdminCategories /> },
          { path: 'payments', element: <AdminPayments /> },
          { path: 'sales-report', element: <AdminSalesReport /> },
          { path: 'banner-management', element: <AdminBannerManagement /> }
        ]
      },

      // Seller Routes (inside dashboard/seller)
      {
        path: '/dashboard/seller',
        element: <SellerRoute><SellerDashboardLayout /></SellerRoute>,
        children: [
          { path: 'medicines', element: <SellerMedicines /> },
          { path: 'payments', element: <PaymentHistory /> },
          { path: 'ads', element: <AdvertisementRequests /> }
        ]
      },

      // User Routes (default dashboard/*)
    {
  path: '/dashboard/payment-history',
  element: <PrivateRoute><UserDashboardLayout /></PrivateRoute>
},
    
  

  {
    path: 'forbidden',
    element: <Forbidden />
  }
]);
