import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, ShoppingCart } from "lucide-react";
import { logoutUser } from "../services/authService";
import { useCart } from "../context/CartContext";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const { user, itemCount, refreshCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      await refreshCart();
      setMenuOpen(false);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <nav className="nav">
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/products">Shop</Link>
        <Link to="/orders">Orders</Link>
      </div>
      <div className="nav-icons">
        {user ? (
          <div className="nav-user" ref={menuRef}>
            <button
              type="button"
              className="nav-icon-btn"
              aria-label="Account menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <User size={20} strokeWidth={2} />
            </button>
            {menuOpen && (
              <div className="nav-menu">
                <button type="button" className="nav-menu-item" onClick={handleLogout}>
                  Log Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="nav-icon-btn" aria-label="Log in">
            <User size={20} strokeWidth={2} />
          </Link>
        )}
        <Link to="/cart" className="nav-icon-btn nav-cart-btn" aria-label="Cart">
          <ShoppingCart size={20} strokeWidth={2} />
          {itemCount > 0 && <span className="nav-cart-badge">{itemCount > 9 ? "9+" : itemCount}</span>}
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
