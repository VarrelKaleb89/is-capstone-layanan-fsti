const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app', 'peraturan-kebijakan', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

let seed = 1;
content = content.replace(/https:\/\/images\.unsplash\.com\/photo-[^?]+\?w=800&h=600&fit=crop/g, (match) => {
    return `https://loremflickr.com/800/600/education,campus?random=${seed++}`;
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated image URLs to loremflickr!');
