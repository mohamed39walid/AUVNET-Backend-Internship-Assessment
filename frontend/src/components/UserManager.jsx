import React, { useEffect, useState } from "react";
import axios from "../api/axios";

function UserManager() {
  const [users, setUsers] = useState([]);

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      const res = await axios.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      alert("Failed to fetch users.");
    }
  };

  // Delete a user by ID
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch (err) {
      alert("Failed to delete user.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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
          {users.map((user) => (
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
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserManager;
