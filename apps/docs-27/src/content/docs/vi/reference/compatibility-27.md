---
title: "Đánh giá khả năng tương thích XOOPS 2.7.0 cho hướng dẫn này"
---
Tài liệu này liệt kê những thay đổi cần thiết trong kho lưu trữ này để Hướng dẫn cài đặt phù hợp với XOOPS 2.7.0.

Cơ sở đánh giá:

- Kho hướng dẫn hiện tại: `L:\GitHub\XoopsDocs\xoops-installation-guide`
- Lõi XOOPS 2.7.0 được review tại: `L:\GitHub\MAMBAX7\CORE\XoopsCore27`
- Đã kiểm tra nguồn 2.7.0 chính:
  - `README.md`
  -`release_notes.txt`
  - `htdocs/install/language/english/welcome.php`
  - `htdocs/install/include/config.php`
  - `htdocs/install/include/page.php`
  - `htdocs/install/class/pathcontroller.php`
  - `htdocs/install/page_dbsettings.php`
  - `htdocs/install/page_configsave.php`
  - `htdocs/install/page_siteinit.php`
  - `htdocs/install/page_end.php`
  - `htdocs/mainfile.dist.php`
  - `upgrade/preflight.php`
  - `upgrade/README.md`
  - `upgrade/upd_2.5.11-to-2.7.0/index.php`

## Phạm vi

Kho lưu trữ này hiện chứa:

- Các file Markdown tiếng Anh cấp độ gốc được sử dụng làm hướng dẫn chính.
- Bản sao `en/` một phần.
- Full cây sách `de/` và `fr/` có assets riêng.

Các tập tin cấp gốc cần có đường chuyền đầu tiên. Sau đó, những thay đổi tương đương cần được phản ánh vào `de/book/` và `fr/book/`. Cây `en/` cũng cần được dọn dẹp vì nó dường như chỉ được bảo trì một phần.

## 1. Thay đổi kho lưu trữ toàn cầu

### 1.1 Phiên bản và siêu dữ liệu

Cập nhật tất cả các tham chiếu cấp hướng dẫn từ XOOPS 2.5.x lên XOOPS 2.7.0.

Các tập tin bị ảnh hưởng:

- `README.md`
- `SUMMARY.md` — TOC trực tiếp chính cho hướng dẫn gốc; nhãn điều hướng và tiêu đề phần cần khớp với tiêu đề chương mới và phần Ghi chú nâng cấp lịch sử đã được đổi tên
- `en/README.md`
- `en/SUMMARY.md`
- `de/README.md`
- `de/SUMMARY.md`
- `fr/README.md`
- `fr/SUMMARY.md`
- `chapter-2-introduction.md`
- `about-xoops-cms.md`
- `appendix-1-working-with-the-new-admin-gui-our-dashboard.md`
- `appendix-5-increase-security-of-your-xoops-installation.md`
- `de/book/*.md` và `fr/book/*.md` được bản địa hóa

Những thay đổi bắt buộc:

- Đổi `for XOOPS 2.5.7.x` thành `for XOOPS 2.7.0`.
- Cập nhật năm bản quyền từ `2018` lên `2026`.
- Thay thế các tham chiếu XOOPS 2.5.x và 2.6.0 cũ trong đó chúng mô tả bản phát hành hiện tại.
- Thay thế hướng dẫn tải xuống thời SourceForge bằng Bản phát hành GitHub:
  - `https://github.com/XOOPS/XoopsCore27/releases`

### 1.2 Làm mới liên kết

Các tệp `about-xoops-cms.md` và `10aboutxoops.md` được bản địa hóa vẫn trỏ đến các vị trí GitHub 2.5.x và 2.6.0 cũ. Những liên kết đó cần được cập nhật lên vị trí dự án 2.7.x hiện tại.

### 1.3 Làm mới ảnh chụp màn hình

