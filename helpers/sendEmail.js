require('dotenv').config();
const sgMail = require('@sendgrid/mail')
const {SENDGRID_API_KEY, SG_EMAIL_FROM} = process.env;

sgMail.setApiKey(SENDGRID_API_KEY)

const sendEmail = data => {
    const {to, subject, text, html} = data
    const msg = {
   to,
    from: SG_EMAIL_FROM,
    subject,
    text,
    html,
}
    return sgMail.send(msg);
} 
module.exports = sendEmail;