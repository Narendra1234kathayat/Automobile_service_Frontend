import React from "react";
import { useNavigate } from "react-router-dom";

const stores = [
  {
    id: "1",
    name: "Auto Parts Shop",
    city: "Vadodara",
    image: "/assets/shop.png"
  },
  {
    id: "2",
    name: "FreshMart Grocery",
    city: "Ahmedabad",
    image: "/assets/shop2.png"
  },
  {
    id: "3",
    name: "TechBazaar",
    city: "Surat",
    image: "/assets/shop3.png"
  }
];

const StoreScroller = () => {
  const navigate = useNavigate();

  return (
    <div className="row gap-3  py-2">
      {stores.map((store) => (
        <div
          key={store.id}
          className=" col-md-3 my-3 border rounded shadow-sm text-white shop-container bg-dark"
          style={{ minWidth: "220px", minHeight: "120px", flex: "0 0 auto", cursor: "pointer" }}
          onClick={() => navigate(`/store/${store.id}`)}
        >
          <div className="d-flex align-items-center p-2">
            <img
              src="src/assets/shop.png"
              alt={store.name}
              style={{ height: "80px", width: "80px", objectFit: "cover" }}
              className="me-3 rounded"
            />
            <div>
              <p className="fw-bold mb-1 fs-5">{store.name}</p>
              <p className="mb-0">{store.city}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StoreScroller;
