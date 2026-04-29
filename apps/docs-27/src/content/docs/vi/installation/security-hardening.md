---
title: "Phụ lục 5: Tăng tính bảo mật cho quá trình cài đặt XOOPS của bạn"
---
Sau khi cài đặt XOOPS 2.7.0, hãy thực hiện các bước sau để làm cứng trang web. Mỗi bước là tùy chọn riêng lẻ nhưng chúng cùng nhau nâng cao đáng kể tính bảo mật cơ bản của quá trình cài đặt.

## 1. Cài đặt và cấu hình module Protector

Mô-đun `protector` đi kèm là tường lửa XOOPS. Nếu bạn chưa cài đặt nó trong trình hướng dẫn ban đầu, hãy cài đặt nó từ màn hình Quản trị → Mô-đun ngay bây giờ.

![](/xoops-docs/2.7/img/installation/img_73.jpg)

Mở bảng admin của Protector và xem lại các cảnh báo mà nó hiển thị. Các chỉ thị PHP cũ như `register_globals` không còn tồn tại (PHP 8.2+ đã xóa chúng), vì vậy bạn sẽ không thấy những cảnh báo đó nữa. Các cảnh báo hiện tại thường liên quan đến quyền thư mục, cài đặt phiên và cấu hình đường dẫn tin cậy.

## 2. Khóa `mainfile.php` và `secure.php`

Khi trình cài đặt hoàn tất, nó sẽ cố gắng đánh dấu cả hai tệp là chỉ đọc, nhưng một số máy chủ hoàn nguyên các quyền. Xác minh và đăng ký lại nếu cần:

- `mainfile.php` → `0444` (chủ sở hữu, nhóm, chỉ đọc khác)
- `xoops_data/data/secure.php` → `0444`

`mainfile.php` xác định các hằng số đường dẫn (`XOOPS_ROOT_PATH`, `XOOPS_PATH`, `XOOPS_VAR_PATH`, `XOOPS_URL`, `XOOPS_COOKIE_DOMAIN`, `XOOPS_COOKIE_DOMAIN_USE_PSL`) và cờ sản xuất. `secure.php` chứa thông tin xác thực cơ sở dữ liệu:

- Trong 2.5.x, thông tin xác thực cơ sở dữ liệu từng tồn tại trong `mainfile.php`. Hiện chúng được lưu trữ trong `xoops_data/data/secure.php`, được tải bởi `mainfile.php` khi chạy. Giữ `secure.php` bên trong `xoops_data/` — thư mục bạn được khuyến khích di chuyển ra ngoài thư mục gốc của tài liệu — khiến kẻ tấn công khó tiếp cận được thông tin xác thực qua HTTP hơn nhiều.

## 3. Di chuyển `xoops_lib/` và `xoops_data/` ra ngoài thư mục gốc của tài liệu

Nếu bạn chưa làm như vậy, hãy di chuyển hai thư mục này lên một cấp trên web root của bạn và đổi tên chúng. Sau đó cập nhật các hằng số tương ứng trong `mainfile.php`:

```php
define('XOOPS_ROOT_PATH', '/home/you/www');
define('XOOPS_PATH',      '/home/you/zubra_mylib');
define('XOOPS_VAR_PATH',  '/home/you/zubra_mydata');
define('XOOPS_TRUST_PATH', XOOPS_PATH);
```

Việc đặt các thư mục này bên ngoài thư mục gốc của tài liệu sẽ ngăn chặn quyền truy cập trực tiếp vào cây `vendor/` của Composer, templates được lưu trong bộ nhớ đệm, tệp phiên, dữ liệu đã tải lên và thông tin xác thực cơ sở dữ liệu trong `secure.php`.

## 4. Cấu hình miền cookie

XOOPS 2.7.0 giới thiệu hai hằng số miền cookie trong `mainfile.php`:

```php
// Use the Public Suffix List (PSL) to derive the registrable domain.
define('XOOPS_COOKIE_DOMAIN_USE_PSL', true);

// Explicit cookie domain; may be blank, the full host, or the registrable domain.
define('XOOPS_COOKIE_DOMAIN', '');
```

Hướng dẫn:

- Để trống `XOOPS_COOKIE_DOMAIN` nếu bạn phục vụ XOOPS từ một tên máy chủ duy nhất hoặc từ một IP.
- Sử dụng toàn bộ máy chủ (ví dụ: `www.example.com`) để chỉ đặt cookie cho tên máy chủ đó.
- Sử dụng tên miền có thể đăng ký (ví dụ: `example.com`) khi bạn muốn chia sẻ cookie trên `www.example.com`, `blog.example.com`, v.v.
- `XOOPS_COOKIE_DOMAIN_USE_PSL = true` cho phép XOOPS phân chia chính xác các TLD phức hợp (`co.uk`, `com.au`, …) thay vì vô tình đặt cookie trên TLD hiệu quả.

## 5. Cờ sản xuất trong `mainfile.php`

`mainfile.dist.php` xuất xưởng với hai cờ này được đặt thành `false` để sản xuất:

```php
define('XOOPS_DB_LEGACY_LOG', false); // disable legacy SQL usage logging
define('XOOPS_DEBUG',         false); // disable debug notices
```

Để chúng lại trong quá trình sản xuất. Kích hoạt chúng tạm thời trong môi trường phát triển hoặc dàn dựng khi bạn muốn:

- săn lùng các cuộc gọi cơ sở dữ liệu kế thừa còn sót lại (`XOOPS_DB_LEGACY_LOG = true`);
- thông báo bề mặt `E_USER_DEPRECATED` và đầu ra gỡ lỗi khác (`XOOPS_DEBUG = true`).

## 6. Xóa trình cài đặtSau khi cài đặt hoàn tất:

1. Xóa mọi thư mục `install_remove_*` đã được đổi tên khỏi thư mục gốc của web.
2. Xóa mọi tập lệnh `install_cleanup_*.php` mà trình hướng dẫn đã tạo trong quá trình dọn dẹp.
3. Xác nhận thư mục `install/` không thể truy cập được qua HTTP nữa.

Việc để lại thư mục trình cài đặt bị vô hiệu hóa nhưng hiện tại là một rủi ro có mức độ nghiêm trọng thấp nhưng có thể tránh được.

## 7. Luôn cập nhật XOOPS và modules

XOOPS tuân theo nhịp vá thông thường. Đăng ký kho lưu trữ XoopsCore27 GitHub để nhận thông báo phát hành và cập nhật trang web của bạn cũng như bất kỳ modules bên thứ ba nào bất cứ khi nào có bản phát hành mới. Các bản cập nhật bảo mật cho 2.7.x được xuất bản qua trang Phát hành của kho lưu trữ.