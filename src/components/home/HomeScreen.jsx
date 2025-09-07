import React, { useEffect, useState } from 'react';
// import socket from '../../socket/SocketUser.js';
import CategoryContainer from './CategoryContainer.jsx';
import SparePartsPage from '../product/SparePartsPage.jsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MapComponent from '../map/MapComponent.jsx';
import StoreContainer from './StoreContainer.jsx';
import HeroSection from './HeroSection.jsx';
import SpareParts from './SpareParts.jsx';
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


  


  const handleRoleFilter = (e) => {
    const selected = e.target.value;
    setSelectedRole(selected);
    if (selected === '') {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(users.filter(user => user.role === selected));
    }
  };

 

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
      <SpareParts/>
      <p className="text-white fs-1">Popular Brands</p>
      <div className="d-flex overflow-auto " style={{ whiteSpace: 'nowrap' }}>
        <CategoryContainer />
      </div>

      
      <div className='row'>

        <StoreContainer />


      </div>

    </div>
  )
};

export default HomeScreen;
