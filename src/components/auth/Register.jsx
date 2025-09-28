import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import "./Login.css";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance.js";
import RightSideBanner from "./RightSideBanner.jsx";
import { FaArrowRight, FaUser, FaEnvelope, FaLock, FaPhone } from "react-icons/fa";
import RegistrationDetail from "./RegistrationDetail";
import AOS from "aos";
import "aos/dist/aos.css";

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
    garageName: "",
    workshopName: "",
    experience: "",
    street: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",
  });

  useEffect(() => {
    AOS.init({ duration: 600, once: true });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    else if (form.name.trim().length < 2) newErrors.name = "Name must be at least 2 characters";

    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Email is invalid";

    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters";

    if (!form.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
    else if (!/^\d{10}$/.test(form.phoneNumber.replace(/\D/g, ""))) newErrors.phoneNumber = "Phone number must be 10 digits";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
      toast.success("Step 1 completed! Please fill additional details.");
    } else {
      toast.error("Please fill all required fields correctly");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        },
        ...(form.role === "mechanic" ? { workShop: form.workshopName.trim(), experience: form.experience ? parseInt(form.experience) : 0 } : {}),
        ...(form.role === "supplier" ? { storeName: form.garageName.trim(), status: "pending" } : {})
      };

      const response = await axiosInstance.post('/api/users/create-user', payload);
      
      if (response.status === 200 || response.status === 201) {
        toast.success("Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      console.error("Registration Failed:", error);
      const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
      toast.error(errorMessage);
      if (error.response?.status === 400 && errorMessage.includes("email")) {
        setStep(1);
        setErrors({ email: "Email already exists" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row vh-100 w-100 m-0">
      {/* Left Side */}
      <div className="col-lg-6 col-12 d-flex align-items-center justify-content-center leftside-bg" data-aos="fade-right">
        <div className="w-100" style={{ maxWidth: "420px", padding: "2rem" }}>
          <div className="text-center mb-4">
            <h3 className="fw-bold text-white mb-2">Create Account</h3>
            <div className="mx-auto" style={{ width: "60px", height: "3px", background: "linear-gradient(90deg, #28a745, #20c997)", borderRadius: "2px" }} />
            <p className="text-muted mt-2">Step {step} of 2</p>
          </div>

          {/* Progress Bar */}
          <div className="progress mb-4" style={{ height: "4px", backgroundColor: "rgba(255,255,255,0.1)" }}>
            <div className="progress-bar bg-success" style={{ width: step === 1 ? "50%" : "100%" }}></div>
          </div>

          {step === 1 && (
            <form>
              {/* Role Selection */}
              <div className="mb-3" data-aos="fade-left">
                <label className="form-label text-light"><FaUser className="me-2" />Register As</label>
                <select className="form-select bg-dark text-white border-success" name="role" value={form.role} onChange={handleChange}>
                  <option value="mechanic">Mechanic</option>
                  <option value="supplier">Supplier</option>
                </select>
              </div>

              {/* Name */}
              <div className="mb-3" data-aos="fade-left">
                <label className="form-label text-light"><FaUser className="me-2" />Full Name</label>
                <input type="text" className={`form-control bg-dark text-white border-0 ${errors.name ? 'border border-danger' : ''}`} name="name" value={form.name} onChange={handleChange} placeholder="Enter your full name" />
                {errors.name && <small className="text-danger d-block mt-1">{errors.name}</small>}
              </div>

              {/* Email */}
              <div className="mb-3" data-aos="fade-left">
                <label className="form-label text-light"><FaEnvelope className="me-2" />Email Address</label>
                <input type="email" className={`form-control bg-dark text-white border-0 ${errors.email ? 'border border-danger' : ''}`} name="email" value={form.email} onChange={handleChange} placeholder="Enter your email" />
                {errors.email && <small className="text-danger d-block mt-1">{errors.email}</small>}
              </div>

              {/* Password */}
              <div className="mb-3" data-aos="fade-left">
                <label className="form-label text-light"><FaLock className="me-2" />Password</label>
                <input type="password" className={`form-control bg-dark text-white border-0 ${errors.password ? 'border border-danger' : ''}`} name="password" value={form.password} onChange={handleChange} placeholder="Enter your password" />
                {errors.password && <small className="text-danger d-block mt-1">{errors.password}</small>}
              </div>

              {/* Phone */}
              <div className="mb-4" data-aos="fade-left">
                <label className="form-label text-light"><FaPhone className="me-2" />Phone Number</label>
                <input type="tel" className={`form-control bg-dark text-white border-0 ${errors.phoneNumber ? 'border border-danger' : ''}`} name="phoneNumber" value={form.phoneNumber} onChange={handleChange} placeholder="Enter your phone number" maxLength="10" />
                {errors.phoneNumber && <small className="text-danger d-block mt-1">{errors.phoneNumber}</small>}
              </div>

              <button type="button"  className="btn btn-success w-100 fw-semibold py-3 rounded-pill" onClick={handleNext}>
                Continue to Step 2 <FaArrowRight className="ms-2" />
              </button>
            </form>
          )}

          <div className="text-center mt-4">
            <span className="text-light">
              Already have an account? <Link to="/login" className="text-success text-decoration-none fw-semibold">Sign in</Link>
            </span>
          </div>
        </div>
      </div>

      {/* Right Side - Step 2 */}
      <RegistrationDetail step={step} setStep={setStep} form={form} handleChange={handleChange} handleSubmit={handleSubmit} loading={loading} />
    </div>
  );
};

export default Register;
