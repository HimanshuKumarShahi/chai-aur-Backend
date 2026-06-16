// src/App.jsx
import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        email,
      });

      setMessage({ type: "success", text: "✨ " + response.data.message });
      setEmail("");
    } catch (error) {
      setMessage({
        type: "error",
        text: "❌ Oops! Connection me kuch problem hai.",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="logo">☁️🍔</div>
      <h2 className="title">Cloud Bites</h2>
      <p className="subtitle">Login to access your premium kitchen dashboard</p>

      <form onSubmit={handleLogin}>
        <div className="input-group">
          <label>Email Address</label>
          <input
            type="email"
            className="input-field"
            placeholder="admin@cloudbites.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Sending Test Mail..." : "Login securely"}
        </button>
      </form>

      {message.text && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}
    </div>
  );
}

export default App;
