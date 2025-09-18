import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const otpRefs = useRef([]);

  // Timer state
  const [timeLeft, setTimeLeft] = useState(120);

  // Handle OTP input
  const handleOtpChange = (value, index) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 3) {
        otpRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // Validation per step
  const validateStep = () => {
    const newErrors = {};
    if (step === 1 && !email) {
      newErrors.email = "Email is required";
    } else if (step === 1 && !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (step === 2 && otp.some((digit) => !digit)) {
      newErrors.otp = "Please enter the complete OTP";
    }
    if (step === 3) {
      if (!password) {
        newErrors.password = "Password is required";
      } else if (password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }
      if (!confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    setIsLoading(true);
    try {
      if (step === 1) {
        // API: Send OTP
        await axiosInstance.post("/api/auth/send-otp", { email });
        toast.success("OTP sent to your email!");
        setStep(2);
        setTimeLeft(120);
      } else if (step === 2) {
        // API: Verify OTP
        const code = otp.join("");
        await axiosInstance.post("/api/auth/verify-otp", { email, otp: code });
        toast.success("OTP verified successfully!");
        setStep(3);
      } else {
        // API: Reset Password
        await axiosInstance.post("/api/auth/reset-password", {
          email,
          password,
          confirmPassword,
        });
        toast.success("Password changed successfully!");
        setStep(1);
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setOtp(["", "", "", ""]);
      }
    } catch (error) {
      
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
    setIsLoading(false);
  };

  // Resend OTP
  const handleResendOtp = async () => {
    try {
      await axios.post("/api/auth/resend-otp", { email });
      toast.info("New OTP sent to your email!");
      setTimeLeft(120);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP!");
    }
  };

  // Countdown effect for OTP
  useEffect(() => {
    if (step === 2 && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, timeLeft]);

  // Format time as mm:ss
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Animations
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, x: -10, transition: { duration: 0.2 } },
  };

  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center py-5">
      <motion.div
        className="card border-0 shadow-sm text-white"
        style={{
          maxWidth: "480px",
          width: "100%",
          borderRadius: "16px",
          backgroundColor: "#05976A",
        }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="card-body p-4">
          {/* Header */}
          <div className="text-center mb-4">
            <h2 className="fw-bold mb-2">
              {step === 1
                ? "Forgot Password?"
                : step === 2
                ? "Verify OTP"
                : "Reset Password"}
            </h2>
            <p className="mb-0 text-white-50">
              {step === 1
                ? "Enter your email to receive a reset code"
                : step === 2
                ? "Enter the 4-digit code sent to your email"
                : "Create a new secure password"}
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center">
              {[1, 2, 3].map((stepNum) => (
                <React.Fragment key={stepNum}>
                  <motion.div
                    className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                    style={{
                      width: "36px",
                      height: "36px",
                      backgroundColor:
                        step >= stepNum ? "white" : "rgba(255,255,255,0.2)",
                      color: step >= stepNum ? "#05976A" : "white",
                      fontSize: "14px",
                    }}
                  >
                    {stepNum}
                  </motion.div>
                  {stepNum < 3 && (
                    <div
                      className="flex-grow-1 mx-2"
                      style={{
                        height: "2px",
                        backgroundColor:
                          step > stepNum ? "white" : "rgba(255,255,255,0.3)",
                      }}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {/* Step 1: Email */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <div className="mb-3">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className={`form-control ${
                        errors.email ? "is-invalid" : ""
                      }`}
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{ borderRadius: "10px" }}
                    />
                    {errors.email && (
                      <div className="invalid-feedback d-block">
                        {errors.email}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 2: OTP */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="text-center"
                >
                  <label className="form-label">Verification Code</label>
                  <div className="d-flex justify-content-center gap-2 mb-2">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (otpRefs.current[index] = el)}
                        type="text"
                        maxLength="1"
                        className="form-control text-center"
                        style={{
                          width: "50px",
                          height: "50px",
                          fontSize: "20px",
                          borderRadius: "10px",
                        }}
                        value={digit}
                        onChange={(e) => handleOtpChange(e.target.value, index)}
                        onKeyDown={(e) => handleOtpKeyDown(e, index)}
                      />
                    ))}
                  </div>
                  {errors.otp && (
                    <div className="text-warning small">{errors.otp}</div>
                  )}

                  {/* Timer */}
                  <div className="mt-2 text-white-50">
                    {timeLeft > 0 ? (
                      <span>Time remaining: {formatTime(timeLeft)}</span>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-link p-0 text-black"
                        onClick={handleResendOtp}
                      >
                        Resend Code
                      </button>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Password */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <div className="mb-3">
                    <label className="form-label">New Password</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`form-control ${
                        errors.password ? "is-invalid" : ""
                      }`}
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{ borderRadius: "10px" }}
                    />
                    {errors.password && (
                      <div className="invalid-feedback d-block">
                        {errors.password}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Confirm Password</label>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className={`form-control ${
                        errors.confirmPassword ? "is-invalid" : ""
                      }`}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      style={{ borderRadius: "10px" }}
                    />
                    {errors.confirmPassword && (
                      <div className="invalid-feedback d-block">
                        {errors.confirmPassword}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn w-100 fw-bold"
              style={{
                backgroundColor: "white",
                color: "#05976A",
                borderRadius: "10px",
              }}
              disabled={isLoading}
            >
              {isLoading
                ? "Processing..."
                : step === 1
                ? "Send Code"
                : step === 2
                ? "Verify Code"
                : "Update Password"}
            </button>

            {/* Back Button */}
            {step > 1 && (
              <button
                type="button"
                className="btn btn-outline-light w-100 mt-2"
                style={{ borderRadius: "10px" }}
                onClick={() => setStep(step - 1)}
              >
                Back
              </button>
            )}
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
