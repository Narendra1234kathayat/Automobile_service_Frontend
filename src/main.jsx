
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// react redux
import { Provider } from 'react-redux';
import store from './Store/redux/Store.js';

import ProtectedRoute from './components/protectroute/ProtectedRoute.jsx'
// src/main.jsx or src/main.tsx
import 'bootstrap/dist/css/bootstrap.min.css';

import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/navbar/Navbar.jsx';
import HomeScreen from './components/home/HomeScreen.jsx';
import Login from './components/auth/Login.jsx';
import Register from './components/auth/Register.jsx';
import ProfilePage from './components/profile/ProfilePage.jsx';
import ProductContainer from './components/home/ProductContainer.jsx';
import SparePartsPage from './components/product/SparePartsPage.jsx';
import ProductPage from './components/product/ProductPage.jsx';
import MapView from './components/home/MapView.jsx';
import CartPage from './components/cart/CartPage.jsx';
import Footer from './components/footer/Footer.jsx';
import OrderHistory from './components/history/OrderHistory.jsx';
import StoreDetail from './components/home/StoreDetail.jsx';
import ScrollToTop from './components/scrolltotop/ScrollToTop.jsx';

import SiderbarLayout from './components/sidebarlayout/SiderbarLayout.jsx';
import Dashboard from './pages/supplier/Dashboard.jsx';
import Quotations from './pages/supplier/Quotations.jsx';
import AddProduct from './pages/supplier/AddProduct.jsx';
import SupplierProducts from './pages/supplier/SupplierProducts.jsx';
function Root() {
  const location = useLocation();

  // Hide Navbar only on /login route
  // const hideNavbarOnPaths = ['/login', '/register', '/supplier'];

  // const shouldShowNavbar = !hideNavbarOnPaths.includes(location.pathname);
  // hide header/footer for login, register and any supplier route
  const hideNavbar =
    location.pathname.startsWith("/supplier") ||
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        style={{ zIndex: 9999 }}
      />
      {!hideNavbar && <Navbar />}
      <ScrollToTop />

      <Routes>
        {/* Public routes */}

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/unauthorized" element={<Unauthorized />} /> */}

        {/* Other public pages */}
        <Route path="/" element={
          <ProtectedRoute allowedRole="mechanic">
            <HomeScreen />
          </ProtectedRoute>

        } />
        <Route path="/brand/:brandName" element={
          <ProtectedRoute allowedRole="mechanic">
            <ProductContainer />
          </ProtectedRoute>} />
        <Route path="/brand/:brandName/model/:modelName" element={
          <ProtectedRoute allowedRole="mechanic">
            <SparePartsPage />
          </ProtectedRoute>} />
        <Route path="/product/:productId" element={
          <ProtectedRoute allowedRole="mechanic">
            <ProductPage />
          </ProtectedRoute>} />
        <Route path="/profile" element={
          <ProtectedRoute allowedRole="mechanic">
            <ProfilePage />
          </ProtectedRoute>} />
        <Route path="/spareparts" element={
          <ProtectedRoute allowedRole="mechanic">
            <SparePartsPage />
          </ProtectedRoute>} />
        <Route path="/location" element={
          <ProtectedRoute allowedRole="mechanic">
            <MapView />
          </ProtectedRoute>} />
        <Route path="/cartpage" element={<ProtectedRoute allowedRole="mechanic">
          <CartPage />
        </ProtectedRoute>} />
        <Route path="/order-history" element={<ProtectedRoute allowedRole="mechanic">
          <OrderHistory />
        </ProtectedRoute>} />
        <Route path="/store/:storeId" element={<ProtectedRoute allowedRole="mechanic">
          <StoreDetail />
        </ProtectedRoute>} />


        {/* Supplier Protected Routes */}
        <Route
          path="/supplier"
          element={
            <ProtectedRoute allowedRole="supplier">
              <SiderbarLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="orders" element={<OrderHistory />} />
          <Route path="quotations" element={<Quotations />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="products" element={<SupplierProducts />} />
        </Route>
      </Routes>

      {!hideNavbar && <Footer />}
    </>
  );
}

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <Root />
    </BrowserRouter>
  </Provider>

)
