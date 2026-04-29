---
title: "Chủ đề đặc biệt"
---
Một số kết hợp phần mềm hệ thống cụ thể có thể yêu cầu một số cấu hình bổ sung để hoạt động
 với XOOPS. Dưới đây là một số chi tiết về các vấn đề đã biết và hướng dẫn cách giải quyết chúng.

## Môi trường SELinux

Một số tập tin và thư mục nhất định cần có khả năng ghi được trong quá trình cài đặt, nâng cấp và hoạt động bình thường
của XOOPS. Trong môi trường Linux truyền thống, điều này được thực hiện bằng cách đảm bảo rằng
người dùng hệ thống mà máy chủ web chạy có quyền trên các thư mục XOOPS, thường là bởi 
thiết lập nhóm thích hợp cho các thư mục đó.

Các hệ thống hỗ trợ SELinux (chẳng hạn như CentOS và RHEL) có một bối cảnh bảo mật bổ sung,
có thể hạn chế khả năng thay đổi hệ thống tập tin của một quy trình. Các hệ thống này có thể yêu cầu 
thay đổi bối cảnh bảo mật để XOOPS hoạt động chính xác.

XOOPS hy vọng có thể tự do ghi vào một số thư mục nhất định trong quá trình hoạt động bình thường. 
Ngoài ra, trong quá trình cài đặt và nâng cấp XOOPS, một số tệp nhất định cũng phải có khả năng ghi.
 
Trong quá trình hoạt động bình thường, XOOPS dự kiến có thể ghi tệp và tạo thư mục con 
trong các thư mục này:

- `uploads` trong web root XOOPS chính
- `xoops_data` bất cứ nơi nào nó được di dời trong quá trình cài đặt

Trong quá trình cài đặt hoặc nâng cấp XOOPS sẽ cần ghi vào tệp này:

- `mainfile.php` trong web root XOOPS chính

Đối với hệ thống dựa trên CentOS Apache điển hình, những thay đổi về bối cảnh bảo mật có thể 
được thực hiện bằng các lệnh sau:

```
chcon -Rv --type=httpd_sys_rw_content_t /path/to/web/root/uploads/
chcon -Rv --type=httpd_sys_rw_content_t /path/to/xoops_data/
```

Bạn có thể làm cho mainfile.php có thể ghi được bằng:

```
chcon -v --type=httpd_sys_rw_content_t /path/to/web/root/mainfile.php
```

Lưu ý: Khi cài đặt, bạn có thể sao chép mainfile.php trống từ thư mục *extras*.

Bạn cũng nên cho phép httpd gửi thư:

```
setsebool -P httpd_can_sendmail=1
```

Các cài đặt khác mà bạn có thể cần include:

Cho phép httpd tạo kết nối mạng, tức là tìm nạp nguồn cấp dữ liệu rss hoặc thực hiện cuộc gọi API:

```
setsebool -P httpd_can_network_connect 1
```

Cho phép kết nối mạng với cơ sở dữ liệu với:

```
setsebool -P httpd_can_network_connect_db=1
```

Để biết thêm thông tin, hãy tham khảo tài liệu hệ thống và/hoặc hệ thống administrator của bạn.

## Smarty 4 và Chủ đề tùy chỉnh

XOOPS 2.7.0 đã nâng cấp công cụ tạo khuôn mẫu từ Smarty 3 lên **Smarty 4**. Smarty 4 chặt chẽ hơn
về cú pháp mẫu hơn Smarty 3 và một số mẫu được chấp nhận trong templates cũ hơn
bây giờ sẽ gây ra lỗi. Nếu bạn đang cài đặt bản sao mới của XOOPS 2.7.0 chỉ bằng themes
và modules được gửi cùng với bản phát hành, không có gì phải lo lắng — mọi mẫu được gửi đi đều
đã được cập nhật để tương thích với Smarty 4.

Mối quan tâm áp dụng khi bạn:

- nâng cấp trang XOOPS 2.5.x hiện có có themes tùy chỉnh hoặc
- cài đặt themes tùy chỉnh hoặc modules của bên thứ ba cũ hơn vào XOOPS 2.7.0.

Trước khi chuyển lưu lượng truy cập trực tiếp sang trang web đã nâng cấp, hãy chạy trình quét trước chuyến bay đi kèm trong
Thư mục `/upgrade/`. Nó quét `/themes/` và `/modules/` để tìm kiếm sự không tương thích của Smarty 4
và có thể tự động sửa chữa nhiều trong số chúng. Xem
Trang [Kiểm tra trước chuyến bay](../upgrading/upgrade/preflight.md) để biết chi tiết.Nếu bạn gặp lỗi mẫu sau khi cài đặt hoặc nâng cấp:

1. Chạy lại `/upgrade/preflight.php` và giải quyết mọi vấn đề được báo cáo.
2. Xóa bộ đệm mẫu đã biên dịch bằng cách xóa mọi thứ ngoại trừ `index.html` khỏi
   `xoops_data/caches/smarty_compile/`.
3. Tạm thời chuyển sang chủ đề được cung cấp như `xbootstrap5` hoặc `default` để xác nhận sự cố
   là theo chủ đề cụ thể hơn là trên toàn trang web.
4. Xác thực mọi thay đổi về mẫu mô-đun hoặc chủ đề tùy chỉnh trước khi đưa trang web trở lại sản xuất.