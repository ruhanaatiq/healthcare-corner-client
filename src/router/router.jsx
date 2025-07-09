import {
  createBrowserRouter,
} from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home/Home";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Authentication/Login/Login";
import Register from "../pages/Authentication/Register/Register";
import CategoryCardContainer from "../pages/Home/Category/CategoryCardContainer";
import CategoryDetails from "../pages/Home/Category/CategoryDetails";

// Define routes using React Router v6
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
        element: <CategoryCardContainer /> // ✅ Correct: now /category
      },
      {
        path: 'category/:categoryId',
        element: <CategoryDetails /> // ✅ Correct: now /category/:categoryId
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
      }
    ]
  }
]);

