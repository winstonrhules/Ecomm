const cloudinary = require("cloudinary")
cloudinary.config({
cloud_name : process.env.CLOU_CLOUD_NAME,
api_key:process.env.CLOU_API_KEY,
api_secret :process.env.CLOU_API_SECRET
})

const cloudinaryUploadImg = async(filesToUpload)=>{
        return new Promise((resolve)=>{
            cloudinary.uploader.upload(filesToUpload, (result)=>{
                resolve(
                    {
                    url: result.secure_url,
                    },
                    {
                       resource_type:"auto"
                    }
                )
            })
        })
}



module.exports = cloudinaryUploadImg