Tất cả các ảnh chụp màn hình hiển thị trình cài đặt, giao diện người dùng nâng cấp, bảng điều khiển admin, bộ chọn chủ đề, bộ chọn mô-đun và màn hình sau cài đặt đều đã lỗi thời.

Cây tài sản bị ảnh hưởng:

- `.gitbook/assets/`
- `en/assets/`
- `de/assets/`
- `fr/assets/`

Đây là một bản làm mới hoàn toàn, không phải một phần. Trình cài đặt 2.7.0 sử dụng bố cục dựa trên Bootstrap khác và cấu trúc hình ảnh khác.

## 2. Chương 2: Giới thiệu

Tập tin:

- `chapter-2-introduction.md`

### 2.1 Yêu cầu hệ thống phải được viết lại

Chương hiện tại chỉ nói Apache, MySQL và PHP. XOOPS 2.7.0 có mức tối thiểu rõ ràng:

| Thành phần | tối thiểu 2.7.0 | Khuyến nghị 2.7.0 |
| --- | --- | --- |
| PHP | 8.2.0 | 8,4+ |
| MySQL | 5.7.8 | 8,4+ |
| Máy chủ web | Bất kỳ máy chủ nào hỗ trợ đều cần có PHP | Khuyến nghị sử dụng Apache hoặc Nginx |

Ghi chú cần thêm:- IIS vẫn được liệt kê trong trình cài đặt càng tốt, nhưng Apache và Nginx là những ví dụ được khuyến nghị.
- Ghi chú phát hành cũng nêu rõ khả năng tương thích MySQL 9.0.

### 2.2 Thêm danh sách kiểm tra tiện ích mở rộng PHP được yêu cầu và đề xuất

Trình cài đặt 2.7.0 hiện đã tách các yêu cầu cứng khỏi các tiện ích mở rộng được đề xuất.

Các bước kiểm tra bắt buộc được trình cài đặt hiển thị:

- MySQLi
- Phiên
- PCRE
- bộ lọc
- `file_uploads`
- thông tin tập tin

Tiện ích mở rộng được đề xuất:

- mbstring
- quốc tế
- biểu tượngv
-xml
- zlib
- gd
- Exif
- cuộn tròn

### 2.3 Xóa hướng dẫn kiểm tra tổng

Bước 5 hiện tại mô tả `checksum.php` và `checksum.mdi`. Những tệp đó không phải là một phần của XOOPS 2.7.0.

Hành động:

- Bỏ hoàn toàn phần xác minh tổng kiểm tra.

### 2.4 Cập nhật gói và hướng dẫn upload

Giữ lại mô tả bố cục gói `docs/`, `extras/`, `htdocs/`, `upgrade/` nhưng cập nhật văn bản tải lên và chuẩn bị để phản ánh kỳ vọng về đường dẫn có thể ghi hiện tại:

- `mainfile.php`
-`uploads/`
- `uploads/avatars/`
- `uploads/files/`
-`uploads/images/`
- `uploads/ranks/`
- `uploads/smilies/`
- `xoops_data/caches/`
- `xoops_data/caches/xoops_cache/`
- `xoops_data/caches/smarty_cache/`
- `xoops_data/caches/smarty_compile/`
- `xoops_data/configs/`
- `xoops_data/configs/captcha/`
- `xoops_data/configs/textsanitizer/`
- `xoops_data/data/`
- `xoops_data/protector/`

Hướng dẫn hiện đang nhấn mạnh điều này.

### 2.5 Thay thế bản dịch/tải xuống SourceForge language

Văn bản hiện tại vẫn yêu cầu truy cập XOOPS trên SourceForge để xem các gói language khác. Điều đó cần được thay thế bằng hướng dẫn tải xuống dự án/cộng đồng hiện tại.

## 3. Chương 3: Kiểm tra cấu hình máy chủ

Tập tin:

- `chapter-3-server-configuration-check.md`

Những thay đổi bắt buộc:

- Viết lại mô tả trang xung quanh bố cục hai khối hiện tại:
  - Yêu cầu
  - Tiện ích mở rộng được đề xuất
