const crypto = require('crypto');
const axios = require('axios');

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
    const { data } = await axios.get("https://www.fast2sms.com/dev/bulkV2", {
        params: {
            authorization: process.env.FAST_TWO_SMS_API,
            message: `Your Otp for hungry is ${otp}. Valid for only 5 minutes.`,
            sender_id: "FTWSMS",
            route: "v3",
            language: "english",
            numbers: phone,
            flash: '0'
        }
    })
    return data
}


module.exports.verifyOtp = function (hashotp, data) {
    let hashdata = this.hashotp(data);

    return hashdata === hashotp;
}