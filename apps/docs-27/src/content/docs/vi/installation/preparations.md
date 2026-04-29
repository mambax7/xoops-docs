---
title: "thông tin php"
---
Bước này là tùy chọn nhưng có thể dễ dàng giúp bạn tránh được nhiều giờ thất vọng.

Là một thử nghiệm cài đặt sẵn của hệ thống lưu trữ, một tập lệnh PHP rất nhỏ nhưng hữu ích được tạo cục bộ và tải lên hệ thống đích.

Tập lệnh PHP chỉ có một dòng:

```php
<?php phpinfo();
```

Sử dụng trình soạn thảo văn bản, tạo một tệp có tên _info.php_ với một dòng này.

Tiếp theo, tải tập tin này lên web root của bạn.

![Thông tin về Filezilla.php Upload](/xoops-docs/2.7/img/installation/filezilla-01-info.png)

Truy cập tập lệnh của bạn bằng cách mở nó trong trình duyệt của bạn, tức là truy cập `http://example.com/info.php`. Nếu mọi thứ đều hoạt động bình thường, bạn sẽ thấy một trang như thế này:

![Ví dụ phpinfo()](/xoops-docs/2.7/img/installation/php-info.png)

Lưu ý: một số dịch vụ lưu trữ có thể vô hiệu hóa chức năng _phpinfo()_ như một biện pháp bảo mật. Bạn thường sẽ nhận được một tin nhắn có nội dung như vậy, nếu đúng như vậy.

Đầu ra của tập lệnh có thể hữu ích cho việc khắc phục sự cố, vì vậy hãy cân nhắc việc lưu một bản sao của tập lệnh.

Nếu quá trình kiểm tra thành công, bạn có thể bắt đầu cài đặt. Bạn nên xóa tập lệnh _info.php_ và tiến hành cài đặt.

Nếu thử nghiệm thất bại, hãy điều tra lý do tại sao! Bất kỳ vấn đề gì đang ngăn cản thử nghiệm đơn giản này hoạt động **sẽ** ngăn cản quá trình cài đặt thực sự hoạt động.