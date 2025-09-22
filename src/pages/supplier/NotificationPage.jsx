import React, { useState, useEffect } from "react";
import { FaBell, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AOS from "aos";
import "aos/dist/aos.css";
import axiosInstance, { BASE_URL } from "../../utils/axiosInstance";
import SocketUser from "../../socket/SocketUser";
import { useNavigate } from "react-router-dom";

const NotificationPage = () => {
  const [requests, setRequests] = useState([]);
  const navigate=useNavigate();

  // Initialize AOS
  useEffect(() => {
    AOS.init({ duration: 200, once: false });
  }, []);

  // Fetch notifications on mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const id = JSON.parse(localStorage.getItem("user"));
        const res = await axiosInstance.get(
          `${BASE_URL}api/quotation/get-quotation/supplier/${id}`
        );
        setRequests(res.data.data || []);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        toast.error("Failed to load notifications.");
      }
    };
    fetchNotifications();
  }, []);

  // Listen for new real-time notifications
  useEffect(() => {
    SocketUser.on("new-quotation-request", (data) => {
      setRequests((prev) => [data, ...prev]);
      console.log("New quotation request received:", data.mechanicId.name);
      toast.info(
        `New request from ${data.mechanicId.name}: ${data.product.sparePartId.name} × ${data.product.quantity}`,
        { position: "top-right", autoClose: 4000 }
      );
    });

    return () => {
      SocketUser.off("new-quotation-request");
    };
  }, []);
  const filteredquotations=requests.filter((req)=>req.status==="pending");

  // Remove a notification
  const handleRemove = (id) => {
    setRequests((prev) => prev.filter((req) => req._id !== id));
    toast.success("Notification removed");
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
        {filteredquotations.length > 0 ? (
          filteredquotations.map((req) => (
            <div
              key={req._id}
              className="col-12 col-sm-6 col-lg-4"
              data-aos="fade-left"
              onClick={() => navigate(`/supplier/quotation/${req._id}`)}

            >
              <div
                className="card bg-dark text-white shadow-sm"
                style={{ borderLeft: "5px solid #ffc107" }}
              >
                {/* Card Header with Remove Button */}
                <div className="d-flex justify-content-between align-items-start p-2 border-bottom border-secondary">
                  <h6 className="fw-bold mb-0" style={{ fontSize: "14px" }}>
                    {req.mechanicId?.name}
                  </h6>
                  <FaTimes
                    className="text-danger cursor-pointer"
                    style={{ fontSize: "14px" }}
                    onClick={() => handleRemove(req._id)}
                  />
                </div>

                {/* Card Body */}
                <div className="card-body p-2">
                  <p className="text-white small mb-1" style={{ fontSize: "13px" }}>
                    {req.product?.sparePartId?.name} × {req.product?.quantity}
                  </p>
                  <p className="text-white small mb-0" style={{ fontSize: "12px" }}>
                    {new Date(req.createdAt).toLocaleString()}
                  </p>
                  <p className="text-white small mb-0" style={{ fontSize: "12px" }}>
                    Status: {req.status}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center text-white mt-5">
            <h5>No notifications yet</h5>
            <p className="text-white">
              You will see quotation requests here in real time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
