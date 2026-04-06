import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminMenu, addMenuItem, toggleMenuItem, deleteMenuItem, getFeedbacks } from '../api';
import { useAuth, useToast } from '../context/AppContext';

const CATEGORIES = ['all', 'breakfast', 'lunch', 'dinner', 'soups', 'snacks', 'drinks'];

export default function AdminPanel() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const showToast = useToast();

  const [activeSection, setActiveSection] = useState('menu');
  const [filter, setFilter] = useState('all');
  const [items, setItems] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
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

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ivory)' }}>
      {/* Admin Topbar */}
      <header className="admin-topbar">
        <span className="logo">Luccia<span>ca</span></span>
        <span className="admin-badge">Admin Panel</span>
        <button className="admin-logout" onClick={handleLogout}>Logout</button>
      </header>

      <div className="admin-layout">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <div className="admin-sidebar-title">Navigation</div>
          {[
            { key: 'menu',     label: '🍽 Menu Management' },
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
