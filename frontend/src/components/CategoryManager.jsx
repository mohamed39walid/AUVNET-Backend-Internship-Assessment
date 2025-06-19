import React, { useEffect, useState } from "react";
import axios from "../api/axios";

// Utility to flatten nested categories with parent names
function flattenCategories(categories, parentMap = {}, level = 0) {
  let flat = [];
  for (const cat of categories) {
    const parentName = parentMap[cat.parent_id] || "-";
    flat.push({ ...cat, parentName, level });

    if (cat.subcategories && cat.subcategories.length > 0) {
      const newMap = { ...parentMap, [cat.id]: cat.name };
      flat = flat.concat(flattenCategories(cat.subcategories, newMap, level + 1));
    }
  }
  return flat;
}

function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", parent_id: "" });
  const [editingId, setEditingId] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/categories");
      const flat = flattenCategories(res.data);
      setCategories(flat);
    } catch (err) {
      alert("Failed to fetch categories.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      parent_id: form.parent_id === "" ? null : Number(form.parent_id),
    };

    try {
      if (editingId) {
        await axios.put(`/categories/${editingId}`, payload);
        setEditingId(null);
      } else {
        await axios.post("/categories", payload);
      }

      setForm({ name: "", parent_id: "" });
      fetchCategories();
    } catch (err) {
      alert("Failed to save category.");
    }
  };

  const handleEdit = (cat) => {
    setForm({
      name: cat.name,
      parent_id: cat.parent_id !== null ? String(cat.parent_id) : "",
    });
    setEditingId(cat.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await axios.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      alert("Failed to delete category.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="container mt-5">
      <h3 className="mb-4">Manage Categories</h3>

      {/* Category Form */}
      <form onSubmit={handleSubmit} className="row g-3 mb-4">
        <div className="col-md-5">
          <input
            className="form-control"
            name="name"
            placeholder="Category Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div className="col-md-5">
          <select
            className="form-select"
            name="parent_id"
            value={form.parent_id}
            onChange={(e) => setForm({ ...form, parent_id: e.target.value })}
          >
            <option value="">No Parent</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {"‣ ".repeat(cat.level) + cat.name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary w-100" type="submit">
            {editingId ? "Update" : "Add"}
          </button>
        </div>
      </form>

      {/* Category Table */}
      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th>Parent</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id}>
              <td>
                <span style={{ paddingLeft: `${cat.level * 20}px` }}>
                  {cat.name}
                </span>
              </td>
              <td>{cat.parentName}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleEdit(cat)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(cat.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CategoryManager;
