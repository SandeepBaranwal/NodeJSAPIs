const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../Model/orders');

router.get('/',(req,res,next)=>{
    res.status(200).json({
        message: 'order fetched',
        data: res.data
    });
});


router.post('/',(req,res,next)=>{
    const order = {
        productId: req.body.productId,
        quantity: req.body.quantity
    };
    res.status(201).json({
        message: 'order created',
        order:order
    });
});

router.get('/:orderId',(req,res,next)=>{
    res.status(200).json({
        message: 'order details',
        orderid: req.params.orderId
    });
});

router.delete('/:orderId',(req,res,next)=>{
    res.status(200).json({
        message: 'order deleted',
        orderid : req.params.orderId
    });
});

module.exports = router;