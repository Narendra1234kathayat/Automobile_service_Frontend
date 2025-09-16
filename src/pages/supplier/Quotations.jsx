import React, { useEffect, useState } from "react";
import axiosInstance, { BASE_URL } from "../../utils/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
const Quotations = () => {
  const [selectedQuotation, setSelectedQuotation] = useState(null);

  // const quotationRequests = [
  //   {
  //     id: 1,
  //     product: "Brake Pad",
  //     quantity: 20,
  //     requestDate: "2025-08-20",
  //     requestedBy: "Mechanic Shop A",
  //   },
  //   {
  //     id: 2,
  //     product: "Engine Oil",
  //     quantity: 50,
  //     requestDate: "2025-08-21",
  //     requestedBy: "Mechanic Shop B",
  //   },
  // ];
  const [quotationRequests, setQuotationRequests] = useState([]); // start empty
  const [form, setForm] = useState({
    perUnitPrice: '',
    discountPercentage: '',
    totalPrice: '',
    deliveryDate: '',
    paymentTerms: '',
    additionalNotes: ''
  })
  // fetch Details
  useEffect(() => {
    const fetchQuotation = async () => {
      try {
        const id = JSON.parse(localStorage.getItem("user"));
        const response = await axiosInstance.get(`${BASE_URL}api/quotation/get-quotation/supplier/${id}`);
        if (response.status === 200) {
          setQuotationRequests(response.data.data);
        }
      } catch (error) {
        console.log(`error ${error}`);
      }
    }
    fetchQuotation();
  }, []);

  // Auto-calculate total price whenever unit price or discount changes
  useEffect(() => {
    if (selectedQuotation) {
      const quantity = selectedQuotation.product?.quantity || 0;
      const price = Number(form.perUnitPrice) || 0;
      const discount = Number(form.discountPercentage) || 0;
      const total = price * quantity - (price * quantity * discount) / 100;
      setForm((prev) => ({ ...prev, totalPrice: total }));
    }
  }, [form.perUnitPrice, form.discountPercentage, selectedQuotation]);


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
    // 
    try {
      const dataToBeSend = {
        deliveryDate: form.deliveryDate,
        paymentTerms: form.paymentTerms,
        additionalNotes: form.additionalNotes,
        product: {
          sparePartId: selectedQuotation.product.sparePartId._id,
          quantity: selectedQuotation.product.quantity,
          perUnitPrice: form.perUnitPrice,
          discountPercentage: form.discountPercentage,
          totalPrice: form.totalPrice
        }
      }
      const response = await axiosInstance.put(`${BASE_URL}api/quotation/approve-quotation/${selectedQuotation._id}`, dataToBeSend)
      if (response.status === 200 || response.status === 201) {
        toast.success('Quotation Approved');
      }
      alert("Quotation sent successfully!");
      setSelectedQuotation(null);
    } catch (error) {
      console.log(`error ${error}`);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleReject = async (quotationId) => {
    try{
      const response = await axiosInstance.delete(`${BASE_URL}api/quotation/reject-quotation/${quotationId}/rejected`);
      if(response.status===200 ){
        toast.error('Quotation Rejected');
      }
    }catch(error){
      console.log(error);
    }
    console.log(quotationId)
  }
  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Quotation Requests</h2>

      {!selectedQuotation ? (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Request Date</th>
                <th>Requested By</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {quotationRequests.map((q) => (
                <tr key={q._id}>
                  <td>{q._id}</td>
                  <td>{q.product?.sparePartId?.name || "N/A"}</td>
                  <td>{q.product?.quantity || 0}</td>
                  <td>{new Date(q.createdAt).toLocaleDateString()}</td>
                  <td>{q.mechanicId?.name || "Unknown"}</td>
                  <td>
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

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card shadow p-4">
          <h4 className="mb-3">Send Quotation for {selectedQuotation.product?.sparePartId?.name}</h4>
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedQuotation.product?.sparePartId?.name}
                  readOnly
                />
              </div>
              <div className="col-md-6">
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
              <div className="col-md-4">
                <label className="form-label">Unit Price (₹)</label>
                <input type="number" className="form-control" name="perUnitPrice"
                  value={form.perUnitPrice}
                  onChange={handleChange} required />
              </div>
              <div className="col-md-4">
                <label className="form-label">Discount (%)</label>
                <input type="number" className="form-control" name="discountPercentage"
                  value={form.discountPercentage}
                  onChange={handleChange} required />
              </div>
              <div className="col-md-4">
                <label className="form-label">Total Price (₹)</label>
                <input type="number" className="form-control" name="totalPrice"
                  value={form.totalPrice} readOnly />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Delivery Time (in days)</label>
                <input type="text" className="form-control" name="deliveryDate"
                  value={form.deliveryDate}
                  onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Payment Terms</label>
                <input type="text" className="form-control" name="paymentTerms"
                  value={form.paymentTerms}
                  onChange={handleChange} required />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Additional Notes</label>
              <textarea className="form-control" rows="3" name="additionalNotes"
                value={form.additionalNotes}
                onChange={handleChange}></textarea>
            </div>

            <div className="d-flex justify-content-between">
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
