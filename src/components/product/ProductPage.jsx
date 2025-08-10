import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// Dummy data (replace with actual API or props)
const sampleProduct = {
  id: "sp001",
  name: "Brake Pad Set",
  description: "High-quality brake pad set suitable for Hyundai Creta.",
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
};

const ProductPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    setProduct(sampleProduct); // Simulate API fetch
  }, [productId]);

  if (!product) return <div style={{ color: "#f1f5f9" }}>Loading...</div>;



  const headingStyle = { color: "#fbbf24" };
  const subTextStyle = { color: "#d1d5db" };
  const labelStyle = { color: "#93c5fd" };
  const priceStyle = { color: "#34d399", fontSize: "1.5rem", fontWeight: "bold" };

  return (
    <div className="container white my-5" >
      <div className="row  ">
        {/* Product Image */}
        <div className="col-md-6">
          <img
            src={'https://media.istockphoto.com/id/526209999/photo/auto-parts.jpg?s=612x612&w=0&k=20&c=yXvzy425jTHSTKWxd7XCdIuh9zLLnTfNHD1jrRCwkrk='}
            alt={product.name}
            className="img-fluid rounded shadow"
            style={{ width: "100%", borderRadius: "1rem" }}
          />
        </div>

        {/* Product Info */}
        <div className="col-md-6" style={{ paddingLeft: "2rem" }}>
          <h2 style={headingStyle}>{product.name}</h2>
          <p style={subTextStyle}>{product.description}</p>
          <p style={priceStyle}>₹{product.price}</p>

          <p>
            <span style={labelStyle}>Brand:</span> {product.brand} <br />
            <span style={labelStyle}>Model:</span> {product.model}
          </p>

          <p>
            <span style={labelStyle}>Availability:</span>{" "}
            {product.available ? (
              <span style={{ color: "#10b981" }}>In Stock</span>
            ) : (
              <span style={{ color: "#ef4444" }}>Out of Stock</span>
            )}
          </p>

          <p>
            <span style={labelStyle}>Delivery:</span> {product.delivery}
          </p>

          <button
            className="btn btn-warning mt-3"
            style={{
              padding: "10px 20px",
              backgroundColor: "#fbbf24",
              color: "#111827",
              fontWeight: "bold",
              border: "none",
              borderRadius: "0.5rem",
            }}
            disabled={!product.available}
            onClick={() => alert("Added to cart!")}
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Specifications */}
      <div className="row ">
        <div className="col-12">
          <h4 style={{ color: "#60a5fa" }}>Specifications</h4>
          <ul className="list-group">
            {Object.entries(product.specifications).map(([key, value], i) => (
              <li
                key={i}
                className="list-group-item"
                style={{
                  backgroundColor: "#1f2937",
                  borderColor: "#374151",
                  color: "#e5e7eb",
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
    </div>
  );
};

export default ProductPage;
