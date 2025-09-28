import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import RightSideBanner from "./RightSideBanner.jsx";
import { FaBuilding, FaMapMarkerAlt, FaArrowLeft, FaCheck } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

const RegistrationDetail = ({ step, setStep, form, handleChange, handleSubmit, loading }) => {
  const [errors, setErrors] = useState({});

  useEffect(() => {
    AOS.init({ duration: 600, once: true });
  }, []);

  const validateStep2 = () => {
    const newErrors = {};

    // Role-specific validation
    if (form.role === "mechanic" && !form.workshopName.trim()) {
      newErrors.workshopName = "Workshop name is required";
    }
    if (form.role === "supplier" && !form.garageName.trim()) {
      newErrors.garageName = "Garage/Store name is required";
    }

    // Address validation
    if (!form.city.trim()) {
      newErrors.city = "City is required";
    }
    if (!form.state.trim()) {
      newErrors.state = "State is required";
    }
    if (form.pincode && !/^\d{6}$/.test(form.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep2()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    await handleSubmit(e);
  };

  return (
    <div className="col-lg-6 col-12 align-items-center d-flex justify-content-center rightside-bg p-5" data-aos="fade-left">
      {step === 1 ? (
        <div data-aos="fade-in">
          <RightSideBanner />
        </div>
      ) : (
        <div className="w-100" style={{ maxWidth: "420px" }} data-aos="fade-left">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4" data-aos="fade-down">
            <div>
              <h4 className="fw-bold text-white mb-1">Additional Details</h4>
              <small className="text-muted">Complete your {form.role} profile</small>
            </div>
            <button
              type="button"
              className="btn btn-outline-light btn-sm rounded-pill px-3"
              onClick={() => setStep(1)}
              disabled={loading}
            >
              <FaArrowLeft className="me-1" /> Back
            </button>
          </div>

          <form onSubmit={handleFormSubmit}>
            {/* Role-specific fields */}
            {form.role === "mechanic" && (
              <div data-aos="fade-up">
                <div className="mb-3">
                  <label className="form-label text-light">
                    <FaBuilding className="me-2" />
                    Workshop Name *
                  </label>
                  <input
                    type="text"
                    className={`form-control bg-dark text-white border-0 ${errors.workshopName ? "border border-danger" : ""}`}
                    name="workshopName"
                    value={form.workshopName}
                    onChange={handleChange}
                    placeholder="Enter your workshop name"
                  />
                  {errors.workshopName && <small className="text-danger">{errors.workshopName}</small>}
                </div>

                <div className="mb-4">
                  <label className="form-label text-light">Years of Experience (Optional)</label>
                  <input
                    type="number"
                    className="form-control bg-dark text-white border-0"
                    name="experience"
                    value={form.experience}
                    onChange={handleChange}
                    placeholder="Enter years of experience"
                    min="0"
                    max="50"
                  />
                </div>
              </div>
            )}

            {form.role === "supplier" && (
              <div data-aos="fade-up">
                <div className="mb-4">
                  <label className="form-label text-light">
                    <FaBuilding className="me-2" />
                    Garage/Store Name *
                  </label>
                  <input
                    type="text"
                    className={`form-control bg-dark text-white border-0 ${errors.garageName ? "border border-danger" : ""}`}
                    name="garageName"
                    value={form.garageName}
                    onChange={handleChange}
                    placeholder="Enter your garage/store name"
                  />
                  {errors.garageName && <small className="text-danger">{errors.garageName}</small>}
                </div>
              </div>
            )}

            {/* Address Section */}
            <div data-aos="fade-up">
              <h5 className="text-light mt-4 mb-3 d-flex align-items-center">
                <FaMapMarkerAlt className="me-2 text-success" /> Address Details
              </h5>

              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label text-light">Street Address</label>
                  <input
                    type="text"
                    className="form-control bg-dark text-white border-0"
                    name="street"
                    value={form.street}
                    onChange={handleChange}
                    placeholder="Enter street address"
                  />
                </div>

                <div className="col-6">
                  <label className="form-label text-light">City *</label>
                  <input
                    type="text"
                    className={`form-control bg-dark text-white border-0 ${errors.city ? "border border-danger" : ""}`}
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                  />
                  {errors.city && <small className="text-danger">{errors.city}</small>}
                </div>

                <div className="col-6">
                  <label className="form-label text-light">State *</label>
                  <input
                    type="text"
                    className={`form-control bg-dark text-white border-0 ${errors.state ? "border border-danger" : ""}`}
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    placeholder="Enter state"
                  />
                  {errors.state && <small className="text-danger">{errors.state}</small>}
                </div>

                <div className="col-6">
                  <label className="form-label text-light">Country</label>
                  <input
                    type="text"
                    className="form-control bg-dark text-white border-0"
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    placeholder="Enter country"
                  />
                </div>

                <div className="col-6">
                  <label className="form-label text-light">Pincode</label>
                  <input
                    type="text"
                    className={`form-control bg-dark text-white border-0 ${errors.pincode ? "border border-danger" : ""}`}
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    placeholder="6-digit pincode"
                    maxLength="6"
                    pattern="[0-9]{6}"
                  />
                  {errors.pincode && <small className="text-danger">{errors.pincode}</small>}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-success w-100 fw-semibold mt-4 py-3 rounded-pill"
              disabled={loading}
              data-aos="zoom-in"
            >
              {loading ? (
                <>
                  <ClipLoader size={20} color="#ffffff" className="me-2" />
                  Creating Account...
                </>
              ) : (
                <>
                  <FaCheck className="me-2" />
                  Complete Registration
                </>
              )}
            </button>

            <p className="text-muted text-center mt-3 small" data-aos="fade-in">
              By registering, you agree to our terms and conditions
            </p>
          </form>
        </div>
      )}
    </div>
  );
};

export default RegistrationDetail;
