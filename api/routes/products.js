const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Product = require('../Model/product');

router.get('/',(req,res,next)=>{
    Product.find().then(result=>{
        //res.send(result);
        res.status(200).json({
            message:`Handing get request to product`,
            ProductDetails : result,
            count : 0/0
        }).catch(next);
    })   
});

router.post('/',(req,res,next)=>{
    // const product={
    //     name : req.body.name,
    //     price : req.body.price 
    // };

    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name : req.body.name,
        price : req.body.price
    });
    product.save().then(result=>{
        console.log(result);
    })
    .catch(err=>console.log(err));

    res.status(201).json({
        message:`Handing post request to product`,
        createdProduct:product
    });
});

router.get('/:productId',(req,res,next)=>{
    const id = req.params.productId;
    Product.findById(id).then(result=>{
        //res.send(result);
        res.status(200).json({
            message:`Handing get request to product`,
            ProductDetails : result
        })
        .catch(err => console.log(err));
    });
        
    // if(id ==='special')
    // {
    //     res.status(200).json({
    //         message:`You discoverd the product id ${id}`,
    //         id :id
    //     });
    // }    
    // else
    // {
    //     res.status(200).json({
    //         message:`product id not identified`
    //     });
    // }
});

router.patch('/:productId',(req,res,next)=>{
    res.status(200).json({
        message:`Update product`,
    });
});

router.delete('/:productId',(req,res,next)=>{
    res.status(200).json({
        message:`Delete product`,
    });
});

module.exports = router;