require('dotenv').config()
const twillo = require('twilio')(process.env.SID, process.env.TOKEN)


function twilio(message, number, otp, res) {
    try {
        twillo.messages.create({
            from: '+16812498432',
            to: "+91" + number,
            body: message
        }).then(mms => {
            res.send({ message: "sms sended", res: mms, otp: otp })
            console.log("sms sended")
        }).catch(err => {
            res.send({ message: err.message })
            console.log('err', err.message)
        })
    } catch (err) {
        console.log(err.message)
    }
}

module.exports = { twilio }