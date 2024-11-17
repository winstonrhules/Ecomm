const Blog = require("../models/blogModel")
const User = require("../models/userModel")
const asyncHandler = require("express-async-handler")
const validateMongoDb= require("../utils/validateMongoDb")
const fs = require("fs")

const createBlog = asyncHandler(async(req, res)=>{
    try{
       const newBlog = await Blog.create(req.body)
       res.json(newBlog)
    }
    catch(error){
        throw new Error(error)
    }
})

const getallBlog = asyncHandler(async(req, res)=>{
    try{
     const getblogs = await Blog.find()
     res.json(getblogs)
    }
    catch(error){
        throw new Error(error)
    }
})

const getaBlog = asyncHandler(async(req, res)=>{
    const {id} = req.params
    validateMongoDb(id)
    try{
     const getblog = await Blog.findById(id).populate("likes").populate("dislikes")
     await Blog.findByIdAndUpdate(id, {$inc:{numviews:1}}, {new:true})
     res.json(getblog)
    }
    catch(error){
        throw new Error(error)
    }
})

const updateaBlog = asyncHandler(async(req, res)=>{
    const {id} = req.params
    validateMongoDb(id)
    try{
     const updateblog = await Blog.findByIdAndUpdate(id, req.body, {new:true})
     res.json(updateblog)
    }
    catch(error){
        throw new Error(error)
    }
})

const deleteaBlog = asyncHandler(async(req, res)=>{
    const {id} = req.params
    validateMongoDb(id)
    try{
     const deleteblog = await Blog.findByIdAndDelete(id)
     res.json(deleteblog)
    }
    catch(error){
        throw new Error(error)
    }
})

const likeBlog = asyncHandler(async(req, res)=>{
 const {id}=req.body;
 validateMongoDb(id);
 const blog = await Blog.findById(id);
 const user = req?.user?._id;
 const isLiked=blog?.isLiked;
 const alreadyDisliked = blog?.dislikes?.find((userid)=>userid?.toString()===user?.toString())
 if(alreadyDisliked){
    const blog = await Blog.findByIdAndUpdate(id, {
        $pull:{dislikes:user},
        disLiked:false
    },
    {new:true}
)
res.json(blog)
 }
 if(isLiked){
    const blog = await Blog.findByIdAndUpdate(id, {
        $pull:{likes:user},
        isLiked:false
    },
    {new:true}
)
res.json(blog)
 }
 else{
    const blog = await Blog.findByIdAndUpdate(id, {
        $push:{likes:user},
        isLiked:true
    },
    {new:true}
)
res.json(blog)
 }
})

const dislikeBlog = asyncHandler(async(req, res)=>{
    const {id}=req.body;
    validateMongoDb(id);
    const blog = await Blog.findById(id);
    const user = req?.user?._id;
    const disLiked=blog?.disLiked;
    const alreadyLiked = blog?.likes?.find((userid)=>userid?.toString()===user?.toString())
    if(alreadyLiked){
       const blog = await Blog.findByIdAndUpdate(id, {
           $pull:{likes:user},
           isLiked:false
       },
       {new:true}
   )
   res.json(blog)
    }
    if(disLiked){
       const blog = await Blog.findByIdAndUpdate(id, {
           $pull:{dislikes:user},
           disLiked:false
       },
       {new:true}
   )
   res.json(blog)
    }
    else{
       const blog = await Blog.findByIdAndUpdate(id, {
           $push:{dislikes:user},
           disLiked:true
       },
       {new:true}
   )
   res.json(blog)
    }
   })
   
   
 const uploadBlogPhoto = asyncHandler(async(req, res)=>{
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
        const finalImageBlog = await Blog.findByIdAndUpdate(id, 
            {
            images:urls.map((file)=>{
                return file;
            })
          }, 
           {new:true}
        )
        res.json(finalImageBlog)
    }
    catch(error){
        throw new Error(error)
    }
 })

module.exports = {createBlog, getallBlog, getaBlog, updateaBlog, deleteaBlog, likeBlog, dislikeBlog, uploadBlogPhoto}