const Brand = require("../models/brandModel")
const asyncHandler = require("express-async-handler")
const validateMongoDb= require("../utils/validateMongoDb")


const createBrand = asyncHandler(async(req, res)=>{
    try{
        const newBrand = await Brand.create(req.body)
        res.json(newBrand)
    }
    catch(error){
        throw new Error(error)
    }
})

const getallBrand = asyncHandler(async(req, res)=>{
    try{
        const getBrands = await Brand.find()
        res.json(getBrands)
    }
    catch(error){
        throw new Error(error)
    }
})

const getaBrand = asyncHandler(async(req, res)=>{
    const {id}= req.params
    validateMongoDb(id)
    try{
        const getBrand = await Brand.findById(id)
        res.json(getBrand)
    }
    catch(error){
        throw new Error(error)
    }
})

const updateaBrand = asyncHandler(async(req, res)=>{
    const {id}= req.params
    validateMongoDb(id)
    try{
        const updateBrand = await Brand.findByIdAndUpdate(id, req.body, {new:true})
        res.json(updateBrand)
    }
    catch(error){
        throw new Error(error)
    }
})

const deleteaBrand = asyncHandler(async(req, res)=>{
    const {id}= req.params
    validateMongoDb(id)
    try{
        const deleteBrand = await Brand.findByIdAndDelete(id)
        res.json(deleteBrand)
    }
    catch(error){
        throw new Error(error)
    }
})


module.exports = {createBrand, getallBrand, getaBrand, updateaBrand, deleteaBrand}