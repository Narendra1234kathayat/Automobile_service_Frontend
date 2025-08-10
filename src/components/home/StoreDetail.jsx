import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SparePartsPage from "../product/SparePartsPage";
import { FaPhone, FaMapMarkerAlt, FaStore, FaCity } from "react-icons/fa";

const storeData = {
  "1": {
    name: "Auto Parts Shop",
    city: "Vadodara",
    contact: "+91 9876543210",
    address: "123 Auto Street, Vadodara",
    description:
      "Your trusted partner for high-quality automotive parts and accessories.",
    products: [
      { id: "p1", name: "Brake Pads", price: 500, stock: 20 },
      { id: "p2", name: "Engine Oil", price: 350, stock: 50 }
    ]
  },
  "2": {
    name: "FreshMart Grocery",
    city: "Ahmedabad",
    contact: "+91 9123456780",
    address: "45 Fresh Street, Ahmedabad",
    description:
      "Fresh groceries and daily essentials delivered to your doorstep.",
    products: [
      { id: "p3", name: "Apples", price: 120, stock: 100 },
      { id: "p4", name: "Bananas", price: 60, stock: 80 }
    ]
  },
  "3": {
    name: "TechBazaar",
    city: "Surat",
    contact: "+91 9988776655",
    address: "78 Tech Lane, Surat",
    description:
      "Latest gadgets and electronics at unbeatable prices.",
    products: [
      { id: "p5", name: "Laptop", price: 55000, stock: 10 },
      { id: "p6", name: "Headphones", price: 2000, stock: 25 }
    ]
  }
};

const StoreDetail = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState(null);

  useEffect(() => {
    setStore(storeData[storeId]);
  }, [storeId]);

  if (!store) return <p className="text-light">Loading store details...</p>;

  return (
    <div className="container mt-4 text-light">
      <button
        className="btn btn-outline-light mb-3"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <div className="card bg-dark text-light shadow-lg p-4 border-0 rounded">
        <div className="row g-4 align-items-center">
          {/* Store Info */}
          <div className="col-md-8">
            <h2 className="fw-bold mb-3">
              <FaStore className="me-2 text-warning" />
              {store.name}
            </h2>
            <p className="mb-2">
              <FaCity className="me-2 text-info" /> <strong>City:</strong>{" "}
              {store.city}
            </p>
            <p className="mb-2">
              <FaPhone className="me-2 text-success" /> <strong>Contact:</strong>{" "}
              {store.contact}
            </p>
            <p className="mb-2">
              <FaMapMarkerAlt className="me-2 text-danger" />{" "}
              <strong>Address:</strong> {store.address}
            </p>
            <p className="mt-3 text-muted">{store.description}</p>
          </div>

          {/* Store Image */}
          <div className="col-md-4 text-center">
            <img
              src={`https://via.placeholder.com/300x200.png?text=${encodeURIComponent(
                store.name
              )}`}
              alt={store.name}
              className="img-fluid rounded shadow"
            />
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="mt-5">
        <h4 className="mb-3 text-warning">Available Products</h4>
        <div className="list-group bg-dark">
          <SparePartsPage store={store.products} />
        </div>
      </div>
    </div>
  );
};

export default StoreDetail;
