/**
 * GAME TUYỂN SINH – KHOA CNTT, ĐẠI HỌC LẠC HỒNG
 * ------------------------------------------------------------
 * Ghi mọi lượt chơi của mọi sự kiện vào 1 Google Sheet tổng (SHEET_ID bên dưới).
 * Game vẫn tự lưu file Excel trên máy, Google Sheet là bản tổng hợp online.
 *
 * Google Sheet tổng gồm đúng 4 trang:
 *   1. "Sự kiện"                   – sự kiện tạo trên web (tự thêm dòng)
 *   2. "Trò chơi 1 – Trắc nghiệm"  – thông tin + kết quả trò chơi 1
 *   3. "Trò chơi 2 – Săn kỹ năng"  – thông tin + kết quả trò chơi 2
 *   4. "Tổng hợp"                  – họ tên, SĐT, lớp, trò chơi, STT bên bảng trò chơi, đúng/chưa đúng ý
 */

const SHEET_ID = '1B3dj4QjDAB4VmMwcyPoZTuVuG2Mu_w7KRx4xJQCv8uk';   // Google Sheet tổng
const STRUCT_VERSION = 'v4';

const SH_EVENTS = 'Sự kiện';
const SH_GAME1 = 'Trò chơi 1 – Trắc nghiệm';
const SH_GAME2 = 'Trò chơi 2 – Săn kỹ năng';
const SH_SUM = 'Tổng hợp';

const H_EVENTS = ['STT', 'Tên sự kiện', 'Trường', 'Địa điểm', 'Ngày', 'Cán bộ phụ trách', 'Ghi chú'];
const H_GAME1 = ['STT', 'Thời gian', 'Sự kiện', 'Trường', 'Họ và tên', 'Số điện thoại', 'Lớp', 'Số câu',
  'Ngành gợi ý', 'Độ phù hợp', 'Ngành thứ 2', 'Điểm 5 ngành', 'Kết quả', 'Ngành quan tâm', 'Mã lượt chơi'];
const H_GAME2 = ['STT', 'Thời gian', 'Sự kiện', 'Trường', 'Họ và tên', 'Số điện thoại', 'Lớp', 'Điểm game',
  'Combo cao nhất', 'Ngành gợi ý', 'Độ phù hợp', 'Ngành thứ 2', 'Kỹ năng đã hứng / xuất hiện', 'Kết quả', 'Ngành quan tâm', 'Mã lượt chơi'];
const H_SUM = ['STT', 'Thời gian', 'Sự kiện', 'Họ và tên', 'Số điện thoại', 'Lớp', 'Trò chơi',
  'STT bên bảng trò chơi', 'Kết quả'];

const W_EVENTS = [50, 240, 200, 200, 100, 170, 200];
const W_GAME1 = [50, 140, 200, 170, 180, 115, 100, 70, 190, 90, 190, 300, 120, 180, 110];
const W_GAME2 = [50, 140, 200, 170, 180, 115, 100, 80, 100, 190, 90, 190, 300, 120, 180, 110];
const W_SUM = [50, 140, 200, 180, 115, 100, 190, 150, 120];

const RESULT_COLORS = { 'Đúng ý': '#D4EDDA', 'Chưa đúng ý': '#FFF3CD', 'Không đánh giá': '#E8EDF3' };

/** (Không bắt buộc) Chạy tay để dựng lại 4 trang tính. Bình thường lần ghi đầu tiên sẽ tự làm việc này. */
function setup() {
  PropertiesService.getScriptProperties().deleteProperty('struct');
  ensureStructure_();
  Logger.log('Xong! ' + ss_().getUrl());
}

/** Mở link Web App → hiện game. */
function doGet(e) {
  if (e && e.parameter && e.parameter.ping) return json_({ ok: true, name: ss_().getName() });
  try {
    return HtmlService.createHtmlOutputFromFile('Index')
      .setTitle('Bạn hợp ngành nào? – Khoa CNTT · ĐH Lạc Hồng')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  } catch (err) {                       // dự án chỉ dùng làm cổng ghi dữ liệu (không có file Index)
    return json_({ ok: true, name: ss_().getName(), note: 'API game tuyển sinh Khoa CNTT đang chạy' });
  }
}

