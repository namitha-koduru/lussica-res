import { createContext, useContext, useState, useCallback } from 'react';

// ── Toast Context ──────────────────────────────────────────
const ToastContext = createContext(null);
export const useToast = () => useContext(ToastContext);

// ── Cart Context ───────────────────────────────────────────
const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

// ── Auth Context ───────────────────────────────────────────
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

// ── Combined Provider ──────────────────────────────────────
export function AppProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('luccica_user')); } catch { return null; }
  });

  const showToast = useCallback((msg, type = 'default') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, []);

  const addToCart = useCallback((item) => {
    setCart((prev) => [...prev, item]);
    showToast(`🛒 ${item.name} added to cart`);
  }, [showToast]);

  const removeFromCart = useCallback((idx) => {
    setCart((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const login = useCallback((token, userData) => {
    localStorage.setItem('luccica_token', token);
    localStorage.setItem('luccica_user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('luccica_token');
    localStorage.removeItem('luccica_user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartOpen, setCartOpen }}>
        <ToastContext.Provider value={showToast}>
          {children}
          {/* Toast Container */}
          {toasts.map((t) => (
            <div
              key={t.id}
              className="toast"
              style={t.type === 'error' ? { borderLeftColor: '#c0392b' } : {}}
            >
              {t.msg}
            </div>
          ))}
        </ToastContext.Provider>
      </CartContext.Provider>
    </AuthContext.Provider>
  );
}
