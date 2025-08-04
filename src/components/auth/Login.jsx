import axios from 'axios';
import './Login.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../../socket/SocketUser.js';

function Login() {
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const navigate = useNavigate();

  const handleSubmit =async (e) => {
    try {
      e.preventDefault();
      // Handle login logic here, e.g., API call to authenticate user
      const response=await axios.post('http://localhost:5000/api/v1/users/login', {
        email,
        password
      },{ withCredentials: true } );
      if (response.status === 200) {
        
        localStorage.setItem('user', JSON.stringify(response.data.data._id)); // Store user data in localStorage
        localStorage.setItem('authToken', response.data.data.token); // Store token in localStorage
        // Handle successful login, e.g., redirect or show success message
        const userId=localStorage.getItem('user');
        if(userId){}
          socket.emit('register', userId);
        
        navigate('/'); // Redirect to home or another page after successful login

        
        console.log('Login successful:', response.data);
      } else {
        // Handle login error
        console.error('Login failed:', response.data);
      }
    } catch (error) {
      // Handle error, e.g., show error message
      console.error('Error during login:', error);
      
    }
    
    
  };
 
  return (
    <div className="row vh-100 w-100 ">

      {/* Left Side Of Page */}
      <div className="col-lg-6 col-12 d-flex align-items-center justify-content-center leftside-bg">
        <div
          className="w-100"
          style={{
            maxWidth: '420px',
            padding: '2rem',
          }}
        >
          <h3 className="fw-bold text-white mb-4">Welcome back</h3>

          {/* Login Form */}
          <form>
            <div className="mb-3">
              <label htmlFor="email" className="form-label text-light">Email</label>
              <input
                type="email"
                className="form-control bg-dark text-white border-0"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label text-light">Password</label>
              <input
                type="password"
                className="form-control bg-dark text-white border-0"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="form-check text-light">
                <input type="checkbox" className="form-check-input" id="rememberMe" />
                <label htmlFor="rememberMe" className="form-check-label">Remember me</label>
              </div>
              <a href="#" className="text-success text-decoration-none">Forgot password?</a>
            </div>

            <button type="submit" className="btn btn-success w-100 fw-semibold" onClick={handleSubmit}>
              Sign in to your account
            </button>
          </form>

          <div className="text-start mt-4">
            <span className="text-light">
              Don’t have an account?{' '}
              <a href="#" className="text-success text-decoration-none fw-semibold">Sign up</a>
            </span>
          </div>
        </div>
      </div>


      {/* Right Side Of Page */}
      <div className="col-lg-6 col-12  align-items-center justify-content-lg-start justify-content-center d-lg-flex d-none rightside-bg p-5">
        <div className="d-flex flex-column gap-3 text-white" style={{ maxWidth: '500px' }}>

          {/* Logo and Title */}
          <div className="d-flex align-items-center gap-3">
            <img
              src="https://www.shutterstock.com/image-vector/car-icons-vintage-cars-unique-600nw-2443917033.jpg"
              alt="logo"
              className="logo"
              style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
            />
            <h2 className="fw-bold m-0">Automobile Service</h2>
          </div>

          {/* Main Tagline */}
          <h1 className="fw-bold m-0" style={{ fontSize: '2rem' }}>
            Bringing the Garage to You — Wherever You Are.
          </h1>

          {/* Subtext */}
          <p className="fs-6 m-0 text-light">
            Thousands of vehicle owners across the country trust <strong>website name</strong> to keep them moving — from emergency repairs to routine servicing, all delivered with speed, reliability, and convenience.
          </p>
        </div>
      </div>

    </div>
  );
}

export default Login;
