const nodemailer = require('nodemailer');
const generateTicketImage = require('./generateTicketImage');
require('dotenv').config();

async function sendMail(email, subject, text, ticketNumber, name, role) {
    try {
        // Generate ticket image
        const ticketPath = await generateTicketImage(ticketNumber, name, role);

        // Create transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        // Send email with attachment
        const mailOptions = {
            from: process.env.MAIL_USER,
            to: email,
            subject,
            text,
            attachments: [
                {
                    filename: `${ticketNumber}.png`,
                    path: ticketPath
                }
            ]
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Mail sent to ${email} with ticket attached`);
    } catch (error) {
        console.error('❌ Error sending mail:', error);
    }
}

module.exports = sendMail;
