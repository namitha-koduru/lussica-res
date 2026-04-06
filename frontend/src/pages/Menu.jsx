import { useState, useEffect, useRef } from 'react';
import { getMenu, submitFeedback } from '../api';
import { useCart, useToast } from '../context/AppContext';

const CATEGORIES = ['breakfast', 'lunch', 'dinner', 'soups', 'snacks', 'drinks'];

export default function Menu() {
  const [activeTab, setActiveTab] = useState('breakfast');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackText, setFeedbackText] = useState({});
  const { addToCart } = useCart();
  const showToast = useToast();
  const feedbackRefs = useRef({});

  useEffect(() => {
    fetchMenu(activeTab);
  }, [activeTab]);

  const fetchMenu = async (cat) => {
    setLoading(true);
    try {
      const res = await getMenu(cat);
      setItems(res.data);
    } catch {
      showToast('Failed to load menu', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (item) => {
    const msg = (feedbackText[item._id] || '').trim();
    if (!msg) { showToast('Please write a review first.', 'error'); return; }
    try {
      await submitFeedback({ itemId: item._id, itemName: item.name, message: msg });
      setFeedbackText((prev) => ({ ...prev, [item._id]: '' }));
      showToast('✅ Review sent — thank you!');
    } catch {
      showToast('Failed to submit review.', 'error');
    }
  };

  return (
    <>
      {/* ── MENU HERO ── */}
      <div className="menu-hero">
        <div className="menu-hero-inner">
          <span className="section-label">Our Offerings</span>
          <h1>The Menu</h1>
        </div>
        <div className="menu-tabs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={activeTab === cat ? 'active' : ''}
              onClick={() => setActiveTab(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* ── MENU GRID ── */}
      <section className="menu-section">
        {loading ? (
          <div className="loading-center">Loading menu…</div>
        ) : items.length === 0 ? (
          <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '3rem', letterSpacing: '0.06em' }}>
            No items available in this category.
          </p>
        ) : (
          <div className="menu-grid">
            {items.map((item) => (
              <div className="menu-card" key={item._id}>
                <h3>{item.name}</h3>
                <div className="price">₹{item.price}</div>
                <div className="rating">⭐ {item.rating?.toFixed(1) || '4.5'}</div>
                <textarea
                  className="feedback-area"
                  placeholder="Leave a review…"
                  value={feedbackText[item._id] || ''}
                  onChange={(e) =>
                    setFeedbackText((prev) => ({ ...prev, [item._id]: e.target.value }))
                  }
                />
                <div className="menu-card-actions">
                  <button className="btn-feedback" onClick={() => handleFeedback(item)}>
                    Send Review
                  </button>
                  <button className="btn-add" onClick={() => addToCart(item)}>
                    + Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
