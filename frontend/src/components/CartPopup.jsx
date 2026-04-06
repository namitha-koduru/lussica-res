import { useCart, useToast } from '../context/AppContext';
import { checkout } from '../api';

export default function CartPopup() {
  const { cart, removeFromCart, clearCart, cartOpen, setCartOpen } = useCart();
  const showToast = useToast();
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    try {
      await checkout({ items: cart, total });
      clearCart();
      setCartOpen(false);
      showToast('✅ Order placed successfully!');
    } catch {
      showToast('❌ Checkout failed. Please try again.', 'error');
    }
  };

  if (!cartOpen) return null;

  return (
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
        <div className="cart-actions">
          <button className="popup-close" onClick={() => setCartOpen(false)}>Close</button>
          {cart.length > 0 && (
            <button className="main-btn" onClick={handleCheckout} style={{ flex: 1, textAlign: 'center' }}>
              Place Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
