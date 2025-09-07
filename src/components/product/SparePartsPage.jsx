import React, { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

const spareParts = [
  { id: 1, name: "Front Brake Pad", category: "Brakes", image: "https://m.media-amazon.com/images/I/81hf68N2GkL._SL1500_.jpg", price: "₹1,200", availability: "In Stock" },
  { id: 2, name: "Rear Brake Pad", category: "Brakes", image: "https://m.media-amazon.com/images/I/61E6B06uA7L._SL1500_.jpg", price: "₹1,050", availability: "Out of Stock" },
  { id: 3, name: "Air Filter", category: "Filters", image: "https://m.media-amazon.com/images/I/81T80ibn2HL._SL1500_.jpg", price: "₹450", availability: "In Stock" },
  { id: 4, name: "Oil Filter", category: "Filters", image: "https://m.media-amazon.com/images/I/71+H9H80YvL._SL1500_.jpg", price: "₹350", availability: "In Stock" },
  { id: 5, name: "Clutch Plate", category: "Clutch", image: "https://m.media-amazon.com/images/I/91rDHM8ZQCL._SL1500_.jpg", price: "₹2,800", availability: "Limited Stock" },
  { id: 6, name: "Fan Belt", category: "Engine", image: "https://m.media-amazon.com/images/I/71Jz4fX2BvL._SL1500_.jpg", price: "₹600", availability: "In Stock" },
  { id: 7, name: "Timing Belt", category: "Engine", image: "https://m.media-amazon.com/images/I/81LK3K-r2fL._SL1500_.jpg", price: "₹950", availability: "Out of Stock" },
];

// Categories from spareParts
const categories = ["All", ...new Set(spareParts.map((p) => p.category))];
const brands = ["Hyundai", "Tata", "Maruti", "Honda"];
const models = {
  Hyundai: ["Creta", "i20", "Verna"],
  Tata: ["Nexon", "Altroz", "Harrier"],
  Maruti: ["Swift", "Baleno", "Dzire"],
  Honda: ["City", "Amaze", "Jazz"],
};
const variants = ["Petrol", "Diesel", "CNG", "Electric"];

const SparePartsPage = () => {
  const { brandName, modelName } = useParams(); 
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedVariant, setSelectedVariant] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleCategoryClick = (category) => setSelectedCategory(category);

  // ✅ Filtering spare parts
  const filteredParts = spareParts.filter((part) => {
    const matchesCategory =
      selectedCategory === "All" || part.category === selectedCategory;
    const matchesSearch = part.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div
      className="container py-5"
      style={{ backgroundColor: "#111828", minHeight: "100vh", color: "#f1f1f1" }}
    >
      {/* ✅ Dynamic Title */}
      <h2 className="text-center mb-4 text-light">
        {brandName && modelName
          ? `Spare Parts for ${brandName} ${modelName}`
          : "All Spare Parts"}
      </h2>

      {/* Filter Controls */}
      <div className="row mb-4">
        {/* Search Input */}
        <div className="col-md-4 mb-2">
          <input
            type="text"
            className="form-control bg-dark text-light border-secondary"
            placeholder="🔍 Search spare parts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Show Brand/Model/Variant dropdowns only if NO brandName/modelName in route */}
        {!brandName && !modelName && (
          <>
            <div className="col-md-4 mb-2">
              <select
                className="form-select bg-dark text-light border-secondary"
                value={selectedBrand}
                onChange={(e) => {
                  setSelectedBrand(e.target.value);
                  setSelectedModel("");
                }}
              >
                <option value="">🚘 Select Brand</option>
                {brands.map((brand, i) => (
                  <option key={i} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4 mb-2">
              <select
                className="form-select bg-dark text-light border-secondary"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                disabled={!selectedBrand}
              >
                <option value="">🚗 Select Model</option>
                {selectedBrand &&
                  models[selectedBrand]?.map((model, i) => (
                    <option key={i} value={model}>
                      {model}
                    </option>
                  ))}
              </select>
            </div>

            <div className="col-md-4 mb-2">
              <select
                className="form-select bg-dark text-light border-secondary"
                value={selectedVariant}
                onChange={(e) => setSelectedVariant(e.target.value)}
              >
                <option value="">🔧 Select Variant</option>
                {variants.map((variant, i) => (
                  <option key={i} value={variant}>
                    {variant}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}
      </div>

      {/* Category Buttons */}
      <div className="mb-4 d-flex flex-wrap gap-2 justify-content-center">
        {categories.map((cat, index) => (
          <button
            key={index}
            className={`btn ${
              selectedCategory === cat ? "btn-light" : "btn-outline-light"
            }`}
            onClick={() => handleCategoryClick(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Spare Parts List */}
      <div className="row">
        {filteredParts.length > 0 ? (
          filteredParts.map((part) => (
            <div className="col-sm-6 col-lg-3 col-md-4 mb-2" key={part.id}>
              <div
                className="card bg-dark text-light border-secondary shadow-sm h-100"
                onClick={() => navigate(`/product/${part.id}`)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={part.image}
                  className="card-img-top"
                  alt={part.name}
                  style={{ height: "180px", objectFit: "cover" }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{part.name}</h5>
                  <p className="card-text mb-1">
                    <strong>Category:</strong> {part.category}
                  </p>
                  <p className="card-text mb-1">
                    <strong>Price:</strong> {part.price}
                  </p>
                  <p
                    className={`card-text ${
                      part.availability === "Out of Stock"
                        ? "text-danger"
                        : "text-success"
                    }`}
                  >
                    <strong>Availability:</strong> {part.availability}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted">No spare parts found.</p>
        )}
      </div>
    </div>
  );
};

export default SparePartsPage;
