import React from "react";

const Dashboard = () => {
  return (
    <div className="container">
      {/* Dashboard Heading */}
      <h2 className="text-center  text-white mb-4">Supplier Dashboard</h2>

      {/* Summary Row */}
      <div className="row text-center">
        {/* Orders Received */}
        <div className="col-md-4 mb-3">
          <div className="card shadow-sm border-0">
            <div className="card-body bg-primary text-white rounded">
              <h5 className="card-title">Orders Received</h5>
              <h3>120</h3>
            </div>
          </div>
        </div>

        {/* Revenue */}
        <div className="col-md-4 mb-3">
          <div className="card shadow-sm border-0">
            <div className="card-body bg-success text-white rounded">
              <h5 className="card-title">Revenue</h5>
              <h3>₹ 2,45,000</h3>
            </div>
          </div>
        </div>

        {/* Stock Alerts */}
        <div className="col-md-4 mb-3">
          <div className="card shadow-sm border-0">
            <div className="card-body bg-danger text-white rounded">
              <h5 className="card-title">Stock Alerts</h5>
              <h3>8</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="row mt-4">
        <div className="col-md-12">
          <div className="card shadow-sm">
            <div className="card-header bg-warning">
              <h5 className="mb-0">Notifications</h5>
            </div>
            <div className="card-body">
              <ul className="list-group">
                <li className="list-group-item">
                  New quotation request from <strong>AutoZone Motors</strong>.
                </li>
                <li className="list-group-item">
                  New quotation request from <strong>Speedy Repairs</strong>.
                </li>
                <li className="list-group-item">
                  Quotation approved for order <strong>#1025</strong>.
                </li>
                <li className="list-group-item">
                  Low stock alert: <strong>Brake Pads</strong>.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
