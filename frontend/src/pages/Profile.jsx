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
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>👤 My Profile</h1>
        <button
          onClick={() => {
            logout();
            navigate('/');
            showToast('Logged out successfully');
          }}
          style={{
            padding: '0.6rem 1.2rem',
            background: '#c0392b',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
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

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid var(--border)', marginBottom: '2rem' }}>
        {['info', 'password', 'orders'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '1rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab ? '3px solid var(--primary)' : 'none',
              color: activeTab === tab ? 'var(--primary)' : 'var(--text)',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: activeTab === tab ? 'bold' : 'normal',
            }}
          >
            {tab === 'info' && '📋 Account Info'}
            {tab === 'password' && '🔑 Change Password'}
            {tab === 'orders' && '📦 Orders'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'info' && (
        <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '8px' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--muted)', fontWeight: 'bold' }}>
              Username
            </label>
            <p style={{ fontSize: '1.1rem', margin: 0 }}>{profile.username}</p>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--muted)', fontWeight: 'bold' }}>
              Email
            </label>
            <p style={{ fontSize: '1.1rem', margin: 0 }}>{profile.email}</p>
          </div>
        </div>
      )}

      {activeTab === 'password' && (
        <form onSubmit={handlePasswordChange} style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '8px' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Current Password
            </label>
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                fontSize: '1rem',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              New Password
            </label>
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                fontSize: '1rem',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Confirm Password
            </label>
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                fontSize: '1rem',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <button
            type="submit"
            disabled={passwordLoading}
            style={{
              padding: '0.75rem 2rem',
              background: 'var(--primary)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: passwordLoading ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
              opacity: passwordLoading ? 0.6 : 1,
            }}
          >
            {passwordLoading ? 'Updating...' : 'Change Password'}
          </button>
        </form>
      )}

      {activeTab === 'orders' && (
        <div>
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.3rem' }}>📍 Current Orders</h2>
            {currentOrders.length === 0 ? (
              <p style={{ color: 'var(--muted)' }}>No current orders</p>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {currentOrders.map((order) => (
                  <div key={order._id} style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <strong>Order #{order._id.slice(-6).toUpperCase()}</strong>
                      <span style={{
                        background: order.status === 'pending' ? '#e74c3c' : order.status === 'confirmed' ? '#f39c12' : order.status === 'preparing' ? '#e67e22' : order.status === 'ready' ? '#27ae60' : '#95a5a6',
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '4px',
                        fontSize: '0.85rem',
                        fontWeight: 'bold',
                        textTransform: 'capitalize',
                      }}>
                        {order.status}
                      </span>
                    </div>
                    <p style={{ margin: '0.5rem 0', fontSize: '0.9rem', color: 'var(--muted)' }}>
                      {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}
                    </p>
                    <p style={{ margin: '0.5rem 0' }}>
                      <strong>Total: ₹{order.total}</strong>
                    </p>
                    <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                      <strong>{order.items.length} items</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.3rem' }}>📋 Previous Orders</h2>
            {previousOrders.length === 0 ? (
              <p style={{ color: 'var(--muted)' }}>No previous orders</p>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {previousOrders.map((order) => (
                  <div key={order._id} style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)', opacity: 0.7 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <strong>Order #{order._id.slice(-6).toUpperCase()}</strong>
                      <span style={{
                        background: '#95a5a6',
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '4px',
                        fontSize: '0.85rem',
                        fontWeight: 'bold',
                        textTransform: 'capitalize',
                      }}>
                        {order.status}
                      </span>
                    </div>
                    <p style={{ margin: '0.5rem 0', fontSize: '0.9rem', color: 'var(--muted)' }}>
                      {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}
                    </p>
                    <p style={{ margin: '0.5rem 0' }}>
                      <strong>Total: ₹{order.total}</strong>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
