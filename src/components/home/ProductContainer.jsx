import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { carBrands } from "./CategoryContainer.jsx"; // Adjust as necessary

const ProductContainer = () => {
  const { brandName } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");


  const selectedBrand = carBrands.find(
    (brand) => brand.brand.toLowerCase() === brandName.toLowerCase()
  );

  if (!selectedBrand) {
    return (
      <div className="container mt-5">
        <h3 className="text-danger">Brand not found!</h3>
      </div>
    );
  }
  // console.log("Selected Brand:", selectedBrand.models);
  const filteredModels = selectedBrand.models.filter((model) =>
    // console.log("Model:", model),
    model.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4 white">{selectedBrand.brand} Models</h2>

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
        {filteredModels.map((model, i) => (
          <div className="col-lg-3 col-md-4 col-sm-6 mb-4"  key={i}>
            <div
              className="card h-100 border  shadow-sm"
              style={{ cursor: "pointer",backgroundColor:"transparent" }}
              onClick={() =>
                // navigate(`/model/${model}/brand/${selectedBrand.brand}`)
                 navigate(`/brand/${selectedBrand.brand}/model/${model}`)
              }
            >
              <img
                src="https://imgd.aeplcdn.com/370x208/n/cw/ec/106815/creta-exterior-right-front-three-quarter-5.jpeg?isig=0"
                className="card-img-top"
                alt={model.name}
                style={{ height: "auto", objectFit: "cover" }}
              />
              <div className="card-body d-flex align-items-center justify-content-center">
                <h5 className="card-title text-center  fw-bold" style={{color:"white"}}>
                  {model}
                </h5>
              </div>
            </div>
          </div>
        ))}
        {filteredModels.length === 0 && (
          <div className="col-12 text-center text-muted ">No model found.</div>
        )}
      </div>
    </div>
  );
};

export default ProductContainer;
