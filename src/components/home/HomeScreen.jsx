import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import MapView from './MapView';
import StoreContainer from './StoreContainer';
import CategoryContainer from './CategoryContainer';
import ProductContainer from './ProductContainer';

function getAuthToken() {
  return localStorage.getItem('authToken');
}

const HomeScreen = () => {
  return (
    <div style={{
      marginTop: '100px',
      marginLeft: '25px',
      marginRight: '25px',
      paddingLeft: '15px',
      paddingRight: '15px'
    }}>
      <MapView />
      <p className="text-white fw-bold fs-4 fs-md-3 fs-lg-2 mb-1">Nearby Store</p>
      <div className="d-flex overflow-auto gap-3" style={{ whiteSpace: 'nowrap' }}>
        <StoreContainer />
      </div>
      <p className="text-white fw-bold fs-4 fs-md-3 fs-lg-2 mb-1">Categories</p>
      <div className="d-flex overflow-auto gap-3" style={{ whiteSpace: 'nowrap' }}>
        <CategoryContainer />
      </div>
       <p className="text-white fw-bold fs-4 fs-md-3 fs-lg-2 mb-1">Products</p>
       
             <div className="d-flex overflow-auto gap-3" style={{ whiteSpace: 'nowrap' }}>
        <ProductContainer />
      </div>
    </div>
  )
};

export default HomeScreen;
