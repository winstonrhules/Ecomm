const express = require("express");
const {registerUser, 
    loginUser, 
    getallUsers,  
    getaUser, 
    deleteaUser,
     updateUser, 
     blockUser, 
     unblockUser, 
     handleRefreshToken,
     logout,
     updatePassword,
     forgotPassword,
     resetPasswordToken,
     getWishlist,
     loginAdmin,
     saveAddress,
     cartUser,
     getCart,
     emptyCart,
     applyCoupon,
     orderUser
    } = require("../controllers/userController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");


const router = express.Router();

router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/login-admin", loginAdmin)
router.post("/forgot-password", forgotPassword)
router.get("/handle-refresh", handleRefreshToken)
router.get("/logout", logout)
router.get("/all-users",  getallUsers)
router.get("/getcart", authMiddleware, getCart)
router.get("/:id", authMiddleware, isAdmin, getaUser)
router.delete("/:id", authMiddleware, isAdmin, deleteaUser)
router.delete("/emptycart", authMiddleware, emptyCart)
router.put("/edit-user", authMiddleware, isAdmin,  updateUser)
router.put("/address", authMiddleware,   saveAddress)
router.put("/block-user/:id", authMiddleware, isAdmin,  blockUser)
router.put("/unblock-user/:id", authMiddleware, isAdmin,  unblockUser)
router.put("/password", authMiddleware, updatePassword)
router.put("/reset-password/:token", resetPasswordToken)
router.post("/get-wishlist", authMiddleware, getWishlist)
router.post("/cart", authMiddleware, cartUser)
router.post("/cart/apply-coupon", authMiddleware, applyCoupon)
router.post("/cart/cash-order", authMiddleware, orderUser)


module.exports = router;