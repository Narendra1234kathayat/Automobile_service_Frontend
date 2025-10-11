import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import axiosInstance, { BASE_URL } from "../../utils/axiosInstance";
import AOS from "aos";
import "aos/dist/aos.css";

const SpareParts = () => {
  const navigate = useNavigate();
  const [spareParts, setSpareParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState({});

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: false,
    });
    AOS.refresh();
  }, []);

  // Responsive breakpoints for the carousel
  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 1200 }, items: 4, slidesToSlide: 4 },
    desktop: { breakpoint: { max: 1200, min: 992 }, items: 3, slidesToSlide: 3 },
    tablet: { breakpoint: { max: 992, min: 768 }, items: 2, slidesToSlide: 2 },
    mobile: { breakpoint: { max: 768, min: 0 }, items: 1, slidesToSlide: 1 },
  };

  const fetchSpareparts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/api/spare-part/spare-parts/mechanic");
      setSpareParts(response.data.data || []);
    } catch (error) {
      console.error("Error fetching spare parts:", error);
      toast.error("Failed to load spare parts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpareparts();
  }, []);

  const handleProductClick = (part) => {
    const productId = part.id || part._id;
    if (productId) {
      navigate(`/product/${productId}`);
    } else {
      toast.error("Product details not available");
    }
  };

  const handleImageError = (partId) => {
    setImageErrors((prev) => ({ ...prev, [partId]: true }));
  };

  const getImageSrc = (part) => {
    const partId = part.id || part._id;
    if (imageErrors[partId]) {
      return "https://via.placeholder.com/200x150/6c757d/ffffff?text=No+Image";
    }
    if (part.image) {
      if (part.image.startsWith("http")) return part.image;
      return `${BASE_URL}${part.image}`;
    }
    return "https://via.placeholder.com/200x150/28a745/ffffff?text=Spare+Part";
  };

  const formatPrice = (price) => {
    if (!price) return "Price not available";
    return `₹${Number(price).toLocaleString("en-IN")}`;
  };

  // Custom Left Arrow
  const CustomLeftArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="btn btn-dark rounded-circle position-absolute d-flex justify-content-center align-items-center"
      style={{
        left: "10px",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 10,
        width: "45px",
        height: "45px",
        border: "none",
        boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
      }}
    >
      <FaChevronLeft size={20} />
    </button>
  );

  // Custom Right Arrow
  const CustomRightArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="btn btn-dark rounded-circle position-absolute d-flex justify-content-center align-items-center"
      style={{
        right: "10px",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 10,
        width: "45px",
        height: "45px",
        border: "none",
        boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
      }}
    >
      <FaChevronRight size={20} />
    </button>
  );

  // ✅ Deduplicate by name (case + trim safe)
  const uniqueSpareParts = Array.from(
    new Map(
      spareParts.map((part) => [part.name?.trim().toLowerCase(), part])
    ).values()
  );

  // Loading State
  if (loading) {
    return (
      <div className="container mt-4" data-aos="fade-up">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="fs-1 text-white">Spare Parts</h3>
        </div>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
          <div className="text-center">
            <ClipLoader size={50} color="#28a745" />
            <p className="text-white mt-3">Loading spare parts...</p>
          </div>
        </div>
      </div>
    );
  }

  // Empty State
  if (uniqueSpareParts.length === 0) {
    return (
      <div className="container mt-4" data-aos="fade-up">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="fs-1 text-white">Spare Parts</h3>
        </div>
        <div className="text-center py-5">
          <div className="text-muted fs-1 mb-3">
            <i className="fas fa-box-open"></i>
          </div>
          <h5 className="text-white mb-3">No spare parts available</h5>
          <p className="text-muted mb-4">Check back later for new spare parts.</p>
          <button className="btn btn-outline-success" onClick={() => navigate("/spareparts")}>
            Browse Categories
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4" data-aos="fade-up">
      {/* Header */}
      <div className="d-flex  flex-row justify-content-between align-items-start align-items-sm-center mb-4">
        <h3 className="fs-1 text-white mb-2 mb-sm-0">
          Spare Parts
          <span className="badge bg-success ms-3 fs-6">{uniqueSpareParts.length}</span>
        </h3>
        <button className="btn btn-outline-success btn-sm px-4 text-white" onClick={() => navigate("/spareparts")}>
         
          View All
        </button>
      </div>

      {/* Carousel */}
      <div className="position-relative" data-aos="fade-up">
        <Carousel
          responsive={responsive}
          infinite={true}
          autoPlay={true}
          autoPlaySpeed={4000}
          keyBoardControl={true}
          customTransition="transform 300ms ease-in-out"
          transitionDuration={300}
          containerClass="carousel-container"
          removeArrowOnDeviceType={["tablet", "mobile"]}
          deviceType="desktop"
          dotListClass="custom-dot-list-style"
          itemClass="carousel-item-padding-40-px"
          customLeftArrow={<CustomLeftArrow />}
          customRightArrow={<CustomRightArrow />}
          showDots={uniqueSpareParts.length > 4}
          swipeable={true}
          draggable={true}
          ssr={true}
        >
          {uniqueSpareParts.map((part, index) => {
            const partId = part.id || part._id || index;
            return (
              <div key={partId} className="px-2" data-aos="fade-up">
                <div
                  className="card shadow-sm border-0 rounded-4 h-100 product-card"
                  style={{ cursor: "pointer", transition: "all 0.3s ease" }}
                  onClick={() => handleProductClick(part)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
                  }}
                >
                  <div className="position-relative overflow-hidden rounded-top-4">
                    <img
                      src={getImageSrc(part)}
                      className="card-img-top img-fluid"
                      alt={part.name || "Spare part"}
                      style={{
                        height: "200px",
                        objectFit: "contain",
                        backgroundColor: "#f8f9fa",
                        transition: "transform 0.3s ease",
                      }}
                      onError={() => handleImageError(partId)}
                      loading="lazy"
                    />
                  </div>
                  <div className="card-body text-center p-3">
                    <h6 className="card-title text-truncate mb-2 fw-bold" title={part.name}>
                      {part.name || "Unnamed Part"}
                    </h6>
                    <div className="d-flex justify-content-center align-items-center mb-2">
                      <span className="fw-bold text-success fs-5">{formatPrice(part.price)}</span>
                      {part.originalPrice && part.originalPrice > part.price && (
                        <span className="text-muted text-decoration-line-through ms-2 small">
                          ₹{Number(part.originalPrice).toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                    {part.brand && (
                      <small className="text-muted d-block">Brand: {part.brand}</small>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </Carousel>
      </div>

      {/* Refresh Button */}
      <div className="text-center mt-4" data-aos="fade-up">
        <button className="btn btn-outline-light btn-sm" onClick={fetchSpareparts} disabled={loading}>
          {loading ? (
            <>
              <ClipLoader size={16} color="#ffffff" className="me-2" />
              Refreshing...
            </>
          ) : (
            <>
              <i className="fas fa-sync-alt "></i>
              Refresh
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SpareParts;
