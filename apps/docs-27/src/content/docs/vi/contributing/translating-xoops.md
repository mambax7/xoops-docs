---
title: "Phụ lục 3: Dịch XOOPS sang ngôn ngữ địa phương"
---
XOOPS 2.7.0 chỉ xuất xưởng với các tệp language tiếng Anh. Các bản dịch sang languages khác được cộng đồng duy trì và phân phối thông qua GitHub và các trang web hỗ trợ XOOPS địa phương khác nhau.

## Nơi tìm bản dịch hiện có

- **GitHub** — các bản dịch của cộng đồng ngày càng được xuất bản dưới dạng các kho lưu trữ riêng biệt thuộc [tổ chức XOOPS](https://github.com/XOOPS) và trên tài khoản của từng người đóng góp. Tìm kiếm `xoops-language-<your-language>` trên GitHub hoặc duyệt qua tổ chức XOOPS để biết các gói hiện tại.
- **Trang web hỗ trợ XOOPS địa phương** — nhiều cộng đồng XOOPS trong khu vực xuất bản bản dịch trên trang web của riêng họ. Truy cập [https://xoops.org](https://xoops.org) và truy cập các liên kết đến cộng đồng địa phương.
- **Bản dịch mô-đun** — bản dịch cho cộng đồng cá nhân modules thường nằm bên cạnh chính mô-đun trong tổ chức `25x` trong tổ chức GitHub (`25x` trong tên là lịch sử; modules được duy trì cho cả hai XOOPS 2.5.x và 2.7.x).

Nếu bản dịch cho language của bạn đã tồn tại, hãy thả các thư mục language vào bản cài đặt XOOPS của bạn (xem "Cách cài đặt bản dịch" bên dưới).

## Những gì cần dịch

XOOPS 2.7.0 giữ các tệp language bên cạnh mã sử dụng chúng. Một bản dịch hoàn chỉnh bao gồm tất cả các địa điểm sau:

- **Lõi** — `htdocs/language/english/` — các hằng số trên toàn trang web được mọi trang sử dụng (đăng nhập, lỗi phổ biến, ngày tháng, thư templates, v.v.).
- **Trình cài đặt** — `htdocs/install/language/english/` — các chuỗi được hiển thị bởi trình hướng dẫn cài đặt. Hãy dịch những điều này *trước khi* chạy trình cài đặt nếu bạn muốn có trải nghiệm cài đặt được bản địa hóa.
- **Mô-đun hệ thống** — `htdocs/modules/system/language/english/` — bộ lớn nhất cho đến nay; bao phủ toàn bộ Bảng điều khiển admin.
- **modules đi kèm** — mỗi `htdocs/modules/pm/language/english/`, `htdocs/modules/profile/language/english/`, `htdocs/modules/protector/language/english/` và `htdocs/modules/debugbar/language/english/`.
- **Chủ đề** — một số themes gửi tệp language của riêng chúng; kiểm tra `htdocs/themes/<theme>/language/` nếu nó tồn tại.

Bản dịch "chỉ cốt lõi" là đơn vị hữu ích tối thiểu và tương ứng với hai dấu đầu dòng đầu tiên ở trên.

## Cách dịch

1. Sao chép thư mục `english/` bên cạnh và đổi tên bản sao thành language của bạn. Tên thư mục phải là tên tiếng Anh viết thường của language (`spanish`, `german`, `french`, `japanese`, `arabic`, v.v.).

   
```
   htdocs/language/english/    →    htdocs/language/spanish/
   
```

2. Mở từng tệp `.php` trong thư mục mới và dịch **các giá trị chuỗi** bên trong các lệnh gọi `define()`. **Không** thay đổi tên hằng số - chúng được tham chiếu từ mã PHP trong toàn bộ lõi.

   
```php
   // Before:
   define('_CM_COMDELETED',  'Comment(s) deleted.');
   define('_CM_COMDELETENG', 'Could not delete comment.');
   define('_CM_DELETESELECT', 'Delete all its child comments?');

   // After (Spanish):
   define('_CM_COMDELETED',  'Comentario(s) eliminado(s).');
   define('_CM_COMDELETENG', 'No se pudo eliminar el comentario.');
   define('_CM_DELETESELECT', '¿Eliminar también todos sus comentarios secundarios?');
   
```

3. **Lưu mọi tệp dưới dạng UTF-8 *không có* BOM.** XOOPS 2.7.0 sử dụng `utf8mb4` từ đầu đến cuối (cơ sở dữ liệu, phiên, đầu ra) và từ chối các tệp có dấu thứ tự byte. Trong Notepad++, đây là tùy chọn **"UTF-8"**, *không phải* "UTF-8-BOM". Trong Mã VS, đó là mặc định; chỉ cần xác nhận mã hóa trên thanh trạng thái.

4. Cập nhật siêu dữ liệu language và bộ ký tự ở đầu mỗi tệp để khớp với language của bạn:

   
```php
   // _LANGCODE: es
   // _CHARSET : UTF-8
   // Translator: Your Name
   ````_LANGCODE` phải là mã [ISO 639-1](https://www.loc.gov/standards/iso639-2/php/code_list.php) cho language của bạn. `_CHARSET` luôn là `UTF-8` trong XOOPS 2.7.0 — không còn biến thể ISO-8859-1 nữa.

5. Lặp lại cho trình cài đặt, mô-đun Hệ thống và bất kỳ modules đi kèm nào mà bạn cần.

## Cách cài đặt bản dịch

Nếu bạn nhận được bản dịch hoàn chỉnh dưới dạng cây thư mục:

1. Sao chép từng thư mục `<language>/` vào thư mục gốc `language/english/` phù hợp trong bản cài đặt XOOPS của bạn. Ví dụ: sao chép `language/spanish/` vào `htdocs/language/`, `install/language/spanish/` vào `htdocs/install/language/`, v.v.
2. Đảm bảo máy chủ web có thể đọc được quyền sở hữu và quyền của tệp.
3. Chọn language mới khi cài đặt (trình hướng dẫn quét `htdocs/language/` để tìm languages có sẵn) hoặc trên trang web hiện có, thay đổi language trong **Quản trị → Hệ thống → Tùy chọn → Cài đặt chung**.

## Chia sẻ lại bản dịch của bạn

Hãy đóng góp bản dịch của bạn trở lại cộng đồng.

1. Tạo kho lưu trữ GitHub (hoặc phân nhánh kho lưu trữ language hiện có nếu kho lưu trữ tồn tại cho language của bạn).
2. Sử dụng tên rõ ràng như `xoops-language-<language-code>` (ví dụ: `xoops-language-es`, `xoops-language-pt-br`).
3. Phản chiếu cấu trúc thư mục XOOPS bên trong kho lưu trữ của bạn để các tệp thẳng hàng với nơi chúng được sao chép:

   
```
   xoops-language-es/
   ├── language/spanish/(files).php
   ├── install/language/spanish/(files).php
   └── modules/system/language/spanish/(files).php
   
```

4. Bao gồm tài liệu `README.md`:
   - Tên ngôn ngữ và mã ISO
   - Khả năng tương thích phiên bản XOOPS (ví dụ: `XOOPS 2.7.0+`)
   - Người dịch và tín dụng
   - Bản dịch chỉ có lõi hay bao gồm modules đi kèm
5. Mở yêu cầu kéo đối với kho lưu trữ mô-đun/lõi có liên quan trên GitHub hoặc đăng thông báo trên [https://xoops.org](https://xoops.org) để cộng đồng có thể tìm thấy nó.

> **Lưu ý**
>
> Nếu language của bạn yêu cầu thay đổi lõi để định dạng ngày hoặc lịch, include cũng sẽ thay đổi những thay đổi đó trong gói. Các ngôn ngữ có chữ viết từ phải sang trái (tiếng Ả Rập, tiếng Do Thái, tiếng Ba Tư, tiếng Urdu) hoạt động tốt trong XOOPS 2.7.0 — Hỗ trợ RTL đã được thêm vào trong bản phát hành này và từng themes riêng lẻ sẽ tự động nhận nó.