- Thay thế ảnh chụp màn hình cũ.
- Ghi lại rõ ràng các yêu cầu kiểm tra được liệt kê ở trên.

## 4. Chương 4: Đi Đúng Đường

Tập tin:

- `chapter-4-take-the-right-path.md`

Những thay đổi bắt buộc:

- Thêm trường `Cookie Domain` mới.
- Cập nhật tên và mô tả các trường đường dẫn cho khớp với 2.7.0:
  - Đường dẫn gốc XOOPS
  - Đường dẫn dữ liệu XOOPS
  - Đường dẫn thư viện XOOPS
  - XOOPS URL
  - Tên miền cookie
- Thêm một lưu ý là việc thay đổi đường dẫn thư viện hiện nay cần có trình tải tự động Composer hợp lệ tại `vendor/autoload.php`.

Đây là bước kiểm tra tính tương thích thực tế trong phiên bản 2.7.0 và phải được ghi lại rõ ràng. Hướng dẫn hiện tại hoàn toàn không đề cập đến Composer.

## 5. Chương 5: Kết nối cơ sở dữ liệu

Tập tin:

- `chapter-5-database-connections.md`

Những thay đổi bắt buộc:

- Giữ nguyên tuyên bố rằng chỉ hỗ trợ MySQL.
- Cập nhật phần cấu hình cơ sở dữ liệu để phản ánh:
  - bộ ký tự mặc định bây giờ là `utf8mb4`
  - lựa chọn đối chiếu cập nhật động khi bộ ký tự thay đổi
- Thay thế ảnh chụp màn hình cho cả trang cấu hình và kết nối cơ sở dữ liệu.

Văn bản hiện tại nói rằng bộ ký tự và đối chiếu không cần chú ý là quá yếu đối với 2.7.0. Ít nhất nên đề cập đến mặc định `utf8mb4` mới và bộ chọn đối chiếu động.

## 6. Chương 6: Cấu hình hệ thống cuối cùng

Tập tin:

- `chapter-6-final-system-configuration.md`

### 6.1 Các tập tin cấu hình được tạo đã thay đổi

Hướng dẫn hiện cho biết trình cài đặt ghi `mainfile.php` và `secure.php`.Trong 2.7.0 nó cũng cài đặt các file cấu hình vào `xoops_data/configs/`, bao gồm:

- `xoopsconfig.php`
- tập tin cấu hình captcha
- tập tin cấu hình textanitizer

### 6.2 Các file cấu hình hiện có trong `xoops_data/configs/` không bị ghi đè

Hành vi không ghi đè là **có phạm vi**, không phải toàn cục. Hai đường dẫn mã riêng biệt trong `page_configsave.php` ghi tệp cấu hình:

- `writeConfigurationFile()` (được gọi ở dòng 59 và 66) **luôn** tạo lại `xoops_data/data/secure.php` và `mainfile.php` từ đầu vào trình hướng dẫn. Không có kiểm tra sự tồn tại; một bản sao hiện có được thay thế.
- `copyConfigDistFiles()` (được gọi ở dòng 62, được xác định ở dòng 317) chỉ sao chép các tệp `xoops_data/configs/` (`xoopsconfig.php`, cấu hình captcha, cấu hình textanitizer) **nếu đích đến chưa tồn tại**.

Việc viết lại chương phải phản ánh rõ ràng cả hai hành vi:

- Đối với `mainfile.php` và `secure.php`: cảnh báo rằng mọi chỉnh sửa thủ công đối với các tệp này sẽ bị ghi đè khi chạy lại trình cài đặt.
- Đối với các tệp `xoops_data/configs/`: giải thích rằng các tùy chỉnh cục bộ được giữ nguyên trong suốt quá trình chạy lại và nâng cấp, đồng thời việc khôi phục các giá trị mặc định đã gửi yêu cầu xóa tệp và chạy lại (hoặc sao chép `.dist.php` tương ứng bằng tay).

