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
  const [backendDown, setBackendDown] = useState(false);

  useEffect(() => {
    axios.get(process.env.REACT_APP_API_URL + '/api/health', { timeout: 3000 })
      .catch(() => setBackendDown(true));
  }, []);

  if (!backendDown) return null;

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
      ⚠️ Backend server not running. Please start backend: <code>cd backend && npm start</code>
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
