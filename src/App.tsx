import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import BuyerDashboard from './pages/Buyer/BuyerDashboard';
import SellerDashboard from './pages/Seller/SellerDashboard';
import Layout from './components/Layout';
import type { User } from './types';
import ProductDetail from './pages/Buyer/ProductDetail';
import PaymentPage from './pages/Buyer/PaymentPage';

export default function App() {
  const userString = localStorage.getItem('user');
  const user: User | null = userString ? JSON.parse(userString) : null;

  const userRole = user?.profile?.role?.toUpperCase();

  return (
    <Router>
      <Routes>
        {/* หน้า Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* หน้าที่ต้องมี Navbar (ครอบด้วย Layout) */}
        <Route element={<Layout />}>
          
          {/* แทนที่จะซ่อน Route เราให้มันมีอยู่เสมอ แต่ถ้าเข้ามาผิด Role ให้เด้งกลับ */}
          <Route 
            path="/seller" 
            element={userRole === 'SELLER' ? <SellerDashboard /> : <Navigate to="/" replace />} 
          />
          
          <Route 
            path="/buyer" 
            element={userRole === 'BUYER' ? <BuyerDashboard /> : <Navigate to="/" replace />} 
          />
          <Route 
            path="/buyer/product/:id" 
            element={userRole === 'BUYER' ? <ProductDetail /> : <Navigate to="/" replace />} 
          />
          <Route 
            path="/buyer/payment" 
            element={userRole === 'BUYER' ? <PaymentPage /> : <Navigate to="/" replace />} 
          />
          
          {/* Route ครอบจักรวาล (Catch-all) ถ้าเข้าหน้าแรก หรือพิมพ์ URL ผิด ให้พาไปที่ถูกให้ */}
          <Route 
            path="*" 
            element={
              userRole === 'SELLER' ? <Navigate to="/seller" replace /> :
              userRole === 'BUYER' ? <Navigate to="/buyer" replace /> :
              <Navigate to="/login" replace />
            } 
          />
          
        </Route>
      </Routes>
    </Router>
  );
}