Không khái quát hóa "các tệp hiện có được giữ nguyên" trên tất cả các tệp cấu hình do trình cài đặt ghi — điều đó không chính xác và sẽ gây nhầm lẫn cho administrators khi chỉnh sửa `mainfile.php` hoặc `secure.php`.

### 6.3 HTTPS và xử lý proxy ngược đã thay đổi

`mainfile.php` được tạo hiện hỗ trợ phát hiện giao thức rộng hơn, bao gồm các tiêu đề proxy ngược. Hướng dẫn nên đề cập đến vấn đề này thay vì chỉ ngụ ý phát hiện trực tiếp `http` hoặc `https`.

### 6.4 Số bảng sai

Chương hiện tại cho biết một trang web mới tạo các bảng `32`.

XOOPS 2.7.0 tạo bảng `33`. Bảng còn thiếu là:

- `tokens`

Hành động:

- Cập nhật số đếm từ 32 lên 33.
- Thêm `tokens` vào danh sách bảng.

## 7. Chương 7: Cài đặt quản trị

Tập tin:

- `chapter-7-administration-settings.md`

### 7.1 Mô tả giao diện người dùng mật khẩu đã lỗi thời

Trình cài đặt vẫn tạo mật khẩu includes nhưng giờ đây nó cũng tạo ra includes:

- Máy đo cường độ mật khẩu dựa trên zxcvbn
- nhãn sức mạnh thị giác
- Luồng sao chép và tạo 16 ký tự

Cập nhật văn bản và ảnh chụp màn hình để mô tả bảng mật khẩu hiện tại.

### 7.2 Xác thực email hiện đã được thực thi

Email quản trị viên được xác thực bằng `FILTER_VALIDATE_EMAIL`. Chương này nên đề cập rằng các giá trị email không hợp lệ sẽ bị từ chối.

### 7.3 Phần License key bị sai

Đây là một trong những sửa chữa thực tế quan trọng nhất.

Hướng dẫn hiện tại cho biết:

- có `License System Key`
- nó được lưu trữ trong `/include/license.php`
- `/include/license.php` phải có khả năng ghi trong quá trình cài đặt

Điều đó không còn chính xác nữa.

2.7.0 thực sự làm gì:

- cài đặt ghi dữ liệu giấy phép vào `xoops_data/data/license.php`
- `htdocs/include/license.php` hiện chỉ là một trình bao bọc không dùng nữa để tải tệp từ `XOOPS_VAR_PATH`
- nên loại bỏ cách diễn đạt cũ về việc làm cho `/include/license.php` có thể ghi được

Hành động:

- Viết lại phần này thay vì xóa nó.
- Cập nhật đường dẫn từ `/include/license.php` lên `xoops_data/data/license.php`.

### Danh sách chủ đề 7.4 đã lỗi thời

Hướng dẫn hiện tại vẫn đề cập đến Zetagenesis và bộ chủ đề cũ hơn ở thời đại 2,5.

Các chủ đề có trong XOOPS 2.7.0:- `default`
- `xbootstrap`
- `xbootstrap5`
- `xswatch4`
- `xswatch5`
-`xtailwind`
-`xtailwind2`

Cũng lưu ý:

- `xswatch4` là chủ đề mặc định hiện tại được chèn bởi dữ liệu trình cài đặt.
- Zetagenesis không còn nằm trong danh sách chủ đề đóng gói.

### Danh sách mô-đun 7.5 đã lỗi thời

Các mô-đun có trong gói 2.7.0:

- `system` — được cài đặt tự động trong các bước điền bảng/chèn dữ liệu. Luôn hiện diện, không bao giờ hiển thị trong bộ chọn.
- `debugbar` — có thể chọn trong bước cài đặt.
- `pm` — có thể chọn trong bước cài đặt.
- `profile` — có thể chọn trong bước cài đặt.
- `protector` — có thể chọn trong bước cài đặt.

