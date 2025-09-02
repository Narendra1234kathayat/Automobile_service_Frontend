import React, { useState } from "react";
import "./Login.css";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance.js";
import RightSideBanner from "./RightSideBanner.jsx";
import { FaArrowRight } from "react-icons/fa";
import RegistrationDetail from "./RegistrationDetail";

const Register = () => {
  const navigate = useNavigate();

  // State
  const [step, setStep] = useState(1); // step 1 or 2
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "mechanic", // default

    // Step 2 fields
    garageName: "",
    workshopName: "",
    experience: "",
    street: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name:form.name,
        email:form.email,
        password:form.password,
        phoneNumber:form.phoneNumber,
        role:form.role,
        address:{
          street:form.street,
          city:form.city,
          state:form.state,
          country:form.country,
          pincode:form.pincode
        }
      }
      // Add storeName OR workshopName based on role
      if(form.role === "mechanic"){
        payload.workShop=form.workshopName;
      }else if(form.role === "supplier"){
        payload.storeName=form.garageName;
      }
      console.log("Payload:", payload);

      //Handle The API Call Here
      const response = await axiosInstance.post('/api/users/create-user',payload);
      console.log("Registration Successful", response);
      if (response.status === 200) {
        navigate("/login");
        
      }
    } catch (error) {
      console.error("Registration Failed", error);
    }
  };

  return (
    <div className="row  m-auto">
      {/* Left Side (Step 1) */}
      <div className="col-lg-6 col-12 d-flex align-items-center justify-content-center leftside-bg">

        <div
          className="w-100"
          style={{ maxWidth: "420px", padding: "2rem" }}
        >
          <h3 className="fw-bold text-white mb-4">Register</h3>

          <form onSubmit={handleSubmit}>

            <>
              {/* Role */}
              <div className="mb-3">

                <label className="form-label text-light">Register As</label>
                <select
                  className="form-select bg-dark text-white border-0"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                >
                  <option value="mechanic">Mechanic</option>
                  <option value="supplier">Supplier</option>
                </select>
              </div>

              {/* Basic Fields */}
              <div className="mb-3">
                <label className="form-label text-light">Name</label>
                <input
                  type="text"
                  className="form-control bg-dark text-white border-0"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-light">Email</label>
                <input
                  type="email"
                  className="form-control bg-dark text-white border-0"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-light">Password</label>
                <input
                  type="password"
                  className="form-control bg-dark text-white border-0"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-light">Phone Number</label>
                <input
                  type="text"
                  className="form-control bg-dark text-white border-0"
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
              </div>

              {/* Next Button */}
              <button
                type="button"
                className="btn btn-success w-100 fw-semibold"
                onClick={() => setStep(2)}
              >
                Next <FaArrowRight className="ms-2" />
              </button>
            </>

          </form>

          <div className="text-start mt-4">
            <span className="text-light">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-success text-decoration-none fw-semibold"
              >
                Sign in
              </Link>
            </span>
          </div>
        </div>
      </div>

      {/* Right Side (Step 2) */}
        <RegistrationDetail step={step} setStep={setStep} form={form} handleChange={handleChange} handleSubmit={handleSubmit} />
    </div>
  );
};

export default Register;
