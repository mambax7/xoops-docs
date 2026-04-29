---
title: Nâng cấp từ XOOPS 2.5 lên 2.7
description: Hướng dẫn từng bước để nâng cấp an toàn cài đặt XOOPS của bạn từ 2.5.x lên 2.7.x.
---
:::thận trọng[Sao lưu trước]
Luôn sao lưu cơ sở dữ liệu và tập tin của bạn trước khi nâng cấp. Không có ngoại lệ.
:::

## Điều gì đã thay đổi trong phiên bản 2.7

- **Yêu cầu PHP 8.2+** — PHP 7.x không còn được hỗ trợ
- **Các phần phụ thuộc do nhà soạn nhạc quản lý** — Thư viện lõi được quản lý qua `composer.json`
- **Tự động tải PSR-4** — Mô-đun classes có thể sử dụng không gian tên
- **XoopsObject được cải tiến** — Loại an toàn `getVar()` mới, `obj2Array()` không được dùng nữa
- **Bootstrap 5 admin** — Bảng quản trị được xây dựng lại bằng Bootstrap 5

## Danh sách kiểm tra trước khi nâng cấp

- [ ] PHP 8.2+ có sẵn trên máy chủ của bạn
- [ ] Sao lưu toàn bộ cơ sở dữ liệu (`mysqldump -u user -p xoops_db > backup.sql`)
- [] Sao lưu toàn bộ tập tin cài đặt của bạn
- [ ] Danh sách modules đã cài đặt và các phiên bản của chúng
- [] Chủ đề tùy chỉnh được sao lưu riêng

## Các bước nâng cấp

### 1. Đưa trang web vào chế độ bảo trì

```php
// mainfile.php — add temporarily
define('XOOPS_MAINTENANCE', true);
```

### 2. Tải XOOPS 2.7

```bash
wget https://github.com/XOOPS/XoopsCore27/releases/latest/download/xoops-2.7.x.zip
unzip xoops-2.7.x.zip
```

### 3. Thay thế các file lõi

Tải lên các tập tin mới, **không bao gồm**:
- `uploads/` — tệp đã tải lên của bạn
- `xoops_data/` — cấu hình của bạn
- `modules/` — modules đã cài đặt của bạn
- `themes/` — themes của bạn
- `mainfile.php` — cấu hình trang web của bạn

```bash
rsync -av --exclude='uploads/' --exclude='xoops_data/' \
  --exclude='modules/' --exclude='themes/' --exclude='mainfile.php' \
  xoops-2.7/ /var/www/html/
```

### 4. Chạy script nâng cấp

Điều hướng đến `https://yourdomain.com/upgrade/` trong trình duyệt của bạn.
Trình hướng dẫn nâng cấp sẽ áp dụng việc di chuyển cơ sở dữ liệu.

### 5. Cập nhật modules

XOOPS 2.7 modules phải tương thích với PHP 8.2.
Kiểm tra [Hệ sinh thái mô-đun](/xoops-docs/2.7/module-guide/introduction/) để biết các phiên bản cập nhật.

Trong Quản trị → Mô-đun, nhấp vào **Cập nhật** cho từng mô-đun đã cài đặt.

### 6. Bỏ chế độ bảo trì và kiểm tra

Xóa dòng `XOOPS_MAINTENANCE` khỏi `mainfile.php` và
xác minh tất cả các trang tải chính xác.

## Các vấn đề thường gặp

**Lỗi "Không tìm thấy lớp" sau khi nâng cấp**
- Chạy `composer dump-autoload` trong root XOOPS
- Xóa thư mục `xoops_data/caches/`

**Mô-đun bị hỏng sau khi cập nhật**
- Kiểm tra các bản phát hành GitHub của mô-đun để biết phiên bản tương thích 2.7
- Mô-đun có thể cần thay đổi mã cho PHP 8.2 (các chức năng không được dùng nữa, thuộc tính đã nhập)

**Bảng quản trị CSS bị hỏng**
- Xóa bộ nhớ cache của trình duyệt của bạn
- Đảm bảo `xoops_lib/` đã được thay thế hoàn toàn trong quá trình tải tệp lên