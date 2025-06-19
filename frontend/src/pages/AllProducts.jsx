import React, { useEffect, useState } from "react";
import axios from "../api/axios";

function AllProducts() {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const token = localStorage.getItem("token");
  const currentUser = token ? JSON.parse(atob(token.split(".")[1])) : null;

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const res = await axios.get("/products");
      setProducts(res.data.data || []);
    } catch (err) {
      alert("Failed to fetch products.");
    }
  };

  // Fetch user's wishlist
  const fetchWishlist = async () => {
    if (!token) return;
    try {
      const res = await axios.get("/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist(res.data || []);
    } catch (err) {
      alert("Failed to fetch wishlist.");
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.productId === productId);
  };

  const handleToggleWishlist = async (productId) => {
    if (!token) return alert("Please log in first.");

    try {
      if (isInWishlist(productId)) {
        // Remove from wishlist
        await axios.delete(`/wishlist/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // Add to wishlist
        await axios.post(
          "/wishlist",
          { productId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      fetchWishlist();
    } catch (err) {
      alert("Failed to update wishlist.");
    }
  };

  useEffect(() => {
    fetchProducts();
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
    </div>
  );
}

export default AllProducts;
