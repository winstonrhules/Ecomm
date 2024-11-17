const express = require("express");
const { createPcat, getallPcat, getaPcat, updateaPcat, deleteaPcat } = require("../controllers/PcatController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router()

router.post("/", authMiddleware, isAdmin, createPcat)
router.get("/all-pCategory", authMiddleware, isAdmin, getallPcat)
router.get("/:id", authMiddleware, isAdmin, getaPcat)
router.put("/:id", authMiddleware, isAdmin, updateaPcat)
router.delete("/:id", authMiddleware, isAdmin, deleteaPcat)
module.exports = router;