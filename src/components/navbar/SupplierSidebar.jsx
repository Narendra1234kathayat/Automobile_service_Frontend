import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar, closeSidebar } from "../../Store/Slices/SidebarSlice.js";
import { Link } from "react-router-dom";
import { FaBars, FaTimes, FaBox, FaClipboardList, FaPlus, FaUser } from "react-icons/fa";

const SupplierSidebar = () => {
    const dispatch = useDispatch();
    const isOpen = useSelector((state) => state.sidebar.isOpen);

    return (
        <>
            {/* Toggle button */}
            <button
                onClick={() => dispatch(toggleSidebar())}
                className="btn btn-primary  position-fixed top-0 start-0 m-3 "
                style={{ zIndex: 1050 }} // Ensure button is above the sidebar
            >
                {/* {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />} */}
                <FaBars size={20} />
            </button>

            {/* Sidebar */}
            {!isOpen && <div
                className={`  bg-dark text-white vh-100 position-fixed top-0 start-0 p-3 transition-all `}
                style={{ width: "250px", zIndex: 1040 }}
            >
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
            }
            {/* Overlay (mobile only) */}
            {isOpen && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100  "
                    style={{ zIndex: 1030 }}
                    onClick={() => dispatch(closeSidebar())}
                > </div>
            )}
        </>
    );
};

export default SupplierSidebar;
