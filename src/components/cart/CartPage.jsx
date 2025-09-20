import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart } from "../../Store/Slices/CartSlice.js";
import CheckoutPage from "./CheckoutPage";
import { BASE_URL } from "../../utils/axiosInstance.js";

const CartPage = () => {
  const navigate = useNavigate();
  

  const cartItems = useSelector((state) => state.cart.items);
  const [showCheckout, setShowCheckout] = useState(false);
  const cartRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.2 }
    );

    cartRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      cartRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const getTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  return (
    <div className="container py-5 position-relative">
      <h2 className="mb-4 text-center" style={{ color: "#ffffffff" }}>
        Your Wishlist
      </h2>

      {cartItems.length === 0 ? (
        <div className="text-center">
          <p className="lead">Your Wishlist is empty.</p>
        </div>
      ) : (
        <>
          <div className="row gy-4">
            {cartItems.map((item, index) => (
              <div
                key={item.id}
                className="col-md-6 animate-on-scroll"
                ref={(el) => (cartRefs.current[index] = el)}
                onClick={()=>navigate(`/product/${item._id}`)}
              >
                <div className="card h-100 shadow border-0">
                  <div className="row g-0">
                    <div className="col-md-4 d-flex align-items-center justify-content-center p-3">
                      <img
                        src={`${BASE_URL}${item.image}`}
                        alt={item.name}
                        className="img-fluid rounded"
                        style={{ maxHeight: "120px" }}
                      />
                    </div>
                    <div className="col-md-8">
                      <div className="card-body">
                        <h5 className="card-title fw-semibold">
                          {item.name}
                        </h5>
                        <p className="card-text small">
                          {item.description.slice(0,50)}
                        </p>
                        <p className="mb-2 fw-bold text-success">
                          ₹{item.price}
                        </p>
                        {/* <p className="mb-2">
                          <strong>Quantity:</strong> {item.quantity}
                        </p> */}

                        <button
                          className="btn btn-outline-danger btn-sm mt-2"
                          onClick={() => dispatch(removeFromCart(item.id))}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 text-end">
            <h4 className="fw-bold white">Total: ₹{getTotal()}</h4>
            <button
              className="btn btn-success mt-2 px-4"
              onClick={() => setShowCheckout(true)}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}

      {showCheckout && <CheckoutPage setShowCheckout={setShowCheckout} />}
    </div>
  );
};

export default CartPage;
