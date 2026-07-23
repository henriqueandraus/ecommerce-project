import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getCurrentUser } from "../services/authService";
import { getOrCreateCart } from "../services/cartService";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartId, setCartId] = useState(null);
  const [user, setUser] = useState(null);

  const refreshCart = useCallback(async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
    if (currentUser) {
      const cart = await getOrCreateCart(currentUser.id);
      setCartId(cart.id);
    } else {
      setCartId(null);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  return (
    <CartContext.Provider value={{ cartId, user, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
