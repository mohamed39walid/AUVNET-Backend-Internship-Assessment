import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductList from "./pages/ProductList";
import Navbar from "./components/Navbar";
import AdminManager from "./pages/AdminManager";
import ProtectedRoute from "./components/ProtectedRoute";
import UserManager from "./components/UserManager";
import ProductManager from "./components/ProductManager";
import CategoryManager from "./components/CategoryManager";
import Home from "./pages/Home";
import AllProducts from "./pages/AllProducts";
import Wishlist from "./pages/Wishlist";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <ProductList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-manage"
          element={
            <ProtectedRoute role="admin">
              <AdminManager />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-users"
          element={
            <ProtectedRoute role="admin">
              <UserManager />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-products"
          element={
            <ProtectedRoute role="admin">
              <ProductManager />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-categories"
          element={
            <ProtectedRoute role="admin">
              <CategoryManager />
            </ProtectedRoute>
          }
        />

        <Route
          path="/all-products"
          element={
            <ProtectedRoute>
              <AllProducts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
