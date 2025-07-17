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

        const subject = "TEDx Ticket Automization Testing";

    const htmlBody = `
    <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color: #e62b1e;">Dear ${name},</h2>
        <p>We hope you're doing well!</p>
        <p>
            We're excited to share that the TEDx Tech Team has successfully developed and launched our very own:
        </p>
        <ul>
            <li>✔ Payment Verification System (TEDx Gateway)</li>
            <li>✔ Ticket Automation Platform</li>
            <li>✔ Ticket Validation System</li>
        </ul>
        <p>
            This year, we've eliminated the use of Google Forms and manual processes. Everything is now fully digital and paperless — including ticket verification on the day of the event.
        </p>
        <p><strong>Your Ticket Number:</strong> <span style="color:#e62b1e;font-size:18px;">${ticketNumber}</span></p>
        <p><em>Please note: This email is for <strong>testing purposes only</strong>.</em></p>
        <br>
        <p style="font-weight:bold;">Let's make this TEDx event the best one yet!</p>
        <p>Warm regards,<br>TEDx Tech Team</p>
        <hr style="border:1px solid #ddd;">
        <p style="font-size:14px; color:#555;">
            If you have any questions or concerns, feel free to contact us at: 
            <a href="mailto:tedxdypdpu.tech.work@gmail.com" style="color:#e62b1e; text-decoration: none;">tedxdypdpu.tech.work@gmail.com</a>
        </p>
        <p style="font-size:12px; color:#888;">This is an automated message — please do not reply directly to this email.</p>
    </div>`;


        // Send email with attachment
        const mailOptions = {
            from: `"TEDx Tech Team" <${process.env.MAIL_USER}>`,
            to: email,
            subject,
            html: htmlBody,
            priority: 'high',
            attachments: [
                {
                    filename: `${ticketNumber}.png`,
                    path: ticketPath
                }
            ]
        };

        await transporter.sendMail(mailOptions);

        console.log(`✅ Mail sent to ${email} with ticket ${ticketNumber}`);
        
        // Cleanup: Delete file after sending
        const fs = require('fs');
        fs.unlink(ticketPath, (err) => {
            if (err) console.error('⚠ Failed to delete ticket image:', err);
            else console.log(`🗑 Deleted ticket file: ${ticketPath}`);
        });

    } catch (error) {
        console.error('❌ Error sending mail:', error);
    }
}

module.exports = sendMail;
