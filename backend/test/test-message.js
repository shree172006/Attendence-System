import fs from 'fs';
import whatsappWeb from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

const { Client, LocalAuth } = whatsappWeb;

const args = process.argv.slice(2);
const phone = args[0];

console.log('==============================================');
console.log(' WhatsApp Messaging Demonstration');
console.log('==============================================');

if (!phone) {
    console.log('Please provide a phone number to send the test message to.');
    console.log('Usage: node test-message.js <phone_number>');
    console.log('Example: node test-message.js 9876543210');
    process.exit(1);
}

const chromePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
];
const chrome = chromePaths.find(p => fs.existsSync(p));

if (!chrome) {
    console.error('❌ Error: Chrome or Edge browser not found on the system.');
    process.exit(1);
}

const client = new Client({
    authStrategy: new LocalAuth({ clientId: 'demo-session' }),
    puppeteer: {
        executablePath: chrome,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-accelerated-2d-canvas', '--no-first-run', '--no-zygote', '--disable-gpu']
    }
});

client.on('qr', (qr) => {
    console.log('\n📱 Please scan this QR code with your WhatsApp to link the device:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
    console.log('\n✅ WhatsApp is successfully connected and ready!');
    
    // Format the phone number (assuming India +91 if 10 digits are provided)
    let number = String(phone).replace(/\D/g, '');
    if (number.length === 10) number = `91${number}`;
    
    const targetId = `${number}@c.us`;
    const message = `🤖 *Shree Sai Classes - Demo Message*\n\nHello! This is an automated test message to demonstrate how the attendance system will notify parents.\n\n*Student:* Demo Student\n*Date:* ${new Date().toLocaleDateString()}\n*Status:* Present\n*Time:* 10:00 AM - 12:00 PM\n\n_This message was sent automatically by the system._`;
    
    console.log(`\n⏳ Waiting 3 seconds for WhatsApp Web UI to stabilize...`);
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log(`\n📨 Sending automated demo message to: ${number}`);
    
    try {
        await client.sendMessage(targetId, message);
        console.log('✅ Message sent successfully!');
    } catch (err) {
        console.error('❌ Failed to send message:', err.message);
    }
    
    console.log('\nTest completed. Exiting in 5 seconds...');
    setTimeout(() => {
        client.destroy();
        process.exit(0);
    }, 5000);
});

client.on('auth_failure', (msg) => {
    console.error('\n❌ Authentication failed:', msg);
});

console.log('\nInitializing WhatsApp client (this may take a few seconds)...');
client.initialize();
