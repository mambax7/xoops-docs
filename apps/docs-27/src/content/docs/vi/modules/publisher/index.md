---
title: "Mô-đun nhà xuất bản"
description: "Tài liệu đầy đủ về mô-đun blog và tin tức Nhà xuất bản dành cho XOOPS"
---
> Mô-đun xuất bản blog và tin tức hàng đầu dành cho XOOPS CMS.

---

## Tổng quan

Nhà xuất bản là mô-đun quản lý nội dung hoàn chỉnh dành cho XOOPS, được phát triển từ SmartSection để trở thành giải pháp tin tức và blog có nhiều tính năng nhất. Nó cung cấp các công cụ toàn diện để tạo, sắp xếp và xuất bản nội dung với sự hỗ trợ đầy đủ về quy trình biên tập.

**Yêu cầu:**
- XOOPS 2.5.10+
- PHP 7.1+ (khuyên dùng PHP 8.x)

---

## 🌟 Các tính năng chính

### Quản lý nội dung
- **Danh mục & Danh mục con** - Tổ chức nội dung theo cấp bậc
- **Chỉnh sửa văn bản đa dạng thức** - Hỗ trợ nhiều trình soạn thảo WYSIWYG
- **Đính kèm tệp** - Đính kèm tệp vào bài viết
- **Quản lý hình ảnh** - Hình ảnh trang và danh mục
- **Gói tệp** - Gói tệp dưới dạng bài viết

### Quy trình xuất bản
- **Xuất bản theo lịch** - Đặt ngày xuất bản trong tương lai
- **Ngày hết hạn** - Nội dung tự động hết hạn
- **Kiểm duyệt** - Quy trình phê duyệt biên tập
- **Quản lý bản nháp** - Lưu công việc đang thực hiện

### Hiển thị & Mẫu
- **Bốn mẫu cơ sở** - Nhiều bố cục hiển thị
- **Mẫu tùy chỉnh** - Tạo thiết kế của riêng bạn
- **Tối ưu hóa SEO** - URL thân thiện với công cụ tìm kiếm
- **Thiết kế đáp ứng** - Đầu ra sẵn sàng cho thiết bị di động

### Tương tác người dùng
- **Xếp hạng** - Hệ thống xếp hạng bài viết
- **Bình luận** - Thảo luận của độc giả
- **Chia sẻ xã hội** - Chia sẻ lên mạng xã hội

### Quyền
- **Kiểm soát gửi bài** - Ai có thể gửi bài viết
- **Quyền cấp trường** - Kiểm soát các trường biểu mẫu theo nhóm
- **Quyền danh mục** - Kiểm soát quyền truy cập cho mỗi danh mục
- **Quyền kiểm duyệt** - Cài đặt kiểm duyệt toàn cầu

---

## 🗂️ Nội dung phần

### Hướng dẫn sử dụng
- Hướng dẫn cài đặt
- Cấu hình cơ bản
- Tạo bài viết
- Quản lý danh mục
- Thiết lập quyền

### Hướng dẫn dành cho nhà phát triển
- Mở rộng nhà xuất bản
- Tạo mẫu tùy chỉnh
- Tham khảo API
- Móc và sự kiện

---

## 🚀 Bắt đầu nhanh

### 1. Cài đặt

```bash
# Download from GitHub
git clone https://github.com/XoopsModules25x/publisher.git

# Copy to modules directory
cp -r publisher /path/to/xoops/htdocs/modules/
```

Sau đó cài đặt qua Quản trị viên XOOPS → Mô-đun → Cài đặt.

### 2. Tạo danh mục đầu tiên của bạn

1. Đi tới **Quản trị viên → Nhà xuất bản → Danh mục**
2. Nhấp vào **Thêm danh mục**
3. Điền vào:
   - **Tên**: Tin tức
   - **Mô tả**: Tin tức và cập nhật mới nhất
   - **Hình ảnh**: Tải lên hình ảnh danh mục
4. Lưu

### 3. Tạo bài viết đầu tiên của bạn

