---
title: "Sau khi nâng cấp"
---
## Cập nhật mô-đun hệ thống

Sau khi tất cả các bản vá cần thiết đã được áp dụng, việc chọn _Tiếp tục_ sẽ thiết lập mọi thứ để cập nhật mô-đun **system**. Đây là bước rất quan trọng và cần thiết để hoàn thành việc nâng cấp đúng cách.

![Mô-đun hệ thống cập nhật XOOPS](/xoops-docs/2.7/img/installation/upgrade-06-update-system-module.png)

Chọn _Update_ để thực hiện cập nhật mô-đun Hệ thống.

## Cập nhật các mô-đun được cung cấp XOOPS khác

XOOPS đi kèm với ba hồ sơ modules - pm (Nhắn tin riêng tư,) tùy chọn (Hồ sơ người dùng) và trình bảo vệ (Người bảo vệ) Bạn nên cập nhật trên bất kỳ modules nào đã được cài đặt.

![XOOPS Cập nhật các mô-đun khác](/xoops-docs/2.7/img/installation/upgrade-07-update-modules.png)

## Cập nhật các module khác

Có khả năng có các bản cập nhật cho modules khác có thể cho phép modules hoạt động tốt hơn với XOOPS hiện đã được cập nhật của bạn. Bạn nên điều tra và áp dụng mọi bản cập nhật mô-đun thích hợp.

## Xem lại các tùy chọn làm cứng cookie mới

Bản nâng cấp XOOPS 2.7.0 bổ sung hai tùy chọn mới kiểm soát cách phát hành cookie phiên:

* **`session_cookie_samesite`** — kiểm soát thuộc tính cookie SameSite. `Lax` là mặc định an toàn cho hầu hết các trang web. Sử dụng `Strict` để được bảo vệ tối đa nếu trang web của bạn không dựa vào điều hướng nhiều nguồn gốc. `None` chỉ phù hợp nếu bạn biết mình cần nó.
* **`session_cookie_secure`** — khi được bật, cookie phiên chỉ được gửi qua kết nối HTTPS. Hãy bật tính năng này nếu trang web của bạn chạy trên HTTPS.

Bạn có thể xem lại các cài đặt này trong Tùy chọn hệ thống → Tùy chọn → Cài đặt chung.

## Xác thực chủ đề tùy chỉnh

Nếu trang web của bạn sử dụng chủ đề tùy chỉnh, hãy xem qua giao diện người dùng và khu vực admin để xác nhận rằng các trang hiển thị chính xác. Việc nâng cấp lên Smarty 4 có thể ảnh hưởng đến templates tùy chỉnh ngay cả khi quá trình quét trước đã vượt qua. Nếu bạn thấy vấn đề kết xuất, hãy truy cập lại [Xử lý sự cố](ustep-03.md).

## Dọn dẹp các tập tin cài đặt và nâng cấp

Để bảo mật, hãy xóa các thư mục này khỏi web root của bạn sau khi quá trình nâng cấp được xác nhận là hoạt động:

* `upgrade/` — thư mục quy trình nâng cấp
* `install/` — nếu có, dưới dạng `install/` hoặc dưới dạng thư mục `installremove*` đã được đổi tên

Việc để chúng ở đúng vị trí sẽ hiển thị các tập lệnh nâng cấp và cài đặt cho bất kỳ ai có thể truy cập trang web của bạn.

## Mở trang web của bạn

Nếu bạn làm theo lời khuyên _Tắt trang web của mình_, bạn nên bật lại sau khi xác định rằng trang web đang hoạt động bình thường.