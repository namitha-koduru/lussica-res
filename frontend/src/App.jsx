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

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/menu" element={<Layout><Menu /></Layout>} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}
