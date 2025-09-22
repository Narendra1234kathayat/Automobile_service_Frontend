import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance, { BASE_URL } from "../../utils/axiosInstance";
import { useSelector } from "react-redux";
// Variants (static for now, in lowercase)
const variants = ["petrol", "diesel", "cng", "electric"];

const SparePartsPage = () => {
  const { brandName, modelName } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState(["All"]);
  const [spareParts, setSpareParts] = useState([]);

  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedVariant, setSelectedVariant] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const data = useSelector((state) => state.search.query);

  useEffect(() => {
    if (data) {
      setSearchTerm(data);
    }
  }, [data]);


  // ✅ Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get("/api/category/get-category");
        setCategories(["All", ...res.data.data.map((cat) => cat.name)]);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // ✅ Fetch Brands
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await axiosInstance.get("/api/car-brand/get-brand");
        setBrands(res.data.data);
      } catch (err) {
        console.error("Error fetching brands:", err);
      }
    };
    fetchBrands();
  }, []);

  // ✅ Fetch Models (on brand change)
  const fetchModels = async (brandId) => {
    try {
      const res = await axiosInstance.get(`/api/car-model/get-carmodel/${brandId}`);
      setModels(res.data.data);
      return res.data.data;
    } catch (err) {
      console.error("Error fetching models:", err);
      return [];
    }
  };

  // ✅ Auto select Brand & Model from params
  useEffect(() => {
    if (brandName && brands.length > 0) {
      const brand = brands.find(
        (b) => b.name.toLowerCase() === brandName.toLowerCase()
      );
      if (brand) {
        setSelectedBrand(brand._id);
        fetchModels(brand._id).then((modelsList) => {
          if (modelName && modelsList.length > 0) {
            const model = modelsList.find(
              (m) => m.carModel.toLowerCase() === modelName.toLowerCase()
            );
            if (model) {
              setSelectedModel(model._id);
            }
          }
        });
      }
    }
  }, [brandName, modelName, brands]);

  // ✅ Fetch Spare Parts
  useEffect(() => {
    const fetchSpareParts = async () => {
      try {
        const res = await axiosInstance.get("/api/spare-part/spare-parts/mechanic");
        setSpareParts(res.data.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchSpareParts();
  }, []);

  const handleCategoryClick = (category) => setSelectedCategory(category);

  // ✅ Reset Filters
  const handleResetFilters = () => {
    setSelectedCategory("All");
    setSelectedBrand("");
    setSelectedModel("");
    setSelectedVariant("");
    setSearchTerm("");
    setModels([]); // reset models dropdown
  };
  // ✅ Deduplicate products by name (ignoring case + spaces)
const uniqueParts = Array.from(
  new Map(
    spareParts.map((part) => [part.name?.trim().toLowerCase(), part])
  ).values()
);


  // ✅ Filtering spare parts
  const filteredParts = uniqueParts.filter((part) => {
    const matchesCategory =
      selectedCategory === "All" || part.categoryId?.name === selectedCategory;

    const matchesSearch = part.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesBrand =
      !selectedBrand || part.brandId?.some((b) => b._id === selectedBrand);

    const matchesModel =
      !selectedModel || part.modelId?.some((m) => m._id === selectedModel);

    const matchesVariant =
      !selectedVariant ||
      part.variant?.some(
        (v) => v.toLowerCase() === selectedVariant.toLowerCase()
      );

    return (
      matchesCategory &&
      matchesSearch &&
      matchesBrand &&
      matchesModel &&
      matchesVariant
    );
  });

  return (
    <div
      className="container py-5"
      style={{ backgroundColor: "#111828", minHeight: "100vh", color: "#f1f1f1" }}
    >
      <h2 className="text-center mb-4 text-light">
        {brandName && modelName
          ? `Spare Parts for ${brandName} ${modelName}`
          : "All Spare Parts"}
      </h2>

      {/* Filter Controls */}
      <div className="row mb-4 ">
        {/* Search Input */}
        <div className="col-md-4 col-sm-6 mb-2">
          <input
            type="text"
            className="form-control bg-dark text-light border-secondary"
            placeholder="🔍 Search spare parts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Brand / Model / Variant dropdowns (only if not in URL params) */}
        {!brandName && !modelName && (
          <>
            {/* Brand */}
            <div className="col-md-4 col-6 mb-2">
              <select
                className="form-select bg-dark text-light border-secondary"
                value={selectedBrand}
                onChange={(e) => {
                  const brandId = e.target.value;
                  setSelectedBrand(brandId);
                  setSelectedModel("");
                  fetchModels(brandId);
                }}
              >
                <option value="">🚘 Select Brand</option>
                {brands.map((brand) => (
                  <option key={brand._id} value={brand._id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Model */}
            <div className="col-md-4 col-6 mb-2">
              <select
                className="form-select bg-dark text-light border-secondary"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                disabled={!selectedBrand}
              >
                <option value="">🚗 Select Model</option>
                {models.map((model) => (
                  <option key={model._id} value={model._id}>
                    {model.carModel}
                  </option>
                ))}
              </select>
            </div>

            {/* Variant */}
            <div className="col-md-4 col-6 mb-2">
              <select
                className="form-select bg-dark text-light border-secondary"
                value={selectedVariant}
                onChange={(e) => setSelectedVariant(e.target.value)}
              >
                <option value="">🔧 Select Variant</option>
                {variants.map((variant, i) => (
                  <option key={i} value={variant}>
                    {variant.charAt(0).toUpperCase() + variant.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        {/* Reset Filters Button */}
        <div className="col-md-4 col-6  mb-2">
          <button
            className="btn bg-dark text-light border-secondary  w-100"
            onClick={handleResetFilters}
          >
            Remove Filters
          </button>
        </div>
      </div>

      {/* Category Buttons */}
      <div className="mb-4 d-flex flex-wrap gap-2 justify-content-center">
        {categories.map((cat, index) => (
          <button
            key={index}
            className={`btn ${selectedCategory === cat ? "btn-light" : "btn-outline-light"
              }`}
            onClick={() => handleCategoryClick(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Spare Parts List */}
      <div className="row">
        {filteredParts.length > 0 ? (
          filteredParts.map((part, index) => (
            <div
              className="col-sm-6 col-lg-3 col-md-4 mb-3"
              key={part._id}
              data-aos="zoom-in"            // ✅ AOS animation
              data-aos-delay={index * 100} // ✅ Staggered animation
            >
              <div
                className="card bg-dark text-light border-secondary shadow h-100"
                onClick={() => navigate(`/product/${part._id}`)}
                style={{
                  cursor: "pointer",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
                }}
              >
                <img
                  src={BASE_URL + part.image}
                  className="card-img-top p-2 bg-light"
                  alt={part.name}
                  style={{
                    height: "160px",
                    objectFit: "contain",
                    borderBottom: "1px solid #444",
                  }}
                />
                <div className="card-body d-flex flex-column text-center">
                  <h5 className="card-title fw-bold mb-2">{part.name}</h5>
                  <p className="card-text mb-1">
                    <strong>Category:</strong> {part.categoryId?.name}
                  </p>
                  <p className="card-text mb-1">
                    <strong>Price:</strong> ₹{part.price}
                  </p>
                  
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-white">No spare parts found.</p>
        )}

      </div>
    </div>
  );
};

export default SparePartsPage;
