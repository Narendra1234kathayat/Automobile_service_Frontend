import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance, { BASE_URL } from "../../utils/axiosInstance";
import SocketUser from "../../socket/SocketUser";

const NotificationPage = () => {
  const [requests, setRequests] = useState([]); // ✅ Initialize as []
  const navigate = useNavigate();

  // ✅ Fetch notifications on mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const id = JSON.parse(localStorage.getItem("user"));
        const res = await axiosInstance.get(
          `${BASE_URL}api/quotation/get-quotation/supplier/${id}`
        );
        setRequests(res.data.data || []); // ✅ No .json()
      } catch (err) {
        console.error("Error fetching notifications:", err);
        toast.error("Failed to load notifications.");
      }
    };
    fetchNotifications();
  }, []);

  // ✅ Listen for new real-time notifications
  useEffect(() => {
    SocketUser.on("new-quotation-request", (data) => {
      setRequests((prev) => [data[0], ...prev]); // ✅ data is object, not array
      toast.info(
        `New request from ${data[0].mechanicId.name}: ${data[0].product.sparePartId.name} × ${data[0].product.quantity}`,
        { position: "top-right", autoClose: 4000 }
      );
    });

    return () => {
      SocketUser.off("new-quotation-request");
    };
  }, []);

  // ✅ Handle click → navigate to quotation page
  const handleClick = (req) => {
    navigate(`/supplier/quotation/${req._id}`, { state: req });
  };

  return (
    <div className="container my-5">
      {/* Heading */}
      <div className="d-flex align-items-center gap-2 mb-4">
        <FaBell size={28} className="text-warning" />
        <h2 className="fw-bold text-white mb-0">Notifications</h2>
      </div>

      {/* Notifications List */}
      <div className="row g-3">
        <AnimatePresence>
          {requests.length > 0 ? (
            requests.map((req) => (
              <motion.div
                key={req._id}
                layout
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="col-12 col-md-6 col-lg-4"
              >
                <div
                  className="card bg-dark text-white shadow-sm cursor-pointer h-100"
                  style={{ borderLeft: "5px solid #ffc107" }}
                  onClick={() => handleClick(req)}
                >
                  <div className="card-body">
                    <h5 className="fw-bold">{req.mechanicId?.name}</h5>
                    <p className="text-white small mb-2">
                      <strong>Product:</strong> {req.product?.sparePartId?.name}
                      <br />
                      <strong>Quantity:</strong> {req.product?.quantity}
                    </p>
                    <p className="text-muted small mb-1">
                      <strong>Status:</strong> {req.status}
                    </p>
                    <p className="text-muted small">
                      <strong>Requested On:</strong>{" "}
                      {new Date(req.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              className="col-12 text-center text-white mt-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h4>No notifications yet</h4>
              <p className="text-muted">
                You will see quotation requests here in real time.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NotificationPage;
