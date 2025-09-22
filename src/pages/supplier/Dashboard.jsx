import React, { useEffect, useState } from "react";
import NotificationPage from "./NotificationPage";
import SocketUser from "../../socket/SocketUser";
import axiosInstance, { BASE_URL } from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const supplierId = JSON.parse(localStorage.getItem("user")); // supplier ID from localStorage

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `${BASE_URL}api/order/get-order`
        );
        
        if (response.status === 200) {
          setOrders(response.data.data || []);
        }
        
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [supplierId]);

  // Socket for real-time orders
  useEffect(() => {
    SocketUser.on("order-placed", (data) => {
      toast.info(`New order placed by ${data.mechanicId.name}`, { autoClose: 4000 });
      setOrders((prev) => [data, ...prev]);
    });

    return () => {
      SocketUser.off("order-placed");
    };
  }, []);

  // Calculate summary values
  const totalOrders = orders.length;
  const revenue = orders.reduce((sum, o) => sum + (o.quotationId.product?.totalPrice || 0), 0);
  const pendingPayments = orders.filter((o) => o.quotationId.status === "payment").length;
 

  return (
    <div className="container py-4">
      <h2 className="text-center text-white mb-4">Supplier Dashboard</h2>

      {loading ? (
        <p className="text-center text-white">Loading dashboard data...</p>
      ) : (
        <>
          {/* Summary Row */}
          <div className="row text-center mb-4">
            <div className="col-12 col-sm-6 col-md-4 mb-3">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body bg-primary text-white rounded">
                  <h5 className="card-title">Orders Received</h5>
                  <h3>{totalOrders}</h3>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-md-4 mb-3">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body bg-success text-white rounded">
                  <h5 className="card-title">Revenue (₹)</h5>
                  <h3>{revenue.toLocaleString()}</h3>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4 mb-3">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body bg-warning text-dark rounded">
                  <h5 className="card-title">Payments confirmed</h5>
                  <h3>{pendingPayments}</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications Section */}
          <NotificationPage />
        </>
      )}
    </div>
  );
};

export default Dashboard;
