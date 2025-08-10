import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const carBrands = [
  {
    brand: "Toyota",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Toyota_carlogo.png",
    models: ["Innova Crysta", "Fortuner", "Glanza", "Hilux", "Urban Cruiser"]
  },
  {
    brand: "Hyundai",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/45/Hyundai_logo.png",
    models: ["Creta", "i20", "Venue", "Verna", "Tucson"]
  },
  {
    brand: "Maruti",
    logo: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Maruti_Suzuki_logo.png",
    models: ["Swift", "Baleno", "Alto", "Dzire", "Brezza"]
  },
  {
    brand: "Honda",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Honda-logo.png",
    models: ["City", "Amaze", "Elevate", "WR-V", "Jazz"]
  },
  {
    brand: "Tata",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Tata_logo.png",
    models: ["Nexon", "Harrier", "Safari", "Altroz", "Punch"]
  },
  {
    brand: "Mahindra",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/59/Mahindra_logo.png",
    models: ["XUV700", "Scorpio-N", "Bolero", "Thar", "XUV300"]
  },
  {
    brand: "Kia",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Kia_logo_2021.svg",
    models: ["Seltos", "Sonet", "Carens", "EV6", "Carnival"]
  },
  {
    brand: "Volkswagen",
    logo: "https://upload.wikimedia.org/wikipedia/commons/8/8b/VW_logo_2019.png",
    models: ["Virtus", "Taigun", "Tiguan", "Polo", "Vento"]
  },
  {
    brand: "Nissan",
    logo: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Nissan_2020_logo.svg",
    models: ["Magnite", "Kicks", "GT-R", "Sunny", "X-Trail"]
  },
  {
    brand: "Renault",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/bf/Renault_2021.svg",
    models: ["Kiger", "Triber", "Duster", "Kwid", "Captur"]
  }
];


const CategoryContainer = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filteredBrands = carBrands.filter((brand) =>
    brand.brand.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div id="category" className="container " style={{ backgroundColor: "#111828" }}>
      <h2 className="text-center text-white mb-2">Select Your Car Brand</h2>

      <div className="input-group mb-md-4 mb-3">
        <input
          type="text"
          className="form-control bg-dark text-white border-secondary"
          placeholder="🔍 Search car brands..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

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
              onClick={() => navigate(`/brand/${brand.brand}`)}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <img
                src="src/assets/shop.png" // Assuming the logo is stored locally
                alt={`${brand.brand} logo`}
                className="card-img-top p-3"
                style={{ height: "100px", objectFit: "contain" }}
              />
              <div className="card-body d-flex align-items-center justify-content-center">
                <h5 className="card-title text-center fw-bold">{brand.brand}</h5>
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
