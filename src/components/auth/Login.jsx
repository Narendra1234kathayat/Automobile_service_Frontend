import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import 'react-toastify/dist/ReactToastify.css';
import RightSideBanner from './RightSideBanner.jsx';
import axiosInstance from '../../utils/axiosInstance.js';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    // Prevent all default behaviors
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return false;
    }

    setLoading(true);
    
    try {
      const response = await axiosInstance.post('/api/users/login', 
        { email, password },
        { withCredentials: true }
      );
      
      if (response.status === 200) {
        const role = response.data.data.roleId.roleName;
        
        // Store user data
        localStorage.setItem('token', response.data.authtoken);
        localStorage.setItem('user',JSON.stringify(response.data.data._id));
        localStorage.setItem('role', JSON.stringify(response.data.data.roleId.roleName));
        
        // Success toast
        toast.success(`Welcome back! Redirecting to ${role} dashboard...`);
        
        // Navigate based on role
        setTimeout(() => {
          if (role === 'mechanic') {
            navigate('/');
          } else if (role === 'supplier') {
            navigate('/supplier');
          }
        }, 1500);
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle different error types
      if (error.response?.status === 401) {
        toast.error('Invalid email or password');
      } else if (error.response?.status === 404) {
        toast.error('User not found');
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
    
    return false;
  };

  return (
    <div className="container-fluid p-0">
      
      
      <div className="row vh-100 g-0">
        {/* Left Side - Login Form */}
        <motion.div 
          className="col-lg-6 col-md-12 d-flex align-items-center justify-content-center leftside-bg"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="w-100 px-4 py-5"
            style={{
              maxWidth: '420px',
            }}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Mobile Logo/Brand - Only show on small screens */}
            <div className="text-center d-lg-none mb-4">
              <motion.div
                className="mb-3"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="bg-success rounded-circle mx-auto d-flex align-items-center justify-content-center" 
                     style={{ width: '60px', height: '60px' }}>
                  <i className="fas fa-car text-white fs-4"></i>
                </div>
              </motion.div>
              <h5 className="text-white fw-bold">Sparelink</h5>
            </div>

            <motion.h3 
              className="fw-bold text-white mb-4 text-center text-lg-start"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Welcome back
            </motion.h3>

            {/* Login Form */}
            <form 
              onSubmit={handleSubmit}
              action="#"
              method="POST"
              noValidate
            >
              <motion.div 
                className="mb-3"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <label htmlFor="email" className="form-label text-light">Email</label>
                <input
                  type="email"
                  className={`form-control bg-dark text-white border-0 py-3 ${errors.email ? 'border border-danger' : ''}`}
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) {
                      setErrors(prev => ({ ...prev, email: '' }));
                    }
                  }}
                  placeholder="Enter your email"
                  disabled={loading}
                />
                {errors.email && (
                  <motion.small 
                    className="text-danger d-block mt-1"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {errors.email}
                  </motion.small>
                )}
              </motion.div>

              <motion.div 
                className="mb-3"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <label htmlFor="password" className="form-label text-light">Password</label>
                <input
                  type="password"
                  className={`form-control bg-dark text-white border-0 py-3 ${errors.password ? 'border border-danger' : ''}`}
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) {
                      setErrors(prev => ({ ...prev, password: '' }));
                    }
                  }}
                  placeholder="Enter your password"
                  disabled={loading}
                />
                {errors.password && (
                  <motion.small 
                    className="text-danger d-block mt-1"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {errors.password}
                  </motion.small>
                )}
              </motion.div>

              <motion.div 
                className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <div className="form-check text-light mb-2 mb-sm-0">
                  <input type="checkbox" className="form-check-input" id="rememberMe" />
                  <label htmlFor="rememberMe" className="form-check-label">Remember me</label>
                </div>
                <Link to="/forgotpassword" className="text-success text-decoration-none small">
                  Forgot password?
                </Link>
              </motion.div>

              <motion.button 
                type="submit" 
                className="btn btn-success w-100 fw-semibold d-flex align-items-center justify-content-center py-3"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                {loading ? (
                  <>
                    <ClipLoader size={20} color="#ffffff" className="me-2" />
                    Signing in...
                  </>
                ) : (
                  'Sign in to your account'
                )}
              </motion.button>
            </form>

            <motion.div 
              className="text-center text-lg-start mt-4"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <span className="text-light">
                Don't have an account?{' '}
                <Link to="/register" className="text-success text-decoration-none fw-semibold">
                  Sign up
                </Link>
              </span>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Right Side - Banner (Hidden on mobile) */}
        <motion.div 
          className="col-lg-6 d-none d-lg-flex align-items-center justify-content-center rightside-bg p-5"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <RightSideBanner />
        </motion.div>
      </div>
    </div>
  );
}

export default Login;
