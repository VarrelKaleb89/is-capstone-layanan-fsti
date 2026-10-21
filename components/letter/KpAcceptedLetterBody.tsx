/**
 * Isi surat "Surat Pengantar Kerja Praktik" — fase SETELAH diterima mitra.
 * Replika template resmi public/file/Template Diterima KP.pdf:
 * referensi nomor & tanggal surat balasan mitra, tabel peserta, durasi bulan,
 * rentang periode, dan tanda tangan WD1 (kop & ttd dirender OfficialLetterView).
 */
import type { LetterRequest } from '@/lib/letter-service';
import { formatTanggalIndo, formatRentangBulanIndo } from '@/lib/kp-utils';

interface KpAcceptedLetterBodyProps {
  request: LetterRequest;
}

const ANGKA_BULAN = [
  '0', '1 (satu)', '2 (dua)', '3 (tiga)', '4 (empat)', '5 (lima)',
  '6 (enam)', '7 (tujuh)', '8 (delapan)', '9 (sembilan)', '10 (sepuluh)',
  '11 (sebelas)', '12 (dua belas)',
];

export default function KpAcceptedLetterBody({ request }: KpAcceptedLetterBodyProps) {
  const kp = request.kpDataAccepted;
  const isKelompok = Boolean(kp?.pemohon2Nama && kp?.pemohon2Nim);
  const jumlahPeserta = isKelompok ? 2 : 1;
  const durasi = kp?.durasiBulan ?? 0;
  const durasiKata = ANGKA_BULAN[durasi] ?? `${durasi}`;
  const rentang = kp ? formatRentangBulanIndo(kp.periodeMulai, kp.periodeSelesai) : '';
  const nomorBalasan = kp?.suratBalasanNomor || '(Nomor Surat Balasan Mitra KP)';
  const tanggalBalasan = kp?.suratBalasanTanggal
    ? formatTanggalIndo(kp.suratBalasanTanggal)
    : '(Tanggal Surat Balasan Mitra KP)';

  return (
    <div className="space-y-4 text-justify font-serif text-gray-900">
      <p>
        Sehubungan dengan surat saudara No: <span className="font-semibold">{nomorBalasan}</span>{' '}
        tertanggal <span className="font-semibold">{tanggalBalasan}</span> perihal dalam pokok
        surat, dengan ini kami sampaikan terima kasih atas kesempatan kerja praktik yang diberikan
        kepada {jumlahPeserta === 2 ? '2 (dua)' : '1 (satu)'} orang mahasiswa kami, yaitu :
      </p>

      <div className="my-3 pl-2 pr-2">
        <table className="w-full text-[13px] border-collapse">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="py-1.5 px-2 text-left w-10">No.</th>
              <th className="py-1.5 px-2 text-left">Nama</th>
              <th className="py-1.5 px-2 text-left">NIM</th>
              <th className="py-1.5 px-2 text-left">Program Studi</th>
              <th className="py-1.5 px-2 text-left">Jurusan</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-300">
              <td className="py-1.5 px-2">1.</td>
              <td className="py-1.5 px-2 font-semibold">{request.fullName}</td>
              <td className="py-1.5 px-2">{request.nim}</td>
              <td className="py-1.5 px-2">{request.studyProgram}</td>
              <td className="py-1.5 px-2" rowSpan={isKelompok ? 2 : 1}>{request.studyProgram}</td>
            </tr>
            {isKelompok && (
              <tr className="border-b border-gray-300">
                <td className="py-1.5 px-2">2.</td>
                <td className="py-1.5 px-2 font-semibold">{kp?.pemohon2Nama}</td>
                <td className="py-1.5 px-2">{kp?.pemohon2Nim}</td>
                <td className="py-1.5 px-2">{request.studyProgram}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p>
        yang akan melakukan Kerja Praktik di <span className="font-semibold">{kp?.mitraNama || '(Mitra KP)'}</span>{' '}
        selama {durasiKata} bulan terhitung mulai bulan <span className="font-semibold">{rentang}</span>.
      </p>

      <p>
        Dengan ini pula kami mohon Saudara untuk memberikan bimbingan seperlunya, sehingga tujuan
        dari kerja praktek ini dapat tercapai dengan sebaik-baiknya.
      </p>

      <p>Atas perhatian dan kerjasama yang diberikan kami sampaikan terima kasih.</p>
    </div>
  );
}
