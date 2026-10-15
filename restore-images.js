const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app', 'peraturan-kebijakan', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// We need to restore `coverImage: '/images/docs/xxx.jpg'`
const imageMap = {
    'akademik': '/images/docs/akademik.jpg',
    'kemahasiswaan': '/images/docs/kemahasiswaan.jpg',
    'biayaPendidikan': '/images/docs/biaya-pendidikan.jpg',
    'tugasAkhir': '/images/docs/tugas-akhir.jpg',
    'magang': '/images/docs/magang.jpg',
    'kerjaPraktik': '/images/docs/kerja-praktik.jpg',
    'mbkm': '/images/docs/mbkm.jpg',
    'tataKehidupan': '/images/docs/tata-kehidupan.jpg',
    'kalenderAkademik': '/images/docs/kalender-akademik.jpg',
    'pembelajaranDiluarProdi': '/images/docs/pembelajaran-diluar-prodi.jpg',
    'magangRiset': '/images/docs/magang-riset.jpg',
    'kknTematik': '/images/docs/kkn-tematik.jpg',
    'pertukaranMahasiswa': '/images/docs/pertukaran-mahasiswa.jpg',
    'kewirausahaan': '/images/docs/kewirausahaan.jpg',
    'magangKeprofesian': '/images/docs/magang-keprofesian.jpg',
    'proyekKemanusiaan': '/images/docs/proyek-kemanusiaan.jpg',
    'studiProyekIndependen': '/images/docs/studi-proyek-independen.jpg'
};

const lines = content.split('\n');
let currentId = null;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const idMatch = line.match(/id:\s*['"]([^'"]+)['"]/);
    if (idMatch) {
        currentId = idMatch[1];
    }

    if (line.includes('coverImage:') && currentId && imageMap[currentId]) {
        const replacement = `    coverImage: '${imageMap[currentId]}',`;
        lines[i] = line.replace(/coverImage:\s*['"][^'"]+['"],?/, replacement.trim());
    }
}

content = lines.join('\n');
fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully restored local image URLs in app/peraturan-kebijakan/page.tsx');
