const nodeMailer = require("nodemailer");

exports.nodeMail = (mail) => {
    const mailing = nodeMailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: "96com.team@gmail.com",
            pass: "18-10-2017"
        }
    });

    let mailData = {
        from: mail.from,
        to: mail.to,
        subject: mail.subject,
        html: mail.html
    }

    return mailing.sendMail(mailData)
        .then(info => console.log(`Message sent: ${info.response}`))
        .catch(err => console.log(`Problem sending email: ${err}`));
};
