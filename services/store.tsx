
import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { Product, CartItem, User, Order, Review } from '../types';
import { PRODUCTS as INITIAL_PRODUCTS } from './data';

// --- Cart Context ---
interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  shippingCharge: number;
  deliveryDate: string;
  couponCode: string | null;
  discount: number;
  applyCoupon: (code: string) => { success: boolean, message: string };
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState<string | null>(null);

  // Calculate delivery date once when the provider mounts
  const [deliveryDate] = useState(() => {
    return new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toDateString();
  });

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => {
    setCart([]);
    setCouponCode(null);
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // UPDATED SHIPPING LOGIC: Free if >= 2000, else 100
  const shippingCharge = cartTotal >= 2000 ? 0 : 100;

  // Coupon Logic
  const discount = useMemo(() => {
    if (!couponCode) return 0;
    if (couponCode === 'WELCOME50') return 50;
    if (couponCode === 'SJSM10') return Math.round(cartTotal * 0.10); // 10% off
    return 0;
  }, [cartTotal, couponCode]);

  const applyCoupon = (code: string) => {
    const normalizedCode = code.toUpperCase();
    if (normalizedCode === 'WELCOME50') {
        if (cartTotal < 500) return { success: false, message: 'Minimum order ₹500 required for this coupon.' };
        setCouponCode('WELCOME50');
        return { success: true, message: 'Coupon WELCOME50 applied! ₹50 off.' };
    }
    if (normalizedCode === 'SJSM10') {
        setCouponCode('SJSM10');
        return { success: true, message: 'Coupon SJSM10 applied! 10% off.' };
    }
    return { success: false, message: 'Invalid coupon code.' };
  };

  const removeCoupon = () => {
      setCouponCode(null);
  };

  return (
    <CartContext.Provider value={{ 
        cart, addToCart, removeFromCart, updateQuantity, clearCart, 
        cartTotal, cartCount, shippingCharge, deliveryDate,
        couponCode, discount, applyCoupon, removeCoupon 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};

// --- Auth Context ---
interface ExtendedUser extends User {
  password?: string;
  phone?: string;
}

interface AuthContextType {
  user: ExtendedUser | null;
  login: (email: string, password?: string) => boolean;
  register: (user: ExtendedUser) => boolean;
  logout: () => void;
  updateProfile: (updatedData: Partial<ExtendedUser>) => void;
  orders: Order[];
  addOrder: (order: Order) => void;
  products: Product[];
  addProductReview: (productId: number, review: Review) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  // Load active session
  useEffect(() => {
    const savedUser = localStorage.getItem('sjsm_active_user');
    if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        // Ensure we load the freshest data from sjsm_users to get updated points
        const usersStr = localStorage.getItem('sjsm_users');
        if (usersStr) {
            const users: ExtendedUser[] = JSON.parse(usersStr);
            const freshUserData = users.find(u => u.id === parsedUser.id);
            if (freshUserData) {
                setUser(freshUserData);
                return;
            }
        }
        setUser(parsedUser);
    }
  }, []);

  const login = (email: string, password?: string) => {
    const usersStr = localStorage.getItem('sjsm_users');
    const users: ExtendedUser[] = usersStr ? JSON.parse(usersStr) : [];
    
    const foundUser = users.find(u => u.email === email && (!password || u.password === password));
    
    if (foundUser) {
      // Ensure loyalty points exist
      const userWithPoints = { loyaltyPoints: 0, ...foundUser };
      setUser(userWithPoints);
      localStorage.setItem('sjsm_active_user', JSON.stringify(userWithPoints));
      return true;
    }
    return false;
  };

  const register = (newUser: ExtendedUser) => {
    const usersStr = localStorage.getItem('sjsm_users');
    const users: ExtendedUser[] = usersStr ? JSON.parse(usersStr) : [];
    
    if (users.find(u => u.email === newUser.email)) {
      return false; // User exists
    }

    const userWithId = { ...newUser, id: `u-${Date.now()}`, loyaltyPoints: 0 };
    const updatedUsers = [...users, userWithId];
    localStorage.setItem('sjsm_users', JSON.stringify(updatedUsers));
    
    // Auto login
    setUser(userWithId);
    localStorage.setItem('sjsm_active_user', JSON.stringify(userWithId));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sjsm_active_user');
  };

  const updateProfile = (updatedData: Partial<ExtendedUser>) => {
    if (!user) return;
    
    // Merge updates
    const updatedUser = { ...user, ...updatedData };
    
    // Update State
    setUser(updatedUser);
    
    // Update Active Session Storage
    localStorage.setItem('sjsm_active_user', JSON.stringify(updatedUser));
    
    // Update Persistent Database (sjsm_users)
    const usersStr = localStorage.getItem('sjsm_users');
    if (usersStr) {
        const users: ExtendedUser[] = JSON.parse(usersStr);
        const newUsers = users.map(u => u.id === user.id ? updatedUser : u);
        localStorage.setItem('sjsm_users', JSON.stringify(newUsers));
    }
  };

  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
  };

  const addProductReview = (productId: number, review: Review) => {
    setProducts(prev => prev.map(p => {
        if (p.id === productId) {
            const newReviews = [...(p.userReviews || []), review];
            // Recalculate rating
            const totalRating = newReviews.reduce((sum, r) => sum + r.rating, 0) + (p.rating * p.reviews);
            const totalCount = newReviews.length + p.reviews;
            return {
                ...p,
                userReviews: newReviews
            };
        }
        return p;
    }));
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, orders, addOrder, products, addProductReview }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
