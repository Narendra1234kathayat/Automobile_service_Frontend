import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance, { BASE_URL } from "../../utils/axiosInstance";

const ProductContainer = () => {
  const { brandName } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch brand models from API
  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(
          `/api/car-model/get-car-model/${brandName}` // Adjust according to your backend route
        );
        if(res.status !== 200) {
          throw new Error(res.data.message || "Failed to fetch models");
        }
        
        
        setModels(res.data.data || []);
        setError("");
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

  if (loading) {
    return (
      <div className="container mt-5 text-center text-white">
        <h4>Loading...</h4>
      </div>
    );
  }

  if (error || models.length === 0) {
    return (
      <div className="container mt-5 text-center">
        <h3 className="text-white">{error || "No models found"}</h3>
      </div>
    );
  }

  // Apply search filter on carModel field
const filteredModels = models.filter(
  (model) =>
    model.carModel &&
    model.carModel.toLowerCase().includes(search.toLowerCase())
);


  return (
    <div className="container py-5">
      <h2 className="text-center mb-4 text-white">
        {brandName} Models
      </h2>

      {/* Search Bar */}
      <div className="input-group mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search car models..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="row">
        {filteredModels.map((model) => (
          <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={model._id}>
            <div
              className="card h-100 border shadow-sm"
              style={{ cursor: "pointer", backgroundColor: "transparent" }}
              onClick={() =>
                navigate(`/brand/${brandName}/model/${model.carModel}`)
              }
            >
              <img
                src={
                  model.carModelImage
                    ? `${BASE_URL}${model.carModelImage}`
                    : "https://via.placeholder.com/300x200?text=No+Image"
                }
                className="card-img-top"
                alt={model.carModel}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body d-flex align-items-center justify-content-center">
                <h5
                  className="card-title text-center fw-bold"
                  style={{ color: "white" }}
                >
                  {model.carModel}
                </h5>
              </div>
            </div>
          </div>
        ))}

        {filteredModels.length === 0 && (
          <div className="col-12 text-center text-muted">No model found.</div>
        )}
      </div>
    </div>
  );
};

export default ProductContainer;
