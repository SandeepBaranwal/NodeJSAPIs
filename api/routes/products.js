
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

const storage = multer.diskStorage({
    destination:function(req,file,cb){
     cb(null,'./upload/');   
    },
    filename:function(req, file, cb){
        cb(null,new Date().toString() +  file.filename);
    }
});

const upload = multer({dest:'uploads/'});

const Product = require('../Model/product');



router.get('/', (req, res, next) => {
    Product.find()
    .select('_id name price')
    .then(result => {
        const response ={
            count : result.length,
            product: result
        };
        //res.status(200).json(response);
        res.status(200).json(result.map(doc=>{
            return {
                Product_name : doc.name,
                Product_price : doc.price,
                product_id : doc._id,
                request:{
                    "type":"Get",
                    "url":"http://localhost:3000/products/"+doc._id
                }
            }
        }))
        // if (result.length > 0) {
        //     res.status(200).json({
        //         message: `Handing get request to product`,
        //         ProductDetails: result,
        //         count: 0 / 0
        //     }).catch(next);
        // }
        // else {
        //     res.status(200).json({
        //         message: `Data not avilable in database`
        //     });
        // }

     })
});

router.post('/',upload.single('productImage'),  (req, res, next) => {
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product
    .save()
    .then(result => {
        console.log(result);

        res.status(201).json({
            message: `Product created successfully`,
            createdProduct: product
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            message: `Error iin post request of product ${err.message}`
        })
    });
});
    router.get('/:productId', (req, res, next) => {
        const id = req.params.productId;
        Product.findById(id).then(result => {
            if (result) {
                res.send({
                    message: `get product details for product id: ${id}`,
                    ProductDetails: result
                }).catch(err => {
                    console.log(err);
                    res.status(500).json({
                        message: 'Some exception occure!'
                    })
                });
            } else {
                res.status(200).json(
                    {
                        message: "Product not available for select product id!"
                    });
            }
        });
    });

    /**
     * Test case: [{ propName:"name", value:"Britania GoodDay"}]
     * {"newname":"Britania GoodDay","Price":"25"}
     */
    router.patch('/:productId', (req, res, next) => {
        const id = req.params.productId;
        const updateOps = {};
        for (const ops of req.body) {
            updateOps[ops.newname] = ops.value;
        }
        // Product.update({ _id: id },{$set : {name:req.body.newname} })
        Product.update({ _id: id }, { $set: updateOps })
            .exec()
            .then(result => {
                res.status(200).json({
                    message:"Product Updated",
                    request:{
                        type:"Get",
                        url:"http://localhost/product/"+id
                    }
                });
            })
            .catch(err => {
                console.log(err.message);
                res.status(500).json({
                    error: err.message
                });
            })
    });

    router.delete('/:productId', (req, res, next) => {
        var id = req.params.productId;
        Product.remove({ _id: id }).exec().then(
            result => {
                res.status(200).json(result);
            }).catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    });

    module.exports = router;