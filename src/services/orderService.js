import API_URL, { apiFetch } from "./api";

export async function createPaymentIntent(amount) {
  const response = await apiFetch(`${API_URL}/create-payment-intent`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount }),
  });

  if (!response.ok) {
    throw new Error("Failed to create payment intent");
  }

  return response.json();
}

export async function completeCheckout(cartId, userId, paymentIntentId) {
  const response = await apiFetch(`${API_URL}/cart/${cartId}/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, payment_intent_id: paymentIntentId }),
  });

  if (!response.ok) {
    throw new Error("Checkout failed");
  }

  return response.json();
}

export async function getOrders(userId) {
  const response = await apiFetch(`${API_URL}/orders?user_id=${userId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }

  return response.json();
}

export async function getOrderDetails(orderId) {
  const response = await apiFetch(`${API_URL}/orders/${orderId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch order details");
  }

  return response.json();
}