import React, { useEffect, useState } from "react";
import axios from "../api/axios";

function AdminManager() {
  const [admins, setAdmins] = useState([]);
  const [form, setForm] = useState({ username: "", email: "", name: "", password: "" });
  const [editingId, setEditingId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const token = localStorage.getItem("token");

  const fetchAdmins = async () => {
    try {
      const res = await axios.get(`/admin/admins?page=${page}&limit=5`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAdmins(res.data.data);
      setTotalPages(res.data.pages);
    } catch (err) {
      alert("Failed to fetch admins.");
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, [page]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const headers = { Authorization: `Bearer ${token}` };

      if (editingId) {
        await axios.put(`/admin/admins/${editingId}`, form, { headers });
        setEditingId(null);
      } else {
        await axios.post("/admin/admins", form, { headers });
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
      await axios.delete(`/admin/admins/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAdmins();
    } catch (err) {
      alert("Failed to delete admin.");
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="mb-4">Manage Admins</h3>

      {/* Add / Update Form */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row g-2">
          <div className="col-md-3">
            <input
              name="username"
              className="form-control"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              name="name"
              className="form-control"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              name="email"
              type="email"
              className="form-control"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              name="password"
              type="password"
              className="form-control"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required={!editingId}
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          {editingId ? "Update Admin" : "Add Admin"}
        </button>
      </form>

      {/* Admins Table */}
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
          {admins.length > 0 ? (
            admins.map((admin) => (
              <tr key={admin.id}>
                <td>{admin.username}</td>
                <td>{admin.name}</td>
                <td>{admin.email}</td>
                <td>
                  <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(admin)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(admin.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="4" className="text-center text-muted">No admins found.</td></tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="d-flex justify-content-between mt-3">
        <button
          className="btn btn-outline-secondary"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          ⬅️ Prev
        </button>
        <span className="align-self-center">Page {page} of {totalPages}</span>
        <button
          className="btn btn-outline-secondary"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Next ➡️
        </button>
      </div>
    </div>
  );
}

export default AdminManager;
