const Pcat = require("../models/PcatModel")
const asyncHandler = require("express-async-handler")
const validateMongoDb= require("../utils/validateMongoDb")


const createPcat = asyncHandler(async(req, res)=>{
    try{
        const newPcat = await Pcat.create(req.body)
        res.json(newPcat)
    }
    catch(error){
        throw new Error(error)
    }
})

const getallPcat = asyncHandler(async(req, res)=>{
    try{
        const getPcats = await Pcat.find()
        res.json(getPcats)
    }
    catch(error){
        throw new Error(error)
    }
})

const getaPcat = asyncHandler(async(req, res)=>{
    const {id}= req.params
    validateMongoDb(id)
    try{
        const getPcat = await Pcat.findById(id)
        res.json(getPcat)
    }
    catch(error){
        throw new Error(error)
    }
})

const updateaPcat = asyncHandler(async(req, res)=>{
    const {id}= req.params
    validateMongoDb(id)
    try{
        const updatePcat = await Pcat.findByIdAndUpdate(id, req.body, {new:true})
        res.json(updatePcat)
    }
    catch(error){
        throw new Error(error)
    }
})

const deleteaPcat = asyncHandler(async(req, res)=>{
    const {id}= req.params
    validateMongoDb(id)
    try{
        const deletePcat = await Pcat.findByIdAndDelete(id)
        res.json(deletePcat)
    }
    catch(error){
        throw new Error(error)
    }
})


module.exports = {createPcat, getallPcat, getaPcat, updateaPcat, deleteaPcat}