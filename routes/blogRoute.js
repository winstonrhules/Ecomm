const express = require("express");
const {createBlog, getallBlog, getaBlog, updateaBlog, deleteaBlog, likeBlog, dislikeBlog, uploadBlogPhoto}= require("../controllers/blogController");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const { blogImgResize, uploadPhoto } = require("../middlewares/uploadImage");

const router = express.Router();

router.post("/create-blog",authMiddleware, isAdmin, createBlog)
router.get("/all-blogs", getallBlog)
router.get("/:id", getaBlog)
router.put("/:id", authMiddleware, isAdmin,updateaBlog)
router.delete("/:id",authMiddleware, isAdmin, deleteaBlog)
router.post("/like-blog", authMiddleware, isAdmin, likeBlog)
router.post("/dislike-blog", authMiddleware, isAdmin, dislikeBlog)
router.put("/upload/:id", authMiddleware, isAdmin, uploadPhoto.array("images", 2),  blogImgResize, uploadBlogPhoto)



module.exports = router
