/**
 * Dashboard Rekap Layanan Surat Mahasiswa FSTI
 *
 * Script ini HANYA MEMBACA data (getValues). Tidak ada satu pun fungsi yang
 * menulis, mengubah, memformat, atau menghapus isi spreadsheet.
 *
 * Pemasangan: Extensions > Apps Script > tambah file script "Dashboard"
 * (isi file ini) dan file HTML "Dashboard" (isi Dashboard.html), simpan,
 * lalu muat ulang spreadsheet. Menu "Dashboard" muncul di samping "Help".
 */

var DASHBOARD_PASSWORD = 'password123';

// Sheet yang bukan data permohonan
var DASHBOARD_EXCLUDED_SHEETS = ['TOTAL'];

// Kolom yang dipakai untuk rincian jenis permohonan (dicocokkan dari awal judul kolom)
var DASHBOARD_SUBTYPE_HEADERS = [
  'jenis surat',
  'pilih jenis dokumen',
  'jenis rekomendasi',
  'keperluan legalisasi',
  'jenis dokumen'
];

var DASHBOARD_STATUSES = ['done', 'progress', 'waiting', 'rejected', 'duplicate', 'none'];

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Dashboard')
    .addItem('Buka Dashboard', 'openDashboard')
    .addToUi();
}

function openDashboard() {
  var html = HtmlService.createHtmlOutputFromFile('Dashboard')
    .setWidth(1280)
    .setHeight(820);
  SpreadsheetApp.getUi().showModalDialog(html, 'Dashboard Layanan Surat Mahasiswa');
}

/**
 * Dipanggil dari dialog. Data hanya dikirim jika password benar.
 */
function getDashboardData(password) {
  if (String(password) !== DASHBOARD_PASSWORD) {
    return { ok: false };
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var services = [];
  var prodis = [];
  var prodiIndex = {};
  var records = [];
  var queue = [];

  ss.getSheets().forEach(function (sheet) {
    var sheetName = sheet.getName();
    if (DASHBOARD_EXCLUDED_SHEETS.indexOf(sheetName.trim()) !== -1 || sheet.isSheetHidden()) return;

    var values = sheet.getDataRange().getValues();
    if (values.length < 2) return;

    var headers = values[0].map(function (h) {
      return String(h).replace(/\s+/g, ' ').trim().toLowerCase();
    });

    var col = {
      status: findColumn_(headers, function (h) {
        return h.indexOf('status persetujuan') === 0 || h.indexOf('progress layanan') === 0;
      }),
      nim: findColumns_(headers, function (h) {
        return /^nim\b/.test(h) || h.indexOf('(nim)') !== -1;
      }),
      name: findColumns_(headers, function (h) {
        return /^nama( lengkap| pemohon| mahasiswa)?\b/.test(h) && !/mitra|instansi|dosen|kegiatan/.test(h);
      }),
      email: findColumn_(headers, function (h) {
        return h === 'email address' || h === 'email';
      }),
      prodi: findColumn_(headers, function (h) {
        return h === 'program studi' || h === 'prodi';
      }),
      subtype: findColumn_(headers, function (h) {
        return DASHBOARD_SUBTYPE_HEADERS.some(function (p) { return h.indexOf(p) === 0; });
      })
    };

    var service = {
      name: sheetName.trim(),
      hasStatus: col.status !== -1,
      subtypeLabel: col.subtype !== -1 ? String(values[0][col.subtype]).replace(/\s+/g, ' ').trim() : '',
      subtypes: []
    };
    var serviceIdx = services.length;
    var subtypeIndex = {};

    for (var r = 1; r < values.length; r++) {
      var row = values[r];
      var ts = row[0];
      var hasDate = ts instanceof Date && !isNaN(ts.getTime());
      var nim = firstFilled_(row, col.nim).replace(/\.0$/, '');
      var name = firstFilled_(row, col.name);
      if (!nim && col.email !== -1) {
        var emailMatch = String(row[col.email]).trim().match(/^(\d{6,})@student\.itk\.ac\.id$/i);
        if (emailMatch) nim = emailMatch[1];
      }
      if (!hasDate && !nim && !name) continue;

      var prodi = normalizeProdi_(col.prodi !== -1 ? row[col.prodi] : '');
      if (!(prodi in prodiIndex)) {
        prodiIndex[prodi] = prodis.length;
        prodis.push(prodi);
      }

      var rawStatus = col.status !== -1 ? String(row[col.status]).trim() : '';
      var status = normalizeStatus_(rawStatus, service.hasStatus);

      var subtypeIdx = -1;
      if (col.subtype !== -1) {
        var sub = String(row[col.subtype]).replace(/\s+/g, ' ').trim();
        if (sub) {
          var key = sub.toLowerCase();
          if (!(key in subtypeIndex)) {
            subtypeIndex[key] = service.subtypes.length;
            service.subtypes.push(sub);
          }
          subtypeIdx = subtypeIndex[key];
        }
      }

      var dateMs = hasDate ? ts.getTime() : null;
      records.push([serviceIdx, dateMs, prodiIndex[prodi], DASHBOARD_STATUSES.indexOf(status), subtypeIdx]);

      if (status === 'progress' || status === 'waiting') {
        queue.push({
          s: serviceIdx,
          d: dateMs,
          p: prodiIndex[prodi],
          st: DASHBOARD_STATUSES.indexOf(status),
          name: name.split('/')[0].trim(),
          nim: nim,
          raw: rawStatus,
          row: r + 1
        });
      }
    }

    services.push(service);
  });

  return {
    ok: true,
    generatedAt: new Date().getTime(),
    spreadsheetName: ss.getName(),
    statuses: DASHBOARD_STATUSES,
    services: services,
    prodis: prodis,
    records: records,
    queue: queue
  };
}

function findColumn_(headers, test) {
  for (var i = 0; i < headers.length; i++) {
    if (headers[i] && test(headers[i])) return i;
  }
  return -1;
}

function findColumns_(headers, test) {
  var result = [];
  for (var i = 0; i < headers.length; i++) {
    if (headers[i] && test(headers[i])) result.push(i);
  }
  return result;
}

function firstFilled_(row, cols) {
  for (var i = 0; i < cols.length; i++) {
    var v = String(row[cols[i]]).trim();
    if (v) return v;
  }
  return '';
}

function normalizeProdi_(value) {
  var s = String(value).replace(/\s+/g, ' ').trim();
  if (!s) return 'Tidak diisi';
  if (s.toLowerCase() === 'aktuaria') return 'Ilmu Aktuaria';
  return s;
}

function normalizeStatus_(value, hasStatusColumn) {
  if (!hasStatusColumn) return 'none';
  var s = String(value).trim().toLowerCase();
  if (!s) return 'waiting';
  if (s === 'done' || s.indexOf('selesai') !== -1) return 'done';
  if (s.indexOf('tidak') !== -1 || s.indexOf('tolak') !== -1) return 'rejected';
  if (s.indexOf('double') !== -1 || s.indexOf('duplikat') !== -1 || s.indexOf('ganda') !== -1) return 'duplicate';
  return 'progress'; // PROSES, SAVE, dan status lain yang belum final
}
