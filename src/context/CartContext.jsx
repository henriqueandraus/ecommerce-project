import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getCurrentUser } from "../services/authService";
import { getOrCreateCart } from "../services/cartService";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartId, setCartId] = useState(null);

  const refreshCart = useCallback(async () => {
    const user = await getCurrentUser();
    if (user) {
      const cart = await getOrCreateCart(user.id);
      setCartId(cart.id);
    } else {
      setCartId(null);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  return (
    <CartContext.Provider value={{ cartId, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}