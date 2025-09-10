import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance, { BASE_URL } from "../../utils/axiosInstance";

const CategoryContainer = () => {
  const [search, setSearch] = useState("");
  const [brands, setBrands] = useState([]);
  const navigate = useNavigate();

  // ✅ Fetch car brands from API
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await axiosInstance.get("/api/car-brand/get-brand");
        setBrands(res.data.data); // assuming API returns { data: [ { _id, name, logo }, ... ] }
      } catch (err) {
        console.error("Error fetching brands:", err);
      }
    };
    fetchBrands();
  }, []);

  // ✅ Filter by search
  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div id="category" className="container" style={{ backgroundColor: "#111828" }}>
      <h2 className="text-center text-white mb-2">Select Your Car Brand</h2>

      {/* Search Input */}
      <div className="input-group mb-md-4 mb-3">
        <input
          type="text"
          className="form-control bg-dark text-white border-secondary"
          placeholder="🔍 Search car brands..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Brand Cards */}
      <div className="row">
        {filteredBrands.map((brand, i) => (
          <div className="category col-md-4 col-lg-3 col-sm-6 mb-4" key={i}>
            <div
              className="card h-100 text-white border border-white shadow-sm"
              style={{
                backgroundColor: "#000",
                cursor: "pointer",
                transition: "transform 0.2s ease-in-out"
              }}
              onClick={() => navigate(`/brand/${brand.name}`)}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <img
                src={brand.logo ? BASE_URL + brand.logo : "src/assets/shop.png"}
                alt={`${brand.name} logo`}
                className="card-img-top p-3"
                style={{ height: "100px", objectFit: "contain" }}
              />
              <div className="card-body d-flex align-items-center justify-content-center">
                <h5 className="card-title text-center fw-bold">{brand.name}</h5>
              </div>
            </div>
          </div>
        ))}
        {filteredBrands.length === 0 && (
          <div className="col-12 text-center text-muted mt-3">
            <h5 className="text-secondary">No matching brand found.</h5>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryContainer;
