import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import CheckoutPage from "./CheckoutPage";

const CartPage = () => {
  const navigate = useNavigate();
  const [showCheckout, setShowCheckout] = useState(false);
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Brake Pad",
      description: "High quality brake pad for Toyota Innova.",
      price: 850,
      quantity: 2,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      name: "Air Filter",
      description: "OEM air filter for Hyundai Creta.",
      price: 450,
      quantity: 1,
      image: "https://via.placeholder.com/150",
    },
  ]);

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

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedItems = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedItems);
  };

  const increment = (id) => {
    const updatedItems = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updatedItems);
  };

  const decrement = (id) => {
    const updatedItems = cartItems.map((item) =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCartItems(updatedItems);
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const getTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  return (
    <div className="container py-5 position-relative ">
      <h2 className="mb-4 text-center " style={{ color: "#ffffffff" }}>
      Your  Cart
      </h2>

      {cartItems.length === 0 ? (
        <div className="text-center">
          <p className="lead">Your cart is empty.</p>
        </div>
      ) : (
        <>
          <div className="row gy-4">
            {cartItems.map((item, index) => (
              <div
                key={item.id}
                className="col-md-6 animate-on-scroll"
                ref={(el) => (cartRefs.current[index] = el)}
              >
                <div className="card h-100 shadow border-0 ">
                  <div className="row g-0">
                    <div className="col-md-4 d-flex align-items-center justify-content-center p-3 white">
                      <img
                        src={'data:image/jpeg;base64,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'}
                        alt={item.name}
                        className="img-fluid rounded"
                        style={{ maxHeight: "120px" }}
                      />
                    </div>
                    <div className="col-md-8 ">
                      <div className="card-body">
                        <h5 className="card-title fw-semibold ">
                          {item.name}
                        </h5>
                        <p className="card-text  small">
                          {item.description}
                        </p>
                        <p className="mb-2 fw-bold text-success">
                          ₹{item.price}
                        </p>

                        <div className="d-flex align-items-center gap-2">
                          <label className="form-label mb-0">Qty:</label>
                          <div className="input-group w-auto">
                            <button
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() => decrement(item.id)}
                              disabled={item.quantity === 1}
                            >
                              −
                            </button>
                            <input
                              type="text"
                              value={item.quantity}
                              readOnly
                              className="form-control form-control-sm text-center"
                              style={{ maxWidth: "50px" }}
                            />
                            <button
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() => increment(item.id)}
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <button
                          className="btn btn-outline-danger btn-sm mt-3"
                          onClick={() => removeItem(item.id)}
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
            <button className="btn btn-success mt-2 px-4" onClick={()=>{
              // navigate('/checkout')
              setShowCheckout(true);}}> 
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
