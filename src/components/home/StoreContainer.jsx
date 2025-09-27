import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";

const StoreScroller = () => {
  const [stores, setStores] = useState([]);
  const navigate = useNavigate();

  const fetchSupplier = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/supplier-requests/get-supplier/mechanic`
      );
      setStores(response.data.data || []);
    } catch (error) {
      toast.error("Failed to load suppliers. Please try again.");
    }
  };

  useEffect(() => {
    fetchSupplier();
  }, []);

  // Helper function to get store name
  const getStoreDisplayName = (store) => {
    if (store?.storeName) {
      return store.storeName.length > 10
        ? store.storeName.substring(0, 10) + "..."
        : store.storeName;
    }
    return store?.userId?.name || "Unnamed Store";
  };

  return (
    <div className="row py-3">
      <h1 className="text-white fs-1">Stores</h1>
      {stores.map((store) => (
        <div key={store._id} className="col-md-4 col-sm-6 my-3">
          <div
            className="border rounded shadow-sm text-white shop-container bg-dark"
            style={{ height: "120px", flex: "0 0 auto", cursor: "pointer" }}
            onClick={() => navigate(`/store/${store._id}`)}
          >
            <div className="d-flex align-items-center p-2 my-2">
              <img
                src="src/assets/shop.png"
                alt={getStoreDisplayName(store)}
                style={{ height: "80px", width: "80px", objectFit: "cover" }}
                className="me-3 rounded"
              />
              <div>
                <p className="fw-bold mb-lg-1 fs-xl-1 fs-6">
                  {getStoreDisplayName(store)}
                </p>
                <p className="mb-0">{store?.address?.city || "No city"}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StoreScroller;
