// src/pages/Wishlist.js
import React, { useEffect, useState } from "react";
import axios from "../api/axios";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const token = localStorage.getItem("token");

  const fetchWishlist = async () => {
    try {
      const res = await axios.get(`/wishlist?page=${page}&limit=5`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist(res.data.data || []);
      setTotalPages(res.data.pages || 1);
    } catch (err) {
      alert("Failed to load wishlist.");
    }
  };

  const handleRemove = async (productId) => {
    try {
      await axios.delete(`/wishlist/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchWishlist();
    } catch (err) {
      alert("Failed to remove from wishlist.");
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [page]);

  return (
    <div className="container mt-5">
      <h3 className="mb-4">Your Wishlist</h3>
      {wishlist.length === 0 ? (
        <p>You haven't added anything to your wishlist yet.</p>
      ) : (
        <>
          <div className="row">
            {wishlist.map((item) => (
              <div className="col-md-4 mb-4" key={item.id}>
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">{item.Product?.name}</h5>
                    <p className="card-text">{item.Product?.description}</p>
                    <p>
                      <strong>Price:</strong> ${item.Product?.price}
                    </p>
                    <p>
                      <strong>Category:</strong>{" "}
                      {item.Product?.category?.name || "-"}
                    </p>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleRemove(item.productId)}
                    >
                      🗑️ Remove from Wishlist
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="d-flex justify-content-between mt-3">
            <button
              className="btn btn-outline-secondary"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              ⬅️ Prev
            </button>
            <span className="align-self-center">
              Page {page} of {totalPages}
            </span>
            <button
              className="btn btn-outline-secondary"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next ➡️
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Wishlist;
