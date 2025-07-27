import { useState } from 'react'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const Navbar = () => {
  const [activeItem, setActiveItem] = useState("Home");
  const navigate = useNavigate();
  const handleNavClick = (item) => {
    setActiveItem(item);  
    // You can add more logic here if needed, like scrolling to a section or changing the view
  };
  return (


    <>
      <nav className="navbar navbar-expand-md bg-body-secondary-emphasis position-fixed  ">
        <div className="container-fluid container-lg  my-lg-2 mx-auto">
          <Link className="navbar-brand" to="/">Automobile</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item mx-lg-2 text-lg-start text-center">
                <Link
                  to="/"
                  className={`nav-link responsive-text ${activeItem === "Home" ? "active " : ""}`}
                  
                  onClick={() => handleNavClick("Home")}
                >
                  Home
                </Link>
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
                <button className="btn btn-signup me-2" type="button" onClick={()=> navigate('/register')} >Sign Up</button>
              </li>
              <li className="nav-item my-2 my-lg-0">
                <button className="btn btn-login" type="button" onClick={()=> navigate('/login')}>Login</button>
              </li>
            </ul>
          </div>


        </div>
      </nav >

    </>
  )
}

export default Navbar