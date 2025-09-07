import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AddProduct = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const editingProduct = location.state?.product || null;

  const [form, setForm] = useState({
    supplierId: "",
    name: "",
    image: null,
    description: "",
    categoryId: "",
    specifications: "",
    price: "",
    combos: [], // multiple combos for editing
  });

  const [preview, setPreview] = useState(null);

  // Dummy dropdown data
  const categories = [
    { _id: "C001", name: "Brakes" },
    { _id: "C002", name: "Engine" },
    { _id: "C003", name: "Lights" },
    { _id: "C004", name: "Electrical" },
  ];

  const brands = [
    { _id: "B001", name: "Brembo" },
    { _id: "B002", name: "Castrol" },
    { _id: "B003", name: "Philips" },
    { _id: "B004", name: "Amaron" },
  ];

  const models = [
    { _id: "M001", name: "Swift" },
    { _id: "M002", name: "Innova" },
    { _id: "M003", name: "i20" },
    { _id: "M004", name: "Honda City" },
  ];

  const variants = [
    { _id: "V001", name: "VXi" },
    { _id: "V002", name: "ZX" },
    { _id: "V003", name: "Sportz" },
    { _id: "V004", name: "VX" },
  ];

  // Populate form when editing
  useEffect(() => {
    if (editingProduct) {
      const { sparePartId, price, supplierId, combos } = editingProduct;

      // Map multiple combos
      const mappedCombos = combos?.length
        ? combos.map((c) => ({
            brandId: c.brandId?._id || "",
            modelId: c.modelId?._id || "",
            variantId: c.variantId?._id || "",
          }))
        : [{ brandId: "", modelId: "", variantId: "" }];

      setForm({
        supplierId: supplierId?._id || "",
        name: sparePartId?.name || "",
        image: null,
        description: sparePartId?.description || "",
        categoryId: sparePartId?.categoryId?._id || "",
        specifications: sparePartId?.specifications || "",
        price: price || "",
        combos: mappedCombos,
      });

      setPreview(editingProduct.image);
    }
  }, [editingProduct]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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

  const handleComboChange = (index, field, value) => {
    const newCombos = [...form.combos];
    newCombos[index][field] = value;
    setForm({ ...form, combos: newCombos });
  };

  const addCombo = () => {
    setForm({
      ...form,
      combos: [...form.combos, { brandId: "", modelId: "", variantId: "" }],
    });
  };

  const removeCombo = (index) => {
    const newCombos = form.combos.filter((_, i) => i !== index);
    setForm({ ...form, combos: newCombos });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = {
      ...form,
      combos: form.combos,
      image: form.image ? form.image.name : preview,
    };
    console.log("Submitted Data:", finalData);
    alert("Form submitted! Check console for data.");
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-white">
        {editingProduct ? "Update Spare Part" : "Add Spare Part"}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label text-white">Spare Part Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label text-white">Image</label>
          <input
            type="file"
            className="form-control"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              style={{ maxWidth: "150px", marginTop: "10px", borderRadius: "5px" }}
            />
          )}
        </div>

        <div className="mb-3">
          <label className="form-label text-white">Description</label>
          <textarea
            className="form-control"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="3"
          />
        </div>

        <div className="mb-3">
          <label className="form-label text-white">Category</label>
          <select
            className="form-select"
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Multiple combos */}
        <div className="mb-3">
          <label className="form-label text-white">Brand / Model / Variant</label>
          {form.combos.map((combo, index) => (
            <div key={index} className="d-flex gap-2 mb-2">
              <select
                className="form-select"
                value={combo.brandId}
                onChange={(e) => handleComboChange(index, "brandId", e.target.value)}
                required
              >
                <option value="">Select Brand</option>
                {brands.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.name}
                  </option>
                ))}
              </select>

              <select
                className="form-select"
                value={combo.modelId}
                onChange={(e) => handleComboChange(index, "modelId", e.target.value)}
                required
              >
                <option value="">Select Model</option>
                {models.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name}
                  </option>
                ))}
              </select>

              <select
                className="form-select"
                value={combo.variantId}
                onChange={(e) => handleComboChange(index, "variantId", e.target.value)}
                required
              >
                <option value="">Select Variant</option>
                {variants.map((v) => (
                  <option key={v._id} value={v._id}>
                    {v.name}
                  </option>
                ))}
              </select>

              <button
                type="button"
                className="btn btn-danger"
                onClick={() => removeCombo(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button type="button" className="btn btn-secondary mt-2" onClick={addCombo}>
            Add Another Brand/Model/Variant
          </button>
        </div>

        <div className="mb-3">
          <label className="form-label text-white">Specifications</label>
          <textarea
            className="form-control"
            name="specifications"
            value={form.specifications}
            onChange={handleChange}
            rows="3"
          />
        </div>

        <div className="mb-3">
          <label className="form-label text-white">Price</label>
          <input
            type="number"
            className="form-control"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          {editingProduct ? "Update Product" : "Save Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
