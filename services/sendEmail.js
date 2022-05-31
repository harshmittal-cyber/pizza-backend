const nodeMailer = require("nodemailer");

module.exports.sendEmail = async (options) => {
    const transporter = nodeMailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

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
        const transporter = nodeMailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_MAIL,
                pass: process.env.SMTP_PASSWORD,
            },

        });

        transporter.sendMail({
            from: `hungrypiz83@gmail.com`,
            to: `${process.env.SMTP_MAIL}`,
            subject: `Contact message from ${organisation}`,
            html: `${message} <br/> Contact:${contact} <br/><br/> email:${email} <br/> Regards <br/> ${username}`
        }, (err, info) => {
            if (err) {
            }
        });
    } catch (err) {
        return res.status(501).json({ message: err.message, success: false })
    }
}