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
  // const orders = [
  //   { id: "ORD001", date: "2025-08-01", product: "Brake Pad Set", quantity: 2, price: 1500, total: 3000, status: "Delivered" },
  //   { id: "ORD002", date: "2025-07-20", product: "Engine Oil", quantity: 3, price: 800, total: 2400, status: "Delivered" },
  //   { id: "ORD003", date: "2025-07-05", product: "Air Filter", quantity: 1, price: 1200, total: 1200, status: "Delivered" },
  //   { id: "ORD004", date: "2025-06-28", product: "Car Battery", quantity: 1, price: 6500, total: 6500, status: "Delivered" },
  //   { id: "ORD005", date: "2025-06-15", product: "Spark Plug", quantity: 4, price: 350, total: 1400, status: "Delivered" },
  //   { id: "ORD006", date: "2025-05-30", product: "Brake Fluid", quantity: 2, price: 450, total: 900, status: "Delivered" },
  //   { id: "ORD007", date: "2025-05-18", product: "Radiator", quantity: 1, price: 4500, total: 4500, status: "Delivered" },
  //    { id: "ORD003", date: "2025-07-05", product: "Air Filter", quantity: 1, price: 1200, total: 1200, status: "Delivered" },
  //   { id: "ORD004", date: "2025-06-28", product: "Car Battery", quantity: 1, price: 6500, total: 6500, status: "Delivered" },
  //   { id: "ORD005", date: "2025-06-15", product: "Spark Plug", quantity: 4, price: 350, total: 1400, status: "Delivered" },
  //   { id: "ORD008", date: "2025-05-01", product: "Windshield Wipers", quantity: 2, price: 700, total: 1400, status: "Delivered" },
  //   { id: "ORD009", date: "2025-04-20", product: "Headlight Bulb", quantity: 2, price: 500, total: 1000, status: "Delivered" },
  //   { id: "ORD010", date: "2025-04-05", product: "Air Conditioner Filter", quantity: 1, price: 1800, total: 1800, status: "Delivered" }
  // ];
  const [orders, setOrders] = useState([]);
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
    <div className="container my-5">
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
      <div className="card shadow-sm p-3 mt-4">
        <h5 className="mb-3">Order Details</h5>
        <div className="table-responsive">
          <table className="table table-striped table-bordered table-hover align-middle">
            <thead className="table-dark text-center">
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price (₹)</th>
                <th>Total (₹)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {orders.map(order => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>{order.quotationId?.product?.sparePartId?.name || "Unknown"}</td>
                  <td>{order.quotationId?.product?.quantity}</td>
                  <td>{order.quotationId?.product?.perUnitPrice}</td>
                  <td>{order.quotationId?.product?.totalPrice}</td>
                  <td>
                    <span className={`badge ${order.status === "Delivered" ? "bg-success" : "bg-warning"}`}>
                      {order.status}
                    </span>
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
