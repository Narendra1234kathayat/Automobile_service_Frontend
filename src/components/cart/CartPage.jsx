import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart } from "../../Store/Slices/CartSlice.js";
import { BASE_URL } from "../../utils/axiosInstance.js";
import AOS from "aos";
import "aos/dist/aos.css";

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: false, // animate on scroll both up and down
    });
  }, []);

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  return (
    <div className="container py-4">
      <h2 className="text-center mb-5 text-white" style={{ fontWeight: "700" }}>
        Your Stock
      </h2>

      {cartItems.length === 0 ? (
        <div className="text-center py-5" data-aos="fade-left">
          <div className="text-muted fs-1 mb-3">
            <i className="fas fa-box-open"></i>
          </div>
          <h5 className="text-white mb-3">Your Stock is empty</h5>
          <p className="text-white mb-4">Explore our spare parts and add items to your wishlist.</p>
          <button className="btn btn-outline-success" onClick={() => navigate("/spareparts")}>
            Browse Spare Parts
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {cartItems.map((item, index) => (
            <div
              key={item.id}
              className="col-md-6"
              data-aos="fade-left"
              data-aos-delay={index * 100}
              style={{ cursor: "pointer" }}
            >
              <div
                className="card shadow-lg border-0 h-100 product-card"
                style={{
                  transition: "all 0.3s ease",
                  borderRadius: "1rem",
                  backgroundColor: "#2c3136",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.1)";
                }}
                onClick={() => navigate(`/product/${item._id}`)}
              >
                <div className="row g-0 align-items-center">
                  <div className="col-md-4 d-flex justify-content-center p-3">
                    <img
                      src={item.image ? `${BASE_URL}${item.image}` : "https://via.placeholder.com/120x120/28a745/ffffff?text=No+Image"}
                      alt={item.name}
                      className="img-fluid rounded"
                      style={{ maxHeight: "120px", objectFit: "contain" }}
                    />
                  </div>
                  <div className="col-md-8">
                    <div className="card-body">
                      <h5 className="card-title text-white fw-bold">{item.name}</h5>
                      <p className="card-text text-text-white-50 small">{item.description?.slice(0, 60)}</p>
                      <p className="text-success fw-bold mb-2">₹{item.price}</p>
                      <div className="d-flex justify-content-between mt-3">
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemove(item.id);
                          }}
                        >
                          Remove
                        </button>
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/product/${item._id}`);
                          }}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CartPage;
