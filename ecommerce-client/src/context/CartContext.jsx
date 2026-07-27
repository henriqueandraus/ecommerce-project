import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getCurrentUser } from "../services/authService";
import { getOrCreateCart, getCartItems } from "../services/cartService";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartId, setCartId] = useState(null);
  const [user, setUser] = useState(null);
  const [itemCount, setItemCount] = useState(0);

  const refreshCartCount = useCallback(async (id) => {
    if (!id) {
      setItemCount(0);
      return;
    }
    try {
      const items = await getCartItems(id);
      setItemCount(items.reduce((sum, item) => sum + item.quantity, 0));
    } catch {
      setItemCount(0);
    }
  }, []);

  const refreshCart = useCallback(async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
    if (currentUser) {
      const cart = await getOrCreateCart(currentUser.id);
      setCartId(cart.id);
      await refreshCartCount(cart.id);
    } else {
      setCartId(null);
      await refreshCartCount(null);
    }
  }, [refreshCartCount]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  return (
    <CartContext.Provider value={{ cartId, user, itemCount, refreshCart, refreshCartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
