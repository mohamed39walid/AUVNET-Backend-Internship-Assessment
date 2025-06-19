// src/components/Navbar.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = token ? JSON.parse(atob(token.split(".")[1])) : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          E-Commerce
        </Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            {!token ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>
              </>
            ) : (
              <>
                {user?.type === "admin" ? (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin-manage">
                        Admin Manager
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin-users">
                        User Manager
                      </Link>
                    </li>
                    <li>
                      <Link className="nav-link" to="/admin-products">
                        Product Manager
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin-categories">
                        Category Manager
                      </Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/products">
                        Products
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/wishlist">
                        Wishlist
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/all-products">
                        All Products
                      </Link>
                    </li>
                    
                  </>
                )}
                <li className="nav-item">
                  <button
                    className="btn btn-outline-light ms-3"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
