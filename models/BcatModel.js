const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var BcatSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },

},{timestamps:true});

//Export the model
module.exports = mongoose.model('Bcat', BcatSchema);