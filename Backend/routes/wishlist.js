const express = require("express")
const router = express.Router()
const wishlistController = require("../controllers/wishlistController")
const {verifyToken} = require("../middlewares/auth")

router.post("/", verifyToken, wishlistController.addToWishlist);
router.delete("/:productId",verifyToken,wishlistController.removeFromWishlist);
router.get("/",verifyToken,wishlistController.getUserWishlist);

module.exports = router;