Quan trọng: trang trình cài đặt mô-đun (`htdocs/install/page_moduleinstaller.php`) xây dựng danh sách ứng viên bằng cách lặp lại `XoopsLists::getModulesList()` và **lọc ra mọi thứ đã có trong bảng modules** (dòng 95-102 thu thập `$listed_mods`; dòng 116 bỏ qua bất kỳ thư mục nào có trong danh sách đó). Vì `system` được cài đặt trước khi bước này chạy nên nó không bao giờ xuất hiện dưới dạng hộp kiểm.

Hướng dẫn thay đổi cần thiết:

- Đừng nói chỉ có 3 gói modules đi kèm.
- Mô tả bước cài đặt hiển thị **bốn modules** (`debugbar`, `pm`, `profile`, `protector`), không phải năm.
- Tài liệu `system` riêng biệt như mô-đun lõi luôn được cài đặt không xuất hiện trong bộ chọn.
- Thêm `debugbar` vào phần mô tả mô-đun đi kèm như mới trong 2.7.0.
- Lưu ý rằng việc lựa chọn trước mô-đun mặc định của trình cài đặt hiện trống; modules có sẵn để lựa chọn nhưng không được kiểm tra trước bằng cấu hình trình cài đặt.

## 8. Chương 8: Sẵn sàng lên đường

Tập tin:

- `chapter-8-ready-to-go.md`

### 8.1 Quá trình dọn dẹp cài đặt cần viết lại

Hướng dẫn hiện tại cho biết trình cài đặt đổi tên thư mục cài đặt thành một tên duy nhất.

Điều đó vẫn đúng trên thực tế, nhưng cơ chế đã thay đổi:

- tập lệnh dọn dẹp bên ngoài được tạo trong thư mục gốc của web
- trang cuối cùng kích hoạt việc dọn dẹp thông qua AJAX
- thư mục cài đặt được đổi tên thành `install_remove_<unique suffix>`
- dự phòng cho `cleanup.php` vẫn tồn tại

Hành động:

- Cập nhật lời giải thích.
- Hướng dẫn sử dụng đơn giản: xóa thư mục cài đặt đã đổi tên sau khi cài đặt.

### 8.2 Tham chiếu phụ lục bảng điều khiển dành cho quản trị viên đã lỗi thời

Chương 8 vẫn hướng người đọc về trải nghiệm admin thời Oxy cũ. Điều đó cần phải phù hợp với admin themes hiện tại:

- `default`
- `dark`
- `modern`
-`transition`

### 8.3 Cần chỉnh sửa hướng dẫn chỉnh sửa đường dẫn sau khi cài đặt

Văn bản hiện tại yêu cầu người đọc cập nhật `secure.php` với các định nghĩa đường dẫn. Trong 2.7.0, các hằng số đường dẫn đó được xác định trong `mainfile.php`, trong khi `secure.php` giữ dữ liệu an toàn. Khối ví dụ trong chương này cần được sửa lại cho phù hợp.

### 8.4 Cần thêm cài đặt sản xuất

Hướng dẫn nên đề cập rõ ràng các giá trị mặc định sản xuất hiện có trong `mainfile.dist.php`:

- `XOOPS_DB_LEGACY_LOG` nên giữ nguyên `false`
- `XOOPS_DEBUG` nên giữ nguyên `false`

## 9. Chương 9: Nâng cấp cài đặt XOOPS hiện có

Tập tin:

-`chapter-9-upgrade-existing-xoops-installation.md`

Chương này yêu cầu viết lại nhiều nhất.### 9.1 Thêm Smarty bắt buộc 4 bước kiểm tra trước

Luồng nâng cấp XOOPS 2.7.0 hiện buộc phải thực hiện quá trình kiểm tra trước khi hoàn tất nâng cấp.

Luồng yêu cầu mới:

1. Sao chép thư mục `upgrade/` vào thư mục gốc của trang web.
2. Chạy `/upgrade/preflight.php`.
3. Quét `/themes/` và `/modules/` để tìm cú pháp Smarty cũ.
4. Sử dụng chế độ sửa chữa tùy chọn khi thích hợp.
5. Chạy lại cho đến khi sạch.
6. Tiếp tục vào `/upgrade/`.

