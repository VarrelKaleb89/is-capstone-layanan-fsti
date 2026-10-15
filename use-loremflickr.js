const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app', 'peraturan-kebijakan', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// We have 17 items, let's map them to 17 loremflickr keywords instead of unsplash
const imageMap = {
    'akademik': 'education,university,classroom',
    'kemahasiswaan': 'students,campus,group',
    'biaya-pendidikan': 'finance,money,calculator',
    'tugas-akhir': 'thesis,graduation,library',
    'magang': 'office,work,business',
    'kerja-praktik': 'internship,training,computer',
    'mbkm': 'learning,innovation,study',
    'tata-kehidupan': 'ethics,rules,document',
    'kalender-akademik': 'calendar,schedule,planner',
    'pembelajaran-diluar-prodi': 'explore,outdoor,workshop',
    'magang-riset': 'research,laboratory,microscope',
    'kkn-tematik': 'community,village,social',
    'pertukaran-mahasiswa': 'travel,airport,international',
    'kewirausahaan': 'entrepreneur,startup,meeting',
    'magang-keprofesian': 'professional,career,suit',
    'proyek-kemanusiaan': 'volunteer,help,humanity',
    'studi-proyek-independen': 'project,laptop,coding'
};

// First, find and replace the block of 17 documents in page.tsx
// This is tricky because we replaced the original /images/docs/xxx.jpg with unsplash URLs earlier
// But wait, we can just replace the unsplash URLs one by one based on index, or just use regex to replace all unsplash URLs with a loremflickr sequence.
// Actually, earlier we replaced them, so let's match the unsplash URLs and replace them.
// Let's just find the `coverImage: 'https://images.unsplash.com...'` and replace it with loremflickr.

const lines = content.split('\n');
let currentId = null;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Try to find the id like: id: 'akademik',
    const idMatch = line.match(/id:\s*['"]([^'"]+)['"]/);
    if (idMatch) {
        currentId = idMatch[1];
    }

    // Try to find coverImage
    if (line.includes('coverImage:') && currentId && imageMap[currentId]) {
        const keyword = imageMap[currentId];
        // Random parameter `lock` or just sequence to prevent browser caching the same image for different cards if keywords overlap
        const replacement = `coverImage: 'https://loremflickr.com/800/600/${keyword}?random=${currentId}',`;
        lines[i] = line.replace(/coverImage:\s*['"][^'"]+['"],?/, replacement);
    }
}

content = lines.join('\n');
fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated image URLs to loremflickr in app/peraturan-kebijakan/page.tsx');
