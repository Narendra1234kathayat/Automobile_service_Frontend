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
    <div className="row  py-3 ">
      <h1 className="text-white fs-1">Stores</h1>
      {stores.map((store) => (
        <div className="col-md-4 col-sm-6 my-3">
          <div
            key={store.id}
            className="  border rounded shadow-sm text-white shop-container bg-dark"
            style={{ height: "120px", flex: "0 0 auto", cursor: "pointer" }}
            onClick={() => navigate(`/store/${store.id}`)}
          >
            <div className="d-flex align-items-center p-2 my-2 ">
              <img
                src="src/assets/shop.png"
                alt={store.name}
                style={{ height: "80px", width: "80px", objectFit: "cover" }}
                className="me-3 rounded"
              />
              <div>
                <p className="fw-bold mb-lg-1 fs-xl-1 fs-6">
                  {store.name.length > 10 ? store.name.substring(0, 10) + "..." : store.name}
                </p>
                <p className="mb-0">{store.city}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StoreScroller;
