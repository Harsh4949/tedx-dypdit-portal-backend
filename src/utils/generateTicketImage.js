const { createCanvas, loadImage,registerFont } = require('canvas');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

try {
// Register Montserrat
registerFont(path.join(__dirname, '../assets/Montserrat-Regular.ttf'), {
    family: 'Montserrat'
});
registerFont(path.join(__dirname, '../assets/Montserrat-Bold.ttf'), {
    family: 'Montserrat',
    weight: 'bold'
});
} catch (error) {
    console.error('❌ Error registering fonts:', error);
}

function drawSpacedText(ctx, text, x, y, spacing) {
    const chars = text.split('');
    const totalWidth = chars.reduce((acc, char) => acc + ctx.measureText(char).width + spacing, -spacing);
    let currentX = x - totalWidth / 2;

    for (const char of chars) {
        ctx.fillText(char, currentX, y);
        currentX += ctx.measureText(char).width + spacing;
    }
}


async function generateTicketImage(ticketNumber, name, role) {
    try {
        const width = 1080;
        const height = 1350;

        const templatePath = path.join(__dirname, '../assets/DYPDPU.png');
        const template = await loadImage(templatePath);

        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        // Draw the background/template
        ctx.drawImage(template, 0, 0, width, height);

        // === TEXT: Ticket Number ===
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 60px Montserrat';
        ctx.textAlign = 'center';
        ctx.fillText(ticketNumber, width / 2, 400);

       // === QR CODE ===
        const qrDataURL = await QRCode.toDataURL(ticketNumber, {
            scale: 20,
            margin: 0,
            color: {
                dark: '#000000',
                light: '#00000000' // Transparent
            }
        });

        const qrImg = await loadImage(qrDataURL);
        const qrSize = 450;
        const qrX = (width - qrSize) / 2;
        const qrY = 480;

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);


        // === TEXT: Name ===
        ctx.fillStyle = '#ef2200'; // Red
        ctx.font = 'extrabold 50px Montserrat';
        drawSpacedText(ctx, name.toUpperCase(), (width / 2) + 10, qrY + qrSize + 120, 5); // `5` is spacing in px

        // === TEXT: Role ===
        ctx.fillStyle = '#FFFFFF'; // White
        ctx.font = ' 35px Montserrat';
        drawSpacedText(ctx, role.toUpperCase(), width / 2, qrY + qrSize + 180, 5); // `5` is spacing in px

        // === SAVE ===
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
