import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { userLogin } from '../api';
import { useAuth, useToast } from '../context/AppContext';

export default function UserLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const showToast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    try {
      const res = await userLogin(form);
      login(res.data.token, res.data.user);
      showToast('✅ Welcome back!');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-logo">Luccica</div>
        <div className="login-sub">Guest Portal</div>
        <h2>Welcome Back</h2>
        <p>Sign in to save your cart and track your orders.</p>
        {error && <div className="login-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            className="login-field"
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            className="login-field"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Signing In…' : 'Sign In'}
          </button>
        </form>
        <div className="login-footer-link">
          Are you staff? <Link to="/admin/login">Admin Login →</Link>
        </div>
      </div>
    </div>
  );
}
