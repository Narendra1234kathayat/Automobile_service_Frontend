import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setSearchQuery } from "../../Store/Slices/SearchSlice.js";

const Navbar = () => {
  const [activeItem, setActiveItem] = useState("Home");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ Get spare parts list from Redux
  const spareParts = useSelector((state) => state.spareparts.items);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // true if token exists
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
    <nav className="navbar navbar-expand-md bg-body-secondary-emphasis">
      <div className="container-fluid container-lg my-lg-2 mx-auto">
        <Link className="navbar-brand" to="/">SpareLink</Link>
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
                className={`nav-link ${activeItem === "Home" ? "active" : ""}`}
                onClick={() => setActiveItem("Home")}
              >
                Home
              </Link>
            </li>
            <li className="nav-item mx-lg-2">
              <Link
                to="/order-history"
                className={`nav-link ${activeItem === "History" ? "active" : ""}`}
                onClick={() => setActiveItem("History")}
              >
                Orders
              </Link>
            </li>
            <li className="nav-item mx-lg-2">
              <Link
                to="/cartpage"
                className={`nav-link ${activeItem === "Cart" ? "active" : ""}`}
                onClick={() => setActiveItem("Cart")}
              >
                Cart
              </Link>
            </li>
            <li className="nav-item mx-lg-2">
              <Link
                to="/profile"
                className={`nav-link ${activeItem === "Profile" ? "active" : ""}`}
                onClick={() => setActiveItem("Profile")}
              >
                Profile
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
              <li className="nav-item">
                <button
                  className="btn btn-light"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
 