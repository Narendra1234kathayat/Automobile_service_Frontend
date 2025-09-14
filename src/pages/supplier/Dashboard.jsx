import React from "react";
import NotificationPage from "./NotificationPage";

const Dashboard = () => {
  return (
    <div className="container py-4">
      {/* Dashboard Heading */}
      <h2 className="text-center text-white mb-4">Supplier Dashboard</h2>

      {/* Summary Row */}
      <div className="row text-center">
        {/* Orders Received */}
        <div className="col-12 col-md-4 mb-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body bg-primary text-white rounded">
              <h5 className="card-title">Orders Received</h5>
              <h3>120</h3>
            </div>
          </div>
        </div>

        {/* Revenue */}
        <div className="col-12 col-md-4 mb-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body bg-success text-white rounded">
              <h5 className="card-title">Revenue</h5>
              <h3>₹ 2,45,000</h3>
            </div>
          </div>
        </div>

        {/* Stock Alerts */}
        <div className="col-12 col-md-4 mb-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body bg-danger text-white rounded">
              <h5 className="card-title">Stock Alerts</h5>
              <h3>8</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <NotificationPage />
    </div>
  );
};

export default Dashboard;
