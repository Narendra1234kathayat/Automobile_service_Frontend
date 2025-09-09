import React, { useState } from "react";
import axios from "axios";
import axiosInstance from "../../utils/axiosInstance";

const EditableProfilePage = () => {
    const [user, setUser] = useState({
        _id: "USER_ID_HERE",  // 🔑 Replace with logged-in user’s id (from JWT or context)
        name: "Narendra",
        email: "nskservice@gmail.com",
        phone: "9157312511",
        role: "service-provider",
    });

    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(
        "https://media.istockphoto.com/id/1300972574/photo/millennial-male-team-leader-organize-virtual-workshop-with-employees-online.jpg?s=1024x1024&w=is&k=20&c=4vOXvZRvhvchTRbYn9SknimKUNvKPZyJdGzHvtjqg_w="
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Prepare data
            const formData = new FormData();
            formData.append("name", user.name);
            formData.append("email", user.email);
            formData.append("phoneNumber", user.phone);
            formData.append("role", user.role);
            if (image) formData.append("image", image);

            // Call API
            const token = localStorage.getItem("authtoken"); // JWT stored at login
            const res = await axiosInstance.put(
                `api/users/update-user/${user._id}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );

            alert(res.data.message);
            setUser(res.data.data);
        } catch (error) {
            console.error("Update failed:", error.response?.data || error.message);
            alert(error.response?.data?.message || "Something went wrong!");
        }
    };

    return (
        <div className="container my-5">
            <div className="profile shadow-lg rounded-4 text-white">
                <h2 className="text-center mb-2">Edit Profile</h2>

                <div className="text-center mb-4">
                    <img
                        src={imagePreview}
                        alt="User Avatar"
                        className="rounded-circle"
                        style={{ width: "130px", height: "130px", objectFit: "cover" }}
                    />
                    <div className="mt-2">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="form-control w-auto mx-auto"
                        />
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={user.name}
                                className="form-control"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={user.email}
                                className="form-control"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                value={user.phone}
                                className="form-control"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Role</label>
                            <select
                                name="role"
                                value={user.role}
                                className="form-select"
                                onChange={handleChange}
                            >
                                <option value="service-provider">Service Provider</option>
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                    </div>

                    <div className="text-center mt-4">
                        <button type="submit" className="btn btn-success px-4">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditableProfilePage;
