import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminMenu, addMenuItem, toggleMenuItem, deleteMenuItem, getFeedbacks, getOrders, updateOrderStatus } from '../api';
import { useAuth, useToast } from '../context/AppContext';

const CATEGORIES = ['all', 'breakfast', 'lunch', 'dinner', 'soups', 'snacks', 'drinks'];

export default function AdminPanel() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const showToast = useToast();
  const pollingIntervalRef = useRef(null);

  const [activeSection, setActiveSection] = useState('menu');
  const [filter, setFilter] = useState('all');
  const [items, setItems] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', price: '', category: 'breakfast' });

  // Redirect if not admin
  useEffect(() => {
    if (!user || user.role !== 'admin') navigate('/admin/login');
  }, [user, navigate]);

  const fetchMenu = useCallback(async (cat) => {
    setLoading(true);
    try {
      const res = await getAdminMenu(cat);
      setItems(res.data);
    } catch {
      showToast('Failed to load menu', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const fetchFeedbacks = useCallback(async () => {
    try {
      const res = await getFeedbacks();
      setFeedbacks(res.data);
    } catch {
      showToast('Failed to load feedback', 'error');
    }
  }, [showToast]);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await getOrders();
      setOrders(res.data);
    } catch {
      showToast('Failed to load orders', 'error');
    }
  }, [showToast]);

  // Real-time polling for orders - increased to 8 seconds for better performance
  useEffect(() => {
    if (activeSection === 'orders') {
      fetchOrders(); // Fetch immediately
      
      // Set up polling every 8 seconds to reduce server load
      pollingIntervalRef.current = setInterval(() => {
        fetchOrders();
      }, 8000);
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [activeSection, fetchOrders]);

  useEffect(() => {
    if (activeSection === 'menu') fetchMenu(filter);
    if (activeSection === 'feedback') fetchFeedbacks();
  }, [activeSection, filter, fetchMenu, fetchFeedbacks]);

  const handleAdd = async () => {
    if (!form.name || !form.price) { showToast('Please enter name and price.', 'error'); return; }
    try {
      await addMenuItem({ name: form.name, price: Number(form.price), category: form.category });
      setForm({ name: '', price: '', category: form.category });
      fetchMenu(filter);
      showToast(`✅ "${form.name}" added to ${form.category}`);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to add item.', 'error');
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleMenuItem(id);
      fetchMenu(filter);
    } catch {
      showToast('Failed to toggle item.', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMenuItem(id);
      fetchMenu(filter);
      showToast('Item deleted.');
    } catch {
      showToast('Failed to delete item.', 'error');
    }
  };

  const handleUpdateOrderStatus = async (id, status) => {
    try {
      console.log('🔄 Updating order', id, 'to status:', status);
      const response = await updateOrderStatus(id, status);
      console.log('✅ Order updated:', response.data);
      
      // Update local state immediately for instant UI feedback
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === id ? { ...order, status } : order
        )
      );
      
      // Then fetch fresh data from server
      setTimeout(() => fetchOrders(), 300);
      showToast(`✅ Order status updated to ${status}`);
    } catch (err) {
      console.error('❌ Update error:', err.response?.data || err.message);
      showToast(err.response?.data?.message || 'Failed to update order status.', 'error');
      // Refresh to get server state if update failed
      fetchOrders();
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ivory)' }}>
      {/* Admin Topbar */}
      <header className="admin-topbar">
        <span className="logo">Lussi<span>ca</span></span>
        <span className="admin-badge">Admin Panel</span>
        <button className="admin-logout" onClick={handleLogout}>Logout</button>
      </header>

      <div className="admin-layout">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <div className="admin-sidebar-title">Navigation</div>
          {[
            { key: 'menu',     label: '🍽 Menu Management' },
            { key: 'orders',   label: '📦 Order Management' },
            { key: 'feedback', label: '💬 Customer Feedback' },
          ].map((s) => (
            <button
              key={s.key}
              className={`admin-nav-item${activeSection === s.key ? ' active' : ''}`}
              onClick={() => setActiveSection(s.key)}
            >
              {s.label}
            </button>
          ))}
        </aside>

        {/* Main Content */}
        <main className="admin-main">
          {activeSection === 'menu' && (
            <>
              <div className="admin-section-title">Menu Management</div>
              <div className="admin-section-sub">Add, enable or disable menu items.</div>

              {/* Add Form */}
              <div className="admin-add-form">
                <div>
                  <label>Item Name</label>
                  <input className="admin-input" placeholder="e.g. Paneer Tikka" value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label>Price (₹)</label>
                  <input className="admin-input" type="number" placeholder="e.g. 180" value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })} />
                </div>
                <div>
                  <label>Category</label>
                  <select className="admin-input" value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.filter(c => c !== 'all').map((c) => (
                      <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <button className="admin-add-btn" onClick={handleAdd}>+ Add Item</button>
              </div>

              {/* Filter Tabs */}
              <div className="admin-tab-bar">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    className={`admin-tab${filter === cat ? ' active' : ''}`}
                    onClick={() => setFilter(cat)}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>

              {/* Menu Grid */}
              {loading ? (
                <div className="loading-center">Loading…</div>
              ) : items.length === 0 ? (
                <p style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>No items found.</p>
              ) : (
                <div className="admin-grid">
                  {items.map((item) => (
                    <div className="admin-card" key={item._id}>
                      <h3>{item.name}</h3>
                      <div className="a-price">₹{item.price}</div>
                      <div className="a-cat">{item.category.toUpperCase()}</div>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button
                          className={`toggle-btn ${item.active ? 'enabled' : 'disabled'}`}
                          onClick={() => handleToggle(item._id)}
                        >
                          {item.active ? '● Active' : '○ Disabled'}
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          style={{
                            background: 'none', border: '1px solid rgba(192,57,43,0.2)',
                            color: '#c0392b', fontSize: '0.65rem', letterSpacing: '0.12em',
                            textTransform: 'uppercase', padding: '0.45rem 0.9rem', cursor: 'pointer',
                            fontFamily: 'var(--sans)', transition: 'all 0.2s'
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeSection === 'orders' && (
            <>
              <div className="admin-section-title">Order Management</div>
              <div className="admin-section-sub">View and manage customer orders.</div>
              {loading ? (
                <div className="loading-center">Loading…</div>
              ) : orders.length === 0 ? (
                <p style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>No orders yet.</p>
              ) : (
                <div className="orders-grid">
                  {orders.map((order) => (
                    <div className="order-card" key={order._id}>
                      <div className="order-header">
                        <div className="order-id">Order #{order._id.slice(-6)}</div>
                        <div className="order-time">{new Date(order.createdAt).toLocaleString()}</div>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                        <strong>Customer:</strong> {order.user || 'Guest'}
                      </div>
                      <div className="order-items">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="order-item">
                            <span>{item.name} x{item.quantity}</span>
                            <span>₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>
                      <div className="order-total">Total: ₹{order.total}</div>
                      <div className="order-status">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                          className="status-select"
                        >
                          <option value="pending">🔄 Pending</option>
                          <option value="confirmed">✅ Accept</option>
                          <option value="preparing">👨‍🍳 Preparing</option>
                          <option value="ready">🍽️ Ready</option>
                          <option value="taken">📦 Order Taken</option>
                          <option value="cancelled">❌ Cancelled</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeSection === 'feedback' && (
            <>
              <div className="admin-section-title">Customer Feedback</div>
              <div className="admin-section-sub">All reviews submitted by customers.</div>
              {feedbacks.length === 0 ? (
                <p style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>No customer feedback yet.</p>
              ) : (
                <div className="feedback-grid">
                  {feedbacks.map((f) => (
                    <div className="feedback-card" key={f._id}>
                      <div className="fb-item">{f.itemName}</div>
                      <div className="fb-msg">"{f.message}"</div>
                      <div className="fb-time">{new Date(f.createdAt).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
