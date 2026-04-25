const fs = require('fs');
const path = require('path');

const slidesDir = path.join(__dirname, 'temp_pptx_extract', 'unzipped', 'ppt', 'slides');

// Get all slide files
const files = fs.readdirSync(slidesDir).filter(f => f.startsWith('slide') && f.endsWith('.xml'));

// Sort by slide number
files.sort((a, b) => {
    const numA = parseInt(a.replace('slide', '').replace('.xml', ''));
    const numB = parseInt(b.replace('slide', '').replace('.xml', ''));
    return numA - numB;
});

let output = '';

for (const file of files) {
    const filePath = path.join(slidesDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Extract text from <a:t> tags
    const regex = /<a:t>(.*?)<\/a:t>/g;
    let match;
    let slideText = [];
    while ((match = regex.exec(content)) !== null) {
        slideText.push(match[1]);
    }
    
    if (slideText.length > 0) {
        output += `\n--- Slide ${file.replace('slide', '').replace('.xml', '')} ---\n`;
        output += slideText.join('\n') + '\n';
    }
}

fs.writeFileSync(path.join(__dirname, 'temp_pptx_extract', 'extracted_text.txt'), output);
console.log('Text extracted to extracted_text.txt');
