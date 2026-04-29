---
title: "Lưu cấu hình"
---
Trang này hiển thị kết quả lưu thông tin cấu hình bạn đã nhập tính đến thời điểm này.

Sau khi xem xét và khắc phục mọi vấn đề, hãy chọn nút "Tiếp tục" để tiếp tục.

## Về thành công

Phần _Lưu cấu hình hệ thống của bạn_ hiển thị thông tin đã được lưu. Các cài đặt được lưu vào một trong hai tệp. Một tệp là _mainfile.php_ trong thư mục gốc của web. Cái còn lại là _data/secure.php_ trong thư mục _xoops_data_.

![Cấu hình lưu trình cài đặt XOOPS](/xoops-docs/2.7/img/installation/installer-07.png)

Cả hai tệp đều được tạo từ các tệp mẫu đi kèm với XOOPS 2.7.0:

* `mainfile.php` được tạo từ `mainfile.dist.php` trong web root.
* `xoops_data/data/secure.php` được tạo từ `xoops_data/data/secure.dist.php`.

Ngoài các đường dẫn và URL bạn đã nhập, `mainfile.php` hiện là includes, một số hằng số mới trong XOOPS 2.7.0:

* `XOOPS_TRUST_PATH` — được giữ làm bí danh tương thích ngược của `XOOPS_PATH`; bạn không cần phải cấu hình nó một cách riêng biệt.
* `XOOPS_COOKIE_DOMAIN_USE_PSL` — mặc định là `true`; sử dụng Danh sách hậu tố công khai để lấy tên miền cookie chính xác.
* `XOOPS_DB_LEGACY_LOG` — mặc định là `false`; được đặt thành `true` trong quá trình phát triển để ghi nhật ký sử dụng các API cơ sở dữ liệu cũ.
* `XOOPS_DEBUG` — mặc định là `false`; được đặt thành `true` trong quá trình phát triển để cho phép báo cáo lỗi bổ sung.

Bạn không cần phải chỉnh sửa chúng bằng tay trong khi cài đặt — các giá trị mặc định phù hợp với cơ sở sản xuất. Chúng được đề cập ở đây để bạn biết những gì cần tìm nếu sau này bạn mở `mainfile.php`.

## Lỗi

Nếu XOOPS phát hiện lỗi khi ghi tệp cấu hình, nó sẽ hiển thị thông báo nêu chi tiết những gì sai.

![Lỗi cấu hình lưu trình cài đặt XOOPS](/xoops-docs/2.7/img/installation/installer-07-errors.png)

Trong nhiều trường hợp, cài đặt mặc định của hệ thống có nguồn gốc từ Debian sử dụng mod_php trong Apache là nguyên nhân gây ra lỗi. Hầu hết các nhà cung cấp dịch vụ lưu trữ đều có cấu hình không gặp phải những vấn đề này.

### Vấn đề về quyền của nhóm

Quá trình PHP được chạy bằng quyền của một số người dùng. Các tập tin cũng thuộc sở hữu của một số người dùng. Nếu hai người này không phải là cùng một người dùng, quyền của nhóm có thể được sử dụng để cho phép quy trình PHP chia sẻ tệp với tài khoản người dùng của bạn. Điều này thường có nghĩa là bạn cần thay đổi nhóm tệp và thư mục mà XOOPS cần ghi vào.

Đối với cấu hình mặc định được đề cập ở trên, điều này có nghĩa là nhóm _www-data_ cần được chỉ định làm nhóm cho các tệp và thư mục, đồng thời các tệp và thư mục đó cần phải có khả năng ghi theo nhóm.

Bạn nên xem lại cấu hình của mình một cách cẩn thận và chọn cẩn thận cách giải quyết những vấn đề này cho một hộp có sẵn trên internet mở.

Các lệnh ví dụ có thể là:

```text
chgrp -R www-data xoops_data
chmod -R g+w xoops_data
chgrp -R www-data uploads
chmod -R g+w uploads
```

### Không thể tạo mainfile.php

Trong các hệ thống giống Unix, quyền tạo tệp mới phụ thuộc vào các quyền được cấp trên thư mục mẹ. Trong một số trường hợp, quyền đó không có sẵn và việc cấp quyền đó có thể gây ra mối lo ngại về bảo mật.

Nếu bạn gặp sự cố về cấu hình, bạn có thể tìm thấy _mainfile.php_ giả trong thư mục _extras_ trong bản phân phối XOOPS. Sao chép tệp đó vào web root và đặt quyền trên tệp:

```text
chgrp www-data mainfile.php
chmod g+w mainfile.php
```

### Môi trường SELinuxBối cảnh bảo mật SELinux có thể là nguồn gốc của vấn đề. Nếu điều này có thể áp dụng, vui lòng tham khảo [Chủ đề đặc biệt](../specialtopics.md) để biết thêm thông tin.