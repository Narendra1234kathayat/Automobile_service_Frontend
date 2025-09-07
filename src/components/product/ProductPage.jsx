import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const sampleProduct = {
  id: "sp001",
  name: "Brake Pad Set",
  description:
    "High-quality brake pad set suitable for Hyundai Creta. Designed for durability and excellent stopping performance in both city and highway conditions. Easy to install and backed with 1-year warranty.",
  brand: "Hyundai",
  model: "Creta",
  price: 1999,
  available: true,
  delivery: "3-5 business days",
  image: "https://via.placeholder.com/400x250?text=Brake+Pad+Set",
  specifications: {
    material: "Ceramic",
    warranty: "1 year",
    compatibility: "Creta (2018-2023)",
    manufacturer: "AutoParts Ltd.",
  },
  suppliers: [
    {
      id: 1,
      name: "ABC Motors",
      contact: "9876543210",
      email: "abc@motors.com",
      address: "123 Auto Street, Mumbai",
    },
    {
      id: 2,
      name: "Speed Parts",
      contact: "9123456780",
      email: "sales@speedparts.in",
      address: "45 Highway Road, Delhi",
    },
    {
      id: 3,
      name: "PowerMax Distributors",
      contact: "9988776655",
      email: "info@powermax.com",
      address: "88 SpareHub Lane, Bangalore",
    },
  ],
};

const ProductPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    setProduct(sampleProduct);
  }, [productId]);

  if (!product) return <div style={{ color: "#f8f9fa" }}>Loading...</div>;

  // Dark theme styles
  const headingStyle = { color: "#f8f9fa" }; // white
  const subTextStyle = { color: "#adb5bd" }; // muted gray
  const labelStyle = { color: "#ced4da" }; // light gray
  const priceStyle = {
    color: "#f8f9fa",
    fontSize: "1.5rem",
    fontWeight: "bold",
  };

  // Send quotation request
  const sendQuotationRequest = async (supplier) => {
    const quotationData = {
      productId: product.id,
      productName: product.name,
      price: product.price,
      brand: product.brand,
      model: product.model,
      supplierId: supplier.id,
      supplierName: supplier.name,
      supplierEmail: supplier.email,
      supplierContact: supplier.contact,
      supplierAddress: supplier.address,
      requestedBy: "user123",
    };

    try {
      const response = await fetch("http://localhost:5000/api/quotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quotationData),
      });

      if (response.ok) {
        alert(`Quotation request sent to ${supplier.name}!`);
      } else {
        alert("Failed to send quotation request.");
      }
    } catch (err) {
      console.error("Error sending quotation:", err);
      alert("Something went wrong. Try again!");
    }
  };

  return (
    <div className="container my-5 p-4 rounded" >
      <div className="row mb-5">
        {/* Product Image */}
        <div className="col-md-6">
          <img
            src={product.image}
            alt={product.name}
            className="img-fluid shadow"
            style={{ width: "100%", borderRadius: "1rem" }}
          />
        </div>

        {/* Product Info */}
        <div className="col-md-6 text-white" style={{ paddingLeft: "2rem" }}>
          <h2 style={headingStyle}>{product.name}</h2>
          <p style={subTextStyle}>{product.description}</p>
          <p style={priceStyle}>₹{product.price}</p>

          <p>
            <span style={labelStyle}>Brand:</span> {product.brand} <br />
            <span style={labelStyle}>Model:</span> {product.model}
          </p>

          <p>
            <span style={labelStyle}>Availability:</span>{" "}
            {product.available ? "In Stock" : "Out of Stock"}
          </p>

          <p>
            <span style={labelStyle}>Delivery:</span> {product.delivery}
          </p>

          <div className="d-flex align-items-center gap-3">
            <button
            className="btn btn-primary "
            disabled={!product.available}
            onClick={() => alert("Added to cart!")}
          >
            Add to Cart
          </button>
          <a className="text-white " href="#supplier">View All Suppliers</a>
          </div>
        </div>
      </div>

      {/* ✅ Description Section */}
      <div className="row mb-lg-4 mb-2">
        <div className="col-12">
          <h4 style={headingStyle}>Product Description</h4>
          <p style={subTextStyle} className="mt-2">
            {product.description}
          </p>
        </div>
      </div>

      {/* Specifications */}
      <div className="row ">
        <div className="col-12">
          <h4 style={headingStyle}>Specifications</h4>
          <ul className="list-group">
            {Object.entries(product.specifications).map(([key, value], i) => (
              <li
                key={i}
                className="list-group-item"
                style={{
                  backgroundColor: "#2c3136",
                  borderColor: "#3d444a",
                  color: "#e9ecef",
                }}
              >
                <strong style={labelStyle}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}:
                </strong>{" "}
                {value}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Suppliers */}
      <div className="row my-3" id="supplier" >
        <div className="col-12">
          <h4 style={headingStyle} className="my-3">Suppliers</h4>
        </div>
        {product.suppliers.map((sup) => (
          <div key={sup.id} className="col-lg-4 col-sm-6 mb-4">
            <div
              className="card h-100 rounded-3 shadow"
              style={{ backgroundColor: "#2c3136", border: "1px solid #3d444a" }}
            >
              <div className="card-body text-white">
                <h5 className="fw-bold">{sup.name}</h5>
                <p className="mb-2" style={{ color: "#adb5bd" }}>
                  📍 {sup.address} <br />
                  📞 {sup.contact} <br />
                  ✉️ {sup.email}
                </p>
                <button
                  className="btn btn-success w-100 mt-auto"
                  onClick={() => sendQuotationRequest(sup)}
                >
                  Request Quotation
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductPage;
