import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService";
import API_URL from "../services/api";
import { useCart } from "../context/CartContext";

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
    <div>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Log In</button>
      </form>

      <div>
        <p>Or sign in with:</p>
        <button type="button" onClick={() => (window.location.href = `${API_URL}/auth/google`)}>
          Continue with Google
        </button>
        <button type="button" onClick={() => (window.location.href = `${API_URL}/auth/facebook`)}>
          Continue with Facebook
        </button>
      </div>

      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default Login;