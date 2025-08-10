import React, { useState } from "react";
import { FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaTimes } from "react-icons/fa";

const CheckoutPage = ({ setShowCheckout }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Checkout Data:", formData);
    alert("Order placed successfully!");
    setShowCheckout(false); // Hide checkout after placing order
  };

  return (
    <div className="checkout-page container checkout-container  p-4" style={{ zIndex: 1050, overflowY: "auto" }}>
      <div className="checkout-card shadow-lg p-4  rounded ">
 
        {/* Close Button */}
        <button 
          className="btn btn-light position-absolute top-0 end-0 m-3 border" 
          onClick={() => setShowCheckout(false)}
        >
          <FaTimes size={20} />
        </button>

        <h2 className="text-center mb-4 fw-bold">Checkout</h2>
        <form onSubmit={handleSubmit}>
          {/* Personal Information */}
          <div className="section-header">
            <FaUser className="section-icon" /> Personal Information
          </div>

          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              name="phone"
              className="form-control"
              placeholder="+91 9876543210"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Delivery Address */}
          <div className="section-header">
            <FaMapMarkerAlt className="section-icon" /> Delivery Address
          </div>

          <div className="mb-3">
            <label className="form-label">Street Address</label>
            <textarea
              name="address"
              className="form-control"
              placeholder="123 Main Street"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">City</label>
              <input
                type="text"
                name="city"
                className="form-control"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">State</label>
              <input
                type="text"
                name="state"
                className="form-control"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-2 mb-3">
              <label className="form-label">Zip</label>
              <input
                type="text"
                name="zip"
                className="form-control"
                placeholder="123456"
                value={formData.zip}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button type="submit" className="btn btn-primary btn-lg w-100 mt-3">
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
