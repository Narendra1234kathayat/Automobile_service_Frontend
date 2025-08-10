import React, { useEffect, useState } from 'react';
// import socket from '../../socket/SocketUser.js';
import CategoryContainer from './CategoryContainer.jsx';
import SparePartsPage from '../product/SparePartsPage.jsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MapComponent from '../map/MapComponent.jsx';
import StoreContainer from './StoreContainer.jsx';
import HeroSection from './HeroSection.jsx';
function getAuthToken() {
  return localStorage.getItem('authToken');
}

const HomeScreen = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);
  const navigate = useNavigate();


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

  if (loading) return <div className="text-center h-100 d-flex justify-content-center align-content-center white">Loading users...</div>;
  if (authError) return <div className="alert alert-danger text-center mt-5">Please log in to see users.</div>;

  return (
    <div className="container mt-1 mt-auto">
      {/* Hero section */}
      <HeroSection />

      <div className="jumbotron p-4 mb-4 bg-light border rounded">
        <div className="row align-items-center">

          <div
            className="col-12 text-center py-md-5 py-3 px-md-3"
            style={{
              backgroundColor: "#111828",
              color: "#f8f9fa", // Light text for dark background
              borderRadius: "12px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            }}
          >
            <h1 className="display-5 fw-bold mb-3" style={{ color: "#05976A" }}>
              Welcome to SpareLink!
            </h1>
            <p className="lead mb-4" style={{ fontSize: "1.2rem" }}>
              Browse users, service centers, and hardware shops with ease.
            </p>
            <button
              className="btn btn-outline-light btn-lg"
              onClick={() => navigate("/location")}
              style={{
                transition: "all 0.3s ease",
                borderColor: "#05976A",
                color: "#05976A",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#05976A";
                e.target.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
              }
              }

            >
              Get User Location
            </button>
          </div>


        </div>
      </div>
      <p className="text-white  display-5">Popular Brands</p>
      <div className="d-flex overflow-auto " style={{ whiteSpace: 'nowrap' }}>
        <CategoryContainer />
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
      <div className='row'>

        <StoreContainer />


      </div>

    </div>
  )
};

export default HomeScreen;
