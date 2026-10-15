const fs = require('fs');
const https = require('https');
const path = require('path');

const dir = path.join(__dirname, 'public', 'images', 'docs');
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

// Relevant Unsplash photo IDs (education, campus, money, docs etc.)
const images = {
    'akademik.jpg': '1523050854058-8df90110c9f1',
    'kemahasiswaan.jpg': '1523240795612-9a054b0db644',
    'biaya-pendidikan.jpg': '1554224155-8d04cb21cd6c',
    'tugas-akhir.jpg': '1434030216411-0b793f4b4173',
    'magang.jpg': '1521791136064-7986c2920216',
    'kerja-praktik.jpg': '1581091226825-a6a2a5aee158',
    'mbkm.jpg': '1532094349884-543bc11b234d',
    'tata-kehidupan.jpg': '1541339907-12a1f1fa68bc',
    'kalender-akademik.jpg': '1506784365847-bbad939e9335',
    'pembelajaran-diluar-prodi.jpg': '1497633762465-927073281fa4',
    'magang-riset.jpg': '1532085998198-e4b7e4526274',
    'kkn-tematik.jpg': '1593113565632-136152bc2355',
    'pertukaran-mahasiswa.jpg': '1529390079861-591de354faf5',
    'kewirausahaan.jpg': '1486406146926-c627a92ad1ab',
    'magang-keprofesian.jpg': '1556761175-5973dd0f32d7',
    'proyek-kemanusiaan.jpg': '1469571486292-0ba58a3f068b',
    'studi-proyek-independen.jpg': '1503694978374-8a159f81a179'
};

const download = (filename, id) => {
    return new Promise((resolve, reject) => {
        const url = `https://images.unsplash.com/photo-${id}?w=800&h=600&fit=crop`;
        const dest = path.join(dir, filename);
        const file = fs.createWriteStream(dest);

        https.get(url, (response) => {
            // Handle redirects if any (Unsplash usually redirects source URLs, though specific IDs might not)
            if (response.statusCode === 302 || response.statusCode === 301 || response.statusCode === 308) {
                https.get(response.headers.location, (res) => {
                    res.pipe(file);
                    file.on('finish', () => { file.close(resolve); });
                });
            } else {
                response.pipe(file);
                file.on('finish', () => { file.close(resolve); });
            }
        }).on('error', (err) => {
            fs.unlink(dest, () => reject(err));
        });
    });
};

async function main() {
    console.log('Downloading images from Unsplash...');
    for (const [filename, id] of Object.entries(images)) {
        console.log(`Downloading ${filename}...`);
        try {
            await download(filename, id);
        } catch (e) {
            console.error(`Failed to download: ${filename}`, e);
        }
    }
    console.log('Successfully completed downloading 17 images!');
}
main();
