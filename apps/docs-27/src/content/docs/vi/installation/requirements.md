---
title: "Yêu cầu"
---
## Môi trường phần mềm (Ngăn xếp)

Hầu hết các cơ sở sản xuất XOOPS đều chạy trên ngăn xếp _LAMP_ (hệ thống **L**inux chạy **A**pache, **M**ySQL và **P**HP), tuy nhiên, có rất nhiều ngăn xếp khác nhau có thể có.

Việc tạo nguyên mẫu một trang web mới trên máy cục bộ thường là dễ dàng nhất. Trong trường hợp này, nhiều người dùng XOOPS chọn ngăn xếp _WAMP_ (sử dụng **W**indows làm hệ điều hành) trong khi những người khác chạy ngăn xếp _LAMP_ hoặc _MAMP_ (**M**AC).

### PHP

Mọi phiên bản PHP &gt;= 8.2.0 (Khuyến nghị sử dụng PHP 8.4 trở lên)

> **Quan trọng:** XOOPS 2.7.0 yêu cầu **PHP 8.2 trở lên**. PHP 7.x trở về trước không còn được hỗ trợ. Nếu bạn đang nâng cấp một trang web cũ hơn, hãy xác nhận rằng máy chủ của bạn cung cấp PHP 8.2+ trước khi bắt đầu.

### MySQL

Máy chủ MySQL 5.7 trở lên (Khuyến nghị sử dụng MySQL Máy chủ 8.4 trở lên.) MySQL 9.0 cũng được hỗ trợ. MariaDB là phiên bản thay thế nhị phân, tương thích ngược của MySQL và cũng hoạt động tốt với XOOPS.

### Máy chủ web

Một máy chủ web hỗ trợ chạy các tập lệnh PHP, chẳng hạn như Apache, NGINX, LiteSpeed, v.v.

### Phần mở rộng PHP bắt buộc

Trình cài đặt XOOPS xác minh các tiện ích mở rộng sau đã được tải trước khi cho phép tiến hành cài đặt:

* `mysqli` — Trình điều khiển cơ sở dữ liệu MySQL
* `session` — xử lý phiên
* `pcre` - Biểu thức chính quy tương thích với Perl
* `filter` — lọc và xác thực đầu vào
* `fileinfo` — Phát hiện loại MIME cho uploads

### Yêu cầu cài đặt PHP

Ngoài các tiện ích mở rộng ở trên, trình cài đặt sẽ xác minh cài đặt `php.ini` sau:

* `file_uploads` phải **Bật** — nếu không có nó, XOOPS không thể chấp nhận các tệp đã tải lên

### Tiện ích mở rộng PHP được đề xuất

Trình cài đặt cũng kiểm tra các phần mở rộng này. Chúng không bắt buộc phải có, nhưng XOOPS và hầu hết modules đều dựa vào chúng để có đầy đủ chức năng. Kích hoạt số lượng mà máy chủ của bạn cho phép:

* `mbstring` — xử lý chuỗi nhiều byte
* `intl` - quốc tế hóa
* `iconv` — chuyển đổi bộ ký tự
* `xml` - phân tích cú pháp XML
* `zlib` - nén
* `gd` - xử lý hình ảnh
* `exif` — siêu dữ liệu hình ảnh
* `curl` - Ứng dụng khách HTTP cho nguồn cấp dữ liệu và cuộc gọi API

## Dịch vụ

### Quyền truy cập hệ thống tệp (để truy cập quản trị trang web)

Bạn sẽ cần một số phương thức (FTP, SFTP, v.v.) để chuyển các tệp phân phối XOOPS sang máy chủ web.

### Quyền truy cập hệ thống tệp (đối với quy trình máy chủ web)

Để chạy XOOPS, cần có khả năng tạo, đọc và xóa các tệp và thư mục. Quá trình máy chủ web phải có thể ghi được các đường dẫn sau để cài đặt bình thường và hoạt động bình thường hàng ngày:* `uploads/`
* `uploads/avatars/`
* `uploads/files/`
* `uploads/images/`
* `uploads/ranks/`
* `uploads/smilies/`
* `mainfile.php` (có thể ghi trong quá trình cài đặt và nâng cấp)
* `xoops_data/`
* `xoops_data/caches/`
* `xoops_data/caches/xoops_cache/`
* `xoops_data/caches/smarty_cache/`
* `xoops_data/caches/smarty_compile/`
* `xoops_data/configs/`
* `xoops_data/configs/captcha/`
* `xoops_data/configs/textsanitizer/`
* `xoops_data/data/`
* `xoops_data/protector/`

### Cơ sở dữ liệu

XOOPS sẽ cần tạo, sửa đổi và truy vấn các bảng trong MySQL. Đối với điều này, bạn sẽ cần:

* tài khoản và mật khẩu người dùng MySQL
* cơ sở dữ liệu MySQL mà người dùng có tất cả các đặc quyền trên đó (hoặc cách khác, người dùng có thể có đặc quyền tạo cơ sở dữ liệu đó)

### Email

Đối với một trang web trực tiếp, bạn sẽ cần một địa chỉ email đang hoạt động mà XOOPS có thể sử dụng để liên lạc với người dùng, chẳng hạn như kích hoạt tài khoản và đặt lại mật khẩu. Mặc dù không bắt buộc nghiêm ngặt nhưng nếu có thể, bạn nên sử dụng địa chỉ email phù hợp với miền mà XOOPS của bạn chạy trên đó. Điều đó giúp tránh việc thông tin liên lạc của bạn bị từ chối hoặc bị đánh dấu là thư rác.

## Công cụ

Bạn có thể cần một số công cụ bổ sung để thiết lập và tùy chỉnh cài đặt XOOPS của mình. Đây có thể là include:

* Phần mềm máy khách FTP
* Trình soạn thảo văn bản
* Phần mềm lưu trữ hoạt động với các tệp phát hành XOOPS (_.zip_ hoặc _.tar.gz_).

Xem phần [Công cụ giao dịch](../tools/tools.md) để biết một số đề xuất về các công cụ phù hợp và ngăn xếp máy chủ web nếu cần.

## Chủ đề đặc biệt

Một số kết hợp phần mềm hệ thống cụ thể có thể yêu cầu một số cấu hình bổ sung để hoạt động với XOOPS. Nếu bạn đang sử dụng môi trường SELinux hoặc nâng cấp trang web cũ hơn với themes tùy chỉnh, vui lòng tham khảo [Chủ đề đặc biệt](specialtopics.md) để biết thêm thông tin.