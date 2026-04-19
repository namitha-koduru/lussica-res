import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer>
      <div className="footer-logo">Luccica 🍽️</div>
      <p className="footer-copy">© 2026 Luccica Restaurant · Premium Dining, Vijayawada</p>
      <div className="footer-links">
        <a href="#">Instagram</a>
        <Link to="/menu">Menu</Link>
        <a href="/#contact">Contact</a>
        <Link 
          to="/admin/login" 
          style={{ 
            fontSize: '0.6rem', 
            opacity: 0.4, 
            textDecoration: 'none',
            transition: 'opacity 0.3s'
          }}
          onMouseEnter={(e) => e.target.style.opacity = '1'}
          onMouseLeave={(e) => e.target.style.opacity = '0.4'}
          title="Staff Access"
        >
          ⚙️
        </Link>
      </div>
    </footer>
  );
}
