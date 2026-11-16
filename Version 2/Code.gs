/**
 * GAME TUYỂN SINH – KHOA CNTT, ĐẠI HỌC LẠC HỒNG
 * ------------------------------------------------------------
 * Google Sheet tổng gồm đúng 4 trang:
 *   1. "Sự kiện"                   – bạn tự điền thông tin sự kiện (mỗi sự kiện 1 dòng)
 *   2. "Trò chơi 1 – Trắc nghiệm"  – thông tin + kết quả trò chơi 1
 *   3. "Trò chơi 2 – Săn kỹ năng"  – thông tin + kết quả trò chơi 2
 *   4. "Tổng hợp"                  – họ tên, SĐT, lớp, trò chơi, STT bên bảng trò chơi, đúng/chưa đúng ý
 */

const SH_EVENTS = 'Sự kiện';
const SH_GAME1 = 'Trò chơi 1 – Trắc nghiệm';
const SH_GAME2 = 'Trò chơi 2 – Săn kỹ năng';
const SH_SUM = 'Tổng hợp';

const H_EVENTS = ['STT', 'Tên sự kiện', 'Trường', 'Địa điểm', 'Ngày', 'Cán bộ phụ trách', 'Ghi chú'];
const H_GAME1 = ['STT', 'Thời gian', 'Sự kiện', 'Trường', 'Họ và tên', 'Số điện thoại', 'Lớp', 'Số câu',
  'Ngành gợi ý', 'Điểm 5 ngành', 'Kết quả', 'Ngành quan tâm', 'Mã lượt chơi'];
const H_GAME2 = ['STT', 'Thời gian', 'Sự kiện', 'Trường', 'Họ và tên', 'Số điện thoại', 'Lớp', 'Điểm game',
  'Combo cao nhất', 'Ngành gợi ý', 'Kỹ năng đã hứng', 'Kết quả', 'Ngành quan tâm', 'Mã lượt chơi'];
const H_SUM = ['STT', 'Thời gian', 'Sự kiện', 'Họ và tên', 'Số điện thoại', 'Lớp', 'Trò chơi',
  'STT bên bảng trò chơi', 'Kết quả'];

const W_EVENTS = [50, 240, 200, 200, 100, 170, 200];
const W_GAME1 = [50, 140, 200, 170, 180, 115, 100, 70, 190, 280, 120, 180, 110];
const W_GAME2 = [50, 140, 200, 170, 180, 115, 100, 80, 100, 190, 280, 120, 180, 110];
const W_SUM = [50, 140, 200, 180, 115, 100, 190, 150, 120];

const RESULT_COLORS = { 'Đúng ý': '#D4EDDA', 'Chưa đúng ý': '#FFF3CD', 'Không đánh giá': '#E8EDF3' };

/**
 * Chạy hàm này 1 lần trong trình soạn thảo: cấp quyền + dựng 4 trang tính.
 * Các trang của bản cũ ("Tất cả", "Online", trang theo từng trường) sẽ được xóa nếu còn trống.
 */
function setup() {
  const ss = ss_();
  // trang "Sự kiện" của bản cũ (cột "Tạo lúc") → đổi sang tiêu đề mới nếu chưa có dữ liệu
  const old = ss.getSheetByName(SH_EVENTS);
  if (old && old.getRange(1, 1).getValue() === 'Tạo lúc' && old.getLastRow() <= 1) ss.deleteSheet(old);

  const ev = sheet_(SH_EVENTS, H_EVENTS, W_EVENTS);
  sheet_(SH_GAME1, H_GAME1, W_GAME1);
  sheet_(SH_GAME2, H_GAME2, W_GAME2);
  sheet_(SH_SUM, H_SUM, W_SUM);

  ev.getRange('B1').setNote('Bạn tự điền mỗi sự kiện 1 dòng. Trong game bấm “📍 Chọn sự kiện” → “Tải danh sách” để chọn.');
  ev.getRange('E2:E').setNumberFormat('dd/mm/yyyy');

  const keep = [SH_EVENTS, SH_GAME1, SH_GAME2, SH_SUM];
  ss.getSheets().forEach(function (sh) {
    if (keep.indexOf(sh.getName()) === -1 && sh.getLastRow() <= 1) ss.deleteSheet(sh);
  });
  keep.forEach(function (n, i) { ss.setActiveSheet(ss.getSheetByName(n)); ss.moveActiveSheet(i + 1); });
  Logger.log('Xong! ' + ss.getUrl());
}

/** Mở link Web App → hiện game. */
function doGet(e) {
  if (e && e.parameter && e.parameter.ping) return json_({ ok: true, name: ss_().getName() });
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Bạn hợp ngành nào? – Khoa CNTT · ĐH Lạc Hồng')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
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
  if (action !== 'submit') return { ok: false, error: 'Hành động không hợp lệ' };

  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(25000);
    return submit_(p.record || {});
  } catch (err) {
    return { ok: false, error: String(err && err.message || err) };
  } finally {
    try { lock.releaseLock(); } catch (e) {}
  }
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

  // 1) bảng trò chơi
  const stt = gsh.getLastRow();                   // dòng 1 là tiêu đề → STT = số dòng dữ liệu
  const row = isQuiz
    ? [stt, r.time, r.event, r.school, r.name, phone, r.grade, r.mode, r.major, r.scores, result, r.interest, r.id]
    : [stt, r.time, r.event, r.school, r.name, phone, r.grade, r.gameScore, r.combo, r.major, r.scores, result, r.interest, r.id];
  gsh.appendRow(row.map(function (v) { return v == null ? '' : v; }));
  const gRow = gsh.getLastRow();
  const resCol = isQuiz ? 11 : 12;
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
function ss_() { return SpreadsheetApp.getActiveSpreadsheet(); }

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
