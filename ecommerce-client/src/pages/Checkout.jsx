import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useCart } from "../context/CartContext";
import { getCartItems } from "../services/cartService";
import { getCurrentUser } from "../services/authService";
import { createPaymentIntent, completeCheckout } from "../services/orderService";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm({ total }) {
  const stripe = useStripe();
  const elements = useElements();
  const { cartId } = useCart();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setProcessing(true);

    try {
      const user = await getCurrentUser();
      const { clientSecret } = await createPaymentIntent(total);

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setError(result.error.message);
        setProcessing(false);
        return;
      }

      if (result.paymentIntent.status === "succeeded") {
        await completeCheckout(cartId, user.id, result.paymentIntent.id);
        navigate("/orders");
      }
    } catch (err) {
      setError("Checkout failed. Please try again.");
    }

    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit" disabled={!stripe || processing}>
        {processing ? "Processing..." : `Pay $${total.toFixed(2)}`}
      </button>
    </form>
  );
}

function Checkout() {
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

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (items.length === 0) return <p>Your cart is empty.</p>;

  return (
    <div>
      <h1>Checkout</h1>
      {items.map((item) => (
        <div key={item.id}>
          {item.name} x {item.quantity} — ${(item.price * item.quantity).toFixed(2)}
        </div>
      ))}
      <h3>Total: ${total.toFixed(2)}</h3>

      <Elements stripe={stripePromise}>
        <CheckoutForm total={total} />
      </Elements>
    </div>
  );
}

export default Checkout;