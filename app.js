const express = require('express');
const app = express();
//logger middle ware
const morgan = require('morgan');
const bodyParser = require('body-parser');

/** Mongo DB */
const mongoose = require('mongoose');

const productroute = require('./api/routes/products');
const orderroute = require('./api/routes/orders');

mongoose.connect('mongodb://127.0.0.1:27017/test', {
    useMongoClient: true
});

mongoose.Promise = global.Promise
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/orders', orderroute);
app.use('/products', productroute);

// error handling middleware

app.use(function (err, req, res, next) {
    console.log(err);
    res.send({ error: err.message });
})

/**
 * To avoid CORS (Cross origin resource sharing)
 * CORS security mechanism only apply on browser, not on any tool tike postman
 */
app.use((req, res, next) => {
    //res.header("Access-Control-Allow-Origin","www.travelex.com/login");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Header", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "GET,PUT,PATCH,POST,DELETE");
        return res.status(200).json({});
    }
    next();
})

/** To catch the error exception using morgan */
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 400;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
            errorCode: error.status
        }
    });
});

module.exports = app;