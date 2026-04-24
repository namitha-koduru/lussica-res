import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart, useAuth } from '../context/AppContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { cart, setCartOpen } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className={scrolled ? 'topbar scrolled' : 'topbar'}>
      <Link to="/" className="logo">
        Lussi<span>ca</span>
      </Link>
      <nav>
        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
        <NavLink to="/menu" className={({ isActive }) => isActive ? 'active' : ''}>Menu</NavLink>
        <a href="/#about">About</a>
        <a href="/#contact">Contact</a>
      </nav>
      <div className="top-actions">
        {user?.email && user.role !== 'admin' && (
          <>
            <span style={{ fontSize: '0.72rem', color: 'var(--muted)', letterSpacing: '0.1em' }}>
              {user.email || user.username}
            </span>
            <button className="btn user-btn" onClick={() => navigate('/profile')} style={{ fontSize: '0.72rem' }}>
              Profile
            </button>
            <button className="btn user-btn" onClick={handleLogout} style={{ fontSize: '0.72rem' }}>
              Logout
            </button>
          </>
        )}
        {!user?.email && (
          <button className="btn user-btn" onClick={() => navigate('/login')} style={{ background: '#d4af37', color: 'black', fontWeight: 'bold', padding: '0.6rem 1.2rem', fontSize: '0.85rem', border: 'none', borderRadius: '4px', cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Sign In
          </button>
        )}
        <button className="btn cart-btn" onClick={() => setCartOpen(true)}>
          Cart <span>{cart.length}</span>
        </button>
      </div>
    </header>
  );
}
