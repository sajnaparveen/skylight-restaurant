const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userSchema = require('../model/user.model');
const { mailSending, sentOtp ,orderSuccess,customerQuery} = require('../middleware/mailer');
const port = process.env.port || 8000;
const { twilio } = require('../middleware/twiliosms')

const fast2sms = require('fast-two-sms')
const moment = require('moment');
const BulkExports = require('twilio/lib/rest/preview/BulkExports');

router.post('/signupPage', async (req, res) => {
  console.log(req.body)
  try {

    const userName = req.body.userName;
    const password = req.body.password;
    const email = req.body.email;
    const mobileNumber = req.body.mobileNumber;
    const logintype = req.body.logintype;


    const mailData = {
      from: 'sajna.platosys@gmail.com',
      to: email,
      subject: "Verify Email",
      fileName: "emailverification.ejs",
      details: {
        name: userName,
        date: new Date(),
        link: `http://localhost:${port}/api/v1/user/email-verify?email=${email}`
      }
    }

    console.log(req.body)

    if (userName && password && email && mobileNumber) {

      let userdetails = await userSchema.findOne({ userName: userName }).exec();
      let emailid = await userSchema.findOne({ email: email }).exec();
      let phoneno = await userSchema.findOne({ mobileNumber: mobileNumber }).exec();

      console.log("username", userdetails);
      console.log("email", emailid);
      console.log("mobileno", phoneno);

      if (userdetails) {
        return res.json({
          status: "failure",
          message: "username already exist",
        });
      } else if (emailid) {
        return res.json({ status: "failure", message: "email already exist" });
      } else if (phoneno) {
        return res.json({
          status: "failure",
          message: "mobileno already exist",
        });
      }
      else {
        let mailresponse = mailSending(mailData);
        if (!mailresponse) {
          console.log("mail not sending")
        } else {
          const objData = req.body

          if (logintype == 'google' || logintype== 'facebook') {
            console.log(logintype)
            objData.verifyed = true;
          }else{
            objData.verifyed=false;
          }

          let user = new userSchema(objData);
          let salt = await bcrypt.genSalt(10);
          user.password = bcrypt.hashSync(password, salt);
          console.log(user.password);
          let result = await user.save();
          console.log("result", result);
          return res.status(200).json({ status: "success", message: "successfully register", data: result })
        }

      }
    } else {
      return res
        .status(400)
        .json({ status: "failure", message: "must include all details" });
    }
  } catch (error) {
    return res.status(500).json({
      status: "failure",
      message: error.message
    })
  }
})
//email verification
router.get("/email-verify", async (req, res) => {
  try {

    const data = await userSchema.findOne({ email: req.query.email }).exec();

    console.log("data", data)
    if (data) {
      if (data.verifyed) {
        res.render('verify.ejs', { title: "Your account already verifyed" })
      } else {
        userSchema.updateOne({ email: req.query.email }, { verifyed: true }).exec();
        res.render('verify.ejs', { title: "Your account verifyed successfully" })
      }
    } else {
      res.render('verify.ejs', { title: "Account verification failed" })
    }

  } catch (error) {
    return res.status(500).json({
      status: "failure",
      message: error.message
    })
  }


})

router.post("/loginpage", async (req, res) => {
  try {
    console.log(req.body)
    const userName = req.body.userName;
    const password = req.body.password;
    const email = req.body.email
    const time = moment().toDate() 
    let userdetails;
    let details = await userSchema
      .findOne({ email: email })
      
      .exec();
    if (!details.verifyed) {
      return res.status(400).json({ status: "failure", message: "Your account is not verified, please verify your account" })
    } else {
      if (email) {
        userdetails = await userSchema.findOne({ email: email }).exec();
        if (!userdetails) {
          return res.status(400).json({
            status: "failure",
            message: "Don't have an account?please Register",
          });
        } else if (userdetails) {
          console.log(userdetails.password);
          let match = await bcrypt.compare(password, userdetails.password);
          console.log("match", match);
          console.log("password", password);
          if (userdetails.firstLoginStatus !== true) {
            await userSchema
              .findOneAndUpdate(
                { uuid: userdetails.uuid },
                { firstLoginStatus: true },
                { new: true }
              )
              .exec();
          }
          const logintype =  req.body.logintype;
          let payload = { uuid: userdetails.uuid, role: userdetails.role };
          if (logintype == 'google' || logintype== 'facebook') {
          
          
            let userdetails = details.toObject(); //to append jwt token
            let jwttoken = jwt.sign(payload, process.env.secretKey);
            userdetails.jwttoken = jwttoken;
            await userSchema
              .findOneAndUpdate(
                { uuid: userdetails.uuid },
                { loginStatus: true,lastedVisited:time },
                { new: true }
              )
              .exec();
            return res.status(200).json({
              status: "success",
              message: "Login successfully",
              data: userdetails
            });
          
          }
         else if (match) {
            let userdetails = details.toObject(); //to append jwt token
            let jwttoken = jwt.sign(payload, process.env.secretKey);
            userdetails.jwttoken = jwttoken;
            await userSchema
              .findOneAndUpdate(
                { uuid: userdetails.uuid },
                { loginStatus: true,lastedVisited:time },
                { new: true }
              )
              .exec();
            return res.status(200).json({
              status: "success",
              message: "Login successfully",
              data: userdetails,
            });
          } else {
            return res
              .status(500)
              .json({ status: "failure", message: "Login failed" });
          }
        }
      }
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ status: "failure", message: error.message });
  }
});
// forget password
router.post("/forgetPassword", async (req, res) => {
  try {
    let email = req.body.email;
    let newPassword = req.body.password;
    console.log(email)
    console.log(newPassword)
    let users = await userSchema.findOne({ "email": email }).exec();
    if (users) {
      let salt = await bcrypt.genSalt(10);
      pass = bcrypt.hashSync(newPassword, salt);
      console.log(pass)
      const data = await userSchema.findOneAndUpdate({ email: email }, { password: pass }, { new: true }).exec()
      res.json({ "status": "Success", "message": "Password changed", "data": data });
    }
    else {
      res.json({ "status": "failed", "message": "please enter valid email" });
    }
  } catch (err) {
    res.json({ "status": "Failed", "message": err.message });
  }

});

