import { useState } from 'react';
import { Link } from 'react-router-dom';
import { submitContact } from '../api';
import { useToast } from '../context/AppContext';

const TICKER_ITEMS = [
  'Dum Chicken Biryani','Paneer Tikka','Craft Milkshakes',
  'Seafood Specialities','Artisan Pizzas','Dessert Platters',
  'Masala Dosa','Butter Chicken',
];

export default function Home() {
  const showToast = useToast();
  const [contact, setContact] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleContact = async (e) => {
    e.preventDefault();
    if (!contact.name || !contact.email || !contact.message) {
      showToast('Please fill in all fields.', 'error');
      return;
    }
    setSending(true);
    try {
      await submitContact(contact);
      showToast('✅ Message sent — we will be in touch!');
      setContact({ name: '', email: '', message: '' });
    } catch {
      showToast('❌ Failed to send message. Please try again.', 'error');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-left">
          <div className="hero-eyebrow">Est. 2020 &nbsp;·&nbsp; Vijayawada, A.P.</div>
          <h1>Dining as <em>Art,</em><br />Delivered.</h1>
          <p className="hero-sub">
            Where culinary craft meets digital elegance — premium flavours, luxury ambience, seamlessly online.
          </p>
          <div className="hero-cta-group">
            <Link to="/menu" className="main-btn">Explore Menu</Link>
            <a href="#about" className="ghost-btn">Our Story</a>
          </div>
        </div>
        <div className="hero-right">
          <img
            src="/assets/food1.jpg"
            alt="Signature dish"
            className="hero-img-main"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div className="hero-right-fallback">
            <span style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: '6rem', color: 'rgba(255,255,255,0.06)', fontWeight: 300 }}>
              Luccica
            </span>
          </div>
          <div className="hero-badge">
            <div className="badge-num">120+</div>
            <div className="badge-label">Dishes on Menu</div>
          </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i}>
              <span className="ticker-item">{item}</span>
              <span className="ticker-sep" />
            </span>
          ))}
        </div>
      </div>

      {/* ── SPECIALS ── */}
      <section className="specials">
        <div className="section-header">
          <div>
            <div className="section-label">Chef's Picks</div>
            <h2 className="section-title">Our Signature<br />Specials</h2>
          </div>
          <Link to="/menu" className="section-link">View Full Menu →</Link>
        </div>
        <div className="card-grid">
          {[
            { src: '/assets/food1.jpg', tag: 'House Specialty', name: 'Dum Chicken Biryani', fallback: 'linear-gradient(135deg,#8b5e2a,#3d2010)' },
            { src: '/assets/food2.jpg', tag: 'Wood Fired',      name: 'Artisan Pizza',       fallback: 'linear-gradient(135deg,#c9512a,#6b2510)' },
            { src: '/assets/food3.jpg', tag: 'Signature Sip',   name: 'Craft Milkshake',     fallback: 'linear-gradient(135deg,#c9a84c,#7a5a1a)' },
          ].map((card) => (
            <div className="food-card" key={card.name}>
              <img
                src={card.src}
                alt={card.name}
                onError={(e) => { e.target.style.background = card.fallback; e.target.src = ''; }}
              />
              <div className="food-card-info">
                <div className="food-tag">{card.tag}</div>
                <h3>{card.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="about">
        <div className="about-visual">
          <img src="/assets/culture1.jpg" alt="Restaurant ambience" onError={(e) => { e.target.style.display='none'; }} />
          <div className="about-grid-overlay" />
          <div className="about-watermark">L</div>
        </div>
        <div className="about-content">
          <div className="section-label">Our Story</div>
          <h2 className="section-title">A Passion for<br />Flavour &amp; Form</h2>
          <p>
            Luccica was born from a simple belief — extraordinary food deserves an equally extraordinary experience.
            We blend centuries-old recipes with modern culinary craft, served in an ambience that honours every meal as an occasion.
          </p>
          <div className="about-stats">
            <div><div className="stat-num">6+</div><div className="stat-label">Years of Excellence</div></div>
            <div><div className="stat-num">50k+</div><div className="stat-label">Happy Diners</div></div>
            <div><div className="stat-num">4.8★</div><div className="stat-label">Avg Rating</div></div>
          </div>
        </div>
      </section>

      {/* ── CULTURE ── */}
      <section className="culture">
        <div className="culture-text">
          <div className="section-label">Experience</div>
          <h2 className="section-title light">Where Luxury<br />Meets Comfort</h2>
          <p>Every detail at Luccica is considered — from hand-selected produce to the warm glow of our dining room. We believe dining is ceremony.</p>
        </div>
        <div className="culture-img-wrap">
          <img
            src="/assets/culture1.jpg"
            alt="Luccica culture"
            className="culture-img"
            onError={(e) => { e.target.style.background='linear-gradient(160deg,#2a2520,#1a1a18)'; e.target.removeAttribute('src'); }}
          />
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="contact-section">
        <div>
          <div className="section-label">Reach Us</div>
          <h2 className="section-title" style={{ marginBottom: '2.5rem' }}>Get In Touch</h2>
          {[
            { icon: '📍', label: 'Location',  value: 'Vijayawada, Andhra Pradesh' },
            { icon: '📞', label: 'Phone',     value: '+91 98765 43210' },
            { icon: '✉️', label: 'Email',     value: 'luccicarestaurant@gmail.com' },
            { icon: '🕐', label: 'Hours',     value: 'Daily · 11:00 AM – 11:00 PM' },
          ].map((c) => (
            <div className="contact-item" key={c.label}>
              <div className="contact-icon">{c.icon}</div>
              <div>
                <div className="contact-label">{c.label}</div>
                <div className="contact-value">{c.value}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="contact-form-wrap">
          <h3>Send a Message</h3>
          <form onSubmit={handleContact}>
            <input className="form-input" placeholder="Your Name" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} />
            <input className="form-input" type="email" placeholder="Email Address" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} />
            <textarea className="form-input" placeholder="Your message…" value={contact.message} onChange={(e) => setContact({ ...contact, message: e.target.value })} />
            <button type="submit" className="submit-btn" disabled={sending}>
              {sending ? 'Sending…' : 'Send Message'}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
