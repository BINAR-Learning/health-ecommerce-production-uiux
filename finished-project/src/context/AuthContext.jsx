import { createContext, useContext, useState, useEffect } from 'react';
import { isAuthenticated, getCurrentUser, logout as logoutService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getCurrentUser());
  const [isLoggedIn, setIsLoggedIn] = useState(() => isAuthenticated());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication status on mount
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      const userData = getCurrentUser();
      
      setIsLoggedIn(authenticated);
      setUser(userData);
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    setIsLoggedIn(true);
    
    // Trigger cart refresh after login
    window.dispatchEvent(new Event('auth-changed'));
  };

  const logout = () => {
    logoutService();
    setUser(null);
    setIsLoggedIn(false);
    
    // Clear cart on logout
    localStorage.removeItem('cart');
    
    // Trigger cart refresh after logout
    window.dispatchEvent(new Event('auth-changed'));
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user_data', JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        loading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

