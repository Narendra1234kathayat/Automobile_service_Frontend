import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance, { BASE_URL } from "../../utils/axiosInstance.js";
import AOS from "aos";
import "aos/dist/aos.css";

const SHORT_TEXT_LIMIT = 40;

const TextWithToggle = ({ text }) => {
  const [showMore, setShowMore] = useState(false);

  if (!text) return <span className="text-muted">N/A</span>;

  const isLong = text.length > SHORT_TEXT_LIMIT;
  const displayText = showMore || !isLong
    ? text
    : text.substring(0, SHORT_TEXT_LIMIT) + "...";

  return (
    <span>
      {displayText}
      {isLong && (
        <button
          type="button"
          className="btn btn-link p-0 ms-1 small text-info"
          onClick={() => setShowMore(!showMore)}
        >
          {showMore ? "Show Less" : "Show More"}
        </button>
      )}
    </span>
  );
};

const SupplierProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const supplierId = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    AOS.init({ duration: 700, once: true });
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get(
          `/api/spare-part/spare-parts/supplier/${supplierId}`
        );
        setProducts(res.data.data || []);
      } catch (err) {
        console.error("Error fetching products:", err.response?.data || err.message);
      }
    };
    if (supplierId) fetchProducts();
  }, [supplierId]);

  const handleEdit = (product) => {
    navigate("/supplier/add-product", { state: { product } });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axiosInstance.delete(`/api/spare-part/delete-spare-part/supplier/${id}`);
      setProducts(products.filter((p) => p._id !== id));
      alert("Product deleted successfully");
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Failed to delete product");
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.categoryId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.brandId?.some((b) => b.name?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="container mt-4">
      <div className="mb-4 d-sm-flex justify-content-between align-items-center flex-wrap gap-2">
  <h2 className="mb-0 text-white">My Spare Parts</h2>

  <div style={{ maxWidth: "300px", flex: "1 1 auto" }}>
    <input
      type="text"
      className="form-control form-control-sm mt-sm-0 mt-3"
      placeholder="🔍 Search by name, category, or brand..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  </div>
</div>


      <div className="row">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((p, idx) => (
            <div
              className="col-md-6 col-lg-4 mb-4"
              key={p._id}
              data-aos="fade-up"
              data-aos-delay={idx * 100} // stagger animation
            >
              <div className="card h-100 shadow-sm border-0 product-card compact-card">
                {p.image && (
                  <img
                    src={BASE_URL + "/" + p.image}
                    className="card-img-top"
                    alt={p.name}
                    style={{ height: "150px", objectFit: "contain" }}
                  />
                )}

                <div className="card-body text-white p-3">
                  <h6 className="card-title mb-2 text-truncate">{p.name}</h6>

                  <div className="mb-1 small">
                    <strong>Description: </strong>
                    <TextWithToggle text={p.description} />
                  </div>

                  <ul className="list-unstyled small mb-2">
                    <li>
                      <strong>Category:</strong> {p.categoryId?.name || "N/A"}
                    </li>
                    <li>
                      <strong>Specifications:</strong>{" "}
                      <TextWithToggle text={p.specifications} />
                    </li>
                  </ul>

                  <ul className="list-unstyled small mb-2 d-flex">
                    <li>
                      <strong>Brands:</strong>{" "}
                      {p.brandId?.map((b) => b.name).join(", ") || "N/A"}
                    </li>
                    <li>
                      <strong>Models:</strong>{" "}
                      {p.modelId?.map((m) => m.carModel).join(", ") || "N/A"}
                    </li>
                    <li>
                      <strong>Variants:</strong> {p.variant?.join(", ") || "N/A"}
                    </li>
                    {p.price && (
                      <li>
                        <strong>Price:</strong> ₹{p.price}
                      </li>
                    )}
                  </ul>
                </div>

                <div className="card-footer bg-transparent border-0 d-flex justify-content-between p-2">
                  <button
                    className="btn btn-sm btn-outline-warning"
                    onClick={() => handleEdit(p)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(p._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-white text-center">No spare parts found.</p>
        )}
      </div>
    </div>
  );
};

export default SupplierProducts;
