const generateRefreshToken = require("../config/generateRefreshToken");
const generateToken= require("../config/generateToken");
const User = require("../models/userModel");
const Product = require("../models/productModel")
const Cart = require("../models/cartModel")
const Coupon = require("../models/couponModel")
const Order = require("../models/orderModel")
const asyncHandler = require("express-async-handler");
const validateMongoDb= require("../utils/validateMongoDb");
const jwt = require("jsonwebtoken")
const sendEmail = require("../controllers/sendEmailController")
const crypto = require("crypto");
const uniqid=require("uniqid")

const registerUser = asyncHandler(async(req, res)=>{
    const email = req.body.email;
    const findUser = await User.findOne({email:email})
    if(!findUser){
        const newUser = await User.create(req.body)
        res.json(newUser)
    }
    else{
    throw new Error("User Already Exist")
    }
})

const loginUser = asyncHandler(async(req, res)=>{
    const {email, password}=req.body;
    const findUser = await User.findOne({email:email})
    if(findUser && await findUser.isPasswordMatched(password)){
        const refreshToken = generateRefreshToken(findUser?._id)
        const updateuser= await User.findByIdAndUpdate(findUser.id, {refreshToken:refreshToken}, {new:true})
        res.cookie("refreshToken", refreshToken, 
            {
            httpOnly:true,
            maxAge:72*60*60*1000
           })
        res.json({
            _id:findUser?._id,
            firstname:findUser?.firstname,
            lastname:findUser?.lastname,
            email:findUser?.email,
            mobile:findUser?.mobile,
            token:generateToken(findUser?._id)
        })
    }
    else{
        throw new Error("Wrong Credentials, failed to login")
    }     
})

const loginAdmin = asyncHandler(async(req, res)=>{
  const {email, password}=req.body;
  const findAdmin = await User.findOne({email:email})
  if(findAdmin.role!=="admin") throw new Error("you are not authorized")
  if(findAdmin && await findAdmin.isPasswordMatched(password)){
      const refreshToken = generateRefreshToken(findAdmin?._id)
      const updateuser= await User.findByIdAndUpdate(findAdmin.id, {refreshToken:refreshToken}, {new:true})
      res.cookie("refreshToken", refreshToken, 
          {
          httpOnly:true,
          maxAge:72*60*60*1000
         })
      res.json({
          _id:findAdmin?._id,
          firstname:findAdmin?.firstname,
          lastname:findAdmin?.lastname,
          email:findAdmin?.email,
          mobile:findAdmin?.mobile,
          token:generateToken(findAdmin?._id)
      })
  }
  else{
      throw new Error("Wrong Credentials, failed to login")
  }     
})

const getallUsers = asyncHandler(async(req, res)=>{
    try{
      const getUsers = await User.find()
      res.json(getUsers)
    }
    catch(error){
        throw new Error("failed to get all users")
    }
})

const getaUser = asyncHandler(async(req, res)=>{
    const {id}= req.params
    validateMongoDb(id)
    try{
      const getUser =await User.findById(id)
      res.json(getUser)
    }
    catch(error){
        throw new Error("failed to get user")
    }
})

const deleteaUser = asyncHandler(async(req, res)=>{
    const {id}= req.params
    validateMongoDb(id)
    try{
      const deletedUser =await User.findByIdAndDelete(id)
      res.json(deletedUser)
    }
    catch(error){
        throw new Error("failed to delete a user")
    }
})

const blockUser = asyncHandler(async(req, res)=>{
    const {id}= req.params
    validateMongoDb(id)
    try{
      const blockedUser =await User.findByIdAndUpdate(id, 
        {
          isBlocked:true
        },
      {new:true}
    )
      res.json(blockedUser)
    }
    catch(error){
        throw new Error("failed to block a user")
    }
})

const unblockUser = asyncHandler(async(req, res)=>{
    const {id}= req.params
    validateMongoDb(id)
    try{
      const unblockedUser =await User.findByIdAndUpdate(id, 
        {
          isBlocked:false
        },
      {new:true}
    )
      res.json(unblockedUser)
    }
    catch(error){
        throw new Error("failed to unblock a user")
    }
})

