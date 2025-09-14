import React, { useState } from "react";

const NotificationPage = () => {
  const [requests, setRequests] = useState([
    {
      id: 1,
      mechanic: "AutoZone Motors",
      product: {
        name: "Brake Pads",
        description: "High-quality brake pads for SUVs.",
        quantity: 4,
        price: 1200,
      },
    },
    {
      id: 2,
      mechanic: "Speedy Repairs",
      product: {
        name: "Engine Oil",
        description: "Synthetic engine oil 5W-30.",
        quantity: 2,
        price: 800,
      },
    },
  ]);

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [discount, setDiscount] = useState(0);

  const handleAccept = (request) => setSelectedRequest(request);

  const handleReject = (id) => {
    if (window.confirm("Are you sure you want to reject this request?")) {
      setRequests(requests.filter((req) => req.id !== id));
    }
  };

  const handleSubmitQuotation = () => {
    const totalPrice =
      selectedRequest.product.price * selectedRequest.product.quantity -
      discount;

    alert(
      `Quotation sent to ${selectedRequest.mechanic}\nProduct: ${selectedRequest.product.name}\nQuantity: ${selectedRequest.product.quantity}\nDiscount: ₹${discount}\nTotal Price: ₹${totalPrice}`
    );

    setRequests(requests.filter((req) => req.id !== selectedRequest.id));
    setSelectedRequest(null);
    setDiscount(0);
  };

  return (
    <div className="container my-4">
      <h2 className="h2 fw-bold text-white mb-4">Quotation Requests</h2>

      {/* Requests List */}
      <div className="row g-3">
        {requests.length > 0 ? (
          requests.map((req) => (
            <div key={req.id} className="col-12 col-md-6 col-lg-4">
              <div className="card bg-dark text-white shadow">
                <div className="card-body">
                  <h5 className="card-title">{req.mechanic}</h5>
                  <p className="card-text text-muted small">
                    Request for: {req.product.name}
                  </p>
                  <div className="d-flex gap-2 mt-3">
                    <button
                      onClick={() => handleAccept(req)}
                      className="btn btn-success btn-sm"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(req.id)}
                      className="btn btn-danger btn-sm"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <div className="text-center text-white mt-5">
              <h4>No quotation requests available</h4>
              <p className="text-muted">All requests have been processed.</p>
            </div>
          </div>
        )}
      </div>

      {/* Bootstrap Modal Overlay */}
      {selectedRequest && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ 
            backgroundColor: "rgba(0, 0, 0, 0.7)", 
            zIndex: 1050 
          }}
        >
          <div className="bg-white text-dark p-4 rounded shadow-lg w-100" style={{ maxWidth: "500px", margin: "1rem" }}>
            <h3 className="h4 fw-bold mb-4 text-center">Send Quotation</h3>

            <div className="mb-3">
              <p className="mb-2">
                <strong>Mechanic:</strong> {selectedRequest.mechanic}
              </p>
              <p className="mb-2">
                <strong>Product:</strong> {selectedRequest.product.name}
              </p>
              <p className="text-muted small mb-2">
                {selectedRequest.product.description}
              </p>
              <p className="mb-2">
                <strong>Quantity:</strong> {selectedRequest.product.quantity}
              </p>
              <p className="mb-3">
                <strong>Price per unit:</strong> ₹{selectedRequest.product.price}
              </p>
            </div>

            {/* Discount Input */}
            <div className="mb-3">
              <label className="form-label fw-medium">
                Discount (₹)
              </label>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="form-control"
                placeholder="Enter discount amount"
                min="0"
              />
            </div>

            {/* Total Price */}
            <div className="bg-light p-3 rounded mb-4">
              <p className="h5 fw-bold text-center mb-0">
                Total: ₹
                {Math.max(0, selectedRequest.product.price * selectedRequest.product.quantity - discount)}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="d-flex justify-content-end gap-2">
              <button
                onClick={() => setSelectedRequest(null)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitQuotation}
                className="btn btn-primary"
              >
                Send Quotation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPage;
 