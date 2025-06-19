import React, { useEffect, useState } from "react";
import axios from "../api/axios";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
  });
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const currentUser = token ? JSON.parse(atob(token.split(".")[1])) : null;

  // Updated flattenCategories function to match your API response
  const flattenCategories = (cats, level = 0) => {
    if (!cats || !Array.isArray(cats)) return [];
    return cats.flatMap((cat) => [
      { 
        id: cat.id, 
        name: `${'— '.repeat(level)}${cat.name}`,
        parent_id: cat.parent_id 
      },
      ...flattenCategories(cat.subcategories, level + 1)
    ]);
  };

  const fetchCategories = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const res = await axios.get("/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!res.data || !res.data.data) {
        throw new Error("Invalid categories data structure");
      }

      const flat = flattenCategories(res.data.data);
      setCategories(flat);
    } catch (err) {
      console.error("Categories fetch error:", err);
      setError("Failed to load categories. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`/products?page=${page}&limit=5`);
      setProducts(res.data.data || []);
      setTotalPages(res.data.pages || 1);
    } catch (err) {
      console.error("Products fetch error:", err);
      alert("Failed to fetch products. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      categoryId: form.categoryId || null,
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
      alert(err.response?.data?.message || "Failed to save product.");
    }
  };

  const handleEdit = (prod) => {
    setForm({
      name: prod.name,
      description: prod.description,
      price: prod.price.toString(),
      categoryId: prod.categoryId?.toString() || "",
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
  }, [token]);

  useEffect(() => {
    fetchProducts();
  }, [page]);

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
              step="0.01"
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
              disabled={loading}
              required
            >
              <option value="">{loading ? "Loading categories..." : "Select Category"}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {error && <small className="text-danger">{error}</small>}
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
              <td>{prod.price?.toFixed(2) || '0.00'}</td>
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

export default ProductList;