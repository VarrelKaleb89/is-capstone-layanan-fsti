const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app', 'peraturan-kebijakan', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const correctImages = {
    'akademik': 'https://picsum.photos/seed/akademik/800/600',
    'kemahasiswaan': 'https://picsum.photos/seed/kemahasiswaan/800/600',
    'biayaPendidikan': 'https://picsum.photos/seed/biaya/800/600',
    'tugasAkhir': '/images/docs/tugas-akhir.jpg',
    'magang': '/images/docs/magang.jpg',
    'kerjaPraktik': '/images/docs/kerja-praktik.jpg',
    'mbkm': 'https://picsum.photos/seed/mbkm/800/600',
    'tataKehidupan': 'https://picsum.photos/seed/tatakehidupan/800/600',
    'kalenderAkademik': 'https://picsum.photos/seed/kalender/800/600',
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
let currentTopLevelId = null;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // match "    id: 'akademik'," specifically (4 spaces)
    const idMatch = line.match(/^    id:\s*['"]([^'"]+)['"],/);
    if (idMatch) {
        currentTopLevelId = idMatch[1];
    }

    if (line.includes('coverImage:') && currentTopLevelId && correctImages[currentTopLevelId]) {
        lines[i] = `    coverImage: '${correctImages[currentTopLevelId]}',`;
        // Consume the top level ID so we don't accidentally replace anything else
        currentTopLevelId = null;
    }
}

fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
console.log('Fixed correctly mapped URLs');
