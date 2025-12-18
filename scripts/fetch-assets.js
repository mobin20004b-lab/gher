const fs = require('fs');
const https = require('https');
const path = require('path');

const fontsDir = path.join(__dirname, '../public/assets/fonts');

if (!fs.existsSync(fontsDir)){
    fs.mkdirSync(fontsDir, { recursive: true });
}

const fonts = [
    {
        name: 'Vazirmatn-Regular.woff2',
        url: 'https://raw.githubusercontent.com/rastikerdar/vazirmatn/master/fonts/webfonts/Vazirmatn-Regular.woff2'
    },
    {
        name: 'Vazirmatn-Bold.woff2',
        url: 'https://raw.githubusercontent.com/rastikerdar/vazirmatn/master/fonts/webfonts/Vazirmatn-Bold.woff2'
    }
];

fonts.forEach(font => {
    const file = fs.createWriteStream(path.join(fontsDir, font.name));
    https.get(font.url, function(response) {
        if (response.statusCode !== 200) {
            console.error(`Failed to download ${font.name}: status code ${response.statusCode}`);
            return;
        }
        response.pipe(file);
        file.on('finish', function() {
            file.close(() => {
                console.log(`Downloaded ${font.name}`);
            });
        });
    }).on('error', function(err) { // Handle errors
        fs.unlink(path.join(fontsDir, font.name), () => {}); // Delete the file async. (But we don't check the result)
        console.error(`Error downloading ${font.name}: ${err.message}`);
    });
});
