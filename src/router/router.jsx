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
    element: <MainLayout />, // Main layout for the app
    children: [
      {
        index: true,
        element: <Home /> // Home page route
      },
      {
        path: '/auth', // Base path for authentication
        element: <AuthLayout />, 
        children: [
          {
            path: 'login', // Login route
            element: <Login />
          },
          {
            path: 'register', // Register route
            element: <Register />
          },
          // Adjust these to be relative to /auth
          {
            path: 'category', // Now /auth/category
            element: <CategoryCardContainer /> // Display all categories
          },
          {
            path: 'category/:categoryId', // Now /auth/category/:categoryId
            element: <CategoryDetails /> // Display medicines for a specific category
          },
        ]
      }
    ]
  }
]);
