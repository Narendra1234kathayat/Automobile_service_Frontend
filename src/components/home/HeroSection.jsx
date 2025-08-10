import React from "react";

const HeroSection = () => {
  return (
    <section
      className="py-5"
      style={{
        backgroundColor: "#111828",
        color: "#f8f9fa", // Bootstrap's light color
        
      }}
    >
      <div className="container ">
        <div className="row align-items-center">
          {/* Text Section */}
          <div className="col-md-6 text-center text-md-start">
            <h1 className="display-4 fw-bold mb-3">
              Find Genuine <span style={{ color: "#05976A" }}>Spare Parts</span> Easily
            </h1>
            <p className="lead mb-4">
              Discover nearby hardware shops, check availability, and track your
              vehicle's servicing—all in one place.
            </p>
            <a href="#category" className="btn btn-lg" style={{ background: "#05976A" }}>
              Explore Brands
            </a>
          </div>

          {/* Image Section */}
          <div className="col-md-6 text-center mt-5 mt-md-0">
            <img
              src="https://media.istockphoto.com/id/526209999/photo/auto-parts.jpg?s=612x612&w=0&k=20&c=yXvzy425jTHSTKWxd7XCdIuh9zLLnTfNHD1jrRCwkrk="
              alt="Spare Parts"
              className="img-fluid"
              style={{ maxHeight: "350px" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
