const mongoos = require('mongoose');

const orderSchema = mongoos.Schema({
    _id: mongoos.Schema.Types.ObjectId,
    product: { type: mongoos.Schema.Types.ObjectId, ref: 'Product',required:true },
    quantity: { type: Number, default: 1 }
});

module.exports = mongoos.model('Order', orderSchema);