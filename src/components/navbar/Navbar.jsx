import React from 'react'
import { useState } from 'react'
const Navbar = () => {
  const [activeItem, setActiveItem] = useState("Home");

  const handleNavClick = (item) => {
    setActiveItem(item);  
    // You can add more logic here if needed, like scrolling to a section or changing the view
  };
  return (


    <>
      <nav className="navbar navbar-expand-md bg-body-secondary-emphasis position-fixed  ">
        <div className="container-fluid container-lg  my-lg-2 mx-auto">
          <a className="navbar-brand" href="#">Automobile</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item mx-lg-2 text-lg-start text-center">
                <a
                  className={`nav-link responsive-text ${activeItem === "Home" ? "active " : ""}`}
                  href="#"
                  onClick={() => handleNavClick("Home")}
                >
                  Home
                </a>
              </li>
              <li className="nav-item mx-lg-2 text-lg-start text-center">
                <a
                  className={`nav-link responsive-text ${activeItem === "Services" ? "active " : ""}`}
                  href="#"
                  onClick={() => handleNavClick("Services")}
                >
                  Services
                </a>
              </li>
              <li className="nav-item mx-lg-2 text-lg-start text-center">
                <a
                  className={`nav-link responsive-text ${activeItem === "History" ? "active " : ""}`}
                  href="#"
                  onClick={() => handleNavClick("History")}
                >
                  Services history
                </a>
              </li>
              <li className="nav-item mx-lg-2 text-lg-start text-center">
                <a
                  className={`nav-link responsive-text ${activeItem === "Contact" ? "active " : ""}`}
                  href="#"
                  onClick={() => handleNavClick("Contact")}
                >
                  Contact us
                </a>
              </li>
              <li className="nav-item mx-lg-2 text-lg-start text-center">
                <a
                  className={`nav-link responsive-text ${activeItem === "Profile" ? "active " : ""}`}
                  href="#"
                  onClick={() => handleNavClick("Profile")}
                >
                  Profile
                </a>
              </li>
            </ul>

            <ul className="  list-unstyled navbar-nav ms-lg-auto ms-0 d-flex flex-row justify-content-center">
              <li className="nav-item my-2 my-lg-0">
                <button className="btn btn-signup me-2" type="button">Sign Up</button>
              </li>
              <li className="nav-item my-2 my-lg-0">
                <button className="btn btn-login" type="button">Login</button>
              </li>
            </ul>
          </div>


        </div>
      </nav >

    </>
  )
}

export default Navbar