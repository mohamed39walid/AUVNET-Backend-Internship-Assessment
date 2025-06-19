import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

function Register() {
  const [form, setForm] = useState({ username: "", name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/register", form);
      localStorage.setItem("token", res.data.token);
      alert("Registered and logged in successfully!");
      navigate("/");
    } catch (err) {
      alert("Registration failed: " + err.response?.data?.message);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <h3 className="mb-4">Register</h3>
      <form onSubmit={handleRegister}>
        <input name="username" className="form-control mb-3" placeholder="Username" onChange={handleChange} required />
        <input name="name" className="form-control mb-3" placeholder="Full Name" onChange={handleChange} required />
        <input name="email" type="email" className="form-control mb-3" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" className="form-control mb-3" placeholder="Password" onChange={handleChange} required />
        <button type="submit" className="btn btn-success w-100">Register</button>
      </form>
    </div>
  );
}

export default Register;
