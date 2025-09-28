import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import 'react-toastify/dist/ReactToastify.css';
import RightSideBanner from './RightSideBanner.jsx';
import axiosInstance from '../../utils/axiosInstance.js';
import { Eye, EyeOff } from 'lucide-react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // 🔹 Redirect if already logged in
  useEffect(() => {
    const storedRole = JSON.parse(localStorage.getItem('role'));
    if (storedRole) {
      navigate(storedRole === 'supplier' ? '/supplier' : '/');
    }
  }, [navigate]);

  // 🔹 Validation function
  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    // } else if (!/[A-Z]/.test(password)) {
    //   newErrors.password = 'Password must contain at least one uppercase letter';}
    else if (!/[0-9]/.test(password)) {
      newErrors.password = 'Password must contain at least one number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
  if (!validateForm()) {
    toast.error('Error in the form. Please check the fields.');
    return;
  }

  setLoading(true);

  try {
    const response = await axiosInstance.post(
      '/api/users/login',
      { email: email.trim(), password },
      { withCredentials: true }
    );

    if (response.status === 200) {
      const role = response.data.data.roleId.roleName;

      localStorage.setItem('name', response.data.data.name);
      localStorage.setItem('token', response.data.authtoken);
      localStorage.setItem('user', JSON.stringify(response.data.data._id));
      localStorage.setItem('role', JSON.stringify(role));

      toast.success(`Welcome back! Redirecting to ${role} dashboard...`);

      setTimeout(() => {
        navigate(role === 'supplier' ? '/supplier' : '/');
      }, 1500);
    }
  } catch (error) {
    console.error('Login error:', error);

    if (error.response?.status === 401) {
      toast.error('Invalid email or password');
    } else {
      toast.error('Login failed. Please try again.');
    }
  } finally {
    setLoading(false);
  }
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
            style={{ maxWidth: '420px' }}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Login Form */}
            <h3 className="fw-bold text-white mb-4 text-center text-lg-start">
              Welcome back
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();   // ✅ prevents refresh
                handleSubmit(e);      // manually call submit
              }}
              noValidate 
            >
              {/* Email */}
              <div className="mb-3">
                <label htmlFor="email" className="form-label text-light">
                  Email
                </label>
                <input
                  type="email"
                  className={`form-control bg-dark text-white border-0 py-3 ${errors.email ? 'border border-danger' : ''
                    }`}
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) {
                      setErrors((prev) => ({ ...prev, email: '' }));
                    }
                  }}
                  placeholder="Enter your email"
                  disabled={loading}
                />
                {errors.email && (
                  <small className="text-danger d-block mt-1">
                    {errors.email}
                  </small>
                )}
              </div>

              {/* Password */}
              <div className="mb-3 position-relative">
                <label htmlFor="password" className="form-label text-light">
                  Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`form-control bg-dark text-white border-0 py-3 ${errors.password ? 'border border-danger' : ''
                    }`}
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) {
                      setErrors((prev) => ({ ...prev, password: '' }));
                    }
                  }}
                  placeholder="Enter your password"
                  disabled={loading}
                />

                {/* 👁️ Toggle Button (fix) */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="btn btn-link p-0 m-0 border-0 position-absolute top-50 end-0 my-auto  me-3"
                  style={{ color: 'white' }}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>

                {errors.password && (
                  <small className="text-danger d-block mt-1">
                    {errors.password}
                  </small>
                )}
              </div>

              {/* Sign up link */}
              <div className="mb-3">
                <p className="text-light">
                  Don’t have an account?{' '}
                  <Link
                    to="/register"
                    className="text-decoration-none fw-semibold text-success"
                  >
                    Sign up
                  </Link>
                </p>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                className="btn btn-success w-100 fw-semibold d-flex align-items-center justify-content-center py-3"
                disabled={loading}
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
          </motion.div>
        </motion.div>

        {/* Right Side - Banner */}
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
