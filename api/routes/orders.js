const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../Model/orders');
const Product = require('../Model/product');

router.get('/', (req, res, next) => {
    Order.find()
    .select('id product quantity')
    .populate('product','name')
    .exec()
    .then(docs=>{
        res.status(200).json({
            count:docs.length,
            orderDetails: docs
        })    
    }).catch(err=>{
        console.log(err);
    })
});


router.post('/', (req, res, next) => {

    /** Validate if product is found then only create the order */
    Product.findById(req.body.productId)
    .then( product => {
        /** Check if order quantity already exist in system */
        Order.find({product:req.body.productId}).then(docs =>{
            if(docs.length>0){
                res.status(404).json({
                    message:"order details for product already exist."
                })
            }
            else{
                // create order object to insert
                const order = new Order({
                    _id : mongoose.Types.ObjectId(),
                    product: req.body.productId,
                    quantity: req.body.quantity
                });
                return order
                .save()       
                .then(result => {
                    console.log(result);
                    res.status(200).json(result);
                })            
            }            
        })
    })
    .catch(err =>{
        res.status(500).json({
            message :'Product not available',
            error:err     
        })
    })
    /** Generate order details to save */
    
});

router.get('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    Order.findById(id)
    .populate('product')
    .exec()
    //.select('product quantity')
    .then(order =>{
        if(!order){
            return res.status(404).json({
                message:"Order not found"
            });
        }
        res.status(200).json({
            message:"Order details for order id "+id,
            orderDetails : order
        })
    })
    .catch(err =>{
       res.status(400).json({
        message:"Error occured in Order get()",
        error:err
       });        
    });
});

router.delete('/:orderId', (req, res, next) => {
    Order.remove({_id:req.param.orderId})
    .exec()
    .then(del=>{
        res.status(200).json({
            message: 'order deleted',
            orderid: req.params.orderId
        });
    })
    .catch(
        err=>{
            res.status(500).json({
                message :'Error in order delete()',
                error:err     
            })
        }
    )
    
    
});

module.exports = router;