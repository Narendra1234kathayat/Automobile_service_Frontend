import React, { useEffect, useState } from "react";
import axiosInstance, { BASE_URL } from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import "react-toastify/dist/ReactToastify.css";

const Quotations = () => {
  const [quotationRequests, setQuotationRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [filter, setFilter] = useState("all");
  const { id } = useParams(); // ✅ Grab quotation ID from URL

  const [form, setForm] = useState({
    perUnitPrice: "",
    discountPercentage: "",
    totalPrice: "",
    deliveryDate: "",
    paymentTerms: "",
    additionalNotes: "",
  });

  // ✅ Initialize AOS
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  // ✅ Fetch Quotations
  useEffect(() => {
    const fetchQuotation = async () => {
      try {
        const supplierId = JSON.parse(localStorage.getItem("user"));
        const response = await axiosInstance.get(
          `${BASE_URL}api/quotation/get-quotation/supplier/${supplierId}`
        );
        if (response.status === 200) {
          setQuotationRequests(response.data.data);
          setFilteredRequests(response.data.data);

          // ✅ Pre-select quotation if URL contains :id
          if (id) {
            const found = response.data.data.find((q) => q._id === id);
            if (found) setSelectedQuotation(found);
          }
        }
      } catch (error) {
        console.log(`Error: ${error}`);
      }
    };
    fetchQuotation();
  }, [id]);

  // ✅ Auto calculate total price
  useEffect(() => {
    if (selectedQuotation) {
      const quantity = selectedQuotation.product?.quantity || 0;
      const price = Number(form.perUnitPrice) || 0;
      const discount = Number(form.discountPercentage) || 0;
      const total = price * quantity - (price * quantity * discount) / 100;
      setForm((prev) => ({ ...prev, totalPrice: total }));
    }
  }, [form.perUnitPrice, form.discountPercentage, selectedQuotation]);

  // ✅ Handle Filter Change
  const handleFilterChange = (status) => {
    setFilter(status);
    if (status === "all") {
      setFilteredRequests(quotationRequests);
    } else {
      setFilteredRequests(quotationRequests.filter((q) => q.status === status));
    }
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
        setSelectedQuotation(null);
      }
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  };

  const handleReject = async (quotationId) => {
    try {
      const response = await axiosInstance.delete(
        `${BASE_URL}api/quotation/reject-quotation/${quotationId}/rejected`
      );
      if (response.status === 200) {
        toast.info("Quotation Rejected");
        setQuotationRequests((prev) =>
          prev.filter((q) => q._id !== quotationId)
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mt-2">
      <h2 className="mb-4 text-center text-light">Quotation Requests</h2>

      {/* ✅ Filters */}
      <div className="d-flex justify-content-center gap-2 mb-4">
        {["all", "pending", "approved", "rejected"].map((status) => (
          <button
            key={status}
            className={`btn ${filter === status ? "btn-primary" : "btn-outline-primary"
              }`}
            onClick={() => handleFilterChange(status)}

          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {!selectedQuotation ? (
        <div className="table-responsive" data-aos="fade-up">
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Request Date</th>
                <th>Requested By</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length > 0 ? (
                filteredRequests.map((q) => (
                  <tr key={q._id} data-aos="fade-up">
                    <td>{q.product?.sparePartId?.name || "N/A"}</td>
                    <td>{q.product?.quantity || 0}</td>
                    <td>{new Date(q.createdAt).toLocaleDateString()}</td>
                    <td>{q.mechanicId?.name || "Unknown"}</td>
                    <td>
                      <span
                        className={`badge ${q.status === "approved"
                            ? "bg-success"
                            : q.status === "rejected"
                              ? "bg-danger"
                              : "bg-warning text-dark"
                          }`}
                      >
                        {q.status}
                      </span>
                    </td>
                    <td>
                      {q.status === "pending" && (
                        <>
                          <button
                            className="btn btn-success btn-sm me-2"
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
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No quotations found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card shadow p-4 " data-aos="zoom-in">
          <h4 className="mb-3" data-aos="fade-down">
            Send Quotation for{" "}
            <span className="text-primary">
              {selectedQuotation.product?.sparePartId?.name}
            </span>
          </h4>

          <form onSubmit={handleSubmit} data-aos="fade-up" data-aos-delay="200">
            <div className="row mb-3">
              <div className="col-md-6" data-aos="fade-right" data-aos-delay="300">
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedQuotation.product?.sparePartId?.name}
                  readOnly
                />
              </div>
              <div className="col-md-6" data-aos="fade-left" data-aos-delay="300">
                <label className="form-label">Requested Quantity</label>
                <input
                  type="number"
                  className="form-control"
                  value={selectedQuotation.product?.quantity}
                  readOnly
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-4" data-aos="flip-left" data-aos-delay="400">
                <label className="form-label">Unit Price (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  name="perUnitPrice"
                  value={form.perUnitPrice}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-4" data-aos="flip-up" data-aos-delay="500">
                <label className="form-label">Discount (%)</label>
                <input
                  type="number"
                  className="form-control"
                  name="discountPercentage"
                  value={form.discountPercentage}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-4" data-aos="flip-right" data-aos-delay="600">
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

            <div className="row mb-3">
              <div className="col-md-6" data-aos="fade-right" data-aos-delay="700">
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
              <div className="col-md-6" data-aos="fade-left" data-aos-delay="700">
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

            <div className="mb-3" data-aos="fade-up" data-aos-delay="800">
              <label className="form-label">Additional Notes</label>
              <textarea
                className="form-control"
                rows="3"
                name="additionalNotes"
                value={form.additionalNotes}
                onChange={handleChange}
              ></textarea>
            </div>

            <div
              className="d-flex justify-content-between mt-3"
              
            >
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
  );
};

export default Quotations;
