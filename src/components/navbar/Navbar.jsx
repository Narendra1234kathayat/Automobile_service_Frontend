import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setSearchQuery } from "../../Store/Slices/SearchSlice.js";
import CarAnimation from "../animation/CarAnimation.jsx";
import SocketUser from "../../socket/SocketUser.js";

const Navbar = () => {
  const [activeItem, setActiveItem] = useState("Home");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (isLoggedIn && user) {
      SocketUser.emit("register", user);
      console.log("User registered to socket with ID:", user);
    }
  }, [isLoggedIn]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ Get spare parts list from Redux
  const spareParts = useSelector((state) => state.spareparts.items);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    dispatch(setSearchQuery(searchTerm));

    const found = spareParts.find((part) =>
      part.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (found) {
      navigate(`/spareparts`);
    } else {
      navigate(`/spareparts`);
    }
  };

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <>
      <nav className="navbar navbar-expand-md bg-body-secondary-emphasis">
        <CarAnimation />
        <div className="container-fluid container-lg my-lg-2 mx-auto ">
          <Link className="navbar-brand" to="/">
            SpareLink
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item mx-lg-2">
                <Link
                  to="/"
                  className={`nav-link ${activeItem === "Home" ? "active" : ""
                    }`}
                  onClick={() => setActiveItem("Home")}
                >
                  Home
                </Link>
              </li>

              

              {/* ✅ Quotation NavLink */}
              <li className="nav-item mx-lg-2">
                <Link
                  to="/quotations"
                  className={`nav-link ${activeItem === "Quotations" ? "active" : ""
                    }`}
                  onClick={() => setActiveItem("Quotations")}
                >
                  Quotations
                </Link>
              </li>

              {/* ✅ Wishlist instead of Cart */}
              <li className="nav-item mx-lg-2">
                <Link
                  to="/restock"
                  className={`nav-link ${activeItem === "Wishlist" ? "active" : ""
                    }`}
                  onClick={() => setActiveItem("Wishlist")}
                >
                  ReStock
                </Link>
              </li>
              <li className="nav-item mx-lg-2">
                <Link
                  to="/order-history"
                  className={`nav-link ${activeItem === "History" ? "active" : ""
                    }`}
                  onClick={() => setActiveItem("History")}
                >
                  Orders
                </Link>
              </li>

              
            </ul>

            {/* 🔍 Search Input */}
            <form className="d-flex me-3 w-md-auto" onSubmit={handleSearch}>
              <input
                type="text"
                className="form-control"
                placeholder="Search spare parts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>

            {/* ✅ Auth Buttons */}
            {/* ✅ Auth Buttons */}
            <ul className="navbar-nav mt-2 mt-md-0">
              {!isLoggedIn ? (
                <>
                  <li className="nav-item">
                    <button
                      className="btn btn-signup me-2 text-nowrap"
                      onClick={() => navigate("/register")}
                    >
                      Sign Up
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className="btn btn-login"
                      onClick={() => navigate("/login")}
                    >
                      Login
                    </button>
                  </li>
                </>
              ) : (
                <li className="nav-item dropdown position-relative">
                  <button
                    className="btn btn-light dropdown-toggle"
                    id="profileDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {JSON.parse(localStorage.getItem("user"))?.name || "Profile"}
                  </button>
                  <ul
                    className="dropdown-menu dropdown-menu-end"
                    aria-labelledby="profileDropdown"
                    style={{ zIndex: 2000 }}   // ✅ force on top
                  >
                    <li>
                      <button className="dropdown-item" onClick={() => navigate("/profile")}>
                        Profile
                      </button>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button className="dropdown-item text-danger" onClick={handleLogout}>
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>

              )}
            </ul>

          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
