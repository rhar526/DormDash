import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import { CartProvider } from './components/CartContext';
import HomePage from './components/HomePage';
import OrderPage from './components/OrderPage';
import CheckoutPage from './components/CheckoutPage';
import OrderStatusPage from './components/OrderStatusPage';
import DasherConfirmPage from './components/DasherConfirmPage';


function App() {

  return (
     <Router>
      <CartProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/status" element={<OrderStatusPage />} />
          <Route path="/dasher/confirm/:orderId" element={<DasherConfirmPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </CartProvider>
    </Router>
  )
}

export default App
