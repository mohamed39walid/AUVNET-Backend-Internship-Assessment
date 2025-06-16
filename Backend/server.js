const express = require("express");
const dotenv = require("dotenv");
const sequelize = require("./config/db");
const { User, Product, Category, Wishlist } = require("./models");
const authRoutes = require("./routes/auth");
const cors = require("cors");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => res.send("Project with the mysql running"));
app.use("/api/auth", require('./routes/auth'));

app.post("/test", (req, res) => {
  console.log("Test hit", req.body);
  res.json({ message: "Test OK" });
});

sequelize
  .authenticate()
  .then(() => console.log("MySQL connected..."))
  .catch((err) => console.error("Error: ", err));

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`the app is running on the port ${PORT}`));
