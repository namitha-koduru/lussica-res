import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userLogin, userSignup } from '../api';
import { useAuth, useToast } from '../context/AppContext';

export default function UserLogin() {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ email: '', username: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const showToast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!form.email || !form.password || (isSignup && !form.username)) { 
      setError('Please fill in all fields.'); 
      return; 
    }

    if (isSignup && form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (isSignup && form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const endpoint = isSignup ? userSignup : userLogin;
      const payload = isSignup 
        ? { email: form.email, username: form.username, password: form.password, confirmPassword: form.confirmPassword }
        : { email: form.email, password: form.password };
      
      const res = await endpoint(payload);
      login(res.data.token, res.data.user);
      showToast(isSignup ? '✅ Account created! Welcome!' : '✅ Welcome back!');
      navigate('/');
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      console.error('Auth error:', err);
      
      if (err.response?.status === 401) {
        setError('Invalid email or password. Please check and try again.');
      } else if (err.response?.status === 400) {
        setError(errorMsg || 'Invalid input. Please check your information.');
      } else if (err.code === 'ERR_NETWORK') {
        setError('Connection error. Make sure the server is running at http://localhost:5000');
      } else {
        setError(errorMsg || (isSignup ? 'Signup failed.' : 'Login failed.'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-logo">Luccica</div>
        <div className="login-sub">Guest Portal</div>
        <h2>{isSignup ? 'Create Account' : 'Welcome Back'}</h2>
        <p>{isSignup ? 'Sign up to save your cart and track orders.' : 'Sign in to save your cart and track your orders.'}</p>
        
        {error && <div className="login-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <input
            className="login-field"
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          {isSignup && (
            <input
              className="login-field"
              type="text"
              placeholder="Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          )}
          <input
            className="login-field"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          {isSignup && (
            <input
              className="login-field"
              type="password"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            />
          )}
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (isSignup ? 'Creating Account…' : 'Signing In…') : (isSignup ? 'Create Account' : 'Sign In')}
          </button>
        </form>
        
        <div className="login-footer-link">
          {isSignup ? 'Already have an account? ' : "Don't have an account? "}
          <button 
            onClick={() => {
              setIsSignup(!isSignup);
              setError('');
              setForm({ email: '', username: '', password: '', confirmPassword: '' });
            }}
            style={{ background: 'none', border: 'none', color: '#d4af37', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}
          >
            {isSignup ? 'Sign In' : 'Create One'}
          </button>
        </div>
      </div>
    </div>
  );
}
