const Bcat = require("../models/BcatModel")
const asyncHandler = require("express-async-handler")
const validateMongoDb= require("../utils/validateMongoDb")


const createBcat = asyncHandler(async(req, res)=>{
    try{
        const newBcat = await Bcat.create(req.body)
        res.json(newBcat)
    }
    catch(error){
        throw new Error(error)
    }
})

const getallBcat = asyncHandler(async(req, res)=>{
    try{
        const getBcats = await Bcat.find()
        res.json(getBcats)
    }
    catch(error){
        throw new Error(error)
    }
})

const getaBcat = asyncHandler(async(req, res)=>{
    const {id}= req.params
    validateMongoDb(id)
    try{
        const getBcat = await Bcat.findById(id)
        res.json(getBcat)
    }
    catch(error){
        throw new Error(error)
    }
})

const updateaBcat = asyncHandler(async(req, res)=>{
    const {id}= req.params
    validateMongoDb(id)
    try{
        const updateBcat = await Bcat.findByIdAndUpdate(id, req.body, {new:true})
        res.json(updateBcat)
    }
    catch(error){
        throw new Error(error)
    }
})

const deleteaBcat = asyncHandler(async(req, res)=>{
    const {id}= req.params
    validateMongoDb(id)
    try{
        const deleteBcat = await Bcat.findByIdAndDelete(id)
        res.json(deleteBcat)
    }
    catch(error){
        throw new Error(error)
    }
})


module.exports = {createBcat, getallBcat, getaBcat, updateaBcat, deleteaBcat}