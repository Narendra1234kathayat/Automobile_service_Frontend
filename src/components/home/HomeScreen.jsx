import React, { useEffect, useState } from 'react';
import socket from '../../socket/SocketUser.js';
import axios from 'axios';
import SparePartsPage from '../product/SparePartsPage.jsx';
import MapComponent from '../map/MapComponent.jsx';

function getAuthToken() {
  return localStorage.getItem('authToken');
}

const HomeScreen = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);

  // Correctly extract current user ID from localStorage
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const currentUserId = storedUser;
  console.log("Current User ID:", currentUserId);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setAuthError(true);
      setLoading(false);
      return;
    }

    // Fetch all users
    axios.get('http://localhost:5000/api/v1/users/getallusers', {
      withCredentials: true,
    })
      .then(response => {
        const allUsers = response.data.users || [];
        setUsers(allUsers);
        setFilteredUsers(allUsers);
        setLoading(false);
      })
      .catch(error => {
        if (error.response && error.response.status === 401) {
          setAuthError(true);
        }
        setLoading(false);
      });

    // Register socket and set up listeners
    if (!currentUserId) {
      console.error("User ID not found. Make sure it's saved in localStorage.");
      return;
    }

    socket.on("connect", () => {
      // console.log("Socket connected:", socket.id);
      socket.emit("register", currentUserId);
    });

    socket.on("receive_alert", ({ from, message }) => {
      console.log(`Alert from user ${from}: ${message}`);
      alert(`Alert from user ${from}: ${message}`);
    });

    return () => {
      socket.off("connect");
      socket.off("receive_alert");
      socket.disconnect();
    };
  }, [currentUserId]);

  // Filter users based on selected role
  const handleRoleFilter = (e) => {
    const selected = e.target.value;
    setSelectedRole(selected);
    if (selected === '') {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(users.filter(user => user.role === selected));
    }
  };

  // Send alert to selected user
  const handleClickOnUser = (receiverId) => {
    console.log('User clicked:', receiverId);
    socket.emit("send_alert", {
      senderId: currentUserId,
      receiverId,
      message: "Hello! You were clicked!",
    });
  };

  if (loading) return <div className="text-center mt-5">Loading users...</div>;
  if (authError) return <div className="alert alert-danger text-center mt-5">Please log in to see users.</div>;

  return (
    <div className="container mt-4">
      <MapComponent/>
      
      {/* Hero Section */}
      <div className="jumbotron p-4 mb-4 bg-light border rounded">
        <div className="row align-items-center">
          <div className="col-md-6">
            <h1 className="display-5">Welcome to AutoCare!</h1>
            <p className="lead">Browse users, service centers, and hardware shops with ease.</p>
          </div>
          <div className="col-md-6 text-center">
            <img
              src="https://img.freepik.com/free-vector/car-service-illustration_1284-20984.jpg"
              alt="Service Illustration"
              className="img-fluid rounded shadow"
              style={{ maxHeight: '250px' }}
            />
          </div>
        </div>
      </div>

      {/* Role Filter */}
      <div className="mb-4">
        <label htmlFor="roleFilter" className="form-label">Filter by Role:</label>
        <select
          id="roleFilter"
          className="form-select"
          value={selectedRole}
          onChange={handleRoleFilter}
        >
          <option value="">All</option>
          <option value="user">User</option>
          <option value="service-provider">Service Provider</option>
          <option value="hardware-shop">Hardware Shop</option>
        </select>
      </div>

      {/* User Cards */}
      <div className="row ">
        {filteredUsers.length > 0 ? (
          filteredUsers.map(user => (
            <div className="col-md-4 mb-3" key={user._id} onClick={() => handleClickOnUser(user._id)}>
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{user.name}</h5>
                  <p className="card-text"><strong>Email:</strong> {user.email}</p>
                  <p className="card-text"><strong>Phone:</strong> {user.phone}</p>
                  <p className="card-text"><strong>Role:</strong> {user.role}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="alert alert-warning">No users found.</div>
        )}
      </div>
      <SparePartsPage/>
    </div>
  );
};

export default HomeScreen;
