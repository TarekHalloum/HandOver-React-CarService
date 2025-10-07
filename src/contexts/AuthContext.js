import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userType, setUserType] = useState('guest'); // ✅ default is 'guest'

  useEffect(() => {
    const storedType = localStorage.getItem('userType');
    if (storedType === 'user' || storedType === 'repairer') {
      setUserType(storedType);
    } else {
      setUserType('guest');
    }
  }, []);

  const login = (type) => {
    if (type === 'user' || type === 'repairer') {
      setUserType(type);
      localStorage.setItem('userType', type);
    } else {
      console.warn('Unknown login type:', type);
    }
  };

  const logout = () => {
    setUserType('guest');
    localStorage.removeItem('userType');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ userType, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
