import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";

import { motion } from "framer-motion";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { addToCart } from "../../Store/Slices/CartSlice";
import { useDispatch } from "react-redux";
import axiosInstance, { BASE_URL } from "../../utils/axiosInstance";
import AOS from "aos";
import "aos/dist/aos.css";

const ProductPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  // quotation form states
  const [showForm, setShowForm] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    AOS.init({ duration: 800, once: false });
  }, []);

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
      } catch (err) {
        console.error("Failed to fetch suppliers:", err);
        toast.error("⚠️ Failed to load suppliers!");
      }
    };
    if (productId) fetchSuppliers();
  }, [productId]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
        <ClipLoader size={50} color="#00d4ff" />
      </div>
    );
  }

  if (!product)
    return (
      <p className="text-center text-white mt-5 bg-dark p-3 rounded">
        No product found
      </p>
    );

  // Styles
  const headingStyle = { color: "#ffffff" };
  const subTextStyle = { color: "#b8c6db" };
  const labelStyle = { color: "#a6b5cb" };
  const priceStyle = {
    color: "rgb(5, 151, 106)",
    fontSize: "1.8rem",
    fontWeight: "bold",
  };

  const specsArray = product.specifications
    ? product.specifications.split("\r\n")
    : [];

  const responsive = {
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3 },
    tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
  };

  const openQuotationForm = (supplier) => {
    setSelectedSupplier(supplier);
    setQuantity(1);
    setShowForm(true);
  };

  const handleQuotationSubmit = async () => {
    const qty = Number(quantity);
    if (!qty || qty < 1 || qty > 100) {
      toast.error("⚠️ Quantity must be between 1 and 100");
      return;
    }
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const quotationData = {
        mechanicId: user,
        supplierId: selectedSupplier.userId._id,
        product: {
          sparePartId: productId,
          quantity: quantity,
          name: product.name,
        },
      };

      const response = await axiosInstance.post(
        `${BASE_URL}api/quotation/request-quotation`,
        quotationData
      );

      if (response.status === 200 || response.status === 201) {
        toast.success(
          `✅ Quotation request sent to ${selectedSupplier.userId.name} for ${quantity} unit(s)`
        );
        setShowForm(false);
      }
    } catch (error) {
      console.error("Quotation submit error:", error);
      toast.error("❌ Failed to send quotation request");
    }
  };

  const AddToCart = (product) => {
    dispatch(addToCart(product));
  };

  return (
    <div
      className="container-fluid py-5"
      
    >
      

      {/* Product Info */}
      <div className="container mb-5" data-aos="fade-up">
        <div className="row align-items-center g-4">
          <div className="col-md-6 text-center" data-aos="zoom-in">
            <img
              src={`${BASE_URL}${product.image}`}
              alt={product.name}
              className="img-fluid rounded-4 shadow"
              style={{
                maxWidth: "90%",
                height: "auto",
               
              }}
            />
          </div>
          <div className="col-md-6 text-white" data-aos="fade-left">
            <h2 style={headingStyle}>{product.name}</h2>
            <p style={subTextStyle}>{product.description}</p>
            <p style={priceStyle}>₹{product.price}</p>
            <p>
              <span style={labelStyle}>Category:</span> {product.categoryId?.name}
              <br />
              <span style={labelStyle}>Car Brand:</span>{" "}
              {product.brandId?.map((b) => b.name).join(", ")}
              <br />
              <span style={labelStyle}>Car Model:</span>{" "}
              {product.modelId?.map((m) => m.carModel).join(", ")}
            </p>
            <p>
              <span style={labelStyle}>Variant:</span>{" "}
              {product.variant?.join(", ")}
            </p>
            <div className="mt-3">
              <button
                className="btn btn-success text-white fw-bold me-2"
                onClick={() => AddToCart(product)}
              >
                🛒 Add to Cart
              </button>
              <a href="#supplier" className="btn btn-outline-light fw-bold">
                View Suppliers
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications */}
      <div className="container mb-4" data-aos="fade-up">
        <h4 style={headingStyle}>Specifications</h4>
        <ul className="list-group mt-3">
          {specsArray.map((line, i) => (
            <li
              key={i}
              className="list-group-item"
              style={{
                backgroundColor: "#002b5c",
                borderColor: "#00509d",
                color: "#d9e6ff",
              }}
              data-aos="fade-right"
            >
              {line}
            </li>
          ))}
        </ul>
      </div>

      {/* Suppliers */}
      <div className="container my-5" id="supplier" data-aos="fade-up">
        <h4 style={headingStyle} className="mb-4">
          Suppliers
        </h4>
        <Carousel responsive={responsive} infinite autoPlay autoPlaySpeed={4000}>
          {suppliers.length > 0 ? (
            suppliers.map((sup, index) => (
              <div>
                <div
                  className="card h-100 rounded-3 shadow"
                  data-aos="zoom-in"
                  style={
                    {
                      minHeight: "250px",

                    }
                  }
                  
                >
                  <div className="card-body text-white"
                    style={{ margin:"15px", backgroundColor: "#001f3f",height:"100%"}}
                    >
                    <h5 className="fw-bold">{sup.userId.name}</h5>
                    <p className="" style={{ color: "#b8d1ff" }}>
                      📍 {sup.address?.street}, {sup.address?.city},{" "}
                      {sup.address?.state} <br />
                      📞 {sup.userId.phoneNumber} <br />
                      <strong>Email:</strong> {sup.userId.email}
                    </p>
                    <button
                      type="button"
                      className="btn btn-success w-100 mt-auto text-white fw-bold "
                      onClick={() => openQuotationForm(sup)}
                    >
                      Request Quotation
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-white ms-3">No suppliers available</p>
          )}
        </Carousel>
      </div>

      {/* Quotation Form Overlay */}
      {showForm && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ backgroundColor: "rgba(0,0,0,0.7)", zIndex: 1050 }}
        >
          <div
            className="bg-dark text-white p-4 rounded shadow-lg"
            style={{ width: "400px" }}
            data-aos="zoom-in"
          >
            <h5 className="mb-3 text-info">Request Quotation</h5>
            <p>
              Supplier: <strong>{selectedSupplier?.userId?.name}</strong>
            </p>
            <div className="mb-3">
              <label className="form-label text-light">Quantity</label>
              <input
                type="number"
                min="1"
                max="100"
                className="form-control bg-secondary text-white"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
              <small className="text-muted">
                Enter quantity between 1 and 100
              </small>
            </div>
            <div className="d-flex justify-content-end">
              <button
                type="button"
                className="btn btn-secondary me-2"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-info text-white fw-bold"
                onClick={handleQuotationSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
