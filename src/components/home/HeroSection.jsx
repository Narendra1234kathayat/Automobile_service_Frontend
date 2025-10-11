import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const HeroSection = () => {
  

  return (
    <section className="pt-lg-2 pt-3 mb-lg-4 mb-3">
      <div className="container">
        <div className="row align-items-center">
          
          {/* Text Section */}
          <div
            className="col-md-6 my-3   text-center text-md-start"
            data-aos="fade-right"
          >
            <h1 className="display-4 fw-bold mb-3 text-white">
              Find Genuine <span className="text-success">Spare Parts</span> Easily
            </h1>
            <p className="lead  text-white">
              Connecting Mechanics with Spare Parts Suppliers - Instantly, Efficiently, Digitally.
            </p>
            <p className="text-white">   Your Complete B2B Marketplace for Automotive Spare Parts - Streamlining Orders, Optimizing Inventory, Accelerating Business.
</p>
            <a
              href="#category"
              className="btn btn-lg btn-success px-4 py-2 rounded-pill"
              data-aos="zoom-in"
              data-aos-delay="200"
            >
              <i className="fas fa-search me-2"></i>
              Explore Brands
            </a>
          </div>

          {/* Image Section */}
          <div
            className="col-md-6 text-center mt-4 mt-md-0"
            data-aos="fade-left"
          >
            <img
              src="https://media.istockphoto.com/id/526209999/photo/auto-parts.jpg?s=612x612&w=0&k=20&c=yXvzy425jTHSTKWxd7XCdIuh9zLLnTfNHD1jrRCwkrk="
              alt="Spare Parts"
              className="img-fluid rounded shadow-lg"
              style={{ maxHeight: "350px" }}
              data-aos="fade-left"
              data-aos-delay="300"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
