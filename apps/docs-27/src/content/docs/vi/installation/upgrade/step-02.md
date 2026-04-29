---
title: "Đang chạy nâng cấp"
---
Trước khi chạy trình nâng cấp chính, hãy đảm bảo bạn đã hoàn thành [Kiểm tra trước chuyến bay] (preflight.md). Giao diện người dùng nâng cấp yêu cầu phải chạy preflight ít nhất một lần và sẽ hướng dẫn bạn tới đó nếu bạn chưa làm như vậy.

Khởi chạy nâng cấp bằng cách trỏ trình duyệt của bạn tới thư mục _upgrade_ trên trang web của bạn:

```text
http://example.com/upgrade/
```

Điều này sẽ hiển thị một trang như thế này:

![XOOPS Khởi động nâng cấp](/xoops-docs/2.7/img/installation/upgrade-01.png)

Chọn nút "Tiếp tục" để tiếp tục.

Mỗi "Tiếp tục" tiến tới một bản vá khác. Tiếp tục cho đến khi tất cả các bản vá được áp dụng và trang Cập nhật mô-đun hệ thống được hiển thị.

![Bản vá ứng dụng nâng cấp XOOPS](/xoops-docs/2.7/img/installation/upgrade-05-applied.png)

## Bản nâng cấp 2.5.11 → 2.7.0 áp dụng những gì

Khi nâng cấp từ XOOPS 2.5.11 lên 2.7.0, trình nâng cấp sẽ áp dụng các bản vá sau. Mỗi bước được trình bày dưới dạng một bước riêng biệt trong trình hướng dẫn để bạn có thể xác nhận những gì đang được thay đổi:

1. **Xóa gói PHPMailer lỗi thời.** Bản sao đi kèm của PHPMailer bên trong mô-đun Protector sẽ bị xóa. PHPMailer hiện được cung cấp thông qua Composer trong `xoops_lib/vendor/`.
2. **Xóa thư mục HTMLPurifier lỗi thời.** Tương tự, thư mục HTMLPurifier cũ bên trong mô-đun Protector cũng bị xóa. HTMLPurifier hiện được cung cấp thông qua Composer.
3. **Tạo bảng `tokens`.** Một bảng `tokens` mới được thêm vào để lưu trữ mã thông báo trong phạm vi chung. Bảng này có các cột cho id mã thông báo, id người dùng, phạm vi, hàm băm và dấu thời gian đã phát hành/hết hạn/đã sử dụng và được sử dụng bởi các tính năng dựa trên mã thông báo trong XOOPS 2.7.0.
4. **Mở rộng `bannerclient.passwd`.** Cột `bannerclient.passwd` được mở rộng thành `VARCHAR(255)` để cột này có thể lưu trữ các hàm băm mật khẩu hiện đại (bcrypt, argon2) thay vì cột hẹp truyền thống.
5. **Thêm tùy chọn cookie phiên.** Hai tùy chọn mới được chèn: `session_cookie_samesite` (dành cho thuộc tính cookie SameSite) và `session_cookie_secure` (để buộc cookie chỉ HTTPS). Xem [Sau khi nâng cấp](ustep-04.md) để biết cách xem lại những thông tin này sau khi quá trình nâng cấp hoàn tất.

Không có bước nào trong số này chạm tới dữ liệu nội dung của bạn. Người dùng, bài đăng, hình ảnh và dữ liệu mô-đun của bạn vẫn được giữ nguyên.

## Chọn ngôn ngữ

Bản phân phối XOOPS chính có hỗ trợ tiếng Anh. Hỗ trợ cho các ngôn ngữ bổ sung được cung cấp bởi [XOOPS Các trang web hỗ trợ cục bộ](https://xoops.org/modules/xoopspartners/). Hỗ trợ này có thể ở dạng bản phân phối tùy chỉnh hoặc các tệp bổ sung để thêm vào bản phân phối chính.

Bản dịch XOOPS được duy trì trên [transifex](https://www.transifex.com/xoops/public/)

Nếu Trình nâng cấp XOOPS của bạn có hỗ trợ bổ sung language, bạn có thể thay đổi language bằng cách chọn biểu tượng language trong menu trên cùng và chọn language khác.

![Ngôn ngữ nâng cấp XOOPS](/xoops-docs/2.7/img/installation/upgrade-02-change-language.png)