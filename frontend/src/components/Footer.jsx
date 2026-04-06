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
      </div>
    </footer>
  );
}
