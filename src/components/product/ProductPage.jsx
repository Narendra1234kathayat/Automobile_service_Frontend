import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import axiosInstance, { BASE_URL } from "../../utils/axiosInstance";

const ProductPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(
          `${BASE_URL}api/spare-part/spare-part-details/${productId}`
        );
        setProduct(res.data.data);
      } catch (err) {
        console.error("Failed to fetch product:", err);
        toast.error("⚠️ Failed to load product details!");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  // Fetch suppliers supplying this product
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await axiosInstance.get(
          `${BASE_URL}api/spare-part/get-Suppliersforspartpart/${productId}`
        );
        setSuppliers(res.data.data || []);
        console.log(res.data.data);
      } catch (err) {
        console.error("Failed to fetch suppliers:", err);
        toast.error("⚠️ Failed to load suppliers!");
      }
    };
    if (productId) fetchSuppliers();
  }, [productId]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <ClipLoader size={50} color="#28a745" />
      </div>
    );
  }

  if (!product)
    return <p className="text-center text-white mt-5">No product found</p>;

  const headingStyle = { color: "#f8f9fa" };
  const subTextStyle = { color: "#adb5bd" };
  const labelStyle = { color: "#ced4da" };
  const priceStyle = {
    color: "#f8f9fa",
    fontSize: "1.5rem",
    fontWeight: "bold",
  };

  // Parse specifications string into list
  const specsArray = product.specifications
    ? product.specifications.split("\r\n")
    : [];

  // Responsive carousel breakpoints
  const responsive = {
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3 },
    tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
  };

  // Send quotation request
  const sendQuotation = (supplier) => {
    toast.success(`✅ Quotation request sent to ${supplier.name}`);
  };

  // Add to cart
  const addToCart = () => {
    toast.success(`🛒 ${product.name} added to cart`);
  };

  return (
    <div className="container my-5 p-4 rounded">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Product Info */}
      <div className="row mb-5">
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <img
            src={`${BASE_URL}${product.image}`}
            alt={product.name}
            className="img-fluid"
            style={{
              maxWidth: "100%",
              height: "auto",
              borderRadius: "1rem",
              objectFit: "contain",
            }}
          />
        </div>
        <div className="col-md-6 text-white" style={{ paddingLeft: "2rem" }}>
          <h2 style={headingStyle}>{product.name}</h2>
          <p style={subTextStyle}>{product.description}</p>
          <p style={priceStyle}>₹{product.price}</p>
          <p>
            <span style={labelStyle}>Category:</span>{" "}
            {product.categoryId?.name} <br />
            <span style={labelStyle}>Brand:</span>{" "}
            {product.brandId?.map((b) => b.name).join(", ")} <br />
            <span style={labelStyle}>Model:</span>{" "}
            {product.modelId?.map((m) => m.carModel).join(", ")}
          </p>
          <p>
            <span style={labelStyle}>Variant:</span>{" "}
            {product.variant?.join(", ")}
          </p>
          <button className="btn btn-primary mt-3" onClick={addToCart}>
            🛒 Add to Cart
          </button>
           <button className="btn ms-2 btn-primary mt-3 text-white" >
          <a href="#supplier" className="text-white" >View Suppliers</a>
          </button>
        </div>
      </div>

      {/* Specifications */}
      <div className="row mb-4">
        <div className="col-12">
          <h4 style={headingStyle}>Specifications</h4>
          <ul className="list-group">
            {specsArray.map((line, i) => (
              <li
                key={i}
                className="list-group-item"
                style={{
                  backgroundColor: "#2c3136",
                  borderColor: "#3d444a",
                  color: "#e9ecef",
                }}
              >
                {line}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Suppliers Carousel */}
      <div className="row my-4" id="supplier">
        <div className="col-12">
          <h4 style={headingStyle} className="my-3">
            Suppliers
          </h4>
        </div>
        <Carousel responsive={responsive} infinite autoPlay autoPlaySpeed={4000}>
          {suppliers.length > 0 ? (
            suppliers.map((sup, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="p-2"
              >
                <div
                  className="card h-100 rounded-3 shadow"
                  style={{
                    backgroundColor: "#2c3136",
                    border: "1px solid #3d444a",
                  }}
                >
                  <div className="card-body text-white">
                    <h5 className="fw-bold">{sup.userId.name}</h5>
                    <p className="mb-2" style={{ color: "#adb5bd" }}>
                      📍 {sup.address?.street}, {sup.address?.city},{" "}
                      {sup.address?.state} <br />
                      📞 {sup.phoneNumber} <br />
                      ✉️ {sup.userId.email}
                    </p>
                    <button
                      className="btn btn-success w-100 mt-auto"
                      onClick={() => sendQuotation(sup)}
                    >
                      Request Quotation
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-white ms-3">No suppliers available</p>
          )}
        </Carousel>
      </div>
    </div>
  );
};

export default ProductPage;