/** Bản HTML mở trên máy (local) gửi dữ liệu về đây. */
function doPost(e) {
  let p;
  try { p = JSON.parse(e.postData.contents); }
  catch (err) { return json_({ ok: false, error: 'Dữ liệu gửi lên không hợp lệ' }); }
  return json_(api(p));
}

/** Cổng chung cho cả bản local (doPost) và bản link Web App (google.script.run). */
function api(p) {
  const action = p && p.action;
  if (action === 'ping') return { ok: true, name: ss_().getName(), url: ss_().getUrl() };
  if (action === 'events') return listEvents_();
  if (['submit', 'createEvent', 'batch'].indexOf(action) < 0) return { ok: false, error: 'Hành động không hợp lệ' };

  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(28000);
    ensureStructure_();
    if (action === 'createEvent') return createEvent_(p.event || {});
    if (action === 'submit') return submit_(p.record || {});
    (p.events || []).forEach(function (ev) { createEvent_(ev); });
    (p.records || []).forEach(function (r) { submit_(r); });
    return { ok: true, events: (p.events || []).length, records: (p.records || []).length };
  } catch (err) {
    return { ok: false, error: String(err && err.message || err) };
  } finally {
    try { lock.releaseLock(); } catch (e) {}
  }
}

/** Sự kiện tạo trên web → thêm 1 dòng vào trang "Sự kiện" (nếu chưa có). */
function createEvent_(ev) {
  const sh = sheet_(SH_EVENTS, H_EVENTS, W_EVENTS);
  const n = sh.getLastRow() - 1;
  const date = ev.date ? ev.date.split('-').reverse().join('/') : '';
  const rows = n > 0 ? sh.getRange(2, 2, n, 4).getDisplayValues() : [];
  if (!rows.some(function (r) { return r[0] === ev.name && r[1] === ev.school && r[3] === date; })) {
    sh.appendRow([n + 1, ev.name || '', ev.school || '', ev.address || '', date, ev.staff || '', '']);
  }
  return { ok: true };
}

/** Đọc danh sách sự kiện bạn tự điền ở trang "Sự kiện". */
function listEvents_() {
  const ss = ss_();
  const sh = sheet_(SH_EVENTS, H_EVENTS, W_EVENTS);
  const n = sh.getLastRow() - 1;
  const tz = ss.getSpreadsheetTimeZone();
  const rows = n > 0 ? sh.getRange(2, 1, n, H_EVENTS.length).getValues() : [];
  const events = rows
    .filter(function (r) { return String(r[1]).trim() || String(r[2]).trim(); })
    .map(function (r) {
      return {
        stt: String(r[0]), name: String(r[1]).trim() || String(r[2]).trim(), school: String(r[2]).trim(),
        address: String(r[3]).trim(),
        date: r[4] instanceof Date ? Utilities.formatDate(r[4], tz, 'dd/MM/yyyy') : String(r[4]).trim(),
        staff: String(r[5]).trim()
      };
    })
    .reverse();                       // sự kiện mới nhất (dòng dưới cùng) hiện trước
  return { ok: true, events: events, url: ss.getUrl() };
}

