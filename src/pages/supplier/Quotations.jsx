import React, { useState } from "react";

const Quotations = () => {
  const [selectedQuotation, setSelectedQuotation] = useState(null);
    
  const quotationRequests = [
    {
      id: 1,
      product: "Brake Pad",
      quantity: 20,
      requestDate: "2025-08-20",
      requestedBy: "Mechanic Shop A",
    },
    {
      id: 2,
      product: "Engine Oil",
      quantity: 50,
      requestDate: "2025-08-21",
      requestedBy: "Mechanic Shop B",
    },
  ];

  const handleAccept = (quotation) => {
    setSelectedQuotation(quotation);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Quotation sent successfully!");
    setSelectedQuotation(null);
  };

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
                <tr key={q.id}>
                  <td>{q.id}</td>
                  <td>{q.product}</td>
                  <td>{q.quantity}</td>
                  <td>{q.requestDate}</td>
                  <td>{q.requestedBy}</td>
                  <td>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleAccept(q)}
                    >
                      Accept & Send
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card shadow p-4">
          <h4 className="mb-3">Send Quotation for {selectedQuotation.product}</h4>
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedQuotation.product}
                  readOnly
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Requested Quantity</label>
                <input
                  type="number"
                  className="form-control"
                  value={selectedQuotation.quantity}
                  readOnly
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label">Unit Price (₹)</label>
                <input type="number" className="form-control" required />
              </div>
              <div className="col-md-4">
                <label className="form-label">Tax (%)</label>
                <input type="number" className="form-control" required />
              </div>
              <div className="col-md-4">
                <label className="form-label">Total Price (₹)</label>
                <input type="number" className="form-control" required />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Delivery Time (in days)</label>
                <input type="number" className="form-control" required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Payment Terms</label>
                <input type="text" className="form-control" required />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Additional Notes</label>
              <textarea className="form-control" rows="3"></textarea>
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
