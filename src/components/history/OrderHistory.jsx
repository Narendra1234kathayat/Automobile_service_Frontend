import React, { useState, useEffect } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js";
import axiosInstance, { BASE_URL } from "../../utils/axiosInstance";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const handleViewPayslip = (order, role) => {
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Add watermark
  doc.setFontSize(60);
  doc.setTextColor(200, 200, 200);
  doc.text("SpareLink", pageWidth / 2, pageHeight / 2, {
    align: "center",
    angle: 45,
  });

  // Reset color and font
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Order Payslip", pageWidth / 2, 20, { align: "center" });

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Order ID: ${order._id}`, 14, 30);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 14, 38);
  // doc.text(`Status: ${order.status || "Unknown"}`, 14, 46);

  // Customer / Mechanic info
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Customer / Mechanic Info", 14, 56);

  const mechanic = order.mechanicId ? order.personalDetails : null;
  const address = order.address || {};

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Name: ${mechanic?.name || "Unknown"}`, 14, 64);
  doc.text(`Email: ${mechanic?.email || "Unknown"}`, 14, 70);
  doc.text(`Phone: ${mechanic?.phoneNumber || "Unknown"}`, 14, 76);
  doc.text(
    `Address: ${address.streetAddress || ""}, ${address.city || ""}, ${address.state || ""} - ${address.pincode || ""}`,
    14,
    82,
    { maxWidth: pageWidth - 28 }
  );

  // Product details table
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Product Details", 14, 92);

  autoTable(doc, {
    startY: 96,
    head: [["Product", "Qty", "Unit Price (₹)", "Discount (%)", "Total (₹)"]],
    body: [
      [
        order.quotationId?.product?.sparePartId?.name || "Unknown",
        order.quotationId?.product?.quantity || 0,
        order.quotationId?.product?.perUnitPrice || 0,
        order.quotationId?.product?.discountPercentage || 0,
        order.quotationId?.product?.totalPrice || 0,
      ],
    ],
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    theme: "grid",
  });

  const finalY = doc.lastAutoTable.finalY + 5;

  // Product description
  const description = order.quotationId?.product?.sparePartId?.description || "";
  if (description) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Description:", 14, finalY);
    doc.text(description, 14, finalY + 6, { maxWidth: pageWidth - 28 });
  }

  // Payment & delivery
  const pdY = finalY + (description ? 20 : 10);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Payment & Delivery", 14, pdY+3);

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Payment Terms: ${order.quotationId?.paymentTerms || ""}`, 14, pdY + 8);
  doc.text(`Delivery Time: ${order.quotationId?.deliveryDate || ""}`, 14, pdY + 14);

  // Additional notes
  if (order.quotationId?.additionalNotes) {
    const notesY = pdY + 24;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(" Additional Notes", 14, notesY);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(order.quotationId.additionalNotes, 14, notesY + 6, { maxWidth: pageWidth - 28 });
  }

  // Open PDF in new tab
  doc.output("dataurlnewwindow");
};





ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);


const OrderHistory = () => {
  const loginrole = JSON.parse(localStorage.getItem("role"));
  const [role, setRole] = useState();
  const [orders, setOrders] = useState([]);
  

  const handleDownloadExcel = () => {
    // 1. Prepare data
    const exportData = orders.map((order) => ({
      Date: new Date(order.createdAt).toLocaleDateString(),
      Product: order.quotationId?.product?.sparePartId?.name || "Unknown",
      Quantity: order.quotationId?.product?.quantity || 0,
      "Unit Price (₹)": order.quotationId?.product?.perUnitPrice || 0,
      "Total Price (₹)": order.quotationId?.product?.totalPrice || 0,
      [role]: role === "Supplier" ? order.supplierId?.name : order.mechanicId?.name,

    }));

    // 2. Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // 3. Create workbook and append worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

    // 4. Write workbook and download
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "orders.xlsx");
  };
  

  useEffect(() => {
    if (loginrole === "supplier") {
      setRole("Mechanic");
    } else {
      setRole("Supplier");
    }
  }, [loginrole]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axiosInstance.get(`${BASE_URL}api/order/get-order`)
        if (response.status == 200 || response.status == 201) {
          setOrders(response.data.data);
        }
      } catch (error) {
        console.log(`Error ${error}`);
      }

    }
    fetchOrder();
  }, []);

  // 🎨 Color palette (consistent across all charts)
  const colors = [
    "#007bff", "#28a745", "#ffc107", "#ff6384", "#36a2eb",
    "#ff9f40", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850"
  ];

  // 📊 Aggregate for charts
  const productTotals = orders.reduce((acc, order) => {
    const productName = order.quotationId?.product?.sparePartId?.name || "Unknown";
    const quantity = order.quotationId?.product?.quantity || 0;
    const total = order.quotationId?.product?.totalPrice || 0;

    if (!acc[productName]) {
      acc[productName] = { quantity: 0, total: 0 };
    }
    acc[productName].quantity += quantity;
    acc[productName].total += total;
    return acc;
  }, {});

  const products = Object.keys(productTotals);
  const quantities = products.map(p => productTotals[p].quantity);
  const totals = products.map(p => productTotals[p].total);

  // 1️⃣ Bar Chart
  const barData = {
    labels: products,
    datasets: [
      {
        label: "Quantity Purchased",
        data: quantities,
        backgroundColor: colors
      }
    ]
  };

  // 2️⃣ Pie Chart
  const pieData = {
    labels: products,
    datasets: [
      {
        data: totals,
        backgroundColor: colors,
        hoverOffset: 10
      }
    ]
  };

  // 3️⃣ Line Chart - Quantity Purchased Over Time

  const sortedOrders = [...orders].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );
  const lineData = {
    labels: sortedOrders.map(o => new Date(o.createdAt).toLocaleDateString()),
    datasets: [
      {
        label: "Quantity Purchased Over Time",
        data: sortedOrders.map(o => o.quotationId?.product?.quantity || 0),
        fill: false,
        borderColor: "#17a2b8",
        backgroundColor: "#17a2b8",
        tension: 0.3,
        pointRadius: 5,
        pointHoverRadius: 7
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "top" } }
  };

  return (
    <div className="container my-lg-5">
      <h3 className="mb-4 text-center text-lg-start text-light">📦 Order History Statistics</h3>

      {/* Charts Section */}
      <div className="row  g-4">
        <div className=" col-md-6">
          <div className="card shadow-sm p-3 h-100">
            <h5 className="mb-3 text-center">Quantity Purchased by Product</h5>
            <div style={{ height: "270px" }}>
              <Bar data={barData} options={chartOptions} />
            </div>
          </div>
        </div>

        <div className="col-md-6 ">
          <div className="card shadow-sm p-3 h-100">
            <h5 className="mb-3 text-center">Spending Distribution by Product</h5>
            <div style={{ height: "270px" }}>
              <Pie data={pieData} options={chartOptions} />
            </div>
          </div>
        </div>

        <div className="col-12 ">
          <div className="card shadow-sm p-3 h-100">
            <h5 className="mb-3 text-center">Quantity Trend Over Time</h5>
            <div style={{ height: "300px" }}>
              <Line data={lineData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card row shadow-sm p-3 mt-4">
        <h5 className="mb-3">Order Details</h5>

        <div className="d-flex justify-content-end mb-2">
          <button className="btn btn-success" onClick={handleDownloadExcel}>
            Download Excel
          </button>
        </div>

        <div className="col-12 table-responsive">
          <table className="table table-striped table-bordered table-hover align-middle">
            <thead className="table-dark text-center">
              <tr>

                <th>Date</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price (₹)</th>
                <th>Total (₹)</th>
                <th>{role}</th>
                <th>Slip</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {orders.map(order => (
                <tr key={order._id}>

                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>{order.quotationId?.product?.sparePartId?.name || "Unknown"}</td>
                  <td>{order.quotationId?.product?.quantity}</td>
                  <td>{order.quotationId?.product?.perUnitPrice}</td>
                  <td>{order.quotationId?.product?.totalPrice}</td>
                  <td>
                    <span className={`badge ${order.status === "Delivered" ? "bg-success" : "bg-warning"}`}>
                      {role === "Supplier" ? order.supplierId?.name : order.mechanicId?.name}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-info btn-sm"
                      onClick={() => handleViewPayslip(order, role)}
                    >
                      Download Payslip
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
