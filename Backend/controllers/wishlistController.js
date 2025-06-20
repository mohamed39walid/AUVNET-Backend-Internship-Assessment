const { Wishlist, Product, Category } = require("../models");

exports.addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    const exists = await Wishlist.findOne({ where: { userId, productId } });
    if (exists) {
      return res.status(400).json({ message: "Item already in wishlist." });
    }

    const count = await Wishlist.count({ where: { userId } });
    if (count >= 25) {
      return res.status(400).json({ message: "You have exceeded the wishlist limit (25 items)." });
    }

    const wishlistItem = await Wishlist.create({ userId, productId });
    res.status(201).json(wishlistItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId;
    const deleted = await Wishlist.destroy({ where: { userId, productId } });
    if (!deleted) {
      return res.status(404).json({ message: "Item not found in wishlist." });
    }
    res.json({ message: "Removed from wishlist." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 25 } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const result = await Wishlist.findAndCountAll({
      where: { userId },
      include: [
        {
          model: Product,
          include: [{ model: Category, as: "category" }]
        }
      ],
      limit: parseInt(limit),
      offset,
    });

    res.json({
      total: result.count,
      pages: Math.ceil(result.count / limit),
      currentPage: parseInt(page),
      data: result.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
