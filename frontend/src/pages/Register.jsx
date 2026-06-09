import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import api from "../services/app.js";
import "../styles/Register.css";

function Register() {

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {

        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);
            const response = await api.post("/api/v1/auth/register", formData);
            console.log(response.data);
            alert("Registration Successful");
            navigate("/login")
            setFormData({
                username: "",
                email: "",
                password: ""
            });

        } catch (error) {
            alert(error.response?.data?.message || "Registration Failed");
        } finally {
            setLoading(false);
        }

    };

    return (
        <div className="register-container">
            <div className="register-card">

                <h2>Create Account</h2>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Username</label>

                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
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
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {
                            loading
                                ? "Registering..."
                                : "Register"
                        }
                    </button>

                </form>

            </div>
        </div>
    );
}

export default Register;