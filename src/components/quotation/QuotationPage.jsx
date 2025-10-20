import React, { useEffect, useState, useMemo } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import CheckoutPage from "../cart/CheckoutPage.jsx"; // import checkout
import SocketUser from "../../socket/SocketUser.js";
import { set } from "react-hook-form";
const QuotationPage = () => {
  const [quotations, setQuotations] = useState([]);
  const [selected, setSelected] = useState([]);
  const [filter, setFilter] = useState({ days: "", product: "", supplier: "" });
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortBy, setSortBy] = useState("quantity");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutData, setCheckoutData] = useState(null);
  const [showCompare, setShowCompare] = useState(false);

  useEffect(() => {
  const handleQuotationApproved = (data) => {
    console.log(data.status);
    toast.dismiss();
    toast.success(`Quotation Approved`);
    setQuotations((prev) => [...prev, data]);
    fetchQuotations();
  };

  // Attach listener once
  SocketUser.on("quotation-approved", handleQuotationApproved);

  // Cleanup to remove listener
  return () => {
    SocketUser.off("quotation-approved", handleQuotationApproved);
  };
}, []); // empty dependency array → runs once

  

  // ✅ Fetch Quotations
  const fetchQuotations = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosInstance.get("/api/quotation/get-quotation/mechanic");
      if (res.status === 200) setQuotations(res.data.data || []);
      toast.success("Quotations fetched successfully");
    } catch (err) {
      setError("Failed to fetch quotations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  // ✅ Handle Checkbox Select
  const handleCheckbox = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((s) => s !== id)
        : prev.length < 3
        ? [...prev, id]
        : prev
    );
  };

  // ✅ Clear Filters
  const clearFilters = () => setFilter({ days: "", product: "", supplier: "" });

  // ✅ Apply Filters + Sorting
  const filteredQuotations = useMemo(() => {
    return quotations
      .filter((q) => {
        const createdAt = new Date(q.createdAt);
        const now = new Date();

        if (filter.days && (now - createdAt) / (1000 * 60 * 60 * 24) > parseInt(filter.days))
          return false;

        if (filter.product && q.product?.sparePartId?.name !== filter.product) return false;

        if (filter.productSearch && !q.product?.sparePartId?.name.toLowerCase().includes(filter.productSearch.toLowerCase()))
          return false;

        if (filter.supplier && !q.supplierId?.name?.toLowerCase().includes(filter.supplier.toLowerCase()))
          return false;

        return true;
      })
      .sort((a, b) => {
        const getValue = (q) => {
          switch (sortBy) {
            case "price":
              return q.product?.perUnitPrice || 0;
            case "total":
              return q.product?.totalPrice || 0;
            case "date":
              return new Date(q.createdAt);
            default:
              return q.product?.quantity || 0;
          }
        };
        return sortOrder === "asc" ? getValue(a) - getValue(b) : getValue(b) - getValue(a);
      });
  }, [quotations, filter, sortOrder, sortBy]);

  // ✅ Checkout Handler
  const handleCheckout = (quotation) => {
    setCheckoutData(quotation);
    setShowCheckout(true);
  };

  // ✅ Compare Data
  const compareData = quotations.filter((q) => selected.includes(q._id));

  return (
    <div className="container py-4 min-vh-100">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center ">
        <h2 className="fw-bold" style={{ color: "#05976A" }}>
          My Quotations
        </h2>
        <button
          className="btn btn-outline-secondary"
          onClick={fetchQuotations}
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {/* Filters */}
      <div className="card shadow-sm mb-4">
        <div className="card-body row g-3">
          <div className="col-lg-3 col-sm-6">
            <input
              type="text"
              className="form-control"
              placeholder="Search product"
              value={filter.productSearch || ""}
              onChange={(e) => setFilter({ ...filter, productSearch: e.target.value })}
            />
          </div>

          <div className="col-lg-3 col-6">
            <select
              className="form-select"
              value={filter.product}
              onChange={(e) => setFilter({ ...filter, product: e.target.value })}
            >
              <option value="">All Products</option>
              {[...new Set(quotations.map((q) => q.product?.sparePartId?.name))].map(
                (product, idx) =>
                  product && (
                    <option key={idx} value={product}>
                      {product}
                    </option>
                  )
              )}
            </select>
          </div>

          <div className="col-lg-3 col-6">
            <select
              className="form-select"
              value={filter.supplier}
              onChange={(e) => setFilter({ ...filter, supplier: e.target.value })}
            >
              <option value="">All Suppliers</option>
              {[...new Set(quotations.map((q) => q.supplierId?.name))].map(
                (supplier, idx) =>
                  supplier && (
                    <option key={idx} value={supplier}>
                      {supplier}
                    </option>
                  )
              )}
            </select>
          </div>

          <div className="col-lg-3 col-6">
            <select
              className="form-select"
              value={filter.days}
              onChange={(e) => setFilter({ ...filter, days: e.target.value })}
            >
              <option value="">All Time</option>
              <option value="1">Last 24h</option>
              <option value="7">Last 7d</option>
              <option value="30">Last 30d</option>
            </select>
          </div>

          <div className="col-lg-3 col-6">
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="quantity">Quantity</option>
              <option value="price">Unit Price</option>
              <option value="total">Total Price</option>
              <option value="date">Date</option>
            </select>
          </div>

          <div className="col-lg-3 col-6">
            <select
              className="form-select"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="asc">Low → High</option>
              <option value="desc">High → Low</option>
            </select>
          </div>

          <div className="col-6">
            <button
              className="btn w-100"
              style={{ backgroundColor: "#05976A", color: "#fff" }}
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Compare Button */}
      {selected.length > 1 && (
        <div className="mb-3 position-fixed bottom-0 end-0">
          <button
            className="btn w-100"
            style={{ backgroundColor: "#ff9800", color: "#fff" }}
            onClick={() => setShowCompare(true)}
          >
            Compare Selected Products
          </button>
        </div>
      )}

      {/* Quotations Grid */}
      <div className="row">
        {filteredQuotations.length ? (
          filteredQuotations.map((q) => (
            <div key={q._id} className="col-md-4 col-6 col-lg-3  ">
              <div
                className={`card h-100 border border-white ${selected.includes(q._id) ? "border-2" : ""}`}
              >
                <div className="card-body">
                  <h6 className="fw-bold">{q.product?.sparePartId?.name || "Product"}</h6>
                  <p className="mb-1">Supplier: {q.supplierId?.name || "N/A"}</p>
                  <p className="mb-1">Quantity: {q.product?.quantity}</p>
                  <p className="mb-1">Unit Price: ₹{q.product?.perUnitPrice}</p>
                  <p className="fw-bold mb-0" style={{ color: "#05976A" }}>
                    Total: ₹{q.product?.totalPrice}
                  </p>
                  <p className="mb-1">delievery expected in : {q.deliveryDate}</p>
                  <p className="text-white mb-0">{new Date(q.createdAt).toLocaleString()}</p>
                  <Link className="btn-outline-info mt-2 fs-5 text-info text-decoration-underline " to={`/product/${q.product.sparePartId._id}`}>View Product</Link>

                </div>
                <div className="card-footer bg-transparent d-flex flex-column gap-2">
                  <button
                    className="btn btn-sm"
                    style={{ borderColor: "#05976A", color: "#05976A" }}
                    onClick={() => handleCheckbox(q._id)}
                  >
                    {selected.includes(q._id) ? "Remove from Compare" : "Add to Compare"}
                  </button>
                  <button
                    className="btn btn-sm"
                    style={{ backgroundColor: "#05976A", color: "#fff" }}
                    onClick={() => handleCheckout(q)}
                  >
                    Checkout
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-white py-5">No quotations found.</div>
        )}
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <div
          className="position-absolute top-0 scroll-y w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ zIndex: 1050, background: "rgba(0,0,0,0.5)" }}
        >
          <div className="bg-white rounded shadow p-3 w-100" style={{ maxWidth: "800px" }}>
            <CheckoutPage setShowCheckout={setShowCheckout} quotation={checkoutData} />
          </div>
        </div>
      )}

      {/* Compare Modal */}
      {showCompare && (
        <div
          className="position-absolute top-0 start-0 scroll-y w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ zIndex: 1050}}
        >
          <div className="bg-dark rounded shadow p-4 w-100" style={{ maxWidth: "900px" }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold text-light">Compare Products</h5>
              <button className="btn btn-light" onClick={() => setShowCompare(false)}>
                Close
              </button>
            </div>

            {compareData.length ? (
              <div className="row g-3">
                {compareData.map((q) => {
                  const bestPrice = Math.min(...compareData.map(c => c.product?.perUnitPrice || Infinity));
                  const isBestPrice = q.product?.perUnitPrice === bestPrice;
                  return (
                    <div key={q._id} className="col-md-4 col-6">
                      <div
                        className={`card h-100 p-3 ${isBestPrice ? "border-success border-2" : "border"} shadow-sm`}
                        style={{ backgroundColor: isBestPrice ? "#e6f9ec" : "#fff" }}
                      >
                        <h6 className="fw-bold mb-2">{q.product?.sparePartId?.name}</h6>
                        <p className="mb-1"><strong>Supplier:</strong> {q.supplierId?.name}</p>
                        <p className="mb-1"><strong>Quantity:</strong> {q.product?.quantity}</p>
                        <p className="mb-1">
                          <strong>Unit Price:</strong> ₹{q.product?.perUnitPrice}{" "}
                          {isBestPrice && <span className="badge bg-success ms-1">Best Price</span>}
                        </p>
                        <p className="fw-bold" style={{ color: "#05976A" }}>
                          Total: ₹{q.product?.totalPrice}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-white text-center">No products selected for comparison.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuotationPage;
