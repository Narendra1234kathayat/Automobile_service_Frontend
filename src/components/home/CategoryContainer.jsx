import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos"; // ✅ Import AOS
import "aos/dist/aos.css"; // ✅ Import AOS styles
import axiosInstance, { BASE_URL } from "../../utils/axiosInstance";

const CategoryContainer = () => {
  const [search, setSearch] = useState("");
  const [brands, setBrands] = useState([]);
  const [visibleCount, setVisibleCount] = useState(4); // ✅ Show 10 by default
  const navigate = useNavigate();

  // ✅ Initialize AOS once
  

  // ✅ Fetch car brands from API
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await axiosInstance.get("/api/car-brand/get-brand");
        setBrands(res.data.data);
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

  // ✅ Show only limited brands
  const visibleBrands = filteredBrands.slice(0, visibleCount);

  return (
    <div
      
      className="container"
      style={{ backgroundColor: "#111828" }}
      data-aos="fade-up"
    >
      {/* <h2 className="text-center text-white mb-2" data-aos="zoom-in">
        Select Your Car Brand
      </h2> */}

      {/* Search Input */}
      <div className="input-group mb-md-4 mb-3" data-aos="fade-right">
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
        {visibleBrands.map((brand, i) => (
          <div
            className="category col-md-4 col-lg-3 col-6 mb-4"
            key={i}
            data-aos="flip-left"
            data-aos-delay={i * 100}
          >
            <div
              className="card text-white border border-white shadow-sm"
              style={{
                backgroundColor: "#000",
                cursor: "pointer",
                transition: "transform 0.2s ease-in-out",
              }}
              onClick={() => navigate(`/brand/${brand.name}`)}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <img
                src={brand.logo ? BASE_URL + brand.logo : "src/assets/shop.png"}
                alt={`${brand.name} logo`}
                className="card-img-top p-md-3"
                style={{ height: "90px", objectFit: "contain" }}
              />
              <div className="card-body d-flex align-items-center justify-content-center">
                <h5 className="card-title text-center fw-bold">{brand.name}</h5>
              </div>
            </div>
          </div>
        ))}

        {/* No Results */}
        {filteredBrands.length === 0 && (
          <div className="col-12 text-center mt-3" data-aos="fade-up">
            <h5 className="text-secondary">No matching brand found.</h5>
          </div>
        )}
      </div>

      {/* Show More Button */}
      {visibleCount < filteredBrands.length && (
        <div className="text-center mt-3">
          <button
            className="btn btn-outline-light px-4"
            onClick={() => setVisibleCount((prev) => prev + 10)} // ✅ Load 10 more
            data-aos="fade-up"
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryContainer;
