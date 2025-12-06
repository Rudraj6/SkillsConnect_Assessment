import { useState } from "react";
import { login } from "../authService"; 
import "./Login.css";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      onLogin(); 
    } catch (err) {
      alert("Invalid email or password");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <div className="login-field">
        <label className="login-label">Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="login-input"
        />
      </div>

      <div className="login-field">
        <label className="login-label">Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="login-input"
        />
      </div>

      <button type="submit" className="login-button">
        Login
      </button>
    </form>
  );
}

export default Login;
