const { User, Product, Category } = require("../models");
const bcrypt = require("bcryptjs");

// Utility to parse page and limit
const parsePagination = (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const offset = (page - 1) * limit;
  return { page, limit, offset };
};

exports.getAllAdmins = async (req, res) => {
  const { page, limit, offset } = parsePagination(req.query);

  const result = await User.findAndCountAll({
    where: { type: "admin" },
    limit,
    offset,
  });

  res.json({
    total: result.count,
    pages: Math.ceil(result.count / limit),
    data: result.rows,
  });
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
  const { page, limit, offset } = parsePagination(req.query);

  const result = await User.findAndCountAll({
    where: { type: "user" },
    limit,
    offset,
  });

  res.json({
    total: result.count,
    pages: Math.ceil(result.count / limit),
    data: result.rows,
  });
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
    const { page, limit, offset } = parsePagination(req.query);

    const result = await Product.findAndCountAll({
      include: [
        { model: User, as: "owner" },
        { model: Category, as: "category" },
      ],
      limit,
      offset,
    });

    res.json({
      total: result.count,
      pages: Math.ceil(result.count / limit),
      data: result.rows,
    });
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
