---
title: "Chuẩn bị nâng cấp"
---
## Tắt trang web

Trước khi bắt đầu quá trình nâng cấp XOOPS, bạn nên đặt tùy chọn "Tắt trang web của bạn?" mục vào _Có_ trong Tùy chọn -&gt; Tùy chọn hệ thống -&gt; Trang Cài đặt chung trong Menu Quản trị.

Điều này giúp người dùng không gặp phải trang web bị hỏng trong quá trình nâng cấp. Nó cũng hạn chế tranh chấp tài nguyên ở mức tối thiểu để đảm bảo nâng cấp mượt mà hơn.

Thay vì có lỗi và trang web bị hỏng, khách truy cập của bạn sẽ thấy nội dung như thế này:

![Trang web đã đóng trên thiết bị di động](/xoops-docs/2.7/img/installation/mobile-site-closed.png)

## Sao lưu

Bạn nên sử dụng phần XOOPS administration _Maintenance_ để _Làm sạch thư mục bộ nhớ đệm_ cho tất cả các bộ nhớ đệm trước khi tạo bản sao lưu toàn bộ các tệp trên trang web của bạn. Khi trang web bị tắt, bạn cũng nên sử dụng _Làm sạch bảng phiên_ để nếu cần khôi phục thì các phiên cũ sẽ không còn là một phần của trang đó.

### Tệp

Việc sao lưu tệp có thể được thực hiện bằng FTP, sao chép tất cả các tệp vào máy cục bộ của bạn. Nếu bạn có quyền truy cập shell trực tiếp vào máy chủ, việc tạo một bản sao (hoặc bản sao lưu trữ) ở đó có thể nhanh hơn nhiều.

### Cơ sở dữ liệu

Để tạo bản sao lưu cơ sở dữ liệu, bạn có thể sử dụng các hàm dựng sẵn trong phần XOOPS administration _Maintenance_. Bạn cũng có thể sử dụng hàm _Export_ trong _phpMyAdmin_, nếu có. Nếu bạn có quyền truy cập shell, bạn có thể sử dụng lệnh _mysql_ để kết xuất cơ sở dữ liệu của mình.

Thông thạo việc sao lưu và _khôi phục_ cơ sở dữ liệu của bạn là một kỹ năng quản trị trang web quan trọng. Có nhiều tài nguyên trực tuyến mà bạn có thể sử dụng để tìm hiểu thêm về các thao tác này phù hợp với cài đặt của mình, chẳng hạn như [http://webcheatsheet.com/sql/mysql_backup_restore.php](http://webcheatsheet.com/sql/mysql_backup_restore.php)

![Xuất phpMyAdmin](/xoops-docs/2.7/img/installation/phpmyadmin-export-01.png)

## Sao chép tệp mới vào trang web

Việc sao chép các tệp mới vào trang web của bạn hầu như giống với bước [Chuẩn bị](../../installation/preparations/) trong khi cài đặt. Bạn nên sao chép thư mục _xoops_data_ và _xoops_lib_ vào bất kỳ nơi nào chúng được di chuyển trong quá trình cài đặt. Sau đó, sao chép phần nội dung còn lại của thư mục _htdocs_ của bản phân phối (với một số ngoại lệ được đề cập trong phần tiếp theo) qua các tệp và thư mục hiện có trong web root của bạn.

Trong XOOPS 2.7.0, sao chép bản phân phối mới lên trên trang hiện có **sẽ không ghi đè các tệp cấu hình hiện có** chẳng hạn như `mainfile.php` hoặc `xoops_data/data/secure.php`. Đây là một thay đổi đáng hoan nghênh so với các phiên bản trước, nhưng bạn vẫn nên tạo bản sao lưu đầy đủ trước khi bắt đầu.

Sao chép toàn bộ thư mục _upgrade_ từ bản phân phối vào web root của bạn, tạo thư mục _upgrade_ ở đó.

## Chạy Smarty 4 Kiểm tra trước chuyến bay

Trước khi khởi chạy quy trình công việc `/upgrade/` chính, bạn phải chạy trình quét preflight có trong thư mục `upgrade/`. Nó kiểm tra themes và mô-đun templates hiện có của bạn để tìm các vấn đề tương thích với Smarty 4 và có thể tự động sửa chữa nhiều vấn đề trong số đó.

1. Trỏ trình duyệt của bạn tới _your-site-url_/upgrade/preflight.php
2. Log in with an administrator account
3. Chạy quét và xem lại báo cáo
4. Áp dụng bất kỳ sửa chữa tự động nào được cung cấp hoặc sửa templates được gắn cờ theo cách thủ công
5. Chạy lại quá trình quét cho đến khi sạch
6. Chỉ sau đó mới tiếp tục nâng cấp chính

Xem trang [Kiểm tra trước chuyến bay](preflight.md) để biết hướng dẫn đầy đủ.

### Những điều bạn có thể không muốn sao chépBạn không nên sao chép lại thư mục _install_ vào hệ thống XOOPS đang hoạt động. Việc để lại thư mục cài đặt trong bản cài đặt XOOPS sẽ khiến hệ thống của bạn gặp phải các vấn đề bảo mật tiềm ẩn. Trình cài đặt đổi tên ngẫu nhiên nó, nhưng bạn nên xóa nó và đảm bảo không sao chép sang cái khác.

Có một số tệp bạn có thể đã chỉnh sửa để tùy chỉnh trang web của mình và bạn sẽ muốn giữ lại những tệp đó. Dưới đây là danh sách các tùy chỉnh phổ biến.

* _xoops_data/configs/xoopsconfig.php_ nếu nó đã bị thay đổi kể từ khi trang web được cài đặt
* bất kỳ thư mục nào trong _themes_ nếu được tùy chỉnh cho trang web của bạn. Trong trường hợp này, bạn có thể muốn so sánh các tệp để xác định các bản cập nhật hữu ích.
* bất kỳ tệp nào trong _class/captcha/_ bắt đầu bằng "config" nếu nó đã bị thay đổi kể từ khi trang web được cài đặt
* mọi tùy chỉnh trong _class/textsanitizer_
* mọi tùy chỉnh trong _class/xoopseditor_

Nếu bạn nhận ra sau khi nâng cấp rằng nội dung nào đó đã vô tình bị ghi đè, đừng hoảng sợ -- đó là lý do tại sao bạn bắt đầu với bản sao lưu đầy đủ. _(Bạn đã sao lưu rồi phải không?)_

## Kiểm tra mainfile.php (Nâng cấp từ XOOPS Pre-2.5)

Bước này chỉ áp dụng nếu bạn đang nâng cấp từ phiên bản XOOPS cũ (2.3 trở về trước). Nếu bạn đang nâng cấp từ XOOPS 2.5.x, bạn có thể bỏ qua phần này.

Các phiên bản cũ của XOOPS yêu cầu thực hiện một số thay đổi thủ công trong `mainfile.php` để kích hoạt mô-đun Protector. Trong web root của bạn, bạn nên có một tệp có tên `mainfile.php`. Mở tệp đó trong trình chỉnh sửa của bạn và tìm những dòng sau:

```php
include XOOPS_TRUST_PATH.'/modules/protector/include/precheck.inc.php' ;
```

và

```php
include XOOPS_TRUST_PATH.'/modules/protector/include/postcheck.inc.php' ;
```

Hãy xóa những dòng này nếu bạn tìm thấy và lưu tệp trước khi tiếp tục.