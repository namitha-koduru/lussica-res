import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import CartPopup from './components/CartPopup';
import Footer from './components/Footer';
import Home from './pages/Home';
import Menu from './pages/Menu';
import UserLogin from './pages/UserLogin';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';
import Profile from './pages/Profile';
import Payment from './pages/Payment';
import axios from 'axios';

function Layout({ children, showFooter = true }) {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 0 }}>{children}</main>
      {showFooter && <Footer />}
      <CartPopup />
    </>
  );
}

function BackendWarning() {
  const [backendDown, setBackendDown] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let isActive = true;
    const apiUrl = process.env.REACT_APP_API_URL;

    if (!apiUrl) {
      console.warn('⚠️ REACT_APP_API_URL not configured');
      if (isActive) setBackendDown(true);
      return;
    }

    // Delay initial check by 1.5s to allow cold start
    const initialDelay = setTimeout(() => {
      checkBackendHealth(apiUrl, isActive, 0);
    }, 1500);

    return () => {
      isActive = false;
      clearTimeout(initialDelay);
    };
  }, []);

  const checkBackendHealth = async (apiUrl, isActive, attempt) => {
    try {
      await axios.get(`${apiUrl}/api/health`, { timeout: 8000 });
      if (isActive) setBackendDown(false);
    } catch (error) {
      if (!isActive) return;

      const isNetworkError = !error.response;
      const shouldRetry = attempt < 2 && (isNetworkError || error.code === 'ECONNABORTED');

      if (shouldRetry) {
        const delay = 2000 * (attempt + 1);
        setRetryCount(attempt + 1);
        setTimeout(() => {
          checkBackendHealth(apiUrl, isActive, attempt + 1);
        }, delay);
      } else {
        console.error('❌ Backend health check failed:', error.message);
        if (isActive) setBackendDown(true);
      }
    }
  };

  if (backendDown === false || backendDown === null) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '70px',
      left: 0,
      right: 0,
      background: '#c0392b',
      color: 'white',
      padding: '1rem',
      textAlign: 'center',
      fontSize: '0.9rem',
      zIndex: 999
    }}>
      {retryCount > 0 
        ? `⏳ Connecting to server (attempt ${retryCount + 1})...`
        : `⚠️ Backend server offline. Verifying connection...`}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AppProvider>
        <BackendWarning />
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/menu" element={<Layout><Menu /></Layout>} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/profile" element={<Layout><Profile /></Layout>} />
          <Route path="/payment" element={<Layout><Payment /></Layout>} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}
