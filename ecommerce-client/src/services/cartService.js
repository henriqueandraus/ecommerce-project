import API_URL, { apiFetch } from "./api";

export async function getOrCreateCart(userId) {
  const existing = await apiFetch(`${API_URL}/cart/user/${userId}`);

  if (existing.ok) {
    return existing.json();
  }

  const created = await apiFetch(`${API_URL}/cart`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId }),
  });

  if (!created.ok) {
    throw new Error("Failed to create cart");
  }

  return created.json();
}

export async function getCartItems(cartId) {
  const response = await apiFetch(`${API_URL}/cart/${cartId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch cart items");
  }

  return response.json();
}

export async function addToCart(cartId, productId, quantity) {
  const response = await apiFetch(`${API_URL}/cart/${cartId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_id: productId, quantity }),
  });

  if (!response.ok) {
    throw new Error("Failed to add item to cart");
  }

  return response.json();
}

export async function removeFromCart(cartId, itemId) {
  const response = await apiFetch(`${API_URL}/cart/${cartId}/items/${itemId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to remove item from cart");
  }

  return response;
}