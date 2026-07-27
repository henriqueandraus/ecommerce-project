import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService";
import API_URL from "../services/api";
import { useCart } from "../context/CartContext";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { refreshCart } = useCart();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await loginUser(username, password);
      await refreshCart();
      navigate("/");
    } catch (err) {
      setError("Invalid username or password. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Log In</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="login-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn-block">
            Log In
          </button>
        </form>

        <div className="login-divider">
          <span>Or sign in with</span>
        </div>

        <div className="login-social">
          <button
            type="button"
            className="login-social-btn"
            onClick={() => (window.location.href = `${API_URL}/auth/google`)}
          >
            Continue with Google
          </button>
          <button
            type="button"
            className="login-social-btn"
            onClick={() => (window.location.href = `${API_URL}/auth/facebook`)}
          >
            Continue with Facebook
          </button>
        </div>

        <p className="login-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
