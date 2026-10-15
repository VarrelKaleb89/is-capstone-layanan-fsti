const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app', 'peraturan-kebijakan', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// The new files array has IDs like pembelajaranDiluarProdi, magangRiset etc.
// But some of them don't have images in the docs folder yet. Since the user wants local images and "if empty use animated 3D",
// we should just use the exact local paths (/images/docs/xxx.jpg) so that if they 404 locally, the animated CSS kicks in.
// We will replace ANY loremflickr url with the ID format.

const lines = content.split('\n');
let currentId = null;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const idMatch = line.match(/id:\s*['"]([^'"]+)['"]/);
    if (idMatch) {
        currentId = idMatch[1];
    }

    if (line.includes('coverImage: \'https://loremflickr') && currentId) {
        // Generate the filename based on the ID (camelCase to kebab-case)
        const kebabId = currentId.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
        const replacement = `    coverImage: '/images/docs/${kebabId}.jpg',`;
        lines[i] = line.replace(/coverImage:\s*['"][^'"]+['"],?/, replacement.trim());
    }
}

content = lines.join('\n');
fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully replaced remaining LoremFlickr URLs with local image paths.');
