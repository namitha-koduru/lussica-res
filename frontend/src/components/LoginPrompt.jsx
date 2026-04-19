import { useNavigate } from 'react-router-dom';

export default function LoginPrompt({ isOpen, onClose }) {
  const navigate = useNavigate();

  const handleLogin = () => {
    onClose();
    navigate('/login');
  };

  if (!isOpen) return null;

  return (
    <div className="popup active" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="popup-box" style={{ maxWidth: '400px', textAlign: 'center' }}>
        <h2>Login Required</h2>
        <p style={{ color: 'var(--muted)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
          To place your order, please sign in to your account. Don't have an account? You can create one during login.
        </p>
        <div className="cart-actions">
          <button className="popup-close" onClick={onClose}>Cancel</button>
          <button className="main-btn" onClick={handleLogin} style={{ flex: 1, textAlign: 'center' }}>
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
