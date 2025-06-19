// src/pages/AdminManager.js
import React, { useEffect, useState } from "react";
import axios from "../api/axios";

function AdminManager() {
  const [admins, setAdmins] = useState([]);
  const [form, setForm] = useState({ username: "", email: "", name: "", password: "" });
  const [editingId, setEditingId] = useState(null);

  const fetchAdmins = async () => {
    try {
      const res = await axios.get("/admin/admins");
      setAdmins(res.data);
    } catch (err) {
      alert("Failed to fetch admins.");
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/admin/admins/${editingId}`, form);
        setEditingId(null);
      } else {
        await axios.post("/admin/admins", form);
      }
      setForm({ username: "", email: "", name: "", password: "" });
      fetchAdmins();
    } catch (err) {
      alert("Failed to save admin.");
    }
  };

  const handleEdit = (admin) => {
    setForm({ username: admin.username, email: admin.email, name: admin.name, password: "" });
    setEditingId(admin.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;
    try {
      await axios.delete(`/admin/admins/${id}`);
      fetchAdmins();
    } catch (err) {
      alert("Failed to delete admin.");
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="mb-4">Manage Admins</h3>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row g-2">
          <div className="col-md-3">
            <input name="username" className="form-control" placeholder="Username" value={form.username} onChange={handleChange} required />
          </div>
          <div className="col-md-3">
            <input name="name" className="form-control" placeholder="Name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="col-md-3">
            <input name="email" type="email" className="form-control" placeholder="Email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="col-md-3">
            <input name="password" type="password" className="form-control" placeholder="Password" value={form.password} onChange={handleChange} required={!editingId} />
          </div>
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          {editingId ? "Update Admin" : "Add Admin"}
        </button>
      </form>

      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>Username</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin.id}>
              <td>{admin.username}</td>
              <td>{admin.name}</td>
              <td>{admin.email}</td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(admin)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(admin.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminManager;