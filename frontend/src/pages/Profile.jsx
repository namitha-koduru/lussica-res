import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useToast } from '../context/AppContext';
import { getUserProfile, changePassword, getUserOrders } from '../api';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const showToast = useToast();
  const pollingIntervalRef = useRef(null);
  
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('info'); // info, password, orders
  const [loading, setLoading] = useState(true);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    loadProfile();
    
    // Auto-refresh orders every 6 seconds when on orders tab
    const startPolling = () => {
      if (activeTab === 'orders') {
        pollingIntervalRef.current = setInterval(async () => {
          try {
            const ordersRes = await getUserOrders();
            setOrders(ordersRes.data);
          } catch (err) {
            console.error('Order refresh error:', err);
            // Silently fail - don't show errors for auto-refresh
          }
        }, 6000);
      }
    };
    
    startPolling();
    
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [user, navigate, activeTab]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const profileRes = await getUserProfile();
      setProfile(profileRes.data);
      
      // Use user's own orders endpoint instead of admin orders
      const ordersRes = await getUserOrders();
      setOrders(ordersRes.data);
    } catch (err) {
      console.error('Profile load error:', err);
      if (err.response?.status === 401) {
        // Token expired, logout
        logout();
        navigate('/login');
        showToast('Session expired. Please login again.', 'error');
      } else {
        showToast('Failed to load profile', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      showToast('All fields are required', 'error');
      return;
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    setPasswordLoading(true);
    try {
      await changePassword(passwordForm);
      showToast('✅ Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to change password';
      showToast(`❌ ${errorMsg}`, 'error');
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', minHeight: '100vh' }}>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', minHeight: '100vh' }}>
        <p>Failed to load profile</p>
      </div>
    );
  }

  const currentOrders = orders.filter(order => !['taken', 'cancelled'].includes(order.status));
  const previousOrders = orders.filter(order => ['taken', 'cancelled'].includes(order.status));

  return (
    <div style={{ background: 'linear-gradient(to bottom, var(--bg-primary), var(--bg-secondary))', minHeight: '100vh', paddingBottom: '2rem' }}>
      {/* Header */}
      <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', paddingTop: '3rem', paddingBottom: '2rem', marginBottom: '3rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.9rem', color: 'var(--primary)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 600 }}>
                Welcome Back
              </div>
              <h1 style={{ fontSize: '2.5rem', margin: '0', fontFamily: 'Cormorant Garamond, serif', fontWeight: 300 }}>
                {profile?.username || 'Account'}
              </h1>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/');
                showToast('Logged out successfully');
              }}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#c0392b',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                fontSize: '0.85rem',
                letterSpacing: '0.1em',
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '2rem', borderBottom: '2px solid var(--border)' }}>
          {['info', 'password', 'orders'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '1rem 0',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab ? '3px solid var(--primary)' : 'none',
                color: activeTab === tab ? 'var(--text)' : 'var(--muted)',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: activeTab === tab ? 600 : 400,
                transition: 'all 0.3s ease',
                marginBottom: '-2px',
              }}
            >
              {tab === 'info' && '📋 Account Info'}
              {tab === 'password' && '🔑 Security'}
              {tab === 'orders' && '📦 My Orders'}
            </button>
          ))}
        </div>
      </div>

      {/* Content Container */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
      {activeTab === 'info' && (
        <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontSize: '1.5rem', margin: '0 0 2rem 0', fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}>Your Account Details</h2>
          <div style={{ display: 'grid', gap: '2rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.75rem', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.1em' }}>
                Username
              </label>
              <p style={{ fontSize: '1.3rem', margin: 0, fontWeight: 500 }}>{profile.username}</p>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.75rem', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.1em' }}>
                Email Address
              </label>
              <p style={{ fontSize: '1.3rem', margin: 0, fontWeight: 500 }}>{profile.email}</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'password' && (
        <form onSubmit={handlePasswordChange} style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', maxWidth: '600px' }}>
          <h2 style={{ fontSize: '1.5rem', margin: '0 0 2rem 0', fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}>Change Your Password</h2>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.1em', color: 'var(--muted)' }}>
              Current Password
            </label>
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              style={{
                width: '100%',
                padding: '0.9rem 1rem',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                fontSize: '1rem',
                boxSizing: 'border-box',
                background: 'var(--bg-primary)',
                color: 'var(--text)',
              }}
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.1em', color: 'var(--muted)' }}>
              New Password
            </label>
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              style={{
                width: '100%',
                padding: '0.9rem 1rem',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                fontSize: '1rem',
                boxSizing: 'border-box',
                background: 'var(--bg-primary)',
                color: 'var(--text)',
              }}
            />
          </div>
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.1em', color: 'var(--muted)' }}>
              Confirm Password
            </label>
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              style={{
                width: '100%',
                padding: '0.9rem 1rem',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                fontSize: '1rem',
                boxSizing: 'border-box',
                background: 'var(--bg-primary)',
                color: 'var(--text)',
              }}
            />
          </div>
          <button
            type="submit"
            disabled={passwordLoading}
            style={{
              padding: '1rem 2rem',
              background: 'var(--primary)',
              color: 'var(--bg-primary)',
              border: 'none',
              borderRadius: '6px',
              cursor: passwordLoading ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
              opacity: passwordLoading ? 0.6 : 1,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              transition: 'all 0.3s ease',
            }}
          >
            {passwordLoading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      )}

      {activeTab === 'orders' && (
        <div>
          <div style={{ marginBottom: '3rem' }}>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}>📍 Active Orders</h2>
            {currentOrders.length === 0 ? (
              <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border)', textAlign: 'center' }}>
                <p style={{ color: 'var(--muted)', fontSize: '1rem' }}>No active orders at the moment</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                {currentOrders.map((order) => (
                  <div key={order._id} style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                      <div>
                        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Order ID</p>
                        <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600 }}>#{order._id.slice(-6).toUpperCase()}</p>
                      </div>
                      <span style={{
                        background: order.status === 'pending' ? '#e74c3c' : order.status === 'confirmed' ? '#f39c12' : order.status === 'preparing' ? '#e67e22' : order.status === 'ready' ? '#27ae60' : '#95a5a6',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        fontWeight: 'bold',
                        textTransform: 'capitalize',
                        whiteSpace: 'nowrap'
                      }}>
                        {order.status}
                      </span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                      <div>
                        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Items</p>
                        <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>{order.items.length}</p>
                      </div>
                      <div>
                        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Date</p>
                        <p style={{ margin: 0, fontSize: '0.95rem' }}>{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Amount</p>
                        <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: 'var(--primary)' }}>₹{order.total}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}>📋 Order History</h2>
            {previousOrders.length === 0 ? (
              <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border)', textAlign: 'center' }}>
                <p style={{ color: 'var(--muted)', fontSize: '1rem' }}>No previous orders</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                {previousOrders.map((order) => (
                  <div key={order._id} style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)', opacity: 0.8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                      <div>
                        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Order ID</p>
                        <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600 }}>#{order._id.slice(-6).toUpperCase()}</p>
                      </div>
                      <span style={{
                        background: '#95a5a6',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        fontWeight: 'bold',
                        textTransform: 'capitalize',
                      }}>
                        {order.status}
                      </span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                      <div>
                        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Items</p>
                        <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>{order.items.length}</p>
                      </div>
                      <div>
                        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Date</p>
                        <p style={{ margin: 0, fontSize: '0.95rem' }}>{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Amount</p>
                        <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>₹{order.total}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
