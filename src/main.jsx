
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx';
// src/main.jsx or src/main.tsx
import 'bootstrap/dist/css/bootstrap.min.css';

import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { BrowserRouter, Route, Routes ,useLocation } from 'react-router-dom';
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
import CheckoutPage from './components/cart/CheckoutPage.jsx';

function Root() {
  const location = useLocation();

  // Hide Navbar only on /login route
  const hideNavbarOnPaths = ['/login','/register'];
  const shouldShowNavbar = !hideNavbarOnPaths.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <ScrollToTop />
      {/* Main content */}
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/login" element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path="/brand/:brandName" element={<ProductContainer />} />
        <Route path="brand/:brandName/model/:modelName" element={<SparePartsPage />} />
        <Route path='/product/:productId' element={<ProductPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/location" element={<MapView/>} />
        <Route path='/cartpage' element={<CartPage/>}/>
        <Route path="/order-history" element={<OrderHistory />} />
        <Route path="/store/:storeId" element={<StoreDetail />} />
        
      </Routes>
      {shouldShowNavbar && <Footer />}
    </>
  )
}

createRoot(document.getElementById('root')).render(
 <BrowserRouter>
    <Root />
  </BrowserRouter>
  
)
