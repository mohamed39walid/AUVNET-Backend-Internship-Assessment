const { Model } = require("sequelize");
const { Wishlist, Product } = require("../models");

exports.addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;
    const exists = await Wishlist.findOne({ where: { userId, productId } });
    if (exists)
      return res.status(400).json({ message: "Already in wishlist!" });
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
      return res.status(404).json({ message: "Not in wishlist" });
    }
    res.json({ message: "Removed from wishlist!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const wishlist = await Wishlist.findAll({
      where: { userId },
      include: [{ model: Product }],
    });
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

