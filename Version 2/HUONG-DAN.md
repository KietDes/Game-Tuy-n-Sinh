# HƯỚNG DẪN CÀI ĐẶT GAME TUYỂN SINH – KHOA CNTT LHU

| File | Dùng để |
|---|---|
| `Index.html` | Giao diện game: 2 trò chơi, form đăng ký, chọn sự kiện, chế độ sáng/tối |
| `Code.gs` | Đoạn Apps Script ghi dữ liệu vào Google Sheet |

---

## Google Sheet gồm đúng 4 trang

| Trang | Ai điền | Nội dung |
|---|---|---|
| **Sự kiện** | **Bạn tự điền** | STT · Tên sự kiện · Trường · Địa điểm · Ngày · Cán bộ phụ trách · Ghi chú |
| **Trò chơi 1 – Trắc nghiệm** | Game tự ghi | STT · Thời gian · Sự kiện · Trường · Họ tên · SĐT · Lớp · Số câu (7/15) · Ngành gợi ý · Điểm 5 ngành · Kết quả · Ngành quan tâm |
| **Trò chơi 2 – Săn kỹ năng** | Game tự ghi | STT · Thời gian · Sự kiện · Trường · Họ tên · SĐT · Lớp · Điểm game · Combo · Ngành gợi ý · Kỹ năng đã hứng · Kết quả · Ngành quan tâm |
| **Tổng hợp** | Game tự ghi | STT · Thời gian · Sự kiện · Họ tên · SĐT · Lớp · Trò chơi · **STT bên bảng trò chơi** (bấm vào là nhảy tới đúng dòng) · Kết quả |

Cột **Kết quả**: 🟩 *Đúng ý* · 🟨 *Chưa đúng ý* (kèm ngành học sinh thấy hợp hơn) · ⬜ *Không đánh giá* (học sinh rời trang mà không bấm).

---

## BƯỚC 1. Cập nhật code vào Google Sheet (bạn đã có Sheet rồi)

1. Mở Google Sheet tổng → **Tiện ích mở rộng → Apps Script**.
2. Mở file `Code.gs` → xóa hết → dán toàn bộ nội dung file **Code.gs** mới.
3. Mở file `Index` → xóa hết → dán toàn bộ nội dung file **Index.html** mới.
4. Bấm 💾 Lưu.
5. Chọn hàm **`setup`** → bấm **Chạy**.
   Sheet sẽ còn đúng 4 trang ở trên. Các trang cũ còn trống (“Tất cả”, “Online”, trang “Sự kiện” kiểu cũ) được tự xóa; trang nào đã có dữ liệu thì giữ lại để bạn tự kiểm tra rồi xóa.
6. **Triển khai → Quản lý các bản triển khai → ✏️ → Phiên bản: Phiên bản mới → Triển khai.** Link `/exec` giữ nguyên.

> Nếu chưa từng triển khai: **Triển khai → Tùy chọn triển khai mới → Ứng dụng web**, Thực thi với tư cách: **Tôi**, Người có quyền truy cập: **Bất kỳ ai** → copy link `/exec`.

## BƯỚC 2. Trước mỗi sự kiện

1. Mở Google Sheet → trang **Sự kiện** → điền 1 dòng mới (tên sự kiện, trường, địa điểm, ngày…).
2. Mở game → bấm nút **📍 Chọn sự kiện** trên thanh đầu trang → **🔄 Tải danh sách từ Sheet** → chạm vào sự kiện vừa điền.
3. Bấm **✅ Xong, cho học sinh chơi**.

Mọi lượt chơi sau đó đều được ghi kèm tên sự kiện và trường. Đăng link chơi online trên fanpage thì chọn **Không gắn sự kiện**.

## Cách mở game

- **Bằng link `/exec` (khuyên dùng):** mở trên iPad, laptop hay điện thoại là chơi được, có thể đăng lên fanpage hoặc in mã QR.
- **Bằng file `Index.html` trên máy:** bấm **📍 Chọn sự kiện** → khung **🔗 Kết nối** ở cuối trang → dán link `/exec` → **Lưu & kiểm tra kết nối** (mỗi máy làm 1 lần).

Các nút trên thanh đầu trang: 🌙/☀️ đổi chế độ **sáng** (tone banner) / **tối** (tone công nghệ), 🔊 bật/tắt âm thanh.
Chấm tròn cạnh nút sự kiện: 🟢 đã gửi được lên Sheet · 🟠 đang mất kết nối (dữ liệu giữ trên máy, có mạng sẽ tự gửi lại).

## Chỉnh nội dung

Mở `Index.html` (hoặc file `Index` trong Apps Script), phần đầu `<script>`:
- `MAJORS`: tên ngành, mô tả, học gì, việc làm
- `QUESTIONS`: 15 câu hỏi (chế độ 7 câu lấy ngẫu nhiên 7 câu)
- `CATCH_ITEMS`: các vật phẩm rơi trong game Săn kỹ năng
- `THANKS_AUTO_RESET`: số giây tự chuyển sang người chơi tiếp theo

Nút **⬇️ Tải CSV dự phòng** (trong trang Chọn sự kiện) xuất toàn bộ lượt chơi đã lưu trên máy đó, phòng khi Sheet có sự cố.
