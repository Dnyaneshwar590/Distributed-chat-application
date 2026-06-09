import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import api from "../services/app.js";
import "../styles/Login.css";

function Login() {

  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      setLoading(true);
      const response = await api.post("/api/v1/auth/login", formData);
      console.log(response.data);
      alert("Login Successful");
      navigate("/chat")

    } catch (error) {
      alert(error.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome Back</h2>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Username</label>

            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            { loading? "Logging In..." : "Login" }
          </button>

        </form>

      </div>

    </div>
  );
}

export default Login;