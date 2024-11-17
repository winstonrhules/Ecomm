const mongoose = require("mongoose")

const dbConnect= ()=>{
    try{
        const conn = mongoose.connect(process.env.MONGO_URL)
        console.log("Database connected Successfully")
    }
    catch(error){
        console.log("Database failed to connect")
    }
   
   

}

module.exports = dbConnect