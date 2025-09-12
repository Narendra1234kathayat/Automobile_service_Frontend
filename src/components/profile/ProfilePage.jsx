import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import ClipLoader from "react-spinners/ClipLoader";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [formData, setFormData] = useState({});

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("authtoken");
        const res = await axiosInstance.get("/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.data);
        // Merge role-specific details for editing
        setFormData({
          ...res.data.data,
          ...res.data.data.mechanicDetails,
          ...res.data.data.supplierDetails,
          ...res.data.data.mechanicDetails?.address,
          ...res.data.data.supplierDetails?.address,
        });
      } catch (error) {
        console.error("Profile fetch failed", error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
  e.preventDefault();
  setUpdateLoading(true);

  try {
    const token = localStorage.getItem("authtoken");
    const userid = JSON.parse(localStorage.getItem("user"));

    // Create payload for user update
    const userPayload = {
      name: formData.name,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      password: formData.password || undefined, // optional
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        pincode: formData.pincode,
      },
      // Role-specific fields
      workShop: formData.workShop || formData.workshopName,
      storeName: formData.storeName || formData.garageName,
    };

    // Remove undefined fields (so empty values won't overwrite existing)
    Object.keys(userPayload).forEach(
      key => userPayload[key] === undefined && delete userPayload[key]
    );
    if (!userPayload.address || Object.keys(userPayload.address).length === 0) delete userPayload.address;

    // Call backend API
    const res = await axiosInstance.put(`/api/users/update-user/${userid}`, userPayload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    toast.success("Profile updated successfully!");
    setUser({ ...user, ...formData }); // update frontend state
    setEditMode(false);

  } catch (error) {
    console.error("Update failed", error);
    toast.error("Failed to update profile");
  } finally {
    setUpdateLoading(false);
  }
};


  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <ClipLoader size={40} color="#28a745" />
      </div>
    );
  }

  if (!user) return <p className="text-center mt-5 text-white">No user data available</p>;

  return (
    <motion.div
      className="container my-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="shadow-lg rounded-4 p-4" style={{ backgroundColor: "rgba(255,255,255,0.05)", backdropFilter: "blur(10px)" }}>
        
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="text-white">Profile Details</h2>
          <motion.button
            className={`btn btn-sm px-3 ${editMode ? 'btn-outline-danger' : 'btn-outline-success'}`}
            onClick={() => setEditMode(!editMode)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {editMode ? "Cancel" : "Edit Profile"}
          </motion.button>
        </div>

        {/* Form */}
        <motion.div
          key={editMode ? 'edit' : 'view'}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {editMode ? (
            <form onSubmit={handleUpdate}>
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label text-white">Name</label>
                  <input type="text" className="form-control bg-dark text-white border-success" name="name" value={formData.name || ""} onChange={handleInputChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-white">Phone</label>
                  <input type="text" className="form-control bg-dark text-white border-success" name="phoneNumber" value={formData.phoneNumber || ""} onChange={handleInputChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-white">Email</label>
                  <input type="email" className="form-control bg-dark text-white border-success" name="email" value={formData.email || ""} onChange={handleInputChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-white">Role</label>
                  <input type="text" className="form-control bg-secondary text-white" value={user.role} readOnly />
                </div>

                {/* Role specific */}
                {user.role.toLowerCase() === "supplier" && (
                  <div className="col-md-6">
                    <label className="form-label text-white">Store Name</label>
                    <input type="text" className="form-control bg-dark text-white border-success" name="storeName" value={formData.storeName || formData.garageName || ""} onChange={handleInputChange} required />
                  </div>
                )}
                {user.role.toLowerCase() === "mechanic" && (
                  <div className="col-md-6">
                    <label className="form-label text-white">Workshop Name</label>
                    <input type="text" className="form-control bg-dark text-white border-success" name="workShop" value={formData.workShop || formData.workshopName || ""} onChange={handleInputChange} required />
                  </div>
                )}

                {/* Address */}
                <div className="col-md-6">
                  <label className="form-label text-white">Street</label>
                  <input type="text" className="form-control bg-dark text-white border-success" name="street" value={formData.street || ""} onChange={handleInputChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-white">City</label>
                  <input type="text" className="form-control bg-dark text-white border-success" name="city" value={formData.city || ""} onChange={handleInputChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-white">State</label>
                  <input type="text" className="form-control bg-dark text-white border-success" name="state" value={formData.state || ""} onChange={handleInputChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-white">Country</label>
                  <input type="text" className="form-control bg-dark text-white border-success" name="country" value={formData.country || ""} onChange={handleInputChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-white">Pincode</label>
                  <input type="text" className="form-control bg-dark text-white border-success" name="pincode" value={formData.pincode || ""} onChange={handleInputChange} />
                </div>
              </div>

              <motion.button
                type="submit"
                className="btn btn-success w-100 py-2"
                disabled={updateLoading}
                whileHover={{ scale: updateLoading ? 1 : 1.02 }}
                whileTap={{ scale: updateLoading ? 1 : 0.98 }}
              >
                {updateLoading ? (
                  <>
                    <ClipLoader size={16} color="#fff" className="me-2" />
                    Updating...
                  </>
                ) : "Save Changes"}
              </motion.button>
            </form>
          ) : (
            <ProfileView user={user} />
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

// View mode component
const ProfileView = ({ user }) => {
  const Detail = ({ label, value }) => (
    <div className="col-md-6">
      <p className="mb-1 fw-bold text-white">{label}</p>
      <p className="form-control bg-dark text-white border-0">{value || "N/A"}</p>
    </div>
  );

  return (
    <div className="row g-3">
      
      <Detail label="Name" value={user.name} />
      <Detail label="Email" value={user.email} />
      <Detail label="Phone" value={user.phoneNumber} />
      <Detail label="Role" value={user.role} />
      {/* <Detail label="Created At" value={new Date(user.createdAt).toLocaleString()} /> */}

      {user.role?.toLowerCase() === "mechanic" && user.mechanicDetails && (
        <>
          <div className="col-12"><h5 className="mt-4 text-success">🔧 Mechanic Details</h5></div>
          <Detail label="Workshop" value={user.mechanicDetails.workShop} />
          <Detail label="Street" value={user.mechanicDetails.address?.street} />
          <Detail label="City" value={user.mechanicDetails.address?.city} />
          <Detail label="State" value={user.mechanicDetails.address?.state} />
          <Detail label="Country" value={user.mechanicDetails.address?.country} />
          <Detail label="Pincode" value={user.mechanicDetails.address?.pincode} />
        </>
      )}

      {user.role?.toLowerCase() === "supplier" && user.supplierDetails && (
        <>
          <div className="col-12"><h5 className="mt-4 text-success">🏪 Supplier Details</h5></div>
          <Detail label="Store Name" value={user.supplierDetails.storeName} />
          <Detail label="Status" value={user.supplierDetails.status} />
          <Detail label="Street" value={user.supplierDetails.address?.street} />
          <Detail label="City" value={user.supplierDetails.address?.city} />
          <Detail label="State" value={user.supplierDetails.address?.state} />
          <Detail label="Country" value={user.supplierDetails.address?.country} />
          <Detail label="Pincode" value={user.supplierDetails.address?.pincode} />
        </>
      )}
    </div>
  );
};

export default ProfilePage;
