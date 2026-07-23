import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/authService";
import { getOrderDetails } from "../services/orderService";

function OrderDetails() {
  const { id } = useParams();
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchOrder() {
      const user = await getCurrentUser();

      if (!user) {
        navigate("/login");
        return;
      }

      try {
        const data = await getOrderDetails(id);
        setItems(data);
      } catch (err) {
        setError("Failed to load order details.");
      }
    }

    fetchOrder();
  }, [id, navigate]);

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h1>Order #{id}</h1>
      {items.map((item) => (
        <div key={item.id}>
          {item.name} x {item.quantity} — ${item.price_at_purchase} each
        </div>
      ))}
    </div>
  );
}

export default OrderDetails;