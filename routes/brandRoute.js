const express = require("express");
const { createBrand, getallBrand, getaBrand, updateaBrand, deleteaBrand } = require("../controllers/brandController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router()

router.post("/", authMiddleware, isAdmin, createBrand)
router.get("/all-brand", authMiddleware, isAdmin, getallBrand)
router.get("/:id", authMiddleware, isAdmin, getaBrand)
router.put("/:id", authMiddleware, isAdmin, updateaBrand)
router.delete("/:id", authMiddleware, isAdmin, deleteaBrand)
module.exports = router;