import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getCurrentUser } from "../services/authService";
import { getOrders } from "../services/orderService";
import "./Orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchOrders() {
      const user = await getCurrentUser();

      if (!user) {
        navigate("/login");
        return;
      }

      try {
        const data = await getOrders(user.id);
        setOrders(data);
      } catch (err) {
        setError("Failed to load order history.");
      }
    }

    fetchOrders();
  }, [navigate]);

  if (error) return <p className="page-status">{error}</p>;

  return (
    <div className="orders-page">
      <h1 className="orders-title">Order History</h1>
      {orders.length === 0 ? (
        <p className="page-status">You have no past orders.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-card-main">
                <p className="order-card-id">Order #{order.id}</p>
                <p className="order-card-status">{order.status}</p>
              </div>
              <div className="order-card-foot">
                <p className="order-card-total">Total: ${order.total_amount}</p>
                <Link to={`/orders/${order.id}`} className="order-card-link">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
