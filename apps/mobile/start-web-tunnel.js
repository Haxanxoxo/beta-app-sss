const localtunnel = require('localtunnel');
const qrcode = require('qrcode-terminal');
const { spawn } = require('child_process');

(async () => {
    console.log('Starting local web server...');
    const serve = spawn('npx', ['serve', 'dist', '-l', '3000'], { stdio: 'ignore', shell: true });

    console.log('Starting tunnel...');
    try {
        const tunnel = await localtunnel({ port: 3000 });

        console.log('\n======================================================');
        console.log('SUCCESS! WEB TUNNEL CREATED.');
        console.log(`Your client URL is: ${tunnel.url}`);
        console.log('======================================================\n');

        console.log('Scan this with ANY phone camera (No Expo Go required!):');
        qrcode.generate(tunnel.url, { small: true });

        tunnel.on('close', () => {
            console.log('Tunnel closed.');
            serve.kill();
        });

    } catch (err) {
        console.error('Tunnel failed!', err);
        serve.kill();
    }
})();
