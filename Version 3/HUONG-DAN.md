# HƯỚNG DẪN DÙNG GAME TUYỂN SINH – KHOA CNTT LHU

## Trong thư mục này có gì

| Tên | Dùng để |
|---|---|
| `Index.html` | **Mở file này bằng Chrome hoặc Edge để chơi** |
| `Nhạc Trải Nghiệm.mp3` | Nhạc nền, tự phát khi mở game (phải nằm cùng thư mục với `Index.html`) |
| `hinh-nganh/` | Ảnh của 5 ngành, hiện khi bấm vào một ngành (tự lướt 3 giây/ảnh) |
| `Code.gs` | **Không bắt buộc**, chỉ dùng khi muốn đồng bộ thêm lên Google Sheet |

> Nên dùng **Chrome hoặc Edge trên máy tính (laptop, PC)** để game tự lưu file Excel.
> iPad hoặc điện thoại vẫn chơi được, dữ liệu giữ trong trình duyệt, cuối buổi bấm “Tải dữ liệu về”.

---

## 1. Trước sự kiện: tạo sự kiện

1. Mở `Index.html` → bấm nút **📍 Sự kiện** trên thanh đầu trang.
2. Điền **Tên sự kiện, Trường, Địa điểm, Ngày, Cán bộ phụ trách** → bấm **➕ Tạo sự kiện**.
3. Máy hỏi nơi lưu file → chọn thư mục (ví dụ thư mục `Data` cạnh game) → **Lưu**.
   Game tạo sẵn file Excel tên dạng `Data game tuyen sinh - 20-11-2026 - THPT Ngô Quyền.xlsx`.
4. Bấm **✅ Xong, cho học sinh chơi**.

Từ đó **mỗi lượt chơi xong, file Excel tự được lưu lại**. Ô 💾 trong trang Sự kiện ghi giờ lưu gần nhất.

- Nếu đang mở file Excel đó để xem, game sẽ chưa ghi được (Excel khóa file). Đóng file, lượt chơi sau game tự lưu bù.
- Nếu tắt máy hay tải lại trang, vào **📍 Sự kiện** bấm **🔓 Bật lại tự lưu** (trình duyệt bắt hỏi lại quyền). Dữ liệu không mất.

## 2. Sau sự kiện: tải dữ liệu

Vào **📍 Sự kiện** → **⬇️ Tải dữ liệu về (Excel)**, hoặc **⏹ Kết thúc sự kiện** (vừa kết thúc vừa tải file).
**⬇️ Tải tất cả sự kiện** gộp toàn bộ dữ liệu trên máy vào 1 file.

File Excel gồm 4 trang:

| Trang | Nội dung |
|---|---|
| **Sự kiện** | STT · Tên · Trường · Địa điểm · Ngày · Cán bộ phụ trách · Số lượt chơi |
| **Trò chơi 1 – Trắc nghiệm** | Thời gian · Họ tên · SĐT · Lớp · Số câu · Ngành gợi ý · **Độ phù hợp** · Ngành thứ 2 · % 5 ngành · Kết quả · Ngành quan tâm |
| **Trò chơi 2 – Săn kỹ năng** | … · Điểm game · Combo · Ngành gợi ý · **Độ phù hợp** · Ngành thứ 2 · Kỹ năng đã hứng/xuất hiện · Kết quả · Ngành quan tâm |
| **Tổng hợp** | Họ tên · SĐT · Lớp · Trò chơi · **STT bên bảng trò chơi** (bấm vào là nhảy tới dòng đó) · Kết quả |

Cột **Kết quả**: 🟩 Đúng ý · 🟨 Chưa đúng ý (kèm ngành học sinh thấy hợp hơn) · ⬜ Không đánh giá.

## 3. Cập nhật ảnh ngành

Trong thư mục `hinh-nganh` có 5 thư mục con:

