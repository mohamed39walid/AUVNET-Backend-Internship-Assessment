import React, { useEffect, useState } from "react";
import axios from "../api/axios";

function UserManager() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`/admin/users?page=${page}&limit=5`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(res.data.data);          // ✅ Extract paginated data
      setTotalPages(res.data.pages);    // ✅ Set total pages
    } catch (err) {
      alert("Failed to fetch users.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`/admin/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchUsers();
    } catch (err) {
      alert("Failed to delete user.");
    }
  };

  const nextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  return (
    <div className="container mt-5">
      <h3 className="mb-4">Manage Users</h3>
      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>Username</th>
            <th>Name</th>
            <th>Email</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">
                No users found.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.type}</td>
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div className="d-flex justify-content-between">
        <button
          className="btn btn-secondary"
          disabled={page === 1}
          onClick={prevPage}
        >
          ⬅️ Previous
        </button>
        <span className="align-self-center">
          Page {page} of {totalPages}
        </span>
        <button
          className="btn btn-secondary"
          disabled={page === totalPages}
          onClick={nextPage}
        >
          Next ➡️
        </button>
      </div>
    </div>
  );
}

export default UserManager;
