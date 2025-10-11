import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";

const StoreScroller = () => {
  const [stores, setStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const navigate = useNavigate();

  // Fetch stores from backend
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

  // Extract unique states and cities from stores
  const states = useMemo(() => {
    const allStates = stores
      .map((s) => s?.address?.state)
      .filter(Boolean);
    return [...new Set(allStates)];
  }, [stores]);

  const cities = useMemo(() => {
    const allCities = stores
      .filter((s) => !selectedState || s?.address?.state === selectedState)
      .map((s) => s?.address?.city)
      .filter(Boolean);
    return [...new Set(allCities)];
  }, [stores, selectedState]);

  // Filtered stores based on search, state, and city
  const filteredStores = useMemo(() => {
    return stores.filter((store) => {
      const storeName = getStoreDisplayName(store).toLowerCase();
      const matchesSearch = storeName.includes(searchTerm.toLowerCase());
      const matchesState = selectedState
        ? store?.address?.state === selectedState
        : true;
      const matchesCity = selectedCity
        ? store?.address?.city === selectedCity
        : true;
      return matchesSearch && matchesState && matchesCity;
    });
  }, [stores, searchTerm, selectedState, selectedCity]);

  return (
    <div className="container py-3">
      <h1 className="text-white fs-1 mb-4">Stores</h1>

      {/* Filters Section */}
      <div className="row mb-4">
        <div className="col-md-4 mb-2">
          <input
            type="text"
            className="form-control bg-light text-white rounded-3 bg-transparent"
            placeholder="Search by store name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="col-md-4 mb-2 col-6">
          <select
            className="form-select bg-light text-dark rounded-3"
            value={selectedState}
            onChange={(e) => {
              setSelectedState(e.target.value);
              setSelectedCity(""); // Reset city when state changes
            }}
          >
            <option value="">Select State</option>
            {states.map((state, index) => (
              <option key={index} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-4 mb-2 col-6">
          <select
            className="form-select bg-light text-dark rounded-3"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            disabled={!selectedState && cities.length === 0}
          >
            <option value="">Select City</option>
            {cities.map((city, index) => (
              <option key={index} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Store Cards */}
      <div className="row">
        {filteredStores.length > 0 ? (
          filteredStores.map((store) => (
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
                    style={{
                      height: "80px",
                      width: "80px",
                      objectFit: "cover",
                    }}
                    className="me-3 rounded"
                  />
                  <div>
                    <p className="fw-bold mb-lg-1 fs-xl-1 fs-6">
                      {getStoreDisplayName(store)}
                    </p>
                    <p className="mb-0">
                      {store?.address?.city || "No city"},{" "}
                      {store?.address?.state || ""}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-white text-center mt-4">No stores found.</p>
        )}
      </div>
    </div>
  );
};

export default StoreScroller;
