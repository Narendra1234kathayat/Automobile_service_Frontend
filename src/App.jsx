import { useState } from 'react'

import './App.css';
import './index.css';
import Navbar from './components/navbar/Navbar';
import Login from './components/auth/Login';

function App() {
  

  return (
    <>
      <div className=' position-relative mainbox w-100'>
        <Navbar/>
        <Login/>
       
      
      </div>
    </>
  )
}

export default App