| Thư mục | Ngành |
|---|---|
| `cntt` | Công nghệ Thông tin |
| `ttdpt` | Truyền thông Đa phương tiện |
| `ai` | Trí tuệ Nhân tạo |
| `attt` | An toàn Thông tin |
| `tmdt` | Thương mại Điện tử |

Bỏ ảnh vào đúng thư mục, **đặt tên theo số: `1.jpg`, `2.jpg`, `3.jpg`…** (nhận cả `.png`, `.jpeg`, `.webp`).
Đánh số liên tục, không bỏ trống (có 1, 2, 4 thì game chỉ hiện 1 và 2). Tối đa 30 ảnh mỗi ngành.
Ảnh ngang tỉ lệ 16:9, khoảng 1280×720, sẽ đẹp và nhẹ nhất. Thư mục nào chưa có ảnh thì game hiện 3 thẻ “Học gì / Làm gì / Hợp với ai”.

## 4. Nhạc nền

Mở game là nhạc tự phát. Chrome/Edge chặn tự phát nhạc khi chưa có thao tác nào, nên **nhạc bắt đầu ngay khi có người chạm/bấm lần đầu** vào trang.
Bật/tắt bằng nút 🔊 trên thanh đầu trang. Muốn đổi bài: thay file mp3 rồi đổi tên trong dòng `MUSIC_FILES` ở đầu phần script của `Index.html`, hoặc đặt tên bài mới là `nhac-nen.mp3`.
File nhạc hiện tại nặng 68MB. Chạy trên máy thì không sao, nhưng nếu sau này đưa lên web thì nên nén nhỏ lại.

## 5. Cách game chấm kết quả

**Trắc nghiệm.** Mỗi đáp án cộng 3 điểm cho ngành chính và 1 điểm cho ngành gần (ví dụ “Đọc tin về ChatGPT” → AI +3, CNTT +1). Câu hỏi về môn học, định hướng tương lai, nơi làm việc có trọng số cao hơn câu sở thích vui.
**Độ phù hợp** = điểm đạt được ÷ điểm tối đa ngành đó có thể đạt, nên kết quả công bằng dù chơi 7 hay 15 câu. Chế độ 7 câu lấy cân bằng: 2 câu sở thích, 2 kỹ năng, 1 giá trị, 2 định hướng.
Hai ngành sát nhau (chênh dưới 8%) thì game báo thêm “Bạn cũng rất hợp với ngành …”.

**Săn kỹ năng.** Mỗi đợt rơi 2–3 kỹ năng của các ngành khác nhau cùng lúc, nên học sinh phải chọn hứng 1 cái, và lựa chọn đó chính là tín hiệu sở thích. Các ngành xuất hiện đều nhau.
**Độ phù hợp** = 40% tỉ lệ hứng (hứng ÷ xuất hiện) + 60% tỉ lệ được chọn khi phải chọn. Hứng dưới 2 kỹ năng thì game yêu cầu chơi lại vì chưa đủ dữ liệu.

## 6. (Không bắt buộc) Đồng bộ thêm lên Google Sheet

Chỉ cần khi muốn dữ liệu đồng thời lên Google Sheet:
1. Google Sheet → **Tiện ích mở rộng → Apps Script** → dán `Code.gs` → chạy hàm `setup` một lần.
2. **Triển khai → Ứng dụng web** (Thực thi: Tôi · Truy cập: Bất kỳ ai) → copy link `/exec`.
3. Trong game: **📍 Sự kiện → ⚙️ Nâng cao** → dán link → **Lưu & kiểm tra kết nối**.

## Chỉnh nội dung

Mở `Index.html` bằng Notepad/VS Code, phần đầu `<script>`:
`MAJORS` (thông tin ngành) · `QUESTIONS` (15 câu hỏi, trọng số) · `CATCH_ITEMS` (vật phẩm rơi) · `SLIDE_SECONDS` (giây chuyển ảnh) · `MUSIC_VOLUME` (âm lượng nhạc) · `THANKS_AUTO_RESET` (giây tự chuyển người chơi).
