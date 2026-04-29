---
title: "Xử lý sự cố"
---
## Smarty 4 lỗi mẫu

Sự cố phổ biến nhất của class khi nâng cấp từ XOOPS 2.5.x lên 2.7.0 là không tương thích mẫu Smarty 4. Nếu bạn bỏ qua hoặc không hoàn thành [Kiểm tra trước chuyến bay](preflight.md), bạn có thể thấy lỗi mẫu ở giao diện người dùng hoặc trong khu vực admin sau khi nâng cấp.

Để phục hồi:

1. **Chạy lại máy quét trước** tại `/upgrade/preflight.php`. Áp dụng mọi sửa chữa tự động mà nó cung cấp hoặc sửa templates được gắn cờ theo cách thủ công.
2. **Xóa bộ đệm mẫu đã biên dịch.** Xóa mọi thứ ngoại trừ `index.html` khỏi `xoops_data/caches/smarty_compile/`. Smarty 3 được biên dịch templates không tương thích với Smarty 4 và các tệp cũ có thể gây ra lỗi khó hiểu.
3. **Chuyển tạm thời sang chủ đề đã gửi.** Từ khu vực admin, chọn `xbootstrap5` hoặc `default` làm chủ đề hiện hoạt. Điều này sẽ xác nhận xem sự cố chỉ giới hạn ở một chủ đề tùy chỉnh hay trên toàn trang web.
4. **Xác thực mọi themes và mô-đun templates tùy chỉnh** trước khi bật lại lưu lượng sản xuất. Đặc biệt chú ý đến templates sử dụng khối `{php}`, công cụ sửa đổi không được dùng nữa hoặc cú pháp dấu phân cách không chuẩn — đây là những sự cố Smarty 4 phổ biến nhất.

Xem thêm phần Smarty 4 trong [Chủ đề đặc biệt](../../installation/specialtopics.md).

## Vấn đề về quyền

Bản nâng cấp XOOPS có thể cần ghi vào các tệp trước đây được đặt ở chế độ chỉ đọc. Nếu đúng như vậy, bạn sẽ thấy một thông báo như thế này:

![Nâng cấp XOOPS gây ra lỗi có thể ghi](/xoops-docs/2.7/img/installation/upgrade-03-make-writable.png)

Giải pháp là thay đổi quyền. Bạn có thể thay đổi quyền bằng FTP nếu bạn không có quyền truy cập trực tiếp hơn. Đây là một ví dụ sử dụng FileZilla:

![Quyền thay đổi FileZilla](/xoops-docs/2.7/img/installation/upgrade-04-change-permissions.png)

## Đầu ra gỡ lỗi

Bạn có thể bật đầu ra gỡ lỗi bổ sung trong trình ghi nhật ký bằng cách thêm tham số gỡ lỗi vào URL được sử dụng để khởi chạy Nâng cấp:

```text
http://example.com/upgrade/?debug=1
```