1. Đi tới **Quản trị viên → Nhà xuất bản → Bài viết**
2. Nhấp vào **Thêm bài viết**
3. Điền vào:
   - **Tiêu đề**: Chào mừng đến với trang web của chúng tôi
   - **Danh mục**: Tin tức
   - **Nội dung**: Nội dung bài viết của bạn
4. Đặt **Trạng thái**: Đã xuất bản
5. Lưu

---

## ⚙️ Tùy chọn cấu hình

### Cài đặt chung

| Cài đặt | Mô tả | Mặc định |
|----------|-------------|----------|
| Biên tập viên | Trình soạn thảo WYSIWYG để sử dụng | XOOPS Mặc định |
| Các mục trên mỗi trang | Các bài viết hiển thị trên mỗi trang | 10 |
| Hiển thị đường dẫn | Hiển thị đường dẫn điều hướng | Có |
| Cho phép xếp hạng | Bật xếp hạng bài viết | Có |
| Cho phép bình luận | Bật bình luận bài viết | Có |

### Cài đặt SEO

| Cài đặt | Mô tả | Mặc định |
|----------|-------------|----------|
| URL SEO | Kích hoạt URL thân thiện | Không |
| Viết lại URL | Apache mod_rewrite | Không có |
| Từ khóa meta | Tự động tạo từ khóa | Có |

### Ma trận quyền| Giấy phép | Ẩn danh | Đã đăng ký | Biên tập viên | Quản trị viên |
|----------||-------------|-------------|--------|-------|
| Xem bài viết | ✓ | ✓ | ✓ | ✓ |
| Gửi bài viết | ✗ | ✓ | ✓ | ✓ |
| Chỉnh sửa bài viết riêng | ✗ | ✓ | ✓ | ✓ |
| Chỉnh sửa tất cả bài viết | ✗ | ✗ | ✓ | ✓ |
| Phê duyệt bài viết | ✗ | ✗ | ✓ | ✓ |
| Quản lý danh mục | ✗ | ✗ | ✗ | ✓ |

---

## 📦 Cấu trúc mô-đun

```
modules/publisher/
├── admin/                  # Admin interface
│   ├── index.php
│   ├── category.php
│   ├── item.php
│   └── menu.php
├── class/                  # PHP classes
│   ├── Category.php
│   ├── CategoryHandler.php
│   ├── Item.php
│   ├── ItemHandler.php
│   └── Helper.php
├── include/                # Include files
│   ├── common.php
│   └── functions.php
├── templates/              # Smarty templates
│   ├── publisher_index.tpl
│   ├── publisher_item.tpl
│   └── publisher_category.tpl
├── language/               # Translations
│   └── english/
├── sql/                    # Database schema
│   └── mysql.sql
├── xoops_version.php       # Module info
└── index.php               # Module entry
```

---

## 🔄 Di chuyển

### Từ SmartSection

Nhà xuất bản includes một công cụ di chuyển tích hợp:

1. Đi tới **Quản trị viên → Nhà xuất bản → Nhập**
2. Chọn **SmartSection** làm nguồn
3. Chọn tùy chọn nhập:
   - Danh mục
   - Bài viết
   - Bình luận
4. Nhấp vào **Nhập**

### Từ mô-đun tin tức

1. Đi tới **Quản trị viên → Nhà xuất bản → Nhập**
2. Chọn **Tin tức** làm nguồn
3. Danh mục bản đồ
4. Nhấp vào **Nhập**

---

## 🔗 Tài liệu liên quan

- Hướng dẫn phát triển mô-đun
- Tạo khuôn Smarty
- Khung XMF

---

## 📚 Tài nguyên

- [Kho lưu trữ GitHub](https://github.com/XoopsModules25x/publisher)
- [Trình theo dõi vấn đề](https://github.com/XoopsModules25x/publisher/issues)
- [Hướng dẫn gốc](https://xoops.gitbook.io/publisher-tutorial/)

---

#xoops #publisher #module #blog #news #cms #content-management