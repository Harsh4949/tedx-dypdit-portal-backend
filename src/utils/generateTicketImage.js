const { createCanvas, loadImage } = require('canvas');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

async function generateTicketImage(ticketNumber, name, role) {
    try {
        const width = 1080;
        const height = 1350;

        // Path to your layout template (second image)
        const templatePath = path.join(__dirname, '../assets/DYPDPU.png');
        const template = await loadImage(templatePath);

        // Create canvas
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        // Draw template
        ctx.drawImage(template, 0, 0, width, height);

        // Ticket Number
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 70px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(ticketNumber, width / 2, 250);

        // QR Code
        const qrDataURL = await QRCode.toDataURL(ticketNumber, { width: 300 });
        const qrImg = await loadImage(qrDataURL);
        ctx.drawImage(qrImg, width / 2 - 150, 400, 300, 300);

        // Name
        ctx.fillStyle = '#FF0000';
        ctx.font = 'bold 60px Arial';
        ctx.fillText(name.toUpperCase(), width / 2, 800);

        // Role / Type
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '40px Arial';
        ctx.fillText(role.toUpperCase(), width / 2, 870);

        // Save ticket image
        const outPath = path.join(__dirname, `../tickets/${ticketNumber}.png`);
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(outPath, buffer);

        return outPath;
    } catch (error) {
        console.error('❌ Error generating ticket:', error);
        throw error;
    }
}

module.exports = generateTicketImage;
