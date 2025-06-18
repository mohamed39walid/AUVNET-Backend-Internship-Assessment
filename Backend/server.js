const express = require("express");
const dotenv = require("dotenv");
const sequelize = require("./config/db");
const { User, Product, Category, Wishlist } = require("./models");
const cors = require("cors");
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/categories", require("./routes/category"));
app.use("/api/products", require("./routes/product"));
app.use("/api/wishlist", require("./routes/wishlist"));


sequelize
  .authenticate()
  .then(() => console.log("MySQL connected..."))
  .catch((err) => console.error("Error: ", err));

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`the app is running on the port ${PORT}`));
