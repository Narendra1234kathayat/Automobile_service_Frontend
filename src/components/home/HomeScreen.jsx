import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const slideInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <motion.div 
      className="container mt-1 mt-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero section */}
      <motion.div variants={itemVariants}>
        <HeroSection />
      </motion.div>

      <motion.div 
        className="jumbotron p-4 mb-4 bg-light border rounded"
        variants={itemVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{  amount: 0.3 }}
      >
        <div className="row align-items-center">
          <motion.div
            className="col-12 text-center py-md-5 py-3 px-md-3"
            style={{
              backgroundColor: "#111828",
              color: "#f8f9fa",
              borderRadius: "12px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <motion.h1 
              className="display-5 fw-bold mb-3" 
              style={{ color: "#05976A" }}
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Welcome to SpareLink!
            </motion.h1>
            
            <motion.p 
              className="lead mb-4" 
              style={{ fontSize: "1.2rem" }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Browse users, service centers, and hardware shops with ease.
            </motion.p>
            
            <motion.button
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
                e.target.style.color = "#05976A";
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              Get User Location
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      <motion.div 
        variants={itemVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <SpareParts />
      </motion.div>

      <motion.p 
        className="text-white fs-1"
        variants={slideInLeft}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        Popular Brands
      </motion.p>

      <motion.div 
        className="d-flex overflow-auto" 
        style={{ whiteSpace: 'nowrap' }}
        variants={itemVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <CategoryContainer />
      </motion.div>

      <motion.div 
        className='row'
        variants={itemVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{  amount: 0.3 }}
      >
        <StoreContainer />
      </motion.div>
    </motion.div>
  );
};

export default HomeScreen;