const updateUser = asyncHandler(async(req, res)=>{
    const {_id} = req.user
    validateMongoDb(_id)
    try{
      const updatedUser =await User.findByIdAndUpdate(_id, 
      {
        firstname:req?.body?.firstname,
        lastname:req?.body?.lastname,
        email:req?.body?.email,
        mobile:req?.body?.mobile,
      }, 
      {new:true}
    )
      res.json(updatedUser)
    }
    catch(error){
        throw new Error("failed to update a user")
    }
})

const saveAddress = asyncHandler(async(req, res)=>{
  const {_id} = req.user
  validateMongoDb(_id)
  try{
    const updatedUser = await User.findByIdAndUpdate(_id, 
    {
      saveaddress:req?.body?.saveaddress,
    }, 
    {new:true}
  )
    res.json(updatedUser)
  }
  catch(error){
      throw new Error("failed to save address of user")
  }
})


const updatePassword= asyncHandler(async(req, res)=>{
  const {password}= req.body;
  const {_id}=req.user;
  validateMongoDb(_id);
  const user = await User.findById(_id);
  if(password){
    user.password=password;
    const updatedPassword = await user.save()
  res.json(updatedPassword)
  }
  else{
    res.json(user)
  }
})

const getWishlist = asyncHandler(async(req, res)=>{
  const {_id} = req.user
   validateMongoDb(_id)
 const user = await User.findById(_id).populate("wishlist");
 res.json(user)
})


const forgotPassword= asyncHandler(async(req, res)=>{
  const {email}= req.body
  const user = await User.findOne({email:email});
  if(!user) throw new Error("Email is invalid")
  const token = await user.iscreatePasswordResetToken();
  await user.save()
  const resetUrls = `Hey, please follow this link to reset password<a href="http://127.00.1:5000/api/user/reset-password/${token}">Click Here</a>`
  const data ={
    to:email,
    subject:"Find the link attached",
    text:"Hey User",
    htm:resetUrls
  }
  sendEmail(data)
  res.json(token)
})

const resetPasswordToken= asyncHandler(async(req, res)=>{
  const {password}=req.body
  const {token}=req.params
 
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex")
  const user =await User.findOne({
    passwordResetToken:hashedToken,
    passwordResetTokenExpires:{$gt:Date.now()}
  })
  if(!user) throw new Error("Token is expired,Try again")
    user.password=password;
    user.passwordResetToken=undefined;
    user.passwordResetTokenExpires=undefined;
    await user.save()
 res.json(user)
})



const handleRefreshToken = asyncHandler(async(req, res)=>{
  const cookie = req.cookies;
  if(!cookie?.refreshToken) throw new Error("No refreshToken in Cookie")
    const refreshToken = cookie.refreshToken
    const user = await User.findOne({refreshToken:refreshToken})
    if(!user) throw new Error("No refreshToken match in the Database")
        jwt.verify(refreshToken, process.env.JWT_PASS_SEC, (err, decode)=>{
        if(err||user.id!== decode.id){
            throw new Error("Something Went wrong with the refreshToken")
        }
        const accessToken =  generateToken(user?._id)
        res.json({accessToken})
    })
       
})

