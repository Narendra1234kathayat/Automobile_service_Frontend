import React, { useEffect, useState } from "react";
import axiosInstance, { BASE_URL } from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import AOS from "aos";
import "aos/dist/aos.css";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";

const Quotations = () => {
  const {id}=useParams();
  const [quotationRequests, setQuotationRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [filter, setFilter] = useState("all");
  const [form, setForm] = useState({
    perUnitPrice: "",
    discountPercentage: "",
    totalPrice: "",
    deliveryDate: "",
    paymentTerms: "",
    additionalNotes: "",
  });
// Auto open form if id is in URL
useEffect(() => {
  if (id && quotationRequests.length > 0) {
    const quotation = quotationRequests.find((q) => q._id === id);
    if (quotation && quotation.status === "pending") handleAccept(quotation);
  }
}, [id, quotationRequests]);

  const actionableStatuses = ["pending", "0", "new"];

  // Initialize AOS
  useEffect(() => {
    AOS.init({ duration: 200, once: false });
  }, []);

  // Fetch quotations
  useEffect(() => {
    const fetchQuotations = async () => {
      try {
        const supplierId = JSON.parse(localStorage.getItem("user"));
        const response = await axiosInstance.get(
          `${BASE_URL}api/quotation/get-quotation/supplier/${supplierId}`
        );

        if (response.status === 200) {
          setQuotationRequests(response.data.data);
          setFilteredRequests(response.data.data);
        }
      } catch (error) {
        console.log("Error fetching quotations:", error);
        toast.error("Failed to fetch quotations");
      }
    };
    fetchQuotations();
  }, []);

  // Calculate total price dynamically
  useEffect(() => {
    if (selectedQuotation) {
      const quantity = selectedQuotation.product?.quantity || 0;
      const price = Number(form.perUnitPrice) || 0;
      const discount = Number(form.discountPercentage) || 0;
      const total = price * quantity - (price * quantity * discount) / 100;
      setForm((prev) => ({ ...prev, totalPrice: total }));
    }
  }, [form.perUnitPrice, form.discountPercentage, selectedQuotation]);

  const handleFilterChange = (status) => {
    setFilter(status);
    setFilteredRequests(
      status === "all"
        ? quotationRequests
        : quotationRequests.filter((q) => q.status === status)
    );
  };

  const handleAccept = (quotation) => {
    setSelectedQuotation(quotation);
    setForm({
      perUnitPrice: "",
      discountPercentage: "",
      totalPrice: "",
      deliveryDate: "",
      paymentTerms: "",
      additionalNotes: "",
    });
  };

  const handleReject = async (quotationId) => {
    try {
      const response = await axiosInstance.patch(
        `${BASE_URL}api/quotation/reject-quotation/${quotationId}/rejected`
      );
      if (response.status === 200) {
        toast.info("Quotation Rejected");
        setQuotationRequests((prev) =>
          prev.map((q) =>
            q._id === quotationId ? { ...q, status: "rejected" } : q
          )
        );
        setFilteredRequests((prev) =>
          prev.map((q) =>
            q._id === quotationId ? { ...q, status: "rejected" } : q
          )
        );
        if (selectedQuotation?._id === quotationId) setSelectedQuotation(null);
      }
    } catch (error) {
      console.log("Error rejecting quotation:", error);
      toast.error("Failed to reject quotation");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        deliveryDate: form.deliveryDate,
        paymentTerms: form.paymentTerms,
        additionalNotes: form.additionalNotes,
        product: {
          sparePartId: selectedQuotation.product.sparePartId._id,
          quantity: selectedQuotation.product.quantity,
          perUnitPrice: form.perUnitPrice,
          discountPercentage: form.discountPercentage,
          totalPrice: form.totalPrice,
        },
      };

      const response = await axiosInstance.put(
        `${BASE_URL}api/quotation/approve-quotation/${selectedQuotation._id}`,
        dataToSend
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Quotation Approved");
        setQuotationRequests((prev) =>
          prev.map((q) =>
            q._id === selectedQuotation._id ? { ...q, status: "approved" } : q
          )
        );
        setFilteredRequests((prev) =>
          prev.map((q) =>
            q._id === selectedQuotation._id ? { ...q, status: "approved" } : q
          )
        );
         setSelectedQuotation(null);

      
      }
    } catch (error) {
      console.log("Error approving quotation:", error);
      toast.error("Failed to approve quotation");
    }
    finally{
      setSelectedQuotation(null);
    }
  };

  const handleChange = (e) => {
  const { name, value } = e.target;
  let numValue = Number(value);

  // Validation for perUnitPrice
  if (name === "perUnitPrice") {
    if (numValue < 0) {
      toast.error("Unit price cannot be negative");
      return;
    }
    if (numValue > 1000000) {
      toast.error("Unit price too large");
      return;
    }
  }

  // Validation for discountPercentage
  if (name === "discountPercentage") {
    if (numValue < 0) {
      toast.error("Discount cannot be negative");
      return;
    }
    if (numValue > 100) {
      toast.error("Discount cannot exceed 100%");
      return;
    }
  }

  setForm((prev) => ({ ...prev, [name]: value }));
};


  const hasActionable = filteredRequests.some((q) =>
    actionableStatuses.includes(q.status)
  );

  return (
    <div className="mt-3  container ">
      <div className="row ">
        <h2 className="mb-4 text-center text-light">Quotation Requests</h2>

      {/* Filters */}
      <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
        {["all", "pending", "approved", "rejected", "payment"].map((status) => (
          <button
            key={status}
            className={`btn ${
              filter === status ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => handleFilterChange(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {!selectedQuotation ? (
        <div className="table-responsive ">
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Request Date</th>
                <th>Requested By</th>
                <th>Status</th>
                {hasActionable && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length > 0 ? (
                filteredRequests.map((q) => (
                  <tr key={q._id}>
                    <td>{q.product?.sparePartId?.name || "N/A"}</td>
                    <td>{q.product?.quantity || 0}</td>
                    <td>{new Date(q.createdAt).toLocaleDateString()}</td>
                    <td>{q.mechanicId?.name || "Unknown"}</td>
                    <td>
                      <span
                        className={`badge ${
                          q.status === "approved"
                            ? "bg-success"
                            : q.status === "rejected"
                            ? "bg-danger"
                            : "bg-warning text-dark"
                        }`}
                      >
                        {q.status}
                      </span>
                    </td>
                    {actionableStatuses.includes(q.status) && hasActionable && (
                      <td className="d-flex flex-nowrap gap-2">
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleAccept(q)}
                        >
                          Accept & Send
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleReject(q._id)}
                        >
                          Reject
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={hasActionable ? 6 : 5} className="text-center">
                    No quotations found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card shadow p-3 p-md-4 mt-4">
          <h4 className="mb-3 text-center text-md-start">
            Send Quotation for{" "}
            <span className="text-primary">
              {selectedQuotation.product?.sparePartId?.name}
            </span>
          </h4>

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedQuotation.product?.sparePartId?.name}
                  readOnly
                />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label">Requested Quantity</label>
                <input
                  type="number"
                  className="form-control"
                  value={selectedQuotation.product?.quantity}
                  readOnly
                />
              </div>
            </div>

            <div className="row g-3 mt-2">
              <div className="col-12 col-md-4">
                <label className="form-label">Unit Price (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  name="perUnitPrice"
                  min="0"
                  max="100000"
                  
                  value={form.perUnitPrice}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-12 col-md-4">
                <label className="form-label">Discount (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100" 
                  className="form-control"
                  name="discountPercentage"
                  value={form.discountPercentage}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-12 col-md-4">
                <label className="form-label">Total Price (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  name="totalPrice"
                  value={form.totalPrice}
                  readOnly
                />
              </div>
            </div>

            <div className="row g-3 mt-2">
              <div className="col-12 col-md-6">
                <label className="form-label">Delivery Time (in days)</label>
                <input
                  type="text"
                  className="form-control"
                  name="deliveryDate"
                  value={form.deliveryDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label">Payment Terms</label>
                <input
                  type="text"
                  className="form-control"
                  name="paymentTerms"
                  value={form.paymentTerms}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-3 mt-2">
              <label className="form-label">Additional Notes</label>
              <textarea
                className="form-control"
                rows="3"
                name="additionalNotes"
                value={form.additionalNotes}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="d-flex flex-column flex-md-row justify-content-between mt-3 gap-2">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setSelectedQuotation(null)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Send Quotation
              </button>
            </div>
          </form>
        </div>
      )}
      </div>
    </div>
  );
};

export default Quotations;
