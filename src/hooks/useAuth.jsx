import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const useAuth = () => {
  const authInfo = useContext(AuthContext); // ✅ Correct
  return authInfo;
};

export default useAuth;
