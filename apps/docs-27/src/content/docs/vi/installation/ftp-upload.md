---
title: "Phụ lục 2: Tải lên XOOPS qua FTP"
---
Phụ lục này hướng dẫn cách triển khai XOOPS 2.7.0 tới máy chủ từ xa bằng FTP hoặc SFTP. Bất kỳ bảng điều khiển nào (cPanel, Plesk, DirectAdmin, v.v.) đều sẽ hiển thị các bước cơ bản giống nhau.

## 1. Chuẩn bị cơ sở dữ liệu

Thông qua bảng điều khiển của máy chủ của bạn:

1. Tạo cơ sở dữ liệu MySQL mới cho XOOPS.
2. Tạo người dùng cơ sở dữ liệu bằng mật khẩu mạnh.
3. Cấp cho người dùng đầy đủ đặc quyền trên cơ sở dữ liệu mới tạo.
4. Ghi lại tên cơ sở dữ liệu, tên người dùng, mật khẩu và máy chủ - bạn sẽ nhập chúng vào trình cài đặt XOOPS.

> **Mẹo**
>
> Bảng điều khiển hiện đại tạo mật khẩu mạnh cho bạn. Vì ứng dụng lưu trữ mật khẩu trong `xoops_data/data/secure.php` nên bạn không cần phải nhập mật khẩu thường xuyên — ưu tiên giá trị dài, được tạo ngẫu nhiên.

## 2. Tạo hộp thư administrator

Tạo một hộp thư email sẽ nhận thông báo administration của trang web. Trình cài đặt XOOPS yêu cầu địa chỉ này trong quá trình thiết lập tài khoản quản trị trang web và xác thực địa chỉ đó bằng `FILTER_VALIDATE_EMAIL`.

## 3. Tải file lên

XOOPS 2.7.0 đi kèm với các phần phụ thuộc của bên thứ ba được cài đặt sẵn trong `xoops_lib/vendor/` (Gói soạn nhạc, Smarty 4, HTMLPurifier, PHPMailer, Monolog, TCPDF, v.v.). Điều này làm cho `xoops_lib/` lớn hơn đáng kể so với 2.5.x — dự kiến ​​là hàng chục megabyte.

**Không bỏ qua có chọn lọc các tệp bên trong `xoops_lib/vendor/`.** Việc bỏ qua các tệp trong cây Composer vendor sẽ phá vỡ quá trình tự động tải và quá trình cài đặt sẽ không thành công.

Cấu trúc tải lên (giả sử `public_html` là gốc tài liệu):

1. Tải lên `xoops_data/` và `xoops_lib/` **bên cạnh** `public_html`, không phải bên trong nó. Đặt chúng bên ngoài web root là tư thế bảo mật được khuyến nghị cho 2.7.0.

   
```
   /home/your-user/
   ├── public_html/
   ├── xoops_data/     ← upload here
   └── xoops_lib/      ← upload here
   
```

   ![](/xoops-docs/2.7/img/installation/img_66.jpg)
   ![](/xoops-docs/2.7/img/installation/img_67.jpg)

2. Tải các nội dung còn lại của thư mục `htdocs/` phân phối vào `public_html/`.

   ![](/xoops-docs/2.7/img/installation/img_68.jpg)

> **Nếu máy chủ của bạn không cho phép các thư mục bên ngoài thư mục gốc**
>
> Tải lên `xoops_data/` và `xoops_lib/` **bên trong** `public_html/` và **đổi tên chúng thành tên không rõ ràng** (ví dụ `xdata_8f3k2/` và `xlib_7h2m1/`). Bạn sẽ nhập các đường dẫn đã đổi tên vào trình cài đặt khi nó yêu cầu Đường dẫn dữ liệu XOOPS và Đường dẫn thư viện XOOPS.

## 4. Làm cho các thư mục có thể ghi được có thể ghi được

Thông qua hộp thoại CHMOD (hoặc SSH) của máy khách FTP, làm cho máy chủ web có thể ghi được các thư mục được liệt kê trong Chương 2. Trên hầu hết các máy chủ được chia sẻ, `0775` trên các thư mục và `0664` trên `mainfile.php` là đủ. `0777` có thể được chấp nhận trong quá trình cài đặt nếu máy chủ của bạn chạy PHP dưới một người dùng không phải là người dùng FTP, nhưng hãy thắt chặt quyền sau khi quá trình cài đặt hoàn tất.

## 5. Khởi chạy trình cài đặt

Trỏ trình duyệt của bạn vào URL công khai của trang web. Nếu tất cả các tệp đã sẵn sàng, Trình hướng dẫn cài đặt XOOPS sẽ khởi động và bạn có thể làm theo phần còn lại của hướng dẫn này từ [Chương 2](chapter-2-introduction.md) trở đi.