import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './router/router.jsx';
import AOS from 'aos';
import 'aos/dist/aos.css';
import AuthProvider from './contexts/AuthProvider.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

// ✅ Initialize react-query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2, // ✅ Auto retry failed fetches
      refetchOnWindowFocus: false, // ✅ Avoid unnecessary refetch
    },
  },
});

// ✅ AOS setup + App wrapper
function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
    return () => AOS.refresh(); // Optional cleanup
  }, []);

  return (
    <div className="max-w-7xl mx-auto bg-white">
      <Toaster position="top-right" />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />
        </AuthProvider>
      </QueryClientProvider>
    </div>
  );
}

// ✅ Render app
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
