import { createContext, useContext } from 'react';

// Create the authentication context
export const AuthContext = createContext();

// Create a custom hook to access the AuthContext
export const useAuth = () => {
  return useContext(AuthContext); // Use the context to get the current user and authentication functions
};
