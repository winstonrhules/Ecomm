const express = require("express");
const { createProduct, getallProduct,  getaProduct,  updateProduct, deleteaProduct, addToWishlist, rating, uploadProductPhoto} = require("../controllers/productController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { uploadPhoto, productImgResize } = require("../middlewares/uploadImage");
const router = express.Router();


router.post("/add-product", authMiddleware, isAdmin, createProduct)
router.get("/all-products", getallProduct)
router.get("/:id", getaProduct)
router.put("/:id",authMiddleware, isAdmin, updateProduct)
router.delete("/:id",authMiddleware, isAdmin, deleteaProduct)
router.post("/add-to-wishlist", authMiddleware, addToWishlist)
router.post("/rating", authMiddleware, rating)
router.put("/upload/:id", authMiddleware, isAdmin, uploadPhoto.array("images", 10), productImgResize, uploadProductPhoto)


module.exports = router;