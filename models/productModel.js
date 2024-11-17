const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true,
        trim:true,
    },
    slug:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    category:{
        type:String,
        required:true
    },
    images:[],
    color:{
        type:String,
    },
    brand:{
        type:String,
        required:true,
    },
    quantity:{
        type:Number,
    },
    sold:{
        type:Number,
        default:0,
    },  
    
    rating:[{
        star:Number,
        comments:String,
        postedby:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    }],
    totalrating:{
         type:String,
         default:0,
    }

},{timestamps:true});

//Export the model
module.exports = mongoose.model('Product', productSchema);