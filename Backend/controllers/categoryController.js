const { Category } = require("../models");

exports.createCategory = async (req, res) => {
  try {
    const { name, parent_id } = req.body;
    if (!name)
      return res.status(400).json({ message: "Category name is required!" });
    const category = await Category.create({
      name,
      parent_id: parent_id ?? null,
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { parent_id: null },
      include: {
        model: Category,
        as: "subcategories",
        include: {
          model: Category,
          as: "subcategories", // 3-level depth
        },
      },
    });

    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCategoryByID = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found!" });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name, parentID } = req.body;
    const id = req.params.id;
    const category = await Category.findByPk(id);
    if (!category)
      return res.status(404).json({ message: "Category not found!" });
    category.name = name || category.name;
    category.parentID = parentID || category.parent_id;
    await category.save();

    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found!" });
    await category.destroy();
    res.json({ message: "Category deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
