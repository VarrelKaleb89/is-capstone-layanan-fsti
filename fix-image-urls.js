const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app', 'peraturan-kebijakan', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const imageMap = {
    '/images/docs/akademik.jpg': '1523050854058-8df90110c9f1',
    '/images/docs/kemahasiswaan.jpg': '1523240795612-9a054b0db644',
    '/images/docs/biaya-pendidikan.jpg': '1554224155-8d04cb21cd6c',
    '/images/docs/tugas-akhir.jpg': '1434030216411-0b793f4b4173',
    '/images/docs/magang.jpg': '1521791136064-7986c2920216',
    '/images/docs/kerja-praktik.jpg': '1581091226825-a6a2a5aee158',
    '/images/docs/mbkm.jpg': '1532094349884-543bc11b234d',
    '/images/docs/tata-kehidupan.jpg': '1541339907-12a1f1fa68bc',
    '/images/docs/kalender-akademik.jpg': '1506784365847-bbad939e9335',
    '/images/docs/pembelajaran-diluar-prodi.jpg': '1497633762465-927073281fa4',
    '/images/docs/magang-riset.jpg': '1532085998198-e4b7e4526274',
    '/images/docs/kkn-tematik.jpg': '1593113565632-136152bc2355',
    '/images/docs/pertukaran-mahasiswa.jpg': '1529390079861-591de354faf5',
    '/images/docs/kewirausahaan.jpg': '1486406146926-c627a92ad1ab',
    '/images/docs/magang-keprofesian.jpg': '1556761175-5973dd0f32d7',
    '/images/docs/proyek-kemanusiaan.jpg': '1469571486292-0ba58a3f068b',
    '/images/docs/studi-proyek-independen.jpg': '1503694978374-8a159f81a179'
};

for (const [localPath, unsplashId] of Object.entries(imageMap)) {
    const replacementUrl = `https://images.unsplash.com/photo-${unsplashId}?w=800&h=600&fit=crop`;
    content = content.replace(
        new RegExp(`coverImage:\\s*['"]${localPath}['"]`, 'g'),
        `coverImage: '${replacementUrl}'`
    );
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated image URLs in app/peraturan-kebijakan/page.tsx');
