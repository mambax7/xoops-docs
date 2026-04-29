---
title: Bắt đầu nhanh
description: Để XOOPS 2.7 chạy trong chưa đầy 5 phút.
---
## Yêu cầu

| Thành phần | Tối thiểu | Được đề xuất |
|---|---|---|
| PHP | 8.2 | 8,4+ |
| MySQL | 5,7 | 8.0+ |
| MariaDB | 10.4 | 10.11+ |
| Máy chủ web | Apache 2.4 / Nginx 1.20 | Ổn định mới nhất |

## Tải xuống

Tải xuống bản phát hành mới nhất từ [Bản phát hành GitHub](https://github.com/XOOPS/XoopsCore27/releases).

```bash
# Or clone directly
git clone https://github.com/XOOPS/XoopsCore27.git mysite
cd mysite
```

## Các bước cài đặt

1. **Tải tệp lên** lên thư mục gốc tài liệu trên máy chủ web của bạn (ví dụ: `public_html/`).
2. **Tạo cơ sở dữ liệu MySQL** và người dùng có đầy đủ đặc quyền trên đó.
3. **Mở trình duyệt của bạn** và điều hướng đến miền của bạn — trình cài đặt XOOPS sẽ tự động khởi động.
4. **Làm theo trình hướng dẫn 5 bước** — nó định cấu hình đường dẫn, tạo bảng và thiết lập tài khoản admin của bạn.
5. **Xóa thư mục `install/`** khi được nhắc. Đây là điều bắt buộc để đảm bảo an ninh.

## Xác minh cài đặt

Sau khi thiết lập, hãy truy cập:

- **Trang đầu:** `https://yourdomain.com/`
- **Bảng quản trị:** `https://yourdomain.com/xoops_data/` *(đường dẫn bạn đã chọn trong khi cài đặt)*

## Các bước tiếp theo

- [Hướng dẫn cài đặt đầy đủ](./installation/) — cấu hình máy chủ, quyền, khắc phục sự cố
- [Hướng dẫn mô-đun](./module-guide/introduction/) — xây dựng mô-đun đầu tiên của bạn
- [Hướng dẫn chủ đề](./theme-guide/introduction/) — tạo hoặc tùy chỉnh chủ đề