router.post("/check-email", async (req, res) => {
  try {
    let email = req.body.email;
    let email_id = await userSchema.findOne({ "email": email }).exec()

    // console.log("xxx",otp)
    console.log("email_id", email_id)
    if (email_id) {


      let otp = Math.floor((Math.random() * 1000) + 1000);
      let mailData = {
        from: 'sajna.platosys@gmail.com',
        to: { email },
        subject: "One time OTP password",
        text: `Your one time password : ${otp}`
      }

      let sendOtpToMail = sentOtp(mailData)
      if (!sendOtpToMail) {
        console.log("Otp not sending to mail")
      }

      return res.status(200).json({ status: true, message: "you're entered correct mail-id", data: email_id})
    } else {
      return res.status(200).json({ status: false, message: "email id is not register" });
    }
  } catch (error) {
    return res.status(400)({ status: false, message: err.message });

  }
})


router.post("/order-success", async (req, res) => {
  try {
    let email = req.body.email;
    let email_id = await userSchema.findOne({ "email": email }).exec()

    // console.log("xxx",otp)
    console.log("email_id", email_id)
    if (email_id) {
      let mailData = {
        from: 'sajna.platosys@gmail.com',
        to: { email },
        subject: "Order Confirmed",
        text: `Your order has been confirmed!
        Shop again`
      }

      let ordersuccess = orderSuccess(mailData)
      if (!ordersuccess) {
        console.log("mail not sending")
      }

      return res.status(200).json({ status: true, message: "you're entered correct mail-id", data: email_id })
    } else {
      return res.status(200).json({ status: false, message: "email id is not register" });
    }
  } 
  catch (error) {
    // return res.status(400)({ status: false, message: error.message });

  }
})

router.post("/customerQuery", async (req, res) => {
  try {
    let message = req.body.message;
    // let email = req.body.email;
    // let email_id = await userSchema.findOne({ "email": email }).exec()
  let  email_id ="sajnatech97@gmail.com"
    // console.log("xxx",otp)
    console.log("email_id", email_id)
    if (email_id) {
      let mailData = {
        from: 'sajna.platosys@gmail.com',
        to: email_id,
        subject: "customerQuery",
        text: message
       
      }

      let customerQuerys = customerQuery(mailData)
      console.log("customerQuerys",customerQuerys)
      if (!customerQuerys) {
        console.log("mail not sending")
      }

      return res.status(200).json({ status: true, message: "you're entered correct mail-id", data:email_id })
    } else {
      return res.status(200).json({ status: false, message: "email id is not register" });
    }
  } 
  catch (error) {
    // return res.status(400)({ status: false, message: error.message });

  }
})

router.post("/verify-number", async (req, res) => {
  try {
    let number = req.body.number;
    let phone_number = await userSchema.findOne({ "mobileNumber": number }).exec()

    if (!phone_number) {

      let otp = Math.floor((Math.random() * 1000) + 1000);
      const message = `Your Social signin OTP is ${otp}`
      // await sendMessage(message, number, res)
      await twilio(message, number, otp, res)


      // return res.status(200).json({ status: true, message: "OTP Sent!", data: number, otp })
    } else {
      return res.status(200).json({ status: false, message: "This Mobile Number Already Registered" });
    }
  } catch (error) {
    return res.status(400)({ status: false, message: err.message });

  }
})

router.put('/updateAdd',async(req,res)=>{
  try{
      const uuid = req.body.uuid;
      let address = req.body.address
      await userSchema.findOneAndUpdate({uuid:uuid},{address:address},{new:true}).then(result=>{
          res.json({status:'success',message:'address successfully updated!','result':result})
      }).catch(err=>{
          console.log(err.message)
          res.json({'err':err.message})
      })
  }catch(err){
      res.json({'err':err.message})
  }   
})


function sendMessage(message, number, res) {
  console.log('response')
  var options = {
    authorization:
      "gTNeKGrPJI7LkvyHlOcw1uzmof8EQSqsbF6diUXWxYZ3atBAp9rhvuUolBHXR3KP76k05FcwMEQpnzmO",
    message: message,
    numbers: [number],
  };


  fast2sms
    .sendMessage(options)
    .then((response) => {
      console.log(response)
      res.send({ messsage: "SMS OTP Code Sent Successfully", response: response })
    })
    .catch((error) => {
      console.log(error)
      res.send("Some error taken place")
    });
}




module.exports = router