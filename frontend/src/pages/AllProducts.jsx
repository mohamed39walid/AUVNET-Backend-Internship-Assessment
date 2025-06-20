import React, { useEffect, useState } from "react";
import axios from "../api/axios";

function AllProducts() {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const token = localStorage.getItem("token");
  const currentUser = token ? JSON.parse(atob(token.split(".")[1])) : null;

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`/products?page=${page}&limit=6`);
      setProducts(res.data.data || []);
      setTotalPages(res.data.pages || 1);
    } catch (err) {
      alert("Failed to fetch products.");
    }
  };

  const fetchWishlist = async () => {
    if (!token) return;
    try {
      const res = await axios.get("/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist(res.data?.data || []); // handle paginated structure
    } catch (err) {
      alert("Failed to fetch wishlist.");
    }
  };

  const isInWishlist = (productId) =>
    wishlist.some((item) => item.productId === productId);

  const handleToggleWishlist = async (productId) => {
    if (!token) return alert("Please log in first.");

    try {
      if (isInWishlist(productId)) {
        await axios.delete(`/wishlist/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(
          "/wishlist",
          { productId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      await fetchWishlist();
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to update wishlist.";
      alert(msg);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <div className="container mt-5">
      <h3 className="mb-4">All Products</h3>
      <div className="row">
        {products.map((prod) => (
          <div className="col-md-4 mb-4" key={prod.id}>
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{prod.name}</h5>
                <p className="card-text">{prod.description}</p>
                <p><strong>Price:</strong> ${prod.price}</p>
                <p><strong>Category:</strong> {prod.category?.name || "-"}</p>
                {currentUser && (
                  <button
                    className={`btn ${isInWishlist(prod.id) ? "btn-danger" : "btn-outline-primary"}`}
                    onClick={() => handleToggleWishlist(prod.id)}
                  >
                    {isInWishlist(prod.id) ? "🗑️ Remove from Wishlist" : "❤️ Add to Wishlist"}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-between mt-4">
        <button
          className="btn btn-outline-secondary"
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page === 1}
        >
          ⬅️ Previous
        </button>
        <span className="align-self-center">Page {page} of {totalPages}</span>
        <button
          className="btn btn-outline-secondary"
          onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={page === totalPages}
        >
          Next ➡️
        </button>
      </div>
    </div>
  );
}

export default AllProducts;
