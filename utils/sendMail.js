const nodemailer = require('nodemailer');
const htmlToText = require('html-to-text');
const pug = require('pug');
module.exports = async({template, user, subject, text, url})=>{
    let transporter = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
            user: process.env.SENDGRID_USERNAME,
            pass: process.env.SENDGRID_PASSWORD
        }
    });
    const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`, {
        firstname: user.name.split(' ')[0],
        url: url,
        subject,
        text
    });
    const info = {
        from: '"Fred Foo 👻" <bettasowebsite@gmail.com>', // sender address
        to: user.email, // list of receivers
        subject: subject,
        // subject: "Hello ✔", // Subject line
        text: htmlToText.fromString(html), // plain text body
        html: html, // html body
    }
    return await transporter.sendMail(info);
}