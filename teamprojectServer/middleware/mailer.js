// const nodemailer = require('nodemailer');
const ejs = require('ejs')
const {join} = require('path');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey("");

async function mailSending(mailData){

    try{
    let data = await ejs.renderFile(join(__dirname,'../views',mailData.fileName),mailData,mailData.details)
let mailDetails={
    from:mailData.from,
    to:mailData.to,
    subject:mailData.subject,
    text:mailData.text,
    html:data
}
sgMail.send(mailDetails,(err,data)=>{
    if(data){
        console.log("mail sent successfully!")
    }else{
       console.log("mail not sending!")
    }
    console.log(err)
})
    }catch(error){
console.log(error)
    }
}

async function sentOtp(mailDetails){
    
    try{
        console.log('success')
      
        sgMail.send(mailDetails,(err,data)=>{
       if(err){
                console.log("err",err)
            }
            if(data){
                console.log("otp is sending!")
            }else{
                console.log("otp not sending!")
            }
        })
    }catch(err){
        console.log("err",err)
    }
}
async function customerQuery(mailDetails){
    
    try{
        console.log('success')
      
        sgMail.send(mailDetails,(err,data)=>{
       if(err){
                console.log("err",err)
            }
            if(data){
                console.log("customerQuery is sending!")
            }else{
                console.log("customerQuery not sending!")
            }
        })
    }catch(err){
        console.log("err",err)
    }
}

async function orderSuccess(mailDetails){
    
    try{
        console.log('success')
      
        sgMail.send(mailDetails,(err,data)=>{
       if(err){
                console.log("err",err)
            }
            if(data){
                console.log("confirmOrdermailSuccess is sending!")
            }else{
                console.log("confirmOrdermailSuccess not sending!")
            }
        })
    }catch(err){
        console.log("err",err)
    }
}

module.exports ={
    mailSending,sentOtp,orderSuccess,customerQuery
}

