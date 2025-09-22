// src/components/AddProduct.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance.js";

const AddProduct = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const editingProduct = location.state?.product || null;
  const supplier = JSON.parse(localStorage.getItem("user"));

  const [form, setForm] = useState({
    supplierId: supplier, 
    name: "",
    image: null,
    description: "",
    categoryId: "",
    specifications: "",
    price: "",
    brandId: "",
    modelId: "",
    variant: "",
    models: [], // models depend on brand
  });

  const [preview, setPreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [variants] = useState([
    { _id: "V001", name: "Petrol" },
    { _id: "V002", name: "Diesel" },
    { _id: "V003", name: "CNG" },
  ]);

  // Fetch categories & brands
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          axiosInstance.get("/api/category/get-category"),
          axiosInstance.get("/api/car-brand/get-brand"),
        ]);
        setCategories(catRes.data.data);
        setBrands(brandRes.data.data);
      } catch (err) {
        console.error("Error fetching dropdown data:", err);
      }
    };
    fetchDropdowns();
  }, []);

  // Fetch models when brand changes
  useEffect(() => {
    if (!form.brandId) return;
    const fetchModels = async () => {
      try {
        const res = await axiosInstance.get(`/api/car-model/get-carmodel/${form.brandId}`);
        setForm(prev => ({ ...prev, models: res.data.data }));
      } catch (err) {
        console.error("Error fetching models:", err);
      }
    };
    fetchModels();
  }, [form.brandId]);

  // Populate form when editing
  useEffect(() => {
    if (editingProduct) {
      const { name, description, image, categoryId, specifications, price, brandId, modelId, variant, supplierId } = editingProduct;
      
      setForm({
        supplierId: supplierId || "",
        name: name || "",
        image: null,
        description: description || "",
        categoryId: categoryId?._id || "",
        specifications: specifications || "",
        price: price || "",
        brandId: brandId?.[0]?._id || "",    // only first brand
        modelId: modelId?.[0]?._id || "",    // only first model
        variant: variant?.[0] || "",          // only first variant
        models: [],                           // models will load based on brand
      });

      setPreview(image ? `/uploads/${image}` : null);
    }
  }, [editingProduct]);

  // Input handlers
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, image: file });

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(editingProduct?.image || null);
    }
  };

  const handleBrandChange = (e) => {
    const brandId = e.target.value;
    setForm({ ...form, brandId, modelId: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("supplierId", form.supplierId);
      data.append("name", form.name);
      data.append("description", form.description);
      data.append("categoryId", form.categoryId);
      data.append("specifications", form.specifications);
      data.append("price", form.price);
      data.append("brandId", form.brandId);
      data.append("modelId", form.modelId);
      data.append("variant", form.variant);
      if (form.image) data.append("image", form.image);

      if (editingProduct) {
        console.log("Updating product with data:", data);
        await axiosInstance.put(`/api/spare-part/update-spare-part/supplier/${editingProduct._id}`, data, {
          
        });
        alert("Spare Part Updated Successfully!");
      } else {
        await axiosInstance.post("/api/spare-part/add-spare-part", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Spare Part Added Successfully!");
      }

      navigate("/supplier/products");
    } catch (err) {
      console.error("Error submitting spare part:", err);
      alert("Failed to save spare part. Check console.");
    }
  };

  return (
    <div className="container my-2">
      <h2 className="mb-4 text-white">
        {editingProduct ? "Update Spare Part" : "Add Spare Part"}
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-3">
          <label className="form-label text-white">Spare Part Name</label>
          <input type="text" className="form-control" name="name" value={form.name} onChange={handleChange} required />
        </div>

        {/* Image */}
        <div className="mb-3">
          <label className="form-label text-white">Image</label>
          <input type="file" className="form-control" name="image" accept="image/*" onChange={handleImageChange} />
          {preview && <img src={preview} alt="Preview" style={{ maxWidth: "150px", marginTop: "10px", borderRadius: "5px" }} />}
        </div>

        {/* Description */}
        <div className="mb-3">
          <label className="form-label text-white">Description</label>
          <textarea className="form-control" name="description" value={form.description} onChange={handleChange} rows="3" />
        </div>

        {/* Category */}
        <div className="mb-3">
          <label className="form-label text-white">Category</label>
          <select className="form-select" name="categoryId" value={form.categoryId} onChange={handleChange} required>
            <option value="">Select Category</option>
            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>

        {/* Brand */}
        <div className="mb-3">
          <label className="form-label text-white">Brand</label>
          <select className="form-select" name="brandId" value={form.brandId} onChange={handleBrandChange} required>
            <option value="">Select Brand</option>
            {brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
          </select>
        </div>

        {/* Model */}
        <div className="mb-3">
          <label className="form-label text-white">Model</label>
          <select className="form-select" name="modelId" value={form.modelId} onChange={handleChange} required>
            <option value="">Select Model</option>
            {form.models.map(m => <option key={m._id} value={m._id}>{m.carModel}</option>)}
          </select>
        </div>

        {/* Variant */}
        <div className="mb-3">
          <label className="form-label text-white">Variant</label>
          <select className="form-select" name="variant" value={form.variant} onChange={handleChange} required>
            <option value="">Select Variant</option>
            {variants.map(v => <option key={v._id} value={v.name}>{v.name}</option>)}
          </select>
        </div>

        {/* Specifications */}
        <div className="mb-3">
          <label className="form-label text-white">Specifications</label>
          <textarea className="form-control" name="specifications" value={form.specifications} onChange={handleChange} rows="3" />
        </div>

        {/* Price */}
        <div className="mb-3">
          <label className="form-label text-white">Price</label>
          <input type="number" className="form-control" name="price" value={form.price} onChange={handleChange} required />
        </div>

        <button type="submit" className="btn btn-primary">{editingProduct ? "Update Product" : "Save Product"}</button>
      </form>
    </div>
  );
};

export default AddProduct;