function submit_(r) {
  if (!r.id) return { ok: false, error: 'Thiếu mã lượt chơi' };
  const cache = CacheService.getScriptCache();
  if (cache.get('rec_' + r.id)) return { ok: true, duplicate: true };   // chống ghi trùng khi gửi lại

  const isQuiz = r.game === 'quiz';
  const gameName = isQuiz ? SH_GAME1 : SH_GAME2;
  const gsh = isQuiz ? sheet_(SH_GAME1, H_GAME1, W_GAME1) : sheet_(SH_GAME2, H_GAME2, W_GAME2);
  const phone = "'" + String(r.phone || '');
  const result = r.feedback || 'Không đánh giá';
  const pct = (r.fitPct === '' || r.fitPct == null) ? '' : r.fitPct / 100;

  // 1) bảng trò chơi
  const stt = gsh.getLastRow();                   // dòng 1 là tiêu đề → STT = số dòng dữ liệu
  const row = isQuiz
    ? [stt, r.time, r.event, r.school, r.name, phone, r.grade, r.mode, r.major, pct, r.second, r.detail, result, r.interest, r.id]
    : [stt, r.time, r.event, r.school, r.name, phone, r.grade, r.gameScore, r.combo, r.major, pct, r.second, r.detail, result, r.interest, r.id];
  gsh.appendRow(row.map(function (v) { return v == null ? '' : v; }));
  const gRow = gsh.getLastRow();
  const resCol = isQuiz ? 13 : 14;
  gsh.getRange(gRow, isQuiz ? 10 : 11).setNumberFormat('0%');
  if (RESULT_COLORS[result]) gsh.getRange(gRow, resCol).setBackground(RESULT_COLORS[result]).setFontWeight('bold');

  // 2) bảng tổng hợp (STT bên bảng trò chơi bấm vào là nhảy tới đúng dòng)
  const sum = sheet_(SH_SUM, H_SUM, W_SUM);
  const sStt = sum.getLastRow();
  sum.appendRow([sStt, r.time || '', r.event || '', r.name || '', phone, r.grade || '', gameName, stt, result]);
  const sRow = sum.getLastRow();
  sum.getRange(sRow, 8).setFormula('=HYPERLINK("#gid=' + gsh.getSheetId() + '&range=A' + gRow + '",' + stt + ')');
  if (RESULT_COLORS[result]) sum.getRange(sRow, 9).setBackground(RESULT_COLORS[result]).setFontWeight('bold');

  cache.put('rec_' + r.id, '1', 21600);
  return { ok: true, stt: stt };
}

/* ---------- tiện ích ---------- */
let SS_CACHE = null;
function ss_() { return SS_CACHE || (SS_CACHE = SpreadsheetApp.openById(SHEET_ID)); }

/** Lần đầu ghi dữ liệu: tự dựng 4 trang (không cần chạy setup bằng tay). */
function ensureStructure_() {
  const props = PropertiesService.getScriptProperties();
  if (props.getProperty('struct') === STRUCT_VERSION) return;
  const ss = ss_();
  const old = ss.getSheetByName(SH_EVENTS);
  if (old && old.getRange(1, 1).getValue() !== 'STT') {          // trang "Sự kiện" kiểu cũ
    if (old.getLastRow() <= 1) ss.deleteSheet(old); else old.setName(SH_EVENTS + ' (cũ)');
  }
  sheet_(SH_EVENTS, H_EVENTS, W_EVENTS);
  [[SH_GAME1, H_GAME1, W_GAME1], [SH_GAME2, H_GAME2, W_GAME2]].forEach(function (x) {
    const sh = ss.getSheetByName(x[0]);
    if (sh && sh.getLastColumn() !== x[1].length) {                // tiêu đề bản cũ → cập nhật
      if (sh.getLastRow() <= 1) ss.deleteSheet(sh); else sh.setName(x[0].slice(0, 20) + ' (cũ)');
    }
    sheet_(x[0], x[1], x[2]);
  });
  sheet_(SH_SUM, H_SUM, W_SUM);
  ['Tất cả', 'Online', 'Trang tính1', 'Sheet1'].forEach(function (n) {
    const sh = ss.getSheetByName(n);
    if (sh && sh.getLastRow() <= 1 && ss.getSheets().length > 1) ss.deleteSheet(sh);
  });
  try {
    [SH_EVENTS, SH_GAME1, SH_GAME2, SH_SUM].forEach(function (n, i) {
      ss.setActiveSheet(ss.getSheetByName(n)); ss.moveActiveSheet(i + 1);
    });
  } catch (e) {}
  props.setProperty('struct', STRUCT_VERSION);
}

function sheet_(name, headers, widths) {
  const ss = ss_();
  let sh = ss.getSheetByName(name);
  if (sh) return sh;
  sh = ss.insertSheet(name);
  sh.getRange(1, 1, 1, headers.length).setValues([headers])
    .setFontWeight('bold').setFontColor('#FFFFFF').setBackground('#8A1C2C')
    .setVerticalAlignment('middle').setHorizontalAlignment('center').setWrap(true);
  sh.setFrozenRows(1);
  sh.setRowHeight(1, 36);
  widths.forEach(function (w, i) { sh.setColumnWidth(i + 1, w); });
  sh.getRange('A:A').setHorizontalAlignment('center');
  return sh;
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
