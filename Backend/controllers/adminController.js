const { User, Product, Category } = require("../models");
const bcrypt = require("bcryptjs");

exports.getAllAdmins = async (req, res) => {
  const admins = await User.findAll({ where: { type: "admin" } });
  res.json(admins);
};

exports.addAdmin = async (req, res) => {
  const { username, email, name, password } = req.body;

  const existing = await User.findOne({ where: { username } });
  if (existing)
    return res.status(400).json({ message: "Admin already exists." });

  const hashed = await bcrypt.hash(password, 10);
  const admin = await User.create({
    username,
    email,
    name,
    password: hashed,
    type: "admin",
  });

  res.status(201).json(admin);
};

exports.updateAdmin = async (req, res) => {
  const admin = await User.findByPk(req.params.id);
  if (!admin || admin.type !== "admin")
    return res.status(404).json({ message: "Admin not found." });

  const { name, email } = req.body;
  admin.name = name || admin.name;
  admin.email = email || admin.email;
  await admin.save();

  res.json(admin);
};

exports.deleteAdmin = async (req, res) => {
  const admin = await User.findByPk(req.params.id);
  if (!admin || admin.type !== "admin")
    return res.status(404).json({ message: "Admin not found." });

  await admin.destroy();
  res.json({ message: "Admin deleted." });
};

exports.getAllUsers = async (req, res) => {
  const users = await User.findAll({ where: { type: "user" } });
  res.json(users);
};

exports.deleteUser = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user || user.type !== "user")
    return res.status(404).json({ message: "User not found." });

  await user.destroy();
  res.json({ message: "User deleted." });
};


exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        { model: User, as: "owner" },         // ✅ alias defined in Product
        { model: Category, as: "category" },  // ✅ FIXED: must match alias
      ],
    });
    res.json(products);
  } catch (error) {
    console.error("Get products failed:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found." });

  await product.destroy();
  res.json({ message: "Product deleted." });
};
