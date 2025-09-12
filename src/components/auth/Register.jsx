import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import "./Login.css";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance.js";
import RightSideBanner from "./RightSideBanner.jsx";
import { FaArrowRight, FaUser, FaEnvelope, FaLock, FaPhone } from "react-icons/fa";
import RegistrationDetail from "./RegistrationDetail";

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "mechanic",
    // Step 2 fields
    garageName: "",
    workshopName: "",
    experience: "",
    street: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const slideVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // Validate Step 1
  const validateStep1 = () => {
    const newErrors = {};
    
    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (!form.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(form.phoneNumber.replace(/\D/g, ""))) {
      newErrors.phoneNumber = "Phone number must be 10 digits";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Next Step
  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
      toast.success("Step 1 completed! Please fill additional details.");
    } else {
      toast.error("Please fill all required fields correctly");
    }
  };

  // Submit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate Step 2
    if (form.role === "mechanic" && !form.workshopName.trim()) {
      toast.error("Workshop name is required");
      return;
    }
    
    if (form.role === "supplier" && !form.garageName.trim()) {
      toast.error("Garage/Store name is required");
      return;
    }
    
    if (!form.city.trim() || !form.state.trim()) {
      toast.error("City and State are required");
      return;
    }
    
    if (form.pincode && !/^\d{6}$/.test(form.pincode)) {
      toast.error("Pincode must be 6 digits");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        phoneNumber: form.phoneNumber.trim(),
        role: form.role,
        address: {
          street: form.street.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          country: form.country.trim(),
          pincode: form.pincode.trim()
        }
      };

      // Add role-specific fields
      if (form.role === "mechanic") {
        payload.workShop = form.workshopName.trim();
        payload.experience = form.experience ? parseInt(form.experience) : 0;
      } else if (form.role === "supplier") {
        payload.storeName = form.garageName.trim();
        payload.status = "pending";
      }

      console.log("Registration payload:", payload);

      const response = await axiosInstance.post('/api/users/create-user', payload);
      
      if (response.status === 200 || response.status === 201) {
        toast.success("Registration successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      console.error("Registration Failed:", error);
      const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
      toast.error(errorMessage);
      
      // If email exists, go back to step 1
      if (error.response?.status === 400 && errorMessage.includes("email")) {
        setStep(1);
        setErrors({ email: "Email already exists" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="row vh-100 w-100 m-0"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Left Side - Step 1 Form */}
      <motion.div 
        className="col-lg-6 col-12 d-flex align-items-center justify-content-center leftside-bg"
        variants={slideVariants}
      >
        <motion.div
          className="w-100"
          style={{ maxWidth: "420px", padding: "2rem" }}
          variants={itemVariants}
        >
          {/* Header */}
          <motion.div 
            className="text-center mb-4"
            variants={itemVariants}
          >
            <motion.h3 
              className="fw-bold text-white mb-2"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              Create Account
            </motion.h3>
            <div 
              className="mx-auto" 
              style={{ 
                width: "60px", 
                height: "3px", 
                background: "linear-gradient(90deg, #28a745, #20c997)",
                borderRadius: "2px" 
              }} 
            />
            <p className="text-muted mt-2">Step {step} of 2</p>
          </motion.div>

          {/* Progress Bar */}
          <motion.div 
            className="progress mb-4"
            style={{ height: "4px", backgroundColor: "rgba(255,255,255,0.1)" }}
            variants={itemVariants}
          >
            <motion.div
              className="progress-bar bg-success"
              initial={{ width: "50%" }}
              animate={{ width: step === 1 ? "50%" : "100%" }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </motion.div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Role Selection */}
                <motion.div className="mb-3" variants={itemVariants}>
                  <label className="form-label text-light">
                    <FaUser className="me-2" />
                    Register As
                  </label>
                  <motion.select
                    className="form-select bg-dark text-white border-success"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <option value="mechanic">Mechanic</option>
                    <option value="supplier">Supplier</option>
                  </motion.select>
                </motion.div>

                {/* Name Field */}
                <motion.div className="mb-3" variants={itemVariants}>
                  <label className="form-label text-light">
                    <FaUser className="me-2" />
                    Full Name
                  </label>
                  <motion.input
                    type="text"
                    className={`form-control bg-dark text-white border-0 ${errors.name ? 'border border-danger' : ''}`}
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  />
                  {errors.name && (
                    <motion.small 
                      className="text-danger d-block mt-1"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {errors.name}
                    </motion.small>
                  )}
                </motion.div>

                {/* Email Field */}
                <motion.div className="mb-3" variants={itemVariants}>
                  <label className="form-label text-light">
                    <FaEnvelope className="me-2" />
                    Email Address
                  </label>
                  <motion.input
                    type="email"
                    className={`form-control bg-dark text-white border-0 ${errors.email ? 'border border-danger' : ''}`}
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  />
                  {errors.email && (
                    <motion.small 
                      className="text-danger d-block mt-1"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {errors.email}
                    </motion.small>
                  )}
                </motion.div>

                {/* Password Field */}
                <motion.div className="mb-3" variants={itemVariants}>
                  <label className="form-label text-light">
                    <FaLock className="me-2" />
                    Password
                  </label>
                  <motion.input
                    type="password"
                    className={`form-control bg-dark text-white border-0 ${errors.password ? 'border border-danger' : ''}`}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  />
                  {errors.password && (
                    <motion.small 
                      className="text-danger d-block mt-1"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {errors.password}
                    </motion.small>
                  )}
                </motion.div>

                {/* Phone Field */}
                <motion.div className="mb-4" variants={itemVariants}>
                  <label className="form-label text-light">
                    <FaPhone className="me-2" />
                    Phone Number
                  </label>
                  <motion.input
                    type="tel"
                    className={`form-control bg-dark text-white border-0 ${errors.phoneNumber ? 'border border-danger' : ''}`}
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    maxLength="10"
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  />
                  {errors.phoneNumber && (
                    <motion.small 
                      className="text-danger d-block mt-1"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {errors.phoneNumber}
                    </motion.small>
                  )}
                </motion.div>

                {/* Next Button */}
                <motion.button
                  type="button"
                  className="btn btn-success w-100 fw-semibold py-3 rounded-pill"
                  onClick={handleNext}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  variants={itemVariants}
                >
                  Continue to Step 2 <FaArrowRight className="ms-2" />
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Footer */}
          <motion.div 
            className="text-center mt-4"
            variants={itemVariants}
          >
            <span className="text-light">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-success text-decoration-none fw-semibold"
              >
                Sign in
              </Link>
            </span>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Right Side - Step 2 */}
      <RegistrationDetail 
        step={step} 
        setStep={setStep} 
        form={form} 
        handleChange={handleChange} 
        handleSubmit={handleSubmit}
        loading={loading}
      />
    </motion.div>
  );
};

export default Register;
