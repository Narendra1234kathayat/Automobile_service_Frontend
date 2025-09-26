import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar, closeSidebar } from "../../Store/Slices/SidebarSlice.js";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaBox, FaClipboardList, FaPlus, FaUser, FaSignOutAlt } from "react-icons/fa";
import SocketUser from "../../socket/SocketUser.js";
const SupplierSidebar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isOpen = useSelector((state) => state.sidebar.isOpen);
     const user=JSON.parse(localStorage.getItem("user"));
  if(user){
    
      SocketUser.emit("register", user);
    //   console.log("User registered to socket with ID:", user);
    
  }
  

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        navigate("/login");
    };

    return (
        <>
            {/* Toggle button */}
            <button
                onClick={() => dispatch(toggleSidebar())}
                className="btn btn-primary position-fixed top-0 start-0 m-3"
                style={{ zIndex: 1050 }}
            >
                <FaBars size={20} />
            </button>

            {/* Sidebar */}
            {!isOpen && (
                <div
                    className="bg-dark text-white vh-100 position-fixed top-0 start-0 p-3 d-flex flex-column justify-content-between"
                    style={{ width: "250px", zIndex: 1040 }}
                >
                    <div>
                        <h4 className="fw-bold border-bottom pb-3 mb-3 mt-5">Supplier Panel</h4>

                        <nav className="nav flex-column gap-2">
                            <Link to="/supplier/dashboard" className="nav-link text-white d-flex align-items-center gap-2">
                                <FaBox /> Dashboard
                            </Link>
                            <Link to="/supplier/products" className="nav-link text-white d-flex align-items-center gap-2">
                                <FaClipboardList /> Manage Products
                            </Link>
                            <Link to="/supplier/add-product" className="nav-link text-white d-flex align-items-center gap-2">
                                <FaPlus /> Add Product
                            </Link>
                            <Link to="/supplier/orders" className="nav-link text-white d-flex align-items-center gap-2">
                                <FaClipboardList /> Orders
                            </Link>
                            <Link to="/supplier/profile" className="nav-link text-white d-flex align-items-center gap-2">
                                <FaUser /> Profile
                            </Link>
                            <Link to="/supplier/quotations" className="nav-link text-white d-flex align-items-center gap-2">
                                <FaClipboardList /> Quotations
                            </Link>
                        </nav>
                    </div>

                    {/* Logout Button at the bottom */}
                    <button
                        onClick={handleLogout}
                        className="btn btn-danger w-100 mt-3 d-flex align-items-center justify-content-center gap-2"
                    >
                        <FaSignOutAlt /> Logout
                    </button>
                </div>
            )}

            {/* Overlay (mobile only)
            {isOpen && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100"
                    style={{ zIndex: 1030 }}
                    onClick={() => dispatch(closeSidebar())}
                ></div>
            )} */}
        </>
    );
};

export default SupplierSidebar;