Chương hiện tại hoàn toàn không đề cập đến điều này, điều này khiến nó không tương thích với hướng dẫn 2.7.0.

### 9.2 Thay thế tường thuật hợp nhất thủ công thời 2.5.2

Chương hiện tại vẫn mô tả cách nâng cấp thủ công theo kiểu 2.5.2 với việc hợp nhất khung, ghi chú AltSys và cơ cấu lại tệp được quản lý bằng tay. Điều đó nên được thay thế bằng trình tự nâng cấp 2.7.x thực tế từ `release_notes.txt` và `upgrade/README.md`.

Đề cương chương được đề xuất:

1. Sao lưu tập tin và cơ sở dữ liệu.
2. Tắt trang web.
3. Sao chép `htdocs/` qua root trực tiếp.
4. Sao chép `htdocs/xoops_lib` vào đường dẫn thư viện đang hoạt động.
5. Sao chép `htdocs/xoops_data` vào đường dẫn dữ liệu đang hoạt động.
6. Sao chép `upgrade/` vào thư mục gốc của web.
7. Chạy `preflight.php`.
8. Chạy `/upgrade/`.
9. Hoàn thành các lời nhắc cập nhật.
10. Cập nhật mô-đun `system`.
11. Cập nhật `pm`, `profile` và `protector` nếu được cài đặt.
12. Xóa `upgrade/`.
13. Bật lại trang web.

### 9.3 Ghi lại những thay đổi thực tế trong bản nâng cấp 2.7.0

Trình cập nhật cho 2.7.0 includes ít nhất có những thay đổi cụ thể sau:

- tạo bảng `tokens`
- mở rộng `bannerclient.passwd` để băm mật khẩu hiện đại
- thêm cài đặt tùy chọn cookie phiên
- loại bỏ các thư mục đi kèm lỗi thời

Hướng dẫn không cần trình bày mọi chi tiết triển khai nhưng không nên ám chỉ rằng bản nâng cấp chỉ là bản sao tệp cộng với bản cập nhật mô-đun.

## 10. Trang nâng cấp lịch sử

Tập tin:

-`upgrading-from-xoops-2.4.5-easy-way.md`
- `upgrading-from-xoops-2.0.-above-2.0.14-and-2.2..md`
- `upgrading-from-any-xoops-2.0.7-to-2.0.13.2.md`
- `upgrading-a-non-utf-8-site.md`
- `upgrading-xoopseditor-package.md`

**Trạng thái:** quyết định về cấu trúc đã được giải quyết — `SUMMARY.md` gốc chuyển những mục này vào phần **Ghi chú nâng cấp lịch sử** chuyên dụng và mỗi tệp mang chú thích "Tham chiếu lịch sử" hướng người đọc đến Chương 9 để nâng cấp 2.7.0. Chúng không còn là hướng dẫn nâng cấp class đầu tiên nữa.

**Công việc còn lại (chỉ nhất quán):**

- Đảm bảo `README.md` (root) liệt kê những mục này trong cùng tiêu đề "Ghi chú nâng cấp lịch sử", chứ không phải dưới tiêu đề chung "Nâng cấp".
- Phản ánh sự phân tách tương tự trong `de/README.md`, `de/SUMMARY.md`, `fr/README.md`, `fr/SUMMARY.md` và `en/SUMMARY.md`.
- Đảm bảo mỗi trang nâng cấp lịch sử (gốc và bản sao `de/book/upg*.md` / `fr/book/upg*.md` đã bản địa hóa) có chú thích nội dung cũ liên kết trở lại Chương 9.

## 11. Phụ lục 1: GUI quản trị

Tập tin:

- `appendix-1-working-with-the-new-admin-gui-our-dashboard.md`

Phụ lục này được gắn với GUI Oxygen admin và cần viết lại.

Những thay đổi bắt buộc:

