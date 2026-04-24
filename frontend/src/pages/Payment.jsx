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
      <div style={{ 
        padding: '4rem 2rem', 
        textAlign: 'center', 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <p style={{ fontSize: '1.1rem', color: 'var(--muted)' }}>Loading payment...</p>
      </div>
    );
  }

  return (
    <div style={{ 
      background: 'linear-gradient(to bottom, var(--bg-primary), var(--bg-secondary))',
      minHeight: '100vh',
      padding: '3rem 2rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: '800px' }}>
        <div style={{ fontSize: '0.9rem', color: 'var(--primary)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem', fontWeight: 600 }}>
          Order Confirmation
        </div>
        <h1 style={{ fontSize: '3rem', margin: '0 0 1rem 0', fontFamily: 'Cormorant Garamond, serif', fontWeight: 300 }}>
          Complete Your<br /><span style={{ color: 'var(--primary)' }}>Order</span>
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--muted)', lineHeight: 1.6 }}>
          Review your order details below and confirm to proceed
        </p>
      </div>

      {/* Order Summary Card */}
      <div style={{ 
        background: 'var(--bg-secondary)', 
        border: '1px solid var(--border)',
        padding: '2rem', 
        borderRadius: '12px',
        maxWidth: '500px',
        width: '100%',
        marginBottom: '2rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
      }}>
        <h2 style={{ 
          fontSize: '1.3rem', 
          margin: '0 0 1.5rem 0',
          fontFamily: 'Cormorant Garamond, serif',
          fontWeight: 400
        }}>Order Summary</h2>
        
        <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--muted)' }}>Order ID</span>
            <span style={{ fontWeight: 600 }}>#{orderData.orderId.slice(-6).toUpperCase()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--muted)' }}>Items</span>
            <span style={{ fontWeight: 600 }}>{orderData.itemCount} {orderData.itemCount === 1 ? 'item' : 'items'}</span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.3rem', fontWeight: 600, margin: '1rem 0' }}>
          <span>Total Amount</span>
          <span style={{ color: 'var(--primary)' }}>₹{orderData.total}</span>
        </div>
      </div>

      {/* Payment Info */}
      <div style={{ 
        background: 'rgba(212, 175, 55, 0.08)', 
        border: '1px solid var(--primary)',
        padding: '1.5rem',
        borderRadius: '8px',
        maxWidth: '500px',
        width: '100%',
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        <p style={{ margin: 0, color: 'var(--text)', fontSize: '0.95rem' }}>
          <strong>Payment Methods:</strong> UPI, Card, Google Pay, PhonePe, Paytm
        </p>
      </div>

      {/* Action Buttons */}
      <div style={{ maxWidth: '500px', width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <button
          onClick={handleConfirmOrder}
          disabled={confirmLoading}
          style={{
            padding: '1rem',
            background: 'var(--primary)',
            color: 'var(--bg-primary)',
            border: 'none',
            borderRadius: '6px',
            cursor: confirmLoading ? 'not-allowed' : 'pointer',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            opacity: confirmLoading ? 0.7 : 1,
            transition: 'all 0.3s ease',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            boxShadow: confirmLoading ? 'none' : '0 4px 15px rgba(212, 175, 55, 0.3)',
            ':hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 20px rgba(212, 175, 55, 0.4)' }
          }}
        >
          {confirmLoading ? '⏳ Processing...' : '✅ Confirm & Place Order'}
        </button>

        <button
          onClick={() => navigate('/menu')}
          style={{
            padding: '0.9rem',
            background: 'transparent',
            color: 'var(--primary)',
            border: '2px solid var(--primary)',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          }}
        >
          ← Continue Shopping
        </button>
      </div>
    </div>
  );
}
