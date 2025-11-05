import { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../services/api';
import { isAuthenticated } from '../services/authService';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch cart from backend if authenticated
  useEffect(() => {
    const fetchCart = async () => {
      if (isAuthenticated()) {
        try {
          setLoading(true);
          const response = await apiClient.get('/api/cart');
          if (response.data.success) {
            setCart(response.data.data || []);
          }
        } catch (error) {
          console.error('Failed to fetch cart:', error);
          // If fetch fails, clear cart
          setCart([]);
        } finally {
          setLoading(false);
        }
      } else {
        // Not authenticated - use localStorage
        const saved = localStorage.getItem('cart');
        setCart(saved ? JSON.parse(saved) : []);
      }
    };

    fetchCart();

    // Listen for auth changes (login/logout)
    const handleAuthChange = () => {
      fetchCart();
    };

    window.addEventListener('auth-changed', handleAuthChange);
    
    return () => {
      window.removeEventListener('auth-changed', handleAuthChange);
    };
  }, []); // Run once on mount

  // Save to localStorage for non-authenticated users
  useEffect(() => {
    if (!isAuthenticated()) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = async (product) => {
    if (isAuthenticated()) {
      // Authenticated - use backend API
      try {
        const response = await apiClient.post('/api/cart', {
          productId: product._id,
          quantity: 1,
        });

        if (response.data.success) {
          // Refresh cart from backend
          const cartResponse = await apiClient.get('/api/cart');
          if (cartResponse.data.success) {
            setCart(cartResponse.data.data || []);
          }
        }
      } catch (error) {
        console.error('Failed to add to cart:', error);
        throw error;
      }
    } else {
      // Not authenticated - use localStorage
      setCart((prevCart) => {
        const existingItem = prevCart.find((item) => item._id === product._id);
        
        if (existingItem) {
          return prevCart.map((item) =>
            item._id === product._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        
        return [...prevCart, { ...product, quantity: 1 }];
      });
    }
  };

  const removeFromCart = async (productId) => {
    if (isAuthenticated()) {
      // Backend API
      try {
        await apiClient.delete(`/api/cart/${productId}`);
        setCart((prevCart) => prevCart.filter((item) => item._id !== productId));
      } catch (error) {
        console.error('Failed to remove from cart:', error);
        throw error;
      }
    } else {
      // LocalStorage
      setCart((prevCart) => prevCart.filter((item) => item._id !== productId));
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    if (isAuthenticated()) {
      // Backend API
      try {
        await apiClient.put(`/api/cart/${productId}`, { quantity });
        setCart((prevCart) =>
          prevCart.map((item) =>
            item._id === productId ? { ...item, quantity } : item
          )
        );
      } catch (error) {
        console.error('Failed to update quantity:', error);
        throw error;
      }
    } else {
      // LocalStorage
      setCart((prevCart) =>
        prevCart.map((item) =>
          item._id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = async () => {
    if (isAuthenticated()) {
      // Backend API
      try {
        await apiClient.delete('/api/cart');
        setCart([]);
      } catch (error) {
        console.error('Failed to clear cart:', error);
        // Clear locally anyway
        setCart([]);
      }
    } else {
      // LocalStorage
      setCart([]);
      localStorage.removeItem('cart');
    }
  };

  const refreshCart = async () => {
    if (isAuthenticated()) {
      try {
        const response = await apiClient.get('/api/cart');
        if (response.data.success) {
          setCart(response.data.data || []);
        }
      } catch (error) {
        console.error('Failed to refresh cart:', error);
      }
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.price || 0;
      const quantity = item.quantity || 1;
      return total + (price * quantity);
    }, 0);
  };

  const getCartCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        refreshCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

