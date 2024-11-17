const Coupon = require("../models/couponModel")
const asyncHandler = require("express-async-handler")
const validateMongoDb= require("../utils/validateMongoDb")


const createCoupon = asyncHandler(async(req, res)=>{
    
    try{
        const newCoupon = await Coupon.create(req.body)
        res.json(newCoupon)
    }
    catch(error){
        throw new Error(error)
    }
})

const getallCoupon = asyncHandler(async(req, res)=>{
    try{
        const getCoupons = await Coupon.find()
        res.json(getCoupons)
    }
    catch(error){
        throw new Error(error)
    }
})

const getaCoupon = asyncHandler(async(req, res)=>{
    const {id}= req.params
    validateMongoDb(id)
    try{
        const getCoupon = await Coupon.findById(id)
        res.json(getCoupon)
    }
    catch(error){
        throw new Error(error)
    }
})

const updateaCoupon = asyncHandler(async(req, res)=>{
    const {id}= req.params
    validateMongoDb(id)
    try{
        const updateCoupon = await Coupon.findByIdAndUpdate(id, req.body, {new:true})
        res.json(updateCoupon)
    }
    catch(error){
        throw new Error(error)
    }
})

const deleteaCoupon = asyncHandler(async(req, res)=>{
    const {id}= req.params
    validateMongoDb(id)
    try{
        const deleteCoupon = await Coupon.findByIdAndDelete(id)
        res.json(deleteCoupon)
    }
    catch(error){
        throw new Error(error)
    }
})


module.exports = {createCoupon, getallCoupon, getaCoupon, updateaCoupon, deleteaCoupon}