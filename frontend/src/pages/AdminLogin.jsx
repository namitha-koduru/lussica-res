import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../api';
import { useAuth, useToast } from '../context/AppContext';

export default function AdminLogin() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const showToast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.username || !form.password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    try {
      const res = await adminLogin(form);
      login(res.data.token, res.data.user);
      showToast('✅ Admin access granted');
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-logo">Luccica</div>
        <div className="login-sub">Admin Access</div>
        <h2>Staff Login</h2>
        <p>Restricted area. Authorised personnel only.</p>
        {error && <div className="login-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            className="login-field"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          <input
            className="login-field"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Verifying…' : 'Enter Admin Panel'}
          </button>
        </form>
        <div className="login-footer-link" style={{ marginTop: '1rem', fontSize: '0.72rem', color: 'var(--muted)' }}>
          Default: admin / admin123
        </div>
      </div>
    </div>
  );
}
