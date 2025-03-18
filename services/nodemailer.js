const nodemailer = require('nodemailer');
const crypto = require("crypto");
require("dotenv").config();

function generateOTP(){
   return crypto.randomInt(100000,999999).toString();
}

async function sendOTP(email,otp){
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth:{
            user: process.env.my_email,
            pass: process.env.my_password
        }
    });

    await transporter.sendMail({
        from:process.env.my_email,
        to: email,
        subject: "Your Admin Panel OTP code",
        text: `Your Otp is ${otp}`
    })
}

module.exports = {
    generateOTP,
    sendOTP,
}
