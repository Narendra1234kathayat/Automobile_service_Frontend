import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
function getAuthToken() {
  return localStorage.getItem('authToken');
}

const HomeScreen = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);

  useEffect(() => {
  const token = getAuthToken();
  if (!token) {
    setAuthError(true);
    setLoading(false);
    return;
  }

  axios.get('http://localhost:5000/api/v1/users/getallusers', {
    
    withCredentials: true, // To include cookies if needed
  })
    .then(response => {
      const allUsers = response.data.users || []; // axios gives parsed data directly
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
}, []);


  const handleRoleFilter = (e) => {
    const selected = e.target.value;
    setSelectedRole(selected);
    if (selected === '') {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(users.filter(user => user.role === selected));
    }
  };

  if (loading) return <div className="text-center mt-5">Loading users...</div>;
  if (authError) return <div className="alert alert-danger text-center mt-5">Please log in to see users.</div>;

  return (
    <div className="container mt-4">
      {/* Hero section */}
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
            <div className="col-md-4 mb-3" key={user._id}>
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
    </div>
  );
};

export default HomeScreen;
