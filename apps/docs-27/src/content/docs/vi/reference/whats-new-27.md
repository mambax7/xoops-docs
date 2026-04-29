---
title: "Có gì mới trong XOOPS 2.7.0"
---
XOOPS 2.7.0 là bản cập nhật quan trọng từ dòng 2.5.x. Trước khi cài đặt hoặc nâng cấp, hãy xem lại những thay đổi trên trang này để bạn biết điều gì sẽ xảy ra. Danh sách bên dưới tập trung vào các mục ảnh hưởng đến việc cài đặt và trang web administration — để biết danh sách đầy đủ các thay đổi, hãy xem ghi chú phát hành đi kèm với bản phân phối.

## PHP 8.2 là mức tối thiểu mới

XOOPS 2.7.0 yêu cầu **PHP 8.2 hoặc mới hơn**. PHP 7.x trở về trước không còn được hỗ trợ. Khuyến khích sử dụng PHP 8.4 trở lên.

**Hành động:** Xác nhận máy chủ của bạn cung cấp PHP 8.2+ trước khi bạn bắt đầu. Xem [Yêu cầu](installation/requirements.md).

## MySQL 5.7 là mức tối thiểu mới

Mức tối thiểu mới là **MySQL 5.7** (hoặc MariaDB tương thích). Khuyến khích sử dụng MySQL 8.4 trở lên. MySQL 9.0 cũng được hỗ trợ.

Các cảnh báo cũ về vấn đề tương thích PHP/MySQL 8 không còn áp dụng nữa vì các phiên bản PHP bị ảnh hưởng không còn được XOOPS hỗ trợ nữa.

## Smarty 4 thay thế Smarty 3

Đây là thay đổi lớn nhất đối với các trang web hiện có. XOOPS 2.7.0 sử dụng **Smarty 4** làm công cụ tạo khuôn mẫu. Smarty 4 có cú pháp mẫu chặt chẽ hơn Smarty 3 và một số themes và mô-đun templates tùy chỉnh có thể cần điều chỉnh trước khi hiển thị chính xác.

Để giúp bạn xác định và khắc phục những sự cố này, XOOPS 2.7.0 cung cấp **máy quét trước** trong thư mục `upgrade/` để kiểm tra templates hiện có của bạn để tìm những điểm không tương thích với Smarty 4 đã biết và có thể tự động sửa chữa nhiều vấn đề trong số đó.

**Hành động:** Nếu bạn đang nâng cấp từ 2.5.x và có themes tùy chỉnh trở lên modules, hãy chạy [Kiểm tra trước](upgrading/upgrade/preflight.md) _trước khi_ chạy trình nâng cấp chính.

## Các phần phụ thuộc do nhà soạn nhạc quản lý

XOOPS 2.7.0 sử dụng **Trình soạn thảo** để quản lý các phần phụ thuộc PHP của nó. Chúng sống trong `xoops_lib/vendor/`. Các thư viện của bên thứ ba trước đây được gói vào lõi hoặc vào modules — PHPMailer, HTMLPurifier, Smarty và các thư viện khác — hiện được cung cấp thông qua Composer.

**Hành động:** Hầu hết các nhà điều hành trang web không cần phải làm bất cứ điều gì — phát hành tarball đi kèm với `vendor/` đã được điền sẵn. Nếu bạn đang di chuyển hoặc nâng cấp một trang web, hãy sao chép toàn bộ cây `xoops_lib/`, bao gồm `vendor/`. Các nhà phát triển nhân bản git repository should run `composer install` inside `htdocs/xoops_lib/`. See [Notes for Developers](notes-for-developers/developers.md).

## Tùy chọn cookie phiên cứng mới

Hai tùy chọn mới được thêm vào trong quá trình nâng cấp:

* **`session_cookie_samesite`** — kiểm soát thuộc tính SameSite trên cookie phiên (`Lax`, `Strict` hoặc `None`).
* **`session_cookie_secure`** — khi được bật, cookie phiên chỉ được gửi qua HTTPS.

**Hành động:** Sau khi nâng cấp, hãy xem lại các mục này trong Tùy chọn hệ thống → Tùy chọn → Cài đặt chung. Xem [Sau khi nâng cấp](upgrading/upgrade/ustep-04.md).

## Bảng `tokens` mới

XOOPS 2.7.0 bổ sung bảng cơ sở dữ liệu `tokens` để lưu trữ mã thông báo có phạm vi chung. Trình nâng cấp tự động tạo bảng này như một phần của bản nâng cấp 2.5.11 → 2.7.0.

## Lưu trữ mật khẩu được hiện đại hóaCột `bannerclient.passwd` đã được mở rộng thành `VARCHAR(255)` để có thể chứa các hàm băm mật khẩu hiện đại (bcrypt, argon2). Trình nâng cấp sẽ tự động mở rộng cột.

## Đã cập nhật dòng chủ đề và mô-đun

XOOPS 2.7.0 xuất xưởng với giao diện người dùng themes được cập nhật:

* `default`, `xbootstrap` (cũ), `xbootstrap5`, `xswatch4`, `xswatch5`, `xtailwind`, `xtailwind2`

Chủ đề **Hiện đại** admin mới là included cùng với chủ đề Chuyển tiếp hiện có.

Mô-đun **DebugBar** mới dựa trên Symfony VarDumper được cung cấp dưới dạng một trong những modules có thể cài đặt tùy chọn. Nó rất hữu ích cho việc phát triển và dàn dựng, nhưng thường không được cài đặt trên các trang sản xuất công cộng.

Xem [Chọn chủ đề](installation/installation/step-12.md) và [Cài đặt mô-đun](installation/installation/step-13.md).

## Sao chép trong bản phát hành mới không còn ghi đè cấu hình

Trước đây, việc sao chép bản phân phối XOOPS mới lên trên trang hiện có cần phải cẩn thận để tránh ghi đè `mainfile.php` và các tệp cấu hình khác. Trong phiên bản 2.7.0, quá trình sao chép giữ nguyên các tệp cấu hình hiện có, giúp việc nâng cấp an toàn hơn đáng kể.

Bạn vẫn nên tạo một bản sao lưu đầy đủ trước khi nâng cấp.

## Khả năng quá tải mẫu trong hệ thống admin themes

Quản trị viên themes trong XOOPS 2.7.0 hiện có thể ghi đè hệ thống riêng lẻ admin templates, giúp tùy chỉnh giao diện người dùng administration dễ dàng hơn mà không cần phân tách toàn bộ mô-đun hệ thống.

## Những gì không thay đổi

Để yên tâm hơn, các phần này của XOOPS hoạt động theo cách tương tự trong 2.7.0 giống như trong 2.5.x:

* Thứ tự trang cài đặt và luồng tổng thể
* Phân chia cấu hình `mainfile.php` cộng với `xoops_data/data/secure.php`
* Phương pháp được khuyến nghị là di chuyển `xoops_data` và `xoops_lib` ra ngoài web root
* Mô hình cài đặt mô-đun và định dạng tệp kê khai `xoops_version.php`
* Quy trình di chuyển địa điểm (sao lưu, chỉnh sửa `mainfile.php`/`secure.php`, sử dụng SRDB hoặc tương tự)

## Đi đâu tiếp theo

* Bắt đầu mới? Tiếp tục tới [Yêu cầu](installation/requirements.md).
* Nâng cấp từ 2.5.x? Bắt đầu với [Nâng cấp](upgrading/upgrade/README.md), sau đó chạy [Kiểm tra trước chuyến bay](upgrading/upgrade/preflight.md).