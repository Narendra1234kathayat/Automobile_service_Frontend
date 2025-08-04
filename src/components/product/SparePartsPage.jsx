// src/SparePartsPage.js

import React, { useEffect, useState } from "react";

function SparePartsPage() {
  const [parts, setParts] = useState([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Fetch filtered spare parts
  const fetchParts = () => {
    let query = [];
    if (name) query.push(`name=${name}`);
    if (category) query.push(`category=${category}`);
    if (minPrice) query.push(`minPrice=${minPrice}`);
    if (maxPrice) query.push(`maxPrice=${maxPrice}`);
    const queryString = query.length ? "?" + query.join("&") : "";
    fetch(`http://localhost:4000/products${queryString}`)
      .then((res) => res.json())
      .then(setParts);
  };

  useEffect(() => {
    fetchParts();
    // eslint-disable-next-line
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchParts();
  };

  // Example static categories, replace with dynamic fetch if needed
  const categories = [
    { value: "", label: "All" },
    { value: "engine", label: "Engine" },
    { value: "body", label: "Body" },
    { value: "electrical", label: "Electrical" },
    { value: "accessory", label: "Accessory" }
  ];

  return (
    <div className="container my-5">
      <h1 className="mb-4">Spare Parts</h1>
      <div className="row">
        {/* Filter Section */}
        <div className="col-md-3">
          <div className="card p-3 mb-3 shadow-sm">
            <h5 className="mb-3">Filters</h5>
            <form onSubmit={handleFilter}>
              <div className="form-group mb-3">
                <label htmlFor="name">Product Name</label>
                <input
                  id="name"
                  type="text"
                  className="form-control"
                  placeholder="Search name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  className="form-control"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                >
                  {categories.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div className="form-group mb-3">
                <label htmlFor="minPrice">Min Price</label>
                <input
                  id="minPrice"
                  type="number"
                  className="form-control"
                  placeholder="Min price"
                  value={minPrice}
                  onChange={e => setMinPrice(e.target.value)}
                  min="0"
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="maxPrice">Max Price</label>
                <input
                  id="maxPrice"
                  type="number"
                  className="form-control"
                  placeholder="Max price"
                  value={maxPrice}
                  onChange={e => setMaxPrice(e.target.value)}
                  min="0"
                />
              </div>
              <button className="btn btn-primary w-100 mt-2" type="submit">
                Apply Filters
              </button>
            </form>
          </div>
        </div>
        {/* Products Section */}
        <div className="col-md-9">
          <div className="row">
            {parts.length === 0 && (
              <div className="col-12">
                <div className="alert alert-info text-center">No spare parts found.</div>
              </div>
            )}
            {parts.map(part => (
              <div className="col-lg-4 col-md-6 mb-4" key={part._id}>
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{part.name}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">{part.category}</h6>
                    <p className="card-text">
                      <strong>Price:</strong> ₹{part.price}<br />
                      <strong>In stock:</strong> {part.quantity}
                    </p>
                  </div>
                  <div className="card-footer bg-transparent border-0">
                    <button className="btn btn-success w-100" disabled={part.quantity <= 0}>
                      {part.quantity > 0 ? "Buy Now" : "Out of Stock"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SparePartsPage;
