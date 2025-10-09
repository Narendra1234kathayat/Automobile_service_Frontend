import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axiosInstance, { BASE_URL } from "../../utils/axiosInstance";

const ProductContainer = () => {
  const { brandName } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [visibleCount, setVisibleCount] = useState(10);
  const [loadingMore, setLoadingMore] = useState(false);

  // Fetch brand models from API
  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(
          `/api/car-model/get-car-model/${brandName}`
        );
        if (res.status !== 200) {
          throw new Error(res.data.message || "Failed to fetch models");
        }

        setModels(res.data.data || []);
        setError("");
        setVisibleCount(10);
      } catch (err) {
        console.log("Error fetching models:", err);
        setError("No models under this brand found...");
        setModels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, [brandName]);

  // Filter models based on search
  const filteredModels = models.filter(
    (model) =>
      model.carModel &&
      model.carModel.toLowerCase().includes(search.toLowerCase())
  );

  // Get visible models for pagination
  const visibleModels = filteredModels.slice(0, visibleCount);
  const hasMore = visibleCount < filteredModels.length;

  // Load more models
  const loadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + 10);
      setLoadingMore(false);
    }, 300);
  };

  // Reset visible count when search changes
  useEffect(() => {
    setVisibleCount(10);
  }, [search]);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border mb-3" style={{ color: "#00d4ff" }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h4 style={{ color: "#e8f4f8" }}>Loading {brandName} Models...</h4>
      </div>
    );
  }

  if (error || models.length === 0) {
    return (
      <div className="container  text-center">
        <div className="fs-1 mb-3" style={{ color: "#ff6b6b" }}>
          <i className="fas fa-exclamation-triangle"></i>
        </div>
        <h3 style={{ color: "#e8f4f8" }} className="mb-3">{error || "No models found"}</h3>
        <button 
          className="btn btn-lg px-4 py-2"
          style={{
            backgroundColor: "#00d4ff",
            color: "#1a1a2e",
            border: "none",
            borderRadius: "25px",
            fontWeight: "600"
          }}
          onClick={() => window.location.reload()}
        >
          <i className="fas fa-redo me-2"></i>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      className="container py-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="text-center ">
        <h2 className="fw-bold" style={{ color: "#e8f4f8" }}>
          <i className="fas fa-car me-2" style={{ color: "#00d4ff" }}></i>
          {brandName} Models
        </h2>
        <div 
          className="mx-auto " 
          style={{ 
            width: "80px", 
            height: "3px", 
            background: "linear-gradient(90deg, #00d4ff, #64b5f6)",
            borderRadius: "2px" 
          }} 
        />
        <p className="mt-3" style={{ color: "#a8b8c8" }}>
          {filteredModels.length} model{filteredModels.length !== 1 ? 's' : ''} available
        </p>
      </div>

      {/* Search Bar */}
      <div className="row justify-content-center mb-4">
        <div className="col-md-6">
          <div className="input-group">
            <span 
              className="input-group-text" 
              style={{ 
                backgroundColor: "#00d4ff", 
                border: "1px solid #00d4ff",
                color: "#1a1a2e"
              }}
            >
              <i className="fas fa-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search car models..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                backgroundColor: "rgba(255,255,255,0.08)",
                color: "#e8f4f8",
                border: "1px solid rgba(0,212,255,0.3)",
                backdropFilter: "blur(10px)"
              }}
            />
            {search && (
              <button
                className="btn"
                onClick={() => setSearch("")}
                style={{
                  backgroundColor: "transparent",
                  border: "1px solid rgba(0,212,255,0.3)",
                  color: "#00d4ff"
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Models Grid */}
      {visibleModels.length > 0 ? (
        <>
          <div className="row g-4">
            {visibleModels.map((model, index) => (
              <motion.div 
                className="col-lg-3 col-md-4 col-6" 
                key={model._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div
                  className="card h-100 border-0 shadow-lg model-card"
                  style={{ 
                    cursor: "pointer", 
                    background: "linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)",
                    backdropFilter: "blur(15px)",
                    borderRadius: "20px",
                    border: "1px solid rgba(0,212,255,0.2)",
                    transition: "all 0.3s ease"
                  }}
                  onClick={() =>
                    navigate(`/brand/${brandName}/model/${model.carModel}`)
                  }
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-8px)";
                    e.target.style.borderColor = "#00d4ff";
                    e.target.style.boxShadow = "0 15px 40px rgba(0,212,255,0.25)";
                    e.target.style.background = "linear-gradient(145deg, rgba(0,212,255,0.1) 0%, rgba(0,212,255,0.05) 100%)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.borderColor = "rgba(0,212,255,0.2)";
                    e.target.style.boxShadow = "0 8px 25px rgba(0,0,0,0.1)";
                    e.target.style.background = "linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)";
                  }}
                >
                  <div className="position-relative overflow-hidden">
                    <img
                      src={
                        model.carModelImage
                          ? `${BASE_URL}${model.carModelImage}`
                          : "https://via.placeholder.com/300x200/00d4ff/1a1a2e?text=No+Image"
                      }
                      className="card-img-top"
                      alt={model.carModel}
                      style={{ 
                        height: "200px", 
                        objectFit: "contain",
                        borderRadius: "20px 20px 0 0"
                      }}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/300x200/64b5f6/ffffff?text=No+Image";
                      }}
                    />
                    <div className="position-absolute top-0 end-0 m-3">
                      <span 
                        className="badge rounded-pill px-3 py-2"
                        style={{ 
                          backgroundColor: "#00d4ff", 
                          color: "#1a1a2e",
                          fontWeight: "600"
                        }}
                      >
                        <i className="fas fa-car me-1"></i>
                        Model
                      </span>
                    </div>
                  </div>
                  
                  <div className="card-body text-center p-4">
                    <h5 className="card-title fw-bold mb-2" style={{ color: "#e8f4f8" }}>
                      {model.carModel}
                    </h5>
                    <div className="mt-2" style={{ color: "#00d4ff" }}>
                      <small className="fw-semibold">
                        <i className="fas fa-arrow-right me-1"></i>
                        View Details
                      </small>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center mt-5">
              <button
                className="btn btn-lg px-5 py-3 me-3"
                onClick={loadMore}
                disabled={loadingMore}
                style={{ 
                  background: "linear-gradient(135deg, #00d4ff, #64b5f6)",
                  color: "#1a1a2e",
                  border: "none",
                  borderRadius: "30px",
                  fontWeight: "600",
                  boxShadow: "0 6px 20px rgba(0,212,255,0.3)"
                }}
              >
                {loadingMore ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Loading...
                  </>
                ) : (
                  <>
                    <i className="fas fa-plus me-2"></i>
                    Load More ({filteredModels.length - visibleCount} remaining)
                  </>
                )}
              </button>
              
              <div className="mt-3">
                <small style={{ color: "#a8b8c8" }}>
                  Showing {visibleCount} of {filteredModels.length} models
                </small>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-5">
          <div className="fs-1 mb-3" style={{ color: "#64b5f6" }}>
            <i className="fas fa-search"></i>
          </div>
          <h5 style={{ color: "#e8f4f8" }}>No models found</h5>
          <p style={{ color: "#a8b8c8" }}>
            {search ? `No results for "${search}"` : "No models available"}
          </p>
          {search && (
            <button 
              className="btn px-4 py-2"
              onClick={() => setSearch("")}
              style={{
                backgroundColor: "transparent",
                border: "2px solid #00d4ff",
                color: "#00d4ff",
                borderRadius: "25px",
                fontWeight: "600"
              }}
            >
              <i className="fas fa-times me-2"></i>
              Clear Search
            </button>
          )}
        </div>
      )}

      {/* Back Button */}
      <div className="text-center mt-5">
        <button
          className="btn px-4 py-2"
          onClick={() => navigate(-1)}
          style={{
            backgroundColor: "transparent",
            border: "2px solid rgba(232,244,248,0.3)",
            color: "#e8f4f8",
            borderRadius: "25px",
            fontWeight: "500"
          }}
        >
          <i className="fas fa-arrow-left me-2"></i>
          Back to Brands
        </button>
      </div>
    </motion.div>
  );
};

export default ProductContainer;
