const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
    products:[
        {
            product:
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Product"
            },
            quantity:Number,
            color:String,
        }
    ],
    paymentintent:{},
   
    orderstatus:{
           type:String,
           default:"In Progress",
           enum:[
            "In Progress",
            "cash on delivery",
            "cancelled",
            "processing",
            "dispatched",
            "delivered",
           ]
    },
    orderby:{
         type:mongoose.Schema.Types.ObjectId,
         ref:"User"
    },
},{timestamps:true});

//Export the model
module.exports = mongoose.model('Order', orderSchema);