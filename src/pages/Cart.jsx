import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getCartItems, removeFromCart } from "../services/cartService";

function Cart() {
  const { cartId } = useCart();
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!cartId) {
      navigate("/login");
      return;
    }

    async function fetchItems() {
      try {
        const data = await getCartItems(cartId);
        setItems(data);
      } catch (err) {
        setError("Failed to load cart items.");
      }
    }

    fetchItems();
  }, [cartId, navigate]);

  const handleRemove = async (itemId) => {
    try {
      await removeFromCart(cartId, itemId);
      setItems(items.filter((item) => item.id !== itemId));
    } catch (err) {
      setError("Failed to remove item.");
    }
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h1>Your Cart</h1>
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {items.map((item) => (
            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <span>{item.name} x {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
              <button onClick={() => handleRemove(item.id)}>Remove</button>
            </div>
          ))}
          <h3>Total: ${total.toFixed(2)}</h3>
          <button onClick={() => navigate("/checkout")}>Proceed to Checkout</button>
        </>
      )}
    </div>
  );
}

export default Cart;