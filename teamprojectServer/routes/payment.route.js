// const router = require('express').Router();
// const gateway = new braintree.BraintreeGateway(config);

// const braintree = require('braintree');
// const config = {
//     environment: braintree.Environment.Sandbox,
//     merchantId: process.env.MERCHANT_ID,
//     publicKey: process.env.PUBLIC_KEY,
//     privateKey: process.env.PRIVATE_KEY
// };
// router.get("/tokenGeneration", async(req,res)=>{
//     try {
//         gateway.clientToken.generate({}, (err, resData)=>{
//             if(err){
//                 return res.send({err: err})
//             }else{
//                 // console.log(resData);
//                 return res.status(200).json({"status": "success", messsage: resData.clientToken})
//             }
//         })
//     } catch (error) {
//         return res.status(500).json({"status": "failed", messsage: error.messsage})
//     }
// });

// // sale transaction
// router.post("/saleTransaction", async(req,res)=>{
//     try {
//         console.log("sale transaction apis ")
//         console.log(req.body)
//         console.log("^".repeat(200))
//         const paymentData = gateway.transaction.sale({
//             amount: req.body.amount,
//             paymentMethodNounce: req.body.paymentMethodNounce,
//             options: {
//                 submitForSettlement: true
//             }
//         }, (err, resData)=>{
//             if(err){
//                 console.log(err.messsage)
//                 console.log("$".repeat(200))
//             }
//             console.log("_".repeat(200))
//             console.log(resData)
//             console.log("_".repeat(200))
//             if(resData.success){
//                 return res.status(200). json({"status": "success", messsage: resData.transaction})
//             }else{
//                 return res.send({err: err});
//             }
//         })
        
//     } catch (error) {
//         return res.status(500).json({"status": "failed", messsage: error.messsage});  
//     }
// })

// module.exports = router