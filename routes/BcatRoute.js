const express = require("express");
const { createBcat, getallBcat, getaBcat, updateaBcat, deleteaBcat } = require("../controllers/BcatController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router()

router.post("/", authMiddleware, isAdmin, createBcat)
router.get("/all-Bcategory", authMiddleware, isAdmin, getallBcat)
router.get("/:id", authMiddleware, isAdmin, getaBcat)
router.put("/:id", authMiddleware, isAdmin, updateaBcat)
router.delete("/:id", authMiddleware, isAdmin, deleteaBcat)
module.exports = router;