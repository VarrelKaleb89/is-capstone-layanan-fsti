/**
 * Isi surat "Permohonan Kerja Praktik" — replika template resmi
 * public/file/Permohonan KP.pdf (2 halaman: individu & kelompok).
 * Kop, blok Nomor/Lampiran/Perihal, QR, dan tanda tangan dirender
 * oleh OfficialLetterView; komponen ini hanya bagian isi.
 */
import type { LetterRequest, SignatureData } from '@/lib/letter-service';
import { formatTanggalIndo } from '@/lib/kp-utils';

interface KpLetterBodyProps {
  request: LetterRequest;
  signedBy: string;
  signedNip: string;
  signedPosition: string;
  signature: SignatureData | null;
}

export default function KpLetterBody({
  request,
  signedBy,
  signedNip,
  signedPosition,
  signature,
}: KpLetterBodyProps) {
  const kp = request.kpData;
  const isKelompok = kp?.registrationType === 'kelompok';
  const jurusan = kp?.jurusan || request.studyProgram;
  const prodi = request.studyProgram;
  const mitra = kp?.mitraNama || '(Mitra KP)';
  const durasi = kp?.durasiBulan ?? 0;
  const mulai = kp?.periodeMulai ? formatTanggalIndo(kp.periodeMulai) : '(Tanggal Pelaksanaan KP)';
  const tenggat = kp?.tenggatBalasan ? formatTanggalIndo(kp.tenggatBalasan) : '(Tenggat Waktu Surat Balasan Mitra KP)';

  return (
    <div className="space-y-4 text-justify font-serif text-gray-900">
      <p>
        Salah satu program pendidikan pada Program Studi {prodi}, Jurusan {jurusan}, Fakultas Sains
        dan Teknologi Informasi (FSTI) adalah Kerja Praktik mahasiswa. Kerja Praktik tersebut
        dilakukan di suatu perusahaan atau instansi tertentu sebagai latihan pengembangan diri dengan
        mengaplikasikan ilmu yang telah dipelajari melalui perkuliahan dan meningkatkan keterampilan
        mahasiswa.
      </p>

      <p>
        Melalui surat ini, kami mengajukan permohonan untuk pelaksanaan Kerja Praktik di{' '}
        <span className="font-semibold">{mitra}</span> selama{' '}
        <span className="font-semibold">{durasi} bulan</span> terhitung mulai pada tanggal{' '}
        <span className="font-semibold">{mulai}</span>, bagi{' '}
        {isKelompok ? '2 (dua)' : '1 (satu)'} orang mahasiswa kami yang berada dalam tahap pendidikan
        sarjana, yaitu {isKelompok ? '' : ':'}
      </p>

      {isKelompok ? (
        // Tabel peserta kelompok (template halaman 2)
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
                <td className="py-1.5 px-2">{prodi}</td>
                <td className="py-1.5 px-2">{jurusan}</td>
              </tr>
              <tr>
                <td className="py-1.5 px-2">2.</td>
                <td className="py-1.5 px-2 font-semibold">{kp?.pemohon2Nama}</td>
                <td className="py-1.5 px-2">{kp?.pemohon2Nim}</td>
                <td className="py-1.5 px-2">{prodi}</td>
                <td className="py-1.5 px-2">{jurusan}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        // Tabel peserta individu (template halaman 1)
        <div className="my-3 pl-6 pr-2">
          <table className="w-full text-[13px]">
            <tbody>
              <tr className="align-top">
                <td className="w-44 py-1">Nama</td>
                <td className="w-4 py-1">:</td>
                <td className="py-1 font-semibold">{request.fullName}</td>
              </tr>
              <tr className="align-top">
                <td className="py-1">NIM</td>
                <td className="py-1">:</td>
                <td className="py-1">{request.nim}</td>
              </tr>
              <tr className="align-top">
                <td className="py-1">Program Studi</td>
                <td className="py-1">:</td>
                <td className="py-1">{prodi}</td>
              </tr>
              <tr className="align-top">
                <td className="py-1">Jurusan</td>
                <td className="py-1">:</td>
                <td className="py-1">{jurusan}</td>
              </tr>
              <tr className="align-top">
                <td className="py-1">No Hp</td>
                <td className="py-1">:</td>
                <td className="py-1">{request.whatsapp}</td>
              </tr>
              <tr className="align-top">
                <td className="py-1">Email</td>
                <td className="py-1">:</td>
                <td className="py-1">{request.email}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <p>
        Selanjutnya kami memohon konfirmasi dari Bapak/Ibu atas kesediaan menerima{' '}
        {isKelompok ? 'mahasiswa kami' : 'mahasiswa kami'} untuk melaksanakan Kerja Praktik melalui
        kontak mahasiswa yang bersangkutan paling lambat{' '}
        <span className="font-semibold">{tenggat}</span>.
        {isKelompok && (
          <>
            {' '}Adapun narahubung yang dapat dihubungi adalah Sdr.{' '}
            <span className="font-semibold">({request.fullName})</span>{' '}
            <span className="font-semibold">({request.whatsapp})</span> email{' '}
            <span className="font-semibold">({request.email})</span>.
          </>
        )}
      </p>

      <p>
        Demikian surat permohonan ini kami sampaikan, atas kerjasama dan perhatian yang diberikan
        kami sampaikan terimakasih.
      </p>
    </div>
  );
}
