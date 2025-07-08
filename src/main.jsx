import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from "react-router";
import { router } from './router/router.jsx';
import AOS from 'aos';
import 'aos/dist/aos.css';
import AuthProvider from './contexts/AuthProvider.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Initialize QueryClient before the App function
const queryClient = new QueryClient();

// Initialize AOS animation library
function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Optional: animation duration in ms
      once: true,     // Optional: animation happens only once
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
