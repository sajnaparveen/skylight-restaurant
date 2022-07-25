const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require('dotenv').config();
const bodyparser = require("body-parser");
const port = process.env.port || 7000;
const braintree = require('braintree');

const userrouter = require('./routes/user.route');
const foodrouter = require('./routes/food.route');
const tableBooking = require('./routes/tableBooking.route');
// const paymentrouter = require('./routes/payment.route');
const app = express();
app.use(cors());
app.use(bodyparser.urlencoded({ extended: false }))
app.use(express.static('uploads'))

app.use(bodyparser.json())

mongoose.connect(process.env.dburl, {
    useNewUrlParser: true,
    useUnifiedTopology: true

}).then(data => {
    console.log("database connected");
}).catch(err => {
    console.log(err.message);
    process.exit(1);
})
const config = {
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.MERCHANT_ID,
    publicKey: process.env.PUBLIC_KEY,
    privateKey: process.env.PRIVATE_KEY
};

const gateway = new braintree.BraintreeGateway(config);

app.use(cors({origin: 'http://localhost:3000'}));
app.use(express.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    // res.header("Access-Control-Allow-Methods", "GET", "POST", "DELETE")
    next();
});

//token generate
app.get("/tokenGeneration", async(req,res)=>{
    try {
        gateway.clientToken.generate({}, (err, resData)=>{
            if(err){
                return res.send({err: err})
            }else{
                console.log(resData);
                return res.status(200).json({"status": "success", message: resData.clientToken}) 
            }
        })
    } catch (error) {
        return res.status(500).json({"status": "failed", messsage: error.message})
    }
});

// sale transaction
app.post("/saleTransaction", async(req,res)=>{
    try {
        console.log("sale transaction apis ")
        console.log(req.body)
        // console.log("^".repeat(200))
        const paymentData = gateway.transaction.sale({
            amount: req.body.amount,
            paymentMethodNonce: req.body.paymentMethodNounce,
            options: {
                submitForSettlement: true
            }
        }).then(data=>{
            console.log("s".repeat(200))
            console.log(data)
            return res.status(200).json({"status":"success",message:data.transaction})
        }).catch(err=>{
            console.log(err)
        })
            
        
    } catch (error) {
        return res.status(500).json({"status": "failed", message: error.message});  
    }
})


app.use('/api/v1/user', userrouter);
app.use('/api/v2/food', foodrouter);
// app.use('/api/v3/payment',paymentrouter);
app.use('/api/v1/table', tableBooking);

app.listen(port, () => {
    console.log(`http://127.0.0.1:${port}${process.env.HOST}`)
})