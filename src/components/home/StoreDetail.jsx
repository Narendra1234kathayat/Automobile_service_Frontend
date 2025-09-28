import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaPhone, FaMapMarkerAlt, FaStore, FaCity, FaEnvelope } from "react-icons/fa";
import axiosInstance, { BASE_URL } from "../../utils/axiosInstance";
import AOS from "aos";
import "aos/dist/aos.css";
import ClipLoader from "react-spinners/ClipLoader";

const StoreDetail = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();

  const [supplier, setSupplier] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loadingSupplier, setLoadingSupplier] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const [categories, setCategories] = useState([]); // For dropdown

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  // Fetch supplier details
  const fetchSupplier = async () => {
    setLoadingSupplier(true);
    try {
      const res = await axiosInstance.get(
        `${BASE_URL}api/supplier-requests/get-supplierById/${storeId}`
      );
      if (res.data.data) {
        setSupplier(res.data.data);
        return res.data.data;
      } else {
        setSupplier(null);
        return null;
      }
    } catch (err) {
      console.error("Failed to fetch supplier details:", err);
      setSupplier(null);
      return null;
    } finally {
      setLoadingSupplier(false);
    }
  };

  // Fetch all products
  const fetchProducts = async (supplierObj) => {
    if (!supplierObj) return;
    setLoadingProducts(true);
    try {
      const res = await axiosInstance.get(
        `${BASE_URL}api/spare-part/spare-parts/supplier/${supplierObj.userId._id}`
      );
      const products = res.data.data || [];
      setAllProducts(products);
      setFilteredProducts(products);

      // Extract unique categories for dropdown
      const uniqueCategories = [
        ...new Set(products.map((p) => p.categoryId?.name).filter(Boolean)),
      ];
      setCategories(uniqueCategories);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setAllProducts([]);
      setFilteredProducts([]);
      setCategories([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Fetch supplier and products on mount
  useEffect(() => {
    const fetchData = async () => {
      const fetchedSupplier = await fetchSupplier();
      if (fetchedSupplier) {
        await fetchProducts(fetchedSupplier);
      }
    };
    fetchData();
  }, [storeId]);

  // Frontend filter: search + category
  const handleFilter = () => {
    let filtered = allProducts;

    if (search) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      filtered = filtered.filter(
        (p) => p.categoryId?.name.toLowerCase() === category.toLowerCase()
      );
    }

    setFilteredProducts(filtered);
  };

  // Apply filter whenever search or category changes
  useEffect(() => {
    handleFilter();
  }, [search, category, allProducts]);

  if (loadingSupplier)
    return (
      <div className="d-flex justify-content-center align-items-center text-light mt-5">
        <ClipLoader size={50} color="#ffc107" />
        <span className="ms-3">Loading supplier details...</span>
      </div>
    );

  if (!supplier)
    return (
      <div className="text-light text-center my-5">
        ⚠️ Supplier not found or unavailable.
      </div>
    );

  return (
    <div className="container my-4 text-light">
      <button
        className="btn btn-outline-light mb-3"
        onClick={() => navigate(-1)}
        data-aos="fade-right"
      >
        ← Back
      </button>

      {/* Supplier Info */}
      <div
        className="card bg-dark text-light shadow-lg p-4 border-0 rounded mb-3"
        data-aos="fade-up"
      >
        <h2 className="fw-bold mb-3">
          <FaStore className="me-2 text-warning" />
          {supplier.storeName}
        </h2>
        <p className="mb-2">
          <FaCity className="me-2 text-info" /> <strong>City:</strong>{" "}
          {supplier.address?.city || "N/A"}
        </p>
        <p className="mb-2">
          <FaPhone className="me-2 text-success" /> <strong>Contact:</strong>{" "}
          {supplier.userId?.phoneNumber || supplier.contact || "N/A"}
        </p>
        <p className="mb-2">
          <FaEnvelope className="me-2 text-primary" /> <strong>Email:</strong>{" "}
          {supplier.userId?.email || supplier.email || "N/A"}
        </p>
        <p className="mb-2">
          <FaMapMarkerAlt className="me-2 text-danger" /> <strong>Address:</strong>{" "}
          {supplier.address
            ? `${supplier.address.street}, ${supplier.address.city}, ${supplier.address.state}, ${supplier.address.country} - ${supplier.address.pincode}`
            : "N/A"}
        </p>

      </div>

      {/* Search & Category Dropdown */}
      <div className="mb-4" data-aos="fade-right">
        <div className="row g-2 align-items-center">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Search product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <button
              className="btn btn-secondary w-100"
              onClick={() => {
                setSearch("");
                setCategory("");
              }}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>


      {/* Products */}
      {loadingProducts ? (
        <div className="d-flex justify-content-center align-items-center text-light mt-5">
          <ClipLoader size={50} color="#17a2b8" />
          <span className="ms-3">Loading products...</span>
        </div>
      ) : (
        <div className="row g-3">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product._id || product.id}
                className="col-md-4"
                data-aos="fade-up"
                onClick={()=> navigate(`/product/${product._id}`)}
              >
                <div className="card bg-dark text-light shadow-sm p-3 h-100">
                  <h5 className="fw-bold">{product.name}</h5>
                  <p className="mb-1">Price: ₹{product.price}</p>
                  <p className="mb-0">Category: {product.categoryId?.name}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12">
              <div
                className="alert alert-warning text-center"
                data-aos="fade-left"
                style={{ marginTop: "20px" }}
              >
                ⚠️ No spare parts found for this supplier.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StoreDetail;
