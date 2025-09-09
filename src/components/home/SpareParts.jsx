import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const SpareParts = () => {
  const navigate = useNavigate();
  const [spareParts, setSpareParts] = useState([]);

  const fetchspareparts = async () => {
    try {
      const response = await axiosInstance.get("/api/spare-part/spare-parts/mechanic");
      setSpareParts(response.data.data || []);
    } catch (error) {
      console.error("Error fetching spare parts:", error);
    }
  };

  useEffect(() => {
    fetchspareparts();
  }, []);

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fs-1 text-white">Spare Parts</h3>
        <button
          className="btn btn-outline-success btn-sm"
          onClick={() => navigate("/spareparts")}
        >
          View All
        </button>
      </div>

      <div id="sparePartsCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          {spareParts
            .reduce((rows, part, index) => {
              if (index % 4 === 0) rows.push([]);
              rows[rows.length - 1].push(part);
              return rows;
            }, [])
            .map((group, groupIndex) => (
              <div
                key={groupIndex}
                className={`carousel-item ${groupIndex === 0 ? "active" : ""}`}
              >
                <div className="row g-3">
                  {group.map((part, index) => (
                    <div
                      className="col-12 col-sm-6 col-md-4 col-lg-3"
                      key={part.id || part._id || index}
                    >
                      <div
                        className="card shadow-sm border-0 rounded-4 h-100"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleProductClick(part.id)}
                      >
                        <img
                          src={part.image || "https://via.placeholder.com/200?text=No+Image"}
                          className="card-img-top rounded-top-4 img-fluid"
                          alt={part.name}
                          style={{ height: "150px", objectFit: "cover" }}
                        />
                        <div className="card-body text-center">
                          <h6 className="card-title">{part.name}</h6>
                          <p className="mb-0">₹ {part.price}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>

        {/* Controls */}
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#sparePartsCarousel"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#sparePartsCarousel"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
};

export default SpareParts;
