import React, { useState } from "react";
import { FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaTimes } from "react-icons/fa";
import axiosInstance, { BASE_URL } from "../../utils/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CheckoutPage = ({ setShowCheckout, quotation }) => {
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

  // Validation function
  const validateForm = () => {
    const { name, phone, email, address, city, state, zip } = formData;

    if (!name.trim()) {
      toast.error("⚠️ Name is required");
      return false;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      toast.error("⚠️ Enter a valid 10-digit phone number");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("⚠️ Enter a valid email address");
      return false;
    }

    if (!address.trim()) {
      toast.error("⚠️ Street address is required");
      return false;
    }

    if (!city.trim()) {
      toast.error("⚠️ City is required");
      return false;
    }

    if (!state.trim()) {
      toast.error("⚠️ State is required");
      return false;
    }

    const zipRegex = /^[1-9][0-9]{5}$/;
    if (!zipRegex.test(zip)) {
      toast.error("⚠️ Enter a valid 6-digit zip code");
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const dataToBeSent = {
      personalDetails: {
        name: formData.name,
        phoneNumber: formData.phone,
        email: formData.email,
      },
      address: {
        streetAddress: formData.address,
        city: formData.city,
        pincode: formData.zip,
        state: formData.state,
      },
      mechanicId: JSON.parse(localStorage.getItem("user")),
      supplierId: quotation.supplierId._id,
      quotationId: quotation._id,
    };

    loadRazorpay(dataToBeSent, quotation.product.totalPrice);
    setShowCheckout(false);
  };

  const loadRazorpay = (dataTobeSent, totalPrice) => {
    const options = {
      key: "rzp_test_y8tz61noZGTrr8",
      amount: totalPrice * 100,
      currency: "INR",
      name: "SpareLink",
      description: "Test Transaction",
      handler: async (response) => {
        try {
          const res = await axiosInstance.post(
            `${BASE_URL}api/order/create-order`,
            dataTobeSent
          );
          if (res.status === 201 || res.status === 200) {
            alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
          }
        } catch (error) {
          console.error(`Error ${error}`);
          toast.error("❌ Payment failed or order could not be created");
        }
      },
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.phone,
      },
      notes: { address: "Corporate Office" },
      theme: { color: "#3399cc" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="checkout-page container checkout-container mt-5 p-4" style={{ zIndex: 1050, overflowY: "auto" }}>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="checkout-card shadow-lg p-4 rounded">
        <button
          className="btn btn-light position-absolute top-0 end-0 m-3 mt-5 border"
          onClick={() => setShowCheckout(false)}
        >
          <FaTimes size={20} />
        </button>

        <h2 className="text-center mt-4 mb-4 fw-bold">Checkout</h2>

        {quotation && (
          <div className="alert alert-info">
            <strong>Product:</strong> {quotation.product?.sparePartId?.name} <br />
            <strong>Supplier:</strong> {quotation.supplierId?.storeName} <br />
            <strong>Quantity:</strong> {quotation.product?.quantity} <br />
            <strong>Total:</strong> ₹{quotation.product?.totalPrice}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="section-header">
            <FaUser className="section-icon" /> Personal Information
          </div>

          <div className="row">
            <div className="mb-3 col-sm-6">
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

            <div className="mb-3 col-sm-6">
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

            <div className="mb-4 col-sm-6">
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
          </div>

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

          <button
            type="submit"
            className="btn btn-lg w-100 mt-3 text-white"
            style={{ backgroundColor: "#05976A" }}
          >
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
