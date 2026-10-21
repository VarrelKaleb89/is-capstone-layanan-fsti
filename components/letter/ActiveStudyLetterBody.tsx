/**
 * Isi surat "SURAT KETERANGAN" (Aktif Studi) — replika template resmi
 * public/file/Surat Aktif Studi.pdf:
 * tabel pejabat WD1 (nama, NIP, pangkat, jabatan), paragraf pernyataan
 * mahasiswa aktif, tabel data mahasiswa (Nama/NIM/Prodi/Jurusan/Fakultas/
 * Strata/Angkatan/Semester), keperluan, dan tanggal.
 * Kop serta tanda tangan dirender oleh OfficialLetterView.
 */
import type { LetterRequest } from '@/lib/letter-service';

interface ActiveStudyLetterBodyProps {
  request: LetterRequest;
  letterDate: string;
}

export default function ActiveStudyLetterBody({ request, letterDate }: ActiveStudyLetterBodyProps) {
  const akt = request.aktifStudiData;
  const jurusan = akt?.jurusan || request.studyProgram;
  const angkatan = akt?.angkatan || '';
  const keperluan = request.purpose;

  return (
    <div className="space-y-4 text-justify font-serif text-gray-900">
      <p className="font-semibold">Yang bertanda tangan di bawah ini :</p>

      {/* Tabel pejabat — sesuai template halaman 1 */}
      <div className="my-3 pl-2 pr-2">
        <table className="w-full text-[13.5px]">
          <tbody>
            <tr className="align-top">
              <td className="w-44 py-1">Nama</td>
              <td className="w-4 py-1">:</td>
              <td className="py-1 font-semibold">Irma Fitria, S.Si., M.Si.</td>
            </tr>
            <tr className="align-top">
              <td className="py-1">NIP</td>
              <td className="py-1">:</td>
              <td className="py-1">199303232022032016</td>
            </tr>
            <tr className="align-top">
              <td className="py-1">Pangkat, golongan</td>
              <td className="py-1">:</td>
              <td className="py-1">Penata, III/c</td>
            </tr>
            <tr className="align-top">
              <td className="py-1">Jabatan</td>
              <td className="py-1">:</td>
              <td className="py-1">Wakil Dekan Bidang Akademik dan Kemahasiswaan</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        Menerangkan dengan sebenarnya bahwa sampai dengan semester{' '}
        <span className="font-semibold">{request.semester}</span> tahun akademik{' '}
        <span className="font-semibold">{request.academicYear}</span>, yang tersebut di bawah ini
        adalah <span className="font-semibold">mahasiswa aktif</span> mengikuti perkuliahan di
        Institut Teknologi Kalimantan (ITK) :
      </p>

      {/* Tabel data mahasiswa — sesuai template */}
      <div className="my-3 pl-2 pr-2">
        <table className="w-full text-[13.5px]">
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
              <td className="py-1">{request.studyProgram}</td>
            </tr>
            <tr className="align-top">
              <td className="py-1">Jurusan</td>
              <td className="py-1">:</td>
              <td className="py-1">{jurusan}</td>
            </tr>
            <tr className="align-top">
              <td className="py-1">Fakultas</td>
              <td className="py-1">:</td>
              <td className="py-1">Fakultas Sains dan Teknologi Informasi</td>
            </tr>
            <tr className="align-top">
              <td className="py-1">Strata</td>
              <td className="py-1">:</td>
              <td className="py-1">{request.degree || 'S1'}</td>
            </tr>
            <tr className="align-top">
              <td className="py-1">Angkatan</td>
              <td className="py-1">:</td>
              <td className="py-1">{angkatan}</td>
            </tr>
            <tr className="align-top">
              <td className="py-1">Semester</td>
              <td className="py-1">:</td>
              <td className="py-1">{request.semester}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        Demikian surat keterangan ini dibuat untuk dipergunakan sebagai keperluan{' '}
        <span className="font-semibold">untuk {keperluan}</span>.
      </p>

      {/* Tanggal kanan — sebelum tanda tangan (dirender OfficialLetterView) */}
      <p className="text-right">{letterDate}</p>
    </div>
  );
}
