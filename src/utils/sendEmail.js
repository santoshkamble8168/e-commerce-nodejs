const nodeMailer = require("nodemailer")

const sendEmail = async (options) => {
    const transporter = nodeMailer.createTransport({
        host: "smtp.gamil.com",
        port:465,
        service: process.env.SMTP_SERVICE,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASS
        }
    })

    const mailOptions = {
        from: process.env.SMTP_EMAIL ,
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    await transporter.sendMail(mailOptions)
}

module.exports = sendEmail