import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authService";
import { useCart } from "../context/CartContext";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const { refreshCart } = useCart();

  const handleLogout = async () => {
    try {
      await logoutUser();
      await refreshCart();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <nav className="nav">
      <Link to="/" className="nav-brand">
        Blacktop
      </Link>
      <div className="nav-links">
        <Link to="/products">Shop</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/orders">Orders</Link>
        <button className="nav-logout" onClick={handleLogout}>
          Log Out
        </button>
      </div>
    </nav>
  );
}

export default Navbar;