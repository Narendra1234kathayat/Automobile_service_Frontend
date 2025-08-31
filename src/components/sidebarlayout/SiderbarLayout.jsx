import SupplierSidebar from "../navbar/SupplierSidebar";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const SupplierLayout = () => {
    const isopen =useSelector((state)=> state.sidebar.isOpen);
  return (
    <div className="d-flex container-fluid"> 
      {/* Sidebar */}
      <SupplierSidebar />

      {/* Main Content */}
      <main className="flex-grow-1 p-4 sidebar" style={{ marginLeft: !isopen ? "240px" : "0", transition: "margin-left 0.3s" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default SupplierLayout;
