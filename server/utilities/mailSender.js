const nodemailer = require('nodemailer');
const config = require('../config/config');

function sendMail(receivers, subject, html, res) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'calendar.events.weedoh@gmail.com',
            pass: `${config.gmailPass}`
        }
    });
    const mailOptions = {
        to: receivers, // list of receivers
        subject: subject, // Subject line
        html: html // plain text body
    };
    transporter.sendMail(mailOptions, function (err, info) {
        if(err)
            res.json({
                errorMessage : `There is an ERROR : ${err}!`
            });
        else
            res.json({
                successMessage : `Your secret key was sended to ${receivers}`
            });
    });
}

module.exports = sendMail;