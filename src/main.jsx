
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx';
// react redux
import { Provider } from 'react-redux';
import store from './Store/redux/Store.js';

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
      {!hideNavbar  && <Navbar />}
      <ScrollToTop />
      {/* Main content */}
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/login" element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path="/brand/:brandName" element={<ProductContainer />} />
        <Route path="brand/:brandName/model/:modelName" element={<SparePartsPage />} />
        <Route path='/product/:productId' element={<ProductPage />} />

        <Route path="/location" element={<MapView />} />
        <Route path='/cartpage' element={<CartPage />} />
        <Route path="/order-history" element={<OrderHistory />} />
        <Route path="/store/:storeId" element={<StoreDetail />} />

        <Route path='/supplier' element={<SiderbarLayout />}>
          <Route index element={<Dashboard />} />
          <Route path='/supplier/dashboard' element={<Dashboard />} />
          <Route path='/supplier/profile' element={<ProfilePage/>} />
          <Route path='/supplier/orders' element={<OrderHistory/>} />  
          <Route path="/supplier/quotations" element={<Quotations/>} />
        </Route>

      </Routes>
      {!hideNavbar  && <Footer />}
    </>
  )
}

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <Root />
    </BrowserRouter>
  </Provider>

)
