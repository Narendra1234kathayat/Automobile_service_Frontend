import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance.js"; // your axios setup

const SupplierProducts = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  // ✅ Replace with actual logged-in supplierId from token/session
  const supplierId = JSON.parse(localStorage.getItem("user")); // Example: "supplier123"

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("Fetching products for supplier:", supplierId);
        const res = await axiosInstance.get(
          `/api/spare-part/spare-parts/supplier/${supplierId}`
        );
        console.log("API response:", res.data);
        setProducts(res.data.data || []);
      } catch (err) {
        console.error("Error fetching products:", err.response?.data || err.message);
      }
    };

    if (supplierId) fetchProducts();
  }, [supplierId]);


  const handleEdit = (product) => {
    console.log("Editing product:", product);
    navigate("/supplier/add-product", { state: { product } });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await axiosInstance.delete(`/api/spareparts/${id}`);
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
    <div className="container my-5">
      <h2 className="mb-4 text-white">My Spare Parts</h2>

      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name, category, or brand..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="row">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((p) => (
            <div className="col-md-4 mb-4" key={p._id}>
              <div className="card h-100 shadow border-0">
                {p.image && (
                  <img
                    src={`/uploads/${p.image}`} // adjust to your backend static path
                    className="card-img-top"
                    alt={p.name}
                    style={{ height: "180px", objectFit: "cover" }}
                  />
                )}
                <div className="card-body text-white">
                  <h5 className="card-title">{p.name}</h5>
                  <p className="card-text">{p.description}</p>
                  <ul className="list-unstyled small">
                    <li><strong>Category:</strong> {p.categoryId?.name}</li>
                    <li><strong>Specifications:</strong> {p.specifications}</li>

                    {/* Multiple brands */}
                    <li>
                      <strong>Brands:</strong>{" "}
                      {p.brandId?.map((b) => b.name).join(", ")}
                    </li>

                    {/* Multiple models */}
                    <li>
                      <strong>Models:</strong>{" "}
                      {p.modelId?.map((m) => m.name).join(", ")}
                    </li>

                    {/* Multiple variants */}
                    <li>
                      <strong>Variants:</strong> {p.variant?.join(", ")}
                    </li>

                    {/* Price (assuming supplierSparePart relation has price) */}
                    {p.price && <li><strong>Price:</strong> ₹{p.price}</li>}
                  </ul>
                </div>

                <div className="card-footer bg-transparent border-0 d-flex justify-content-between">
                  <button className="btn btn-sm btn-warning" onClick={() => handleEdit(p)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p._id)}>Delete</button>
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
