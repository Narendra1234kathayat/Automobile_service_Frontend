
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

function Root() {
  const location = useLocation();

  // Hide Navbar only on /login route
  const hideNavbarOnPaths = ['/login'];
  const shouldShowNavbar = !hideNavbarOnPaths.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/" element={<HomeScreen />} />
        <Route path="/login" element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </>
  )
}

createRoot(document.getElementById('root')).render(
 <BrowserRouter>
    <Root />
  </BrowserRouter>
  
)
