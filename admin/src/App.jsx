import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AdminProvider } from './context/AdminContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import Products from './pages/Products/Products';
import AddProduct from './pages/Products/AddProduct';
import Orders from './pages/Orders/Orders';
import OrderDetail from './pages/Orders/OrderDetail';
import AddOrder from './pages/Orders/AddOrder';
import Inventory from './pages/Inventory/Inventory';
import ReceiveStock from './pages/Inventory/ReceiveStock';
import Discounts from './pages/Discounts/Discounts';
import Settings from './pages/Settings/Settings';
import Profile from './pages/Profile/Profile';
import Customers from './pages/Customers/Customers';
import Analytics from './pages/Analytics/Analytics';
import SignIn from './pages/Auth/SignIn';
import ProtectedRoute from './components/auth/ProtectedRoute';

function AppContent() {
  return (
    <Router>
      <AdminProvider>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/add" element={<AddProduct />} />
              <Route path="/products/:id/edit" element={<AddProduct />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/orders/new" element={<AddOrder />} />
              <Route path="/orders/:id" element={<OrderDetail />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/inventory/receive" element={<ReceiveStock />} />
              <Route path="/discounts" element={<Discounts />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/customers" element={<Customers />} />
            </Route>
          </Route>
        </Routes>
      </AdminProvider>
    </Router>
  );
}

export default function App() {
  return <AppContent />;
}
