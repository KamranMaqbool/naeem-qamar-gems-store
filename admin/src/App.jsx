import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AdminProvider } from './context/AdminContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import Products from './pages/Products/Products';
import AddProduct from './pages/Products/AddProduct';
import Orders from './pages/Orders/Orders';
import Inventory from './pages/Inventory/Inventory';
import Discounts from './pages/Discounts/Discounts';
import Settings from './pages/Settings/Settings';

function AppContent() {
  return (
    <Router>
      <AdminProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/add" element={<AddProduct />} />
            <Route path="/products/:id/edit" element={<AddProduct />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/discounts" element={<Discounts />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </AdminProvider>
    </Router>
  );
}

export default function App() {
  return <AppContent />;
}