- thay thế tất cả các tài liệu tham khảo oxy
- thay thế ảnh chụp màn hình biểu tượng/menu cũ
- ghi lại admin themes hiện tại:
  - mặc định
  - tối
  - hiện đại
  - chuyển tiếp
- đề cập đến các khả năng 2.7.0 admin hiện tại được nêu trong ghi chú phát hành:
  - khả năng quá tải mẫu trong hệ thống admin themes
  - bộ chủ đề admin được cập nhật## 12. Phụ lục 2: Upload XOOPS Qua FTP

Tập tin:

- `appendix-2-uploading-xoops-via-ftp.md`

Những thay đổi bắt buộc:

- loại bỏ các giả định dành riêng cho HostGator và cPanel cụ thể
- hiện đại hóa từ ngữ tải lên tập tin
- lưu ý rằng `xoops_lib` hiện phụ thuộc vào includes Composer, vì vậy uploads lớn hơn và không nên cắt bớt có chọn lọc

## 13. Phụ lục 5: Bảo mật

Tập tin:

- `appendix-5-increase-security-of-your-xoops-installation.md`

Những thay đổi bắt buộc:

- xóa hoàn toàn thảo luận `register_globals`
- xóa vé máy chủ đã lỗi thời language
- sửa văn bản quyền từ `404` thành `0444` nơi dự định chỉ đọc
- cập nhật cuộc thảo luận về `mainfile.php` và `secure.php` để phù hợp với bố cục 2.7.0
- thêm bối cảnh liên tục liên quan đến bảo mật tên miền cookie mới:
  - `XOOPS_COOKIE_DOMAIN_USE_PSL`
  - `XOOPS_COOKIE_DOMAIN`
- thêm hướng dẫn sản xuất cho:
  - `XOOPS_DB_LEGACY_LOG`
  - `XOOPS_DEBUG`

## 14. Tác động duy trì đa ngôn ngữ

Sau khi các tệp tiếng Anh cấp cơ sở được sửa, cần có các bản cập nhật tương đương trong:

- `de/book/`
- `fr/book/`
- `de/README.md`
-`fr/README.md`
-`de/SUMMARY.md`
- `fr/SUMMARY.md`

Cây `en/` cũng cần được xem xét vì nó chứa một tập tài sản và README riêng biệt, nhưng dường như chỉ có một phần cây `book/`.

## 15. Thứ tự ưu tiên

### Quan trọng trước khi phát hành

1. Cập nhật tham chiếu repo/phiên bản lên 2.7.0.
2. Viết lại Chương 9 xoay quanh quy trình nâng cấp 2.7.0 thực và ánh sáng trước Smarty 4.
3. Cập nhật yêu cầu hệ thống lên PHP 8.2+ và MySQL 5.7.8+.
4. Đúng đường dẫn tệp khóa giấy phép Chương 7.
5. Kiểm kê chủ đề và mô-đun chính xác.
6. Đúng số bảng của Chương 6 từ 32 đến 33.

### Quan trọng về độ chính xác

7. Viết lại hướng dẫn đường dẫn có thể ghi.
8. Thêm yêu cầu về trình tải tự động của Composer vào thiết lập đường dẫn.
9. Cập nhật hướng dẫn bộ ký tự cơ sở dữ liệu lên `utf8mb4`.
10. Sửa hướng dẫn chỉnh sửa đường dẫn Chương 8 để các hằng số được ghi vào đúng tệp.
11. Xóa hướng dẫn kiểm tra tổng.
12. Loại bỏ hướng dẫn `register_globals` và PHP đã chết khác.

### Dọn dẹp chất lượng phát hành

13. Thay thế tất cả trình cài đặt và ảnh chụp màn hình admin.
14. Di chuyển các trang nâng cấp lịch sử ra khỏi luồng chính.
15. Đồng bộ hóa các bản tiếng Đức và tiếng Pháp sau khi tiếng Anh được sửa.
16. Dọn dẹp các liên kết cũ và các dòng README trùng lặp.