const mongoos = require('mongoose');

const productSchema = mongoos.Schema({
    _id : mongoos.Schema.Types.ObjectId,
    name:{type:String, required:true},
    price: {type:Number,required:true}
});

module.exports = mongoos.model('Product',productSchema);