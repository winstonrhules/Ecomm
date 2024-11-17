const Product = require("../models/productModel");
const User = require("../models/userModel");
const asyncHandler= require("express-async-handler");
const validateMongoDb = require("../utils/validateMongoDb")
const slugify=require("slugify")
const cloudinaryUploadImg = require("../utils/cloudinary");
const fs = require("fs")


const createProduct = asyncHandler(async(req, res)=>{
    if(req.body.title){
        req.body.slug = slugify(req.body.title)
    }
    try{
        const newProduct = await Product.create(req.body)
        res.json(newProduct)
    }
    catch(error){
        throw new Error(error)
    }
})

const updateProduct = asyncHandler(async(req, res)=>{
    const {id}= req.params
    validateMongoDb(id)
    try{
        if(req.body.title){
            req.body.slug = slugify(req.body.title)
        }
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {new:true})
        res.json(updatedProduct)
    }
    catch(error){
        throw new Error(error)
    }
})

const getaProduct = asyncHandler(async(req, res)=>{
    const {id}= req.params
    validateMongoDb(id)
    try{
        
        const getProduct = await Product.findById(id);
        res.json(getProduct)
    }
    catch(error){
        throw new Error(error)
    }
})

const deleteaProduct = asyncHandler(async(req, res)=>{
    const {id}= req.params
    validateMongoDb(id)
    try{
        
        const deletedProduct = await Product.findByIdAndDelete(id);
        res.json(deletedProduct)
    }
    catch(error){
        throw new Error(error)
    }
})

const getallProduct = asyncHandler(async(req, res)=>{
    try{
        const queryObj = { ...req.query }
        console.log(queryObj)
        const exclusiveFields = ["sort", "fields", "limit", "page"]
        exclusiveFields.forEach((el) => delete queryObj[el])
        let queryStr = JSON.stringify(queryObj)
        queryStr=queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match)=>`$${match}`)

        let query = Product.find(JSON.parse(queryStr));
            //sort
            if(req.query.sort){
            const sortBy=req.query.sort.split(",").join(" ")
            query=query.sort(sortBy)
            }
            else{
            query = query.sort("-createdAt")
            }
            // fields
            if(req.query.fields){
                const fields=req.query.fields.split(",").join(" ")
                query=query.select(fields)
                }
                else{
                query = query.select("-__v")
                }
            
        const page=req.query.page;
        const limit =req.query.limit;
        const skip = (page-1)*limit;
        query=query.skip(skip).limit(limit)
        if(req.query.page){
            const numCount = Product.countDocuments()
            if(skip>=numCount){
                throw new Error("Page does not exist")
            }
        }
        const product = await query
        res.json(product)
    }
    catch(error){
        throw new Error(error)
    }
})

const addToWishlist = asyncHandler(async(req, res)=>{
    const {_id} = req.user
     validateMongoDb(_id)
   const {prodId} = req.body;
   const user = await User.findById(_id);
   const alreadyAddedToWishlist = user?.wishlist?.find((id)=>id?.toString()===prodId?.toString())
   if(alreadyAddedToWishlist){
     const user = await User.findByIdAndUpdate(_id, 
       {
       $pull:{wishlist:prodId},
       },
       {new:true}
   )
   res.json(user)
   }else{
     const user = await User.findByIdAndUpdate(_id, 
       {
       $push:{wishlist:prodId},
       },
       {new:true}
   )
   res.json(user)
   }
 
 })
 
 const rating = asyncHandler(async(req, res)=>{
    const {_id} = req.user;
     validateMongoDb(_id)
   const {star, prodId, comments} = req.body;
   const product = await Product.findById(prodId);
   const alreadyRated = product?.rating?.find((id)=>id?.postedby?.toString()===_id?.toString())
   if(alreadyRated){
    const ratedProduct = await Product.updateOne(
        {
        rating:{$elemMatch:alreadyRated}
       },
       {
        $set:{"rating.$.star":star, "rating.$.comments":comments}
       },
       {
        new:true
       },
)
   }else{
     const ratingProduct = await Product.findByIdAndUpdate(prodId, 
       {
       $push:{rating:{
        star:star,
        comments:comments,
        postedby:_id,
       }},
       },
       {new:true}
   )
   }
   let getallratings = await Product.findById(prodId)
   let totalratings = getallratings.rating.length
   let totalratingsum = getallratings.rating.map((el)=>el.star).reduce((cur,prev) => cur + prev, 0)
   let actualrating = Math.round(totalratingsum/totalratings)
   const finalproduct = await Product.findByIdAndUpdate(prodId,{totalrating:actualrating}, {new:true})
   res.json(finalproduct)
 })


 const uploadProductPhoto = asyncHandler(async(req, res)=>{
    const {id}= req.params
    validateMongoDb(id);
    try{
        const uploader = (path) => cloudinaryUploadImg(path, "images");
        const urls = [];
        const files = req.files;
        for (const file of files){
            const { path } = file;
            const newpath = await uploader(path);
            urls.push(newpath)
            fs.unlinkSync(path)
        }
        const finalImageProduct = await Product.findByIdAndUpdate(id, 
            {
            images:urls.map((file)=>{
                return file;
            })
          }, 
           {new:true}
        )
        res.json(finalImageProduct)
    }
    catch(error){
        throw new Error(error)
    }
 })
 
module.exports = {
    createProduct,
     updateProduct,
     getallProduct,
    getaProduct,
    deleteaProduct,
    addToWishlist,
    rating,
    uploadProductPhoto
}