import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { useCart } from "../context/CartContext";
import { getCartItems, removeFromCart } from "../services/cartService";
import "./Cart.css";

function Cart() {
  const { cartId, refreshCartCount } = useCart();
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
      await refreshCartCount(cartId);
    } catch (err) {
      setError("Failed to remove item.");
    }
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (error) return <p className="page-status">{error}</p>;

  return (
    <div className="cart-page">
      <h1 className="cart-title">Your Cart</h1>
      {items.length === 0 ? (
        <p className="page-status">Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-items">
            {items.map((item) => (
              <div key={item.id} className="cart-item">
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                <button
                  type="button"
                  className="cart-item-remove"
                  aria-label={`Remove ${item.name}`}
                  onClick={() => handleRemove(item.id)}
                >
                  <X size={16} strokeWidth={2} />
                </button>
              </div>
            ))}
          </div>
          <div className="cart-total">
            <span>Total</span>
            <span className="cart-total-amount">${total.toFixed(2)}</span>
          </div>
          <button className="btn-block" onClick={() => navigate("/checkout")}>
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
}

export default Cart;
