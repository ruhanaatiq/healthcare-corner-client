import {
  createBrowserRouter
} from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home/Home";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Authentication/Login/Login";
import Register from "../pages/Authentication/Register/Register";
import CategoryCardContainer from "../pages/Home/Category/CategoryCardContainer";
import CategoryDetails from "../pages/Home/Category/CategoryDetails";
import CartPage from "../pages/Cart/CartPage";
import PrivateRoute from "../routes/PrivateRoute";
import CheckoutPage from "../pages/Checkout/Checkout";
import Invoice from "../pages/Invoice/Invoice";
import AdminUsers from "../pages/Dashboard/AdminDashboard/AdminUsers";
import AdminDashboard from "../pages/Dashboard/AdminDashboard/AdminDashboardLayout";
import AdminRoute from "../routes/AdminRoute";
import AdminOrders from "../pages/Dashboard/AdminDashboard/AdminOrders"
import Checkout from "../pages/Checkout/Checkout";
import Shop from "../pages/Home/Shop";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'category',
        element: <CategoryCardContainer />
      },
      {
        path: 'category/:categoryId',
        element: <CategoryDetails />
      },
      {
        path: 'cart',
        element: <CartPage />
      },
      {
  path: 'shop',
  element: <Shop/>
},
      {
        path: 'checkout',
        element: (
          <PrivateRoute>
            <Checkout />
          </PrivateRoute>
        )
      },
      {
        path: 'invoice',
        element: (
          <PrivateRoute>
            <Invoice />
          </PrivateRoute>
        )
      },
      {
        path: 'auth',
        element: <AuthLayout />,
        children: [
          {
            path: 'login',
            element: <Login />
          },
          {
            path: 'register',
            element: <Register />
          }
        ]
      },
      {
        path: 'admin',
        element: (
          <PrivateRoute>
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          </PrivateRoute>
        ),
        children: [
          {
            path: 'users',
            element: <AdminUsers />
          },
          {
            path: 'orders',
            element: <AdminOrders/>
          }
        ]
      }
    ]
  }
]);
