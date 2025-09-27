import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import { useNavigate } from "react-router-dom";
import CategoryContainer from "./CategoryContainer.jsx";
import StoreContainer from "./StoreContainer.jsx";
import HeroSection from "./HeroSection.jsx";
import SpareParts from "./SpareParts.jsx";

const HomeScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 1000, // animation speed
      once: false,    // re-animate on scroll
      mirror: true,   // animate on scroll up
      offset: 100,    // trigger point offset
    });
  }, []);

  return (
    <div className="container mt-3 mt-auto">
      {/* Hero section */}
      <HeroSection />

      {/* Welcome Section */}
      <div
        className="jumbotron p-4 mb-4 bg-light border rounded"
        data-aos="fade-up"
      >
        <div className="row align-items-center">
          <div
            className="col-12  text-center py-md-5 py-3 px-md-3"
            style={{
              backgroundColor: "#111828",
              color: "#f8f9fa",
              borderRadius: "12px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            }}
            data-aos="zoom-in"
          >
            <h1
              className="display-5 fw-sm-bold  mb-3"
              style={{ color: "#05976A" }}
              data-aos="fade-down"
            >
              Welcome Mechanic to SpareLink!
            </h1>

            <p
              className="lead mb-4"
              style={{ fontSize: "1.2rem" }}
              
            >
              Browse users, service centers, and hardware shops with ease.
            </p>

            <button
              className="btn btn-outline-light btn-lg"
              onClick={() => navigate("/location")}
              style={{
                transition: "all 0.3s ease",
                borderColor: "#05976A",
                color: "#05976A",
              }}
              data-aos="zoom-in-up"
              data-aos-delay="400"
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#05976A";
                e.target.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
                e.target.style.color = "#05976A";
              }}
            >
              Get User Location
            </button>
          </div>
        </div>
      </div>

      {/* Spare Parts Section */}
      <div data-aos="fade-up">
        <SpareParts />
      </div>

      {/* Brands Section */}
      <p
        className="text-white fs-1"
        data-aos="fade-left"
        id="category"
      >
        Popular Brands
      </p>

      <div
        className="d-flex "
        
        style={{ whiteSpace: "nowrap" }}
        data-aos="zoom-in"
      >
        <CategoryContainer />
      </div>

      {/* Store Section */}
      <div
        className="row"
        data-aos="fade-up"
        data-aos-delay="200"
      >
         <StoreContainer /> 
      </div>
    </div>
  );
};

export default HomeScreen;
