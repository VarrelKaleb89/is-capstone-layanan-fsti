import SpreadsheetTrackingPage from '@/components/tracking/SpreadsheetTrackingPage';

export default function DosenTrackingPage() {
  return (
    <SpreadsheetTrackingPage
      spreadsheetId="1ROQyqEn-CxBN6KTKZ6Yrt1iOU1YkmKIY5XhYZ1v_3-A"
      i18nPrefix="lecturerTracking"
      sheetTitle={{ id: 'Tracking Surat Tugas & Pengesahan Dekan — FSTI', en: 'Assignment Letter & Dean Approval Tracking — FSTI' }}
      searchHint={{
        id: 'Klik tabel, lalu tekan Ctrl+F (Cmd+F di Mac) dan ketik nama atau NIP Anda.',
        en: 'Click the table, then press Ctrl+F (Cmd+F on Mac) and type your name or NIP.',
      }}
    />
  );
}
