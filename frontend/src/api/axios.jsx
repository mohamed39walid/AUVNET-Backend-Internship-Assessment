// src/api/axios.js
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5050/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically include token if available
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;