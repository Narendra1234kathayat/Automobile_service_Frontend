import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SupplierProducts = () => {
  const navigate = useNavigate();

  // Dummy data with multiple brand-model-variant combos for one spare part
  const [products, setProducts] = useState([
    {
      _id: "SSP001",
      supplierId: {
        _id: "SUP001",
        companyName: "AutoCare Supplies",
        contactInfo: "autocare@gmail.com | +91-9876543210",
      },
      sparePartId: {
        _id: "SP001",
        name: "Car Brake Pad",
        description: "High-quality ceramic brake pads for smooth and safe braking.",
        categoryId: { _id: "C001", name: "Brakes" },
        specifications: "Material: Ceramic, Warranty: 1 Year",
      },
      price: 3200,
      stockQuantity: 25,
      deliveryTime: "3-5 days",
      image: "https://via.placeholder.com/400x250?text=Brake+Pad",
      combos: [
        { brandId: { _id: "B001", name: "Brembo" }, modelId: { _id: "M001", name: "Swift" }, variantId: { _id: "V001", name: "VXi" } },
        { brandId: { _id: "B002", name: "Bosch" }, modelId: { _id: "M002", name: "Dzire" }, variantId: { _id: "V002", name: "ZXi" } },
        { brandId: { _id: "B003", name: "MRF" }, modelId: { _id: "M003", name: "Baleno" }, variantId: { _id: "V003", name: "ZX" } },
      ],
    },
    {
      _id: "SSP002",
      supplierId: {
        _id: "SUP002",
        companyName: "EnginePro Distributors",
        contactInfo: "enginepro@gmail.com | +91-9988776655",
      },
      sparePartId: {
        _id: "SP002",
        name: "Engine Oil",
        description: "Premium synthetic engine oil for better mileage.",
        categoryId: { _id: "C002", name: "Engine" },
        specifications: "Viscosity: 5W-30, Pack Size: 4L",
      },
      price: 1200,
      stockQuantity: 50,
      deliveryTime: "2-4 days",
      image: "https://via.placeholder.com/400x250?text=Engine+Oil",
      combos: [
        { brandId: { _id: "B004", name: "Castrol" }, modelId: { _id: "M004", name: "Innova" }, variantId: { _id: "V004", name: "ZX" } },
        { brandId: { _id: "B005", name: "Shell" }, modelId: { _id: "M005", name: "Swift" }, variantId: { _id: "V005", name: "VXi" } },
      ],
    },
  ]);

  const [search, setSearch] = useState("");

  const handleEdit = (product) => {
    navigate("/supplier/add-product", { state: { product } });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    setProducts(products.filter((p) => p._id !== id));
    alert("Product deleted successfully");
  };

  const filteredProducts = products.filter(
    (p) =>
      p.sparePartId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.sparePartId?.categoryId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.combos?.some((combo) => combo.brandId?.name?.toLowerCase().includes(search.toLowerCase()))
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
                    src={p.image}
                    className="card-img-top"
                    alt={p.sparePartId?.name}
                    style={{ height: "180px", objectFit: "cover" }}
                  />
                )}
                <div className="card-body text-white">
                  <h5 className="card-title">{p.sparePartId?.name}</h5>
                  <p className="card-text">{p.sparePartId?.description}</p>
                  <ul className="list-unstyled small">
                    <li><strong>Category:</strong> {p.sparePartId?.categoryId?.name}</li>
                    <li><strong>Specifications:</strong> {p.sparePartId?.specifications}</li>
                    <li><strong>Price:</strong> ₹{p.price}</li>
                    <li><strong>Supplier:</strong> {p.supplierId?.companyName}</li>

                    {/* Multiple combos */}
                    {p.combos && p.combos.length > 0 && (
                      <>
                        <strong>Brand / Model / Variant:</strong>
                        {p.combos.map((combo, index) => (
                          <div key={index}>
                            {combo.brandId?.name} / {combo.modelId?.name} / {combo.variantId?.name}
                          </div>
                        ))}
                      </>
                    )}
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
