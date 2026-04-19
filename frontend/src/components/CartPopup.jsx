import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart, useToast, useAuth } from '../context/AppContext';
import LoginPrompt from './LoginPrompt';
import { checkout } from '../api';

export default function CartPopup() {
  const { cart, removeFromCart, clearCart, cartOpen, setCartOpen } = useCart();
  const { user } = useAuth();
  const showToast = useToast();
  const navigate = useNavigate();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }

    setCheckoutLoading(true);
    try {
      const res = await checkout({ items: cart, total });
      showToast('✅ Proceeding to payment...');
      setCartOpen(false);
      clearCart();
      
      // Redirect to payment page with order data
      navigate('/payment', {
        state: {
          order: {
            orderId: res.data.orderId,
            total: res.data.total,
            itemCount: res.data.itemCount,
          }
        }
      });
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Checkout failed';
      console.error('Checkout error:', err);
      showToast(`❌ ${errorMsg}`, 'error');
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (!cartOpen) return null;

  return (
    <>
      <div className="popup active" onClick={(e) => { if (e.target === e.currentTarget) setCartOpen(false); }}>
        <div className="popup-box">
          <h2>Your Cart</h2>
          <ul className="cart-list">
            {cart.length === 0 ? (
              <li style={{ justifyContent: 'center', color: 'var(--muted)' }}>Your cart is empty</li>
            ) : (
              cart.map((item, idx) => (
                <li key={idx}>
                  <span>{item.name}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    ₹{item.price}
                    <button
                      onClick={() => removeFromCart(idx)}
                      style={{ background: 'none', border: 'none', color: '#c0392b', cursor: 'pointer', fontSize: '1rem' }}
                    >×</button>
                  </span>
                </li>
              ))
            )}
          </ul>
          {cart.length > 0 && (
            <div className="cart-total">
              Grand Total: <strong>₹{total}</strong>
            </div>
          )}
          {cart.length > 0 && !user && (
            <div style={{ 
              background: 'rgba(212, 175, 55, 0.1)', 
              padding: '0.75rem', 
              borderRadius: '4px', 
              fontSize: '0.85rem', 
              color: 'var(--muted)',
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              💡 Sign in to place your order
            </div>
          )}
          <div className="cart-actions">
            <button className="popup-close" onClick={() => setCartOpen(false)}>Close</button>
            {cart.length > 0 && (
              <button 
                className="main-btn" 
                onClick={handleCheckout} 
                disabled={checkoutLoading}
                style={{ flex: 1, textAlign: 'center' }}
              >
                {checkoutLoading ? 'Processing…' : 'Place Order'}
              </button>
            )}
          </div>
        </div>
      </div>
      <LoginPrompt isOpen={showLoginPrompt} onClose={() => setShowLoginPrompt(false)} />
    </>
  );
}
