const mongoos = require('mongoose');

const productSchema = mongoos.Schema({
    _id : mongoos.Schema.Types.ObjectId,
    name: String,
    price: Number
});

module.exports = mongoos.model('Product',productSchema);