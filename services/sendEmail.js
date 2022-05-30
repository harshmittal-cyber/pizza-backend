const nodeMailer = require("nodemailer");

const transporter = nodeMailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
    },
});

module.exports.sendEmail = async (options) => {
    let mailOptions = {
        from: process.env.SMTP_MAIL,
        to: options.email,
        subject: options.subject,
        text: options.message,
    }

    await transporter.sendMail(mailOptions, (error, info) => {
        if (error) return error;
    })
}

module.exports.contactMail = async (username, email, message, organisation, contact, res) => {
    try {
        let mailOptions = {
            from: email,
            to: `${process.env.SMTP_MAIL}`,
            subject: `Contact message from ${organisation}`,
            html: `${message} <br/> Contact:${contact} <br/><br/> Regards <br/> ${username}`
        }
        await transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                return err
            }
        });
    } catch (err) {
        return res.status(501).json({ message: err.message, success: false })
    }
}