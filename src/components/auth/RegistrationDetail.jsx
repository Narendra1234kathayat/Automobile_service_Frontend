import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import RightSideBanner from "./RightSideBanner.jsx";
import { FaBuilding, FaMapMarkerAlt, FaArrowLeft, FaCheck } from "react-icons/fa";

const RegistrationDetail = ({ 
  step, 
  setStep, 
  form, 
  handleChange, 
  handleSubmit, 
  loading 
}) => {

  // Animation variants
  const slideVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    },
    exit: { 
      x: -50, 
      opacity: 0,
      transition: { duration: 0.4 }
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Additional validation before submission
    if (form.role === "mechanic" && !form.workshopName.trim()) {
      toast.error("Workshop name is required for mechanics");
      return;
    }
    
    if (form.role === "supplier" && !form.garageName.trim()) {
      toast.error("Garage/Store name is required for suppliers");
      return;
    }
    
    // Call the parent's handleSubmit function
    await handleSubmit(e);
  };

  return (
    <motion.div 
      className="col-lg-6 col-12 align-items-center d-flex justify-content-center rightside-bg p-5"
      variants={slideVariants}
      initial="hidden"
      animate="visible"
    >
      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div
            key="banner"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
          >
            <RightSideBanner />
          </motion.div>
        ) : (
          <motion.div
            key="form"
            className="w-100"
            style={{ maxWidth: "420px" }}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Header */}
              <motion.div 
                className="d-flex justify-content-between align-items-center mb-4"
                variants={itemVariants}
              >
                <div>
                  <h4 className="fw-bold text-white mb-1">Additional Details</h4>
                  <small className="text-muted">Complete your {form.role} profile</small>
                </div>
                <motion.button
                  type="button"
                  className="btn btn-outline-light btn-sm rounded-pill px-3"
                  onClick={() => setStep(1)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={loading}
                >
                  <FaArrowLeft className="me-1" /> Back
                </motion.button>
              </motion.div>

              <form onSubmit={handleFormSubmit}>
                {/* Role-specific fields */}
                <AnimatePresence mode="wait">
                  {form.role === "mechanic" && (
                    <motion.div
                      key="mechanic-fields"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div className="mb-3" variants={itemVariants}>
                        <label className="form-label text-light">
                          <FaBuilding className="me-2" />
                          Workshop Name *
                        </label>
                        <motion.input
                          type="text"
                          className="form-control bg-dark text-white border-0"
                          name="workshopName"
                          value={form.workshopName}
                          onChange={handleChange}
                          placeholder="Enter your workshop name"
                          required
                          whileFocus={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        />
                      </motion.div>

                      <motion.div className="mb-4" variants={itemVariants}>
                        <label className="form-label text-light">
                          Years of Experience (Optional)
                        </label>
                        <motion.input
                          type="number"
                          className="form-control bg-dark text-white border-0"
                          name="experience"
                          value={form.experience}
                          onChange={handleChange}
                          placeholder="Enter years of experience"
                          min="0"
                          max="50"
                          whileFocus={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        />
                      </motion.div>
                    </motion.div>
                  )}

                  {form.role === "supplier" && (
                    <motion.div
                      key="supplier-fields"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div className="mb-4" variants={itemVariants}>
                        <label className="form-label text-light">
                          <FaBuilding className="me-2" />
                          Garage/Store Name *
                        </label>
                        <motion.input
                          type="text"
                          className="form-control bg-dark text-white border-0"
                          name="garageName"
                          value={form.garageName}
                          onChange={handleChange}
                          placeholder="Enter your garage/store name"
                          required
                          whileFocus={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        />
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Address Section */}
                <motion.div variants={itemVariants}>
                  <motion.h5 
                    className="text-light mt-4 mb-3 d-flex align-items-center"
                    variants={itemVariants}
                  >
                    <FaMapMarkerAlt className="me-2 text-success" />
                    Address Details
                  </motion.h5>

                  <motion.div className="row g-3" variants={containerVariants}>
                    <motion.div className="col-12" variants={itemVariants}>
                      <label className="form-label text-light">Street Address</label>
                      <motion.input
                        type="text"
                        className="form-control bg-dark text-white border-0"
                        name="street"
                        value={form.street}
                        onChange={handleChange}
                        placeholder="Enter street address"
                        whileFocus={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      />
                    </motion.div>

                    <motion.div className="col-6" variants={itemVariants}>
                      <label className="form-label text-light">City *</label>
                      <motion.input
                        type="text"
                        className="form-control bg-dark text-white border-0"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        placeholder="Enter city"
                        required
                        whileFocus={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      />
                    </motion.div>

                    <motion.div className="col-6" variants={itemVariants}>
                      <label className="form-label text-light">State *</label>
                      <motion.input
                        type="text"
                        className="form-control bg-dark text-white border-0"
                        name="state"
                        value={form.state}
                        onChange={handleChange}
                        placeholder="Enter state"
                        required
                        whileFocus={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      />
                    </motion.div>

                    <motion.div className="col-6" variants={itemVariants}>
                      <label className="form-label text-light">Country</label>
                      <motion.input
                        type="text"
                        className="form-control bg-dark text-white border-0"
                        name="country"
                        value={form.country}
                        onChange={handleChange}
                        placeholder="Enter country"
                        whileFocus={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      />
                    </motion.div>

                    <motion.div className="col-6" variants={itemVariants}>
                      <label className="form-label text-light">Pincode</label>
                      <motion.input
                        type="text"
                        className="form-control bg-dark text-white border-0"
                        name="pincode"
                        value={form.pincode}
                        onChange={handleChange}
                        placeholder="6-digit pincode"
                        maxLength="6"
                        pattern="[0-9]{6}"
                        whileFocus={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      />
                    </motion.div>
                  </motion.div>
                </motion.div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  className="btn btn-success w-100 fw-semibold mt-4 py-3 rounded-pill"
                  disabled={loading}
                  variants={itemVariants}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
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
                </motion.button>

                <motion.p 
                  className="text-muted text-center mt-3 small"
                  variants={itemVariants}
                >
                  By registering, you agree to our terms and conditions
                </motion.p>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RegistrationDetail;
