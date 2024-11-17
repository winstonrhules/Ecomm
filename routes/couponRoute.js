const express = require("express");
const { createCoupon, getallCoupon, getaCoupon, updateaCoupon, deleteaCoupon } = require("../controllers/couponController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router()

router.post("/", authMiddleware, isAdmin, createCoupon)
router.get("/all-Coupon", authMiddleware, isAdmin, getallCoupon)
router.get("/:id", authMiddleware, isAdmin, getaCoupon)
router.put("/:id", authMiddleware, isAdmin, updateaCoupon)
router.delete("/:id", authMiddleware, isAdmin, deleteaCoupon)
module.exports = router;