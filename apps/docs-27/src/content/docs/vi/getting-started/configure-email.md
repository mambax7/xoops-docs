---
title: "Cấu hình email"
---
![Cấu hình email XOOPS](/xoops-docs/2.7/img/installation/xoops-04-email-setup.png)

XOOPS dựa vào email cho nhiều tương tác quan trọng của người dùng, chẳng hạn như xác thực đăng ký hoặc đặt lại mật khẩu. Vì vậy, điều quan trọng là nó phải được thiết lập chính xác.

Việc định cấu hình email trang web có thể rất dễ dàng trong một số trường hợp nhưng lại cực kỳ khó khăn trong một số trường hợp khác.

Dưới đây là một số mẹo giúp bạn thiết lập thành công.

## Phương thức gửi email

Phần cấu hình này có 4 giá trị có thể

* **PHP Mail()** - cách dễ nhất, nếu có. Phụ thuộc vào chương trình _sendmail_ của hệ thống.
* **sendmail** - Một tùy chọn sức mạnh công nghiệp, nhưng thường nhắm tới SPAM bằng cách khai thác điểm yếu trong phần mềm khác.
* **SMTP** - Giao thức truyền thư đơn giản thường không khả dụng trong các tài khoản lưu trữ mới do lo ngại về bảo mật và khả năng bị lạm dụng. Nó phần lớn đã được thay thế bằng SMTP Auth.
* **Xác thực SMTP** - SMTP có ủy quyền thường được ưu tiên hơn SMTP đơn giản. Trong trường hợp này XOOPS kết nối trực tiếp với máy chủ thư theo cách an toàn hơn.

## Máy chủ SMTP

Nếu bạn cần sử dụng SMTP, có hoặc không có "Auth", bạn sẽ cần chỉ định tên máy chủ tại đây. Tên đó có thể là tên máy chủ hoặc địa chỉ IP đơn giản hoặc có thể là thông tin giao thức và cổng bổ sung include. Trường hợp đơn giản nhất là `localhost` dành cho máy chủ SMTP (không có xác thực) chạy trên cùng một máy với máy chủ web.

Tên người dùng SMTP và mật khẩu SMTP luôn được yêu cầu khi sử dụng SMTP Auth. Có thể chỉ định TLS hoặc SSL, cũng như một cổng trong trường cấu hình XOOPS Máy chủ SMTP.

Điều này có thể được sử dụng để kết nối với SMTP của Gmail: `tls://smtp.gmail.com:587`

Một ví dụ khác sử dụng SSL: `ssl://mail.example.com:465`

## Mẹo khắc phục sự cố

Đôi khi, mọi thứ không diễn ra suôn sẻ như chúng ta mong đợi. Dưới đây là một số gợi ý và tài nguyên có thể hữu ích.

### Kiểm tra tài liệu của nhà cung cấp dịch vụ lưu trữ của bạn

Khi bạn thiết lập dịch vụ lưu trữ với nhà cung cấp, họ phải cung cấp thông tin về cách truy cập máy chủ email. Bạn muốn có sẵn tính năng này khi định cấu hình email cho hệ thống XOOPS của mình.

### XOOPS Sử dụng PHPMailer

XOOPS sử dụng thư viện [PHPMailer](https://github.com/PHPMailer/PHPMailer) để gửi email. Phần [khắc phục sự cố](https://github.com/PHPMailer/PHPMailer/wiki/Troubleshooting) trong wiki cung cấp một số thông tin chi tiết.