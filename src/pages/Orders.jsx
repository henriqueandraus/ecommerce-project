import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getCurrentUser } from "../services/authService";
import { getOrders } from "../services/orderService";

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

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h1>Order History</h1>
      {orders.length === 0 ? (
        <p>You have no past orders.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "0.5rem" }}>
            <p>Order #{order.id}</p>
            <p>Status: {order.status}</p>
            <p>Total: ${order.total_amount}</p>
            <Link to={`/orders/${order.id}`}>View Details</Link>
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;