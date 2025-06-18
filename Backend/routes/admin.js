const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, isAdmin } = require('../middlewares/auth');

// Admins
router.get('/admins', verifyToken, isAdmin, adminController.getAllAdmins);
router.post('/admins', verifyToken, isAdmin, adminController.addAdmin);
router.put('/admins/:id', verifyToken, isAdmin, adminController.updateAdmin);
router.delete('/admins/:id', verifyToken, isAdmin, adminController.deleteAdmin);

// Users
router.get('/users', verifyToken, isAdmin, adminController.getAllUsers);
router.delete('/users/:id', verifyToken, isAdmin, adminController.deleteUser);

// Products
router.get('/products', verifyToken, isAdmin, adminController.getAllProducts);
router.delete('/products/:id', verifyToken, isAdmin, adminController.deleteProduct);

module.exports = router;
