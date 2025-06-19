import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import CategoryTree from "../components/CategoryTree";

function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [form, setForm] = useState({ name: "", parent_id: "" });
  const [editingId, setEditingId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const token = localStorage.getItem("token");

  const fetchPaginated = async () => {
    try {
      const res = await axios.get(`/categories?page=${page}&limit=5`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data.data);
      setTotalPages(res.data.pages);
    } catch {
      alert("Failed to fetch categories");
    }
  };

  const fetchAll = async () => {
    try {
      const res = await axios.get(`/categories?page=1&limit=100`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const flatten = (arr) => {
        let result = [];
        for (let c of arr) {
          result.push({ id: c.id, name: c.name });
          if (c.subcategories?.length) {
            result = result.concat(flatten(c.subcategories));
          }
        }
        return result;
      };
      setAllCategories(flatten(res.data.data));
    } catch {
      alert("Failed to fetch all categories");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        parent_id: form.parent_id || null,
      };
      if (editingId) {
        await axios.put(`/categories/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEditingId(null);
      } else {
        await axios.post("/categories", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setForm({ name: "", parent_id: "" });
      fetchPaginated();
      fetchAll();
    } catch {
      alert("Failed to save category");
    }
  };

  const handleEdit = (cat) => {
    setForm({ name: cat.name, parent_id: cat.parent_id || "" });
    setEditingId(cat.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPaginated();
      fetchAll();
    } catch {
      alert("Failed to delete category");
    }
  };

  useEffect(() => {
    fetchPaginated();
  }, [page]);

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <div className="container mt-5">
      <h3 className="mb-4">Manage Categories (Paginated)</h3>

      {/* Add / Edit Form */}
      <form onSubmit={handleSubmit} className="row g-3 mb-4">
        <div className="col-md-5">
          <input
            className="form-control"
            placeholder="Category Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div className="col-md-5">
          <select
            className="form-select"
            value={form.parent_id}
            onChange={(e) => setForm({ ...form, parent_id: e.target.value })}
          >
            <option value="">No Parent</option>
            {allCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <button type="submit" className="btn btn-primary w-100">
            {editingId ? "Update" : "Add"}
          </button>
        </div>
      </form>

      {/* Paginated Tree */}
      <CategoryTree
        categories={categories}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Pagination Controls */}
      <div className="d-flex justify-content-between mt-4">
        <button
          className="btn btn-outline-secondary"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          ⬅️ Previous
        </button>
        <span className="align-self-center">Page {page} of {totalPages}</span>
        <button
          className="btn btn-outline-secondary"
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Next ➡️
        </button>
      </div>
    </div>
  );
}

export default CategoryManager;
