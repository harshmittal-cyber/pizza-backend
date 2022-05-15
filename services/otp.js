const crypto = require('crypto');
const fast2sms = require('fast-two-sms');

module.exports.hashotp = function (data) {
    const hash = crypto
        .createHmac("sha256", process.env.OTP_SECRET)
        .update(data)
        .digest("hex");

    return hash;
}

module.exports.generateotp = function (req, res) {
    let otp = crypto.randomInt(100000, 999999);
    return otp;
}

module.exports.sendOtp = async function (otp, phone) {
    var options = {
        authorization: process.env.FAST_TWO_SMS_API,
        message: `Your Otp for hungry is ${otp}. Valid for 5 minutes.`,
        numbers: [phone]
    }

    fast2sms.sendMessage(options).then((res) => {
        console.log('otp', res)
        return res
    });
}


module.exports.verifyOtp = function (hashotp, data) {
    let hashdata = this.hashotp(data);

    return hashdata === hashotp;
}