const logout = asyncHandler(async(req, res)=>{
    const cookie = req.cookies;
    if(!cookie?.refreshToken) throw new Error("No refreshToken in Cookie")
      const refreshToken = cookie.refreshToken
      const user = await User.findOne({refreshToken:refreshToken})
      if(!user) throw new Error("No refreshToken match in the Database")
          res.clearCookie("refreshToken", {
            httpOnly:true,
            secure:true
        })
        res.sendStatus(204);
        await User.findOneAndUpdate(refreshToken, {refreshToken:""}, {new:true})
        res.clearCookie("refreshToken", {
            httpOnly:true,
            secure:true
        })
        res.sendStatus(204);
  })


  const cartUser = asyncHandler(async(req, res)=>{
    const {cart}=req.body;
    const {_id}=req.user;
    validateMongoDb(_id);
    try{
      let products =[];
      const user = await User.findById(_id);
      const alreadyExistInCart = await Cart.findOne({orderby:user._id})
      if(alreadyExistInCart){
        alreadyExistInCart.remove;
      }
      for (let i = 0; i<cart.length; i++ ){
        let object = {}
        object.product = cart[i]._id;
        object.quantity = cart[i].quantity;
        object.color = cart[i].color;
        let getPrice = await Product.findById(cart[i]._id).select("price").exec();
        object.price = getPrice.price;
        products.push(object)
      }
      let cartTotal = 0;
      for (let i = 0; i<products.length; i++){
        cartTotal = cartTotal + (products[i].price * products[i].quantity);
      }
      const newcart =  await new Cart({
        products,
        cartTotal,
        orderby:user._id
      }).save()
      res.json(newcart)
    }
    catch(error){
      throw new Error(error)
    }
  })
  
  const getCart = asyncHandler(async(req, res)=>{
    const {_id}=req.user;
    validateMongoDb(_id);
    try{
      const cart = await Cart.findOne({orderby:_id}).populate("products.product")
      res.json(cart)
      }
    catch(error){
      throw new Error(error)
    }
  })

  const emptyCart = asyncHandler(async(req, res)=>{
    const {_id}=req.user;
    validateMongoDb(_id);
    try{
      const user = await User.findOne(_id)
      const cart = await Cart.findOneAndDelete({orderby:user._id})
      res.json(cart)
      }
    catch(error){
      throw new Error(error)
    }
  })

  const applyCoupon = asyncHandler(async(req, res)=>{
    const {coupon} = req.body
    const {_id}=req.user;
    validateMongoDb(_id);
    const user = await User.findOne(_id)
    const validateCoupon = await Coupon.findOne({name:coupon})
    if(validateCoupon== null) throw new Error(error)
    try{
   const{cartTotal}=await Cart.findOne({orderby:user._id}).populate("products.product")
   let totalAfterDiscount = (cartTotal - (cartTotal* validateCoupon.discount)/100).toFixed(2);
   await Cart.findOneAndUpdate({orderby:user._id}, {totalAfterDiscount}, {new:true})
   res.json(totalAfterDiscount)
      }
    catch(error){
      throw new Error(error)
    }
  })

  const orderUser = asyncHandler(async(req, res)=>{
    const {COD, couponApplied} = req.body
    const {_id}=req.user;
    validateMongoDb(_id);
    if(!COD)throw new Error("failed to create cash on delivery")
    try{
   const user = await User.findById({_id})
   const cart = await Cart.findOne({orderby:user._id})
   let finalAmount=0;
   if(couponApplied && cart.totalAfterDiscount){
    finalAmount = cart.totalAfterDiscount;
   }
   else{
    finalAmount = cart.cartTotal;
   }
   const newOrder = await new Order({
    products:cart.products,
    paymentintent:{
      id:uniqid(),
      method:"COD",
      amount:finalAmount,
      currency:"usd",
      status:"cash on delivery",
      created:Date.now(),
     },
     orderstatus:"cash on delivery",
     orderby:user?._id,
   }).save()
        let update = cart.products.map(item=>{
         return {
         updateOne:{
          filter:{_id:item.products._id},
          update:{$inc:{quantity:-item.quantity, sold:+item.quantity}}
         }
         }
        })
        const updated = Product.bulkWrite(update, {})
        res.json({message:"success"});
      }
    catch(error){
      throw new Error(error)
    }
  })

  const getOrders = asyncHandler(async(req, res)=>{
    const {_id}=req.user;
    validateMongoDb(_id);
    try{
      const orders = await Order.findOne({orderby:_id}).populate("products.product")
      res.json(orders)
      }
    catch(error){
      throw new Error(error)
    }
  })

  const updateOrders = asyncHandler(async(req, res)=>{
    const {status}=req.body;
    const {id}=req.params;
    validateMongoDb(id);
    try{
      const findorder = await Order.findByIdAndUpdate(id, 
        {
           orderstatus:status,
           paymentintent:{
            status:status
           }
      }, 
      {new:true})
      res.json(findorder)
      }
    catch(error){
      throw new Error(error)
    }
  })


module.exports = {
    registerUser, 
    loginUser, 
    loginAdmin,
     getallUsers,
     getaUser,
     deleteaUser,
     updateUser,
     updatePassword,
     blockUser,
     unblockUser,
     handleRefreshToken,
     logout,
     forgotPassword,
     resetPasswordToken,
     getWishlist,
     saveAddress,
     cartUser,
     getCart,
     emptyCart,
     applyCoupon,
     orderUser,
     getOrders,
     updateOrders
    }