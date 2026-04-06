import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart, useAuth } from '../context/AppContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { cart, setCartOpen } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`topbar${scrolled ? ' scrolled' : ''}`}>
      <Link to="/" className="logo">
        Luccia<span>ca</span>
      </Link>
      <nav>
        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
        <NavLink to="/menu" className={({ isActive }) => isActive ? 'active' : ''}>Menu</NavLink>
        <a href="/#about">About</a>
        <a href="/#contact">Contact</a>
      </nav>
      <div className="top-actions">
        {user ? (
          <span style={{ fontSize: '0.72rem', color: 'var(--muted)', letterSpacing: '0.1em' }}>
            {user.email || user.username}
          </span>
        ) : (
          <button className="btn user-btn" onClick={() => navigate('/login')}>Sign In</button>
        )}
        <button className="btn admin-btn" onClick={() => navigate('/admin/login')}>Admin</button>
        <button className="btn cart-btn" onClick={() => setCartOpen(true)}>
          Cart <span>{cart.length}</span>
        </button>
      </div>
    </header>
  );
}
