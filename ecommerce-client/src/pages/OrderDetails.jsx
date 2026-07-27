import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/authService";
import { getOrderDetails } from "../services/orderService";
import "./OrderDetails.css";

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

  if (error) return <p className="page-status">{error}</p>;

  return (
    <div className="order-details-page">
      <h1 className="order-details-title">Order #{id}</h1>
      <div className="order-details-list">
        {items.map((item) => (
          <div key={item.id} className="order-details-item">
            <span>
              {item.name} x {item.quantity}
            </span>
            <span>${item.price_at_purchase} each</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderDetails;
