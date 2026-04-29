---
title: "Kiểm tra trước chuyến bay"
---
XOOPS 2.7.0 đã nâng cấp công cụ tạo khuôn mẫu từ Smarty 3 lên Smarty 4. Smarty 4 chặt chẽ hơn về cú pháp mẫu so với Smarty 3 và một số themes và mô-đun templates tùy chỉnh có thể cần được điều chỉnh trước khi chúng hoạt động chính xác trên XOOPS 2.7.0.

Để giúp xác định và khắc phục những sự cố này _trước khi_ bạn chạy trình nâng cấp chính, XOOPS 2.7.0 đi kèm **máy quét trước** trong thư mục `upgrade/`. Bạn phải chạy trình quét trước ít nhất một lần trước khi quy trình nâng cấp chính cho phép bạn tiếp tục.

## Máy quét làm gì

Trình quét trước chuyến bay sẽ xem xét themes hiện có của bạn và mô-đun templates để tìm kiếm những điểm không tương thích với Smarty 4 đã biết. Nó có thể:

* **Quét** các thư mục `themes/` và `modules/` của bạn để tìm các tệp mẫu `.tpl` và `.html` có thể cần thay đổi
* **Báo cáo** các vấn đề được nhóm theo tệp và theo loại vấn đề
* **Tự động sửa chữa** nhiều vấn đề thường gặp khi bạn yêu cầu

Không phải mọi vấn đề đều có thể được sửa chữa tự động. Một số templates sẽ cần chỉnh sửa thủ công, đặc biệt nếu chúng sử dụng các thành ngữ Smarty 3 cũ hơn không có tương đương trực tiếp trong Smarty 4.

## Chạy máy quét

1. Sao chép thư mục phân phối `upgrade/` vào web root của trang web của bạn (nếu bạn chưa làm như vậy trong bước [Chuẩn bị nâng cấp](ustep-01.md).
2. Trỏ trình duyệt của bạn vào preflight URL:

   
```text
   http://example.com/upgrade/preflight.php
   
```

3. Đăng nhập bằng tài khoản administrator khi được nhắc.
4. Máy quét hiển thị một biểu mẫu có ba điều khiển:
   * **Thư mục mẫu** — để trống để quét cả `themes/` và `modules/`. Nhập đường dẫn như `/themes/mytheme/` để thu hẹp phạm vi quét vào một thư mục.
   * **Phần mở rộng mẫu** — để trống để quét cả tệp `.tpl` và `.html`. Nhập một phần mở rộng duy nhất để thu hẹp phạm vi quét.
   * **Cố gắng tự động sửa** — chọn hộp này nếu bạn muốn máy quét khắc phục các sự cố mà nó biết cách khắc phục. Bỏ chọn nó để quét chỉ đọc.
5. Nhấn nút **Chạy**. Máy quét sẽ duyệt qua các thư mục đã chọn và báo cáo từng vấn đề mà nó tìm thấy.

## Diễn giải kết quả

Báo cáo quét liệt kê mọi tệp mà nó đã kiểm tra và mọi vấn đề được tìm thấy. Mỗi mục nhập vấn đề sẽ cho bạn biết:

* Tệp nào chứa vấn đề
* Nó vi phạm 4 quy tắc nào của Smarty
* Liệu máy quét có thể tự động sửa chữa nó hay không

Nếu bạn quét với tính năng _Attempt auto fix_ được bật, báo cáo cũng sẽ xác nhận những tệp nào đã được ghi lại.

## Khắc phục sự cố theo cách thủ công

Đối với các sự cố mà máy quét không thể tự động sửa chữa, hãy mở tệp mẫu được gắn cờ trong trình chỉnh sửa và thực hiện các thay đổi cần thiết. Smarty 4 điểm không tương thích phổ biến include:

* Khối `{php} ... {/php}` (không còn được hỗ trợ trong Smarty 4)
* Công cụ sửa đổi và lệnh gọi hàm không được dùng nữa
* Cách sử dụng dấu phân cách nhạy cảm với khoảng trắng
* Giả định plugin tại thời điểm đăng ký đã thay đổi trong Smarty 4

Nếu bạn không thoải mái khi chỉnh sửa templates, cách an toàn nhất là chuyển sang một chủ đề đã được cung cấp (`xbootstrap5`, `default`, `xswatch5`, v.v.) và xử lý riêng chủ đề tùy chỉnh sau khi quá trình nâng cấp hoàn tất.## Chạy lại cho đến khi sạch

Sau khi thực hiện sửa lỗi - dù là tự động hay thủ công - hãy chạy lại trình quét trước. Lặp lại cho đến khi quá trình quét báo cáo không còn vấn đề gì.

Sau khi quá trình quét hoàn tất, bạn có thể kết thúc phiên làm việc trước bằng cách nhấn nút **Thoát máy quét** trong giao diện người dùng máy quét. Điều này đánh dấu quá trình kiểm tra trước là hoàn tất và cho phép quá trình nâng cấp chính tại `/upgrade/` tiếp tục.

## Tiếp tục nâng cấp

Khi quá trình kiểm tra trước hoàn tất, bạn có thể khởi chạy trình nâng cấp chính tại:

```text
http://example.com/upgrade/
```

Xem [Đang chạy nâng cấp](ustep-02.md) để biết các bước tiếp theo.

## Nếu bạn bỏ qua chuyến bay trước

Việc bỏ qua ánh sáng trước không được khuyến khích nhưng nếu bạn đã nâng cấp mà không chạy nó và hiện thấy lỗi mẫu, hãy xem phần Smarty 4 Lỗi mẫu của [Khắc phục sự cố](ustep-03.md). Bạn có thể chạy preflight sau khi thực tế và xóa `xoops_data/caches/smarty_compile/` để khôi phục.