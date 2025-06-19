import React, { useEffect, useState } from "react";
import axios from "../api/axios";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", price: "", categoryId: "" });
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem("token");
  const currentUser = token ? JSON.parse(atob(token.split(".")[1])) : null;

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/products");
      setProducts(res.data.data || []);
    } catch (err) {
      alert("Failed to fetch products.");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/categories");
      const flat = flattenCategories(res.data);
      setCategories(flat);
    } catch (err) {
      alert("Failed to load categories.");
    }
  };

  const flattenCategories = (categories, level = 0) => {
    return categories.flatMap((cat) => [
      { id: cat.id, name: "‣ ".repeat(level) + cat.name },
      ...(cat.subcategories ? flattenCategories(cat.subcategories, level + 1) : []),
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      categoryId: Number(form.categoryId),
    };

    try {
      if (editingId) {
        await axios.put(`/products/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEditingId(null);
      } else {
        await axios.post("/products", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setForm({ name: "", description: "", price: "", categoryId: "" });
      fetchProducts();
    } catch (err) {
      alert("Failed to save product.");
    }
  };

  const handleEdit = (prod) => {
    setForm({
      name: prod.name,
      description: prod.description,
      price: prod.price,
      categoryId: prod.categoryId,
    });
    setEditingId(prod.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (err) {
      alert("Failed to delete product.");
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  return (
    <div className="container mt-5">
      <h3 className="mb-4">Manage Your Products</h3>

      {currentUser ? (
        <form onSubmit={handleSubmit} className="row g-3 mb-4">
          <div className="col-md-3">
            <input
              className="form-control"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              className="form-control"
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
          </div>
          <div className="col-md-2">
            <input
              className="form-control"
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
          </div>
          <div className="col-md-2">
            <select
              className="form-select"
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <button className="btn btn-success w-100" type="submit">
              {editingId ? "Update" : "Add"}
            </button>
          </div>
        </form>
      ) : (
        <p className="text-danger">Please log in to manage products.</p>
      )}

      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Price ($)</th>
            <th>Category</th>
            <th>Owner</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((prod) => (
            <tr key={prod.id}>
              <td>{prod.name}</td>
              <td>{prod.description}</td>
              <td>{prod.price}</td>
              <td>{prod.category?.name || "-"}</td>
              <td>{prod.owner?.username || "-"}</td>
              <td>
                {(currentUser?.id === prod.userId || currentUser?.type === "admin") && (
                  <>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEdit(prod)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(prod.id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductList;
