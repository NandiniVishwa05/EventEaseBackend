const nm = require('nodemailer');

let tprt = nm.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'collegeproject1140@gmail.com',
        pass: 'yflwcsnxjhppmrqg'
    },
})

const sendmail = (request, response) => {
    console.log("hello");

    let { email, otp } = request.body;
    console.log(otp);

    let mailOptions = {
        from: process.env.SMTP_MAIL,
        to: email,
        subject: "Email OTP Testing",
        text: `Your OTP is ${otp}`
    }
    tprt.sendMail(mailOptions, (err, data) => {
        if (err) {
            response.json(err);

        } else {
            response.json({ msg: "EmailSentSuccessfully" });

        }
    })
}

module.exports = { sendmail };