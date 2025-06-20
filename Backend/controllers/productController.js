const { Product, User, Category } = require("../models");

// Create a product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, categoryId } = req.body;
    const userId = req.user.id;

    if (!name || !description || !price) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const product = await Product.create({
      name,
      description,
      price,
      userId,
      categoryId: categoryId || null,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all products with pagination and optional filtering

exports.getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 25, categoryId, userId } = req.query;
    const parsedLimit = parseInt(limit);
    const parsedPage = parseInt(page);

    if (parsedLimit > 25) {
      return res.status(400).json({ message: "Limit cannot exceed 25 items per request." });
    }

    const where = {};
    if (categoryId) where.categoryId = categoryId;
    if (userId) where.userId = userId;

    const products = await Product.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: "owner",
          attributes: ["id", "username", "email"],
        },
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
      ],
      limit: parsedLimit,
      offset: (parsedPage - 1) * parsedLimit,
    });

    res.json({
      total: products.count,
      pages: Math.ceil(products.count / parsedLimit),
      currentPage: parsedPage,
      data: products.rows,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get single product by ID
exports.getProductByID = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "owner",
          attributes: ["id", "username", "email"],
        },
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
      ],
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found!" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update product by owner or admin
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, categoryId } = req.body;
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found!" });
    }

    if (req.user.id !== product.userId && req.user.type !== "admin") {
      return res.status(403).json({ message: "Forbidden: not your product" });
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.categoryId = categoryId || product.categoryId;

    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete product by owner or admin
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found!" });
    }

    if (req.user.id !== product.userId && req.user.type !== "admin") {
      return res.status(403).json({ message: "Forbidden: not your product" });
    }

    await product.destroy();
    res.json({ message: "Product deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
