import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth, useToast } from '../context/AppContext';

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const showToast = useToast();
  
  const [orderData, setOrderData] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    // Get order data from location state
    if (!location.state || !location.state.order) {
      navigate('/');
      return;
    }
    
    if (!user) {
      navigate('/login');
      return;
    }
    
    setOrderData(location.state.order);
  }, [location, user, navigate]);

  const handleConfirmOrder = async () => {
    if (!orderData) return;
    
    setConfirmLoading(true);
    try {
      // Simulate payment processing (no server call needed)
      await new Promise(resolve => setTimeout(resolve, 800));
      
      showToast('✅ Payment confirmed! Order placed successfully!');
      navigate('/profile');
    } catch (err) {
      console.error('Payment error:', err);
      showToast('Failed to confirm payment', 'error');
    } finally {
      setConfirmLoading(false);
    }
  };

  if (!orderData) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', minHeight: '100vh' }}>
        <p>Loading payment...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>💳 Payment</h1>

      {/* Order Summary */}
      <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid var(--border)' }}>
        <h2 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Order Summary</h2>
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ margin: '0.5rem 0', color: 'var(--muted)' }}>
            <strong>Order ID:</strong> #{orderData.orderId.slice(-6).toUpperCase()}
          </p>
          <p style={{ margin: '0.5rem 0', color: 'var(--muted)' }}>
            <strong>Items:</strong> {orderData.itemCount}
          </p>
          <p style={{ margin: '0.5rem 0', fontSize: '1.2rem' }}>
            <strong>Total: ₹{orderData.total}</strong>
          </p>
        </div>
      </div>

      {/* QR Code Placeholder */}
      <div style={{
        background: 'var(--bg-secondary)',
        padding: '2rem',
        borderRadius: '8px',
        marginBottom: '2rem',
        border: '1px solid var(--border)',
        textAlign: 'center',
        minHeight: '300px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <div style={{
          width: '200px',
          height: '200px',
          background: '#e0e0e0',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '1rem',
          border: '2px dashed #95a5a6',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📱</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--muted)', textAlign: 'center' }}>
            QR Code<br />Placeholder
          </div>
        </div>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', maxWidth: '400px', margin: '0' }}>
          Scan this QR code with your payment app to complete the transaction
        </p>
      </div>

      {/* Sample Project Message */}
      <div style={{
        background: 'rgba(52, 152, 219, 0.1)',
        border: '1px solid #3498db',
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '2rem',
        textAlign: 'center',
      }}>
        <p style={{ margin: '0.5rem 0', color: '#2980b9', fontWeight: 'bold' }}>
          ℹ️ This is a sample project
        </p>
        <p style={{ margin: '0.5rem 0', color: '#2980b9', fontSize: '0.9rem' }}>
          Just click "Place Order" to confirm your order. No actual payment processing.
        </p>
      </div>

      {/* Payment Method Info */}
      <div style={{
        background: 'var(--bg-secondary)',
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '2rem',
        border: '1px solid var(--border)',
      }}>
        <h3 style={{ marginBottom: '0.75rem' }}>Payment Methods</h3>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: 'var(--muted)', fontSize: '0.9rem' }}>
          <li>Google Pay</li>
          <li>PhonePe</li>
          <li>Paytm</li>
          <li>Card Payment</li>
          <li>UPI</li>
        </ul>
      </div>

      {/* Confirm Button */}
      <button
        onClick={handleConfirmOrder}
        disabled={confirmLoading}
        style={{
          width: '100%',
          padding: '1rem',
          background: 'var(--primary)',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: confirmLoading ? 'not-allowed' : 'pointer',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          opacity: confirmLoading ? 0.7 : 1,
          transition: 'all 0.3s ease',
        }}
      >
        {confirmLoading ? '⏳ Processing...' : '✅ Place Order'}
      </button>

      {/* Back to Menu */}
      <button
        onClick={() => navigate('/menu')}
        style={{
          width: '100%',
          padding: '0.75rem',
          background: 'transparent',
          color: 'var(--primary)',
          border: '1px solid var(--primary)',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '0.95rem',
          marginTop: '1rem',
          fontWeight: 'bold',
        }}
      >
        Continue Shopping
      </button>
    </div>
  );
}
