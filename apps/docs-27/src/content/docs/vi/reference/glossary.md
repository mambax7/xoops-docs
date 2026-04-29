---
title: "Thuật ngữ XOOPS"
description: "Định nghĩa của các thuật ngữ và khái niệm dành riêng cho XOOPS"
---
> Bảng thuật ngữ toàn diện về thuật ngữ và khái niệm dành riêng cho XOOPS.

---

## A

### Khung quản trị
Khung giao diện administrative được tiêu chuẩn hóa được giới thiệu trong XOOPS 2.3, cung cấp các trang admin nhất quán trên modules.

### Tự động tải
Tự động tải PHP classes khi cần thiết, sử dụng tiêu chuẩn PSR-4 trong XOOPS hiện đại.

---

## B

### Chặn
Một đơn vị nội dung độc lập có thể được định vị trong các vùng chủ đề. Các khối có thể hiển thị nội dung mô-đun, HTML tùy chỉnh hoặc dữ liệu động.

```php
// Block definition
$modversion['blocks'][] = [
    'file'      => 'myblock.php',
    'name'      => 'My Block',
    'show_func' => 'mymodule_block_show'
];
```

### Khởi động
Quá trình khởi tạo lõi XOOPS trước khi thực thi mã mô-đun, điển hình là thông qua `mainfile.php` và `header.php`.

---

## C

### Tiêu chí/Tiêu chíCompo
Các lớp xây dựng điều kiện truy vấn cơ sở dữ liệu theo cách hướng đối tượng.

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 1));
```

### CSRF (Giả mạo yêu cầu trên nhiều trang web)
Một cuộc tấn công bảo mật đã ngăn chặn trong XOOPS bằng cách sử dụng mã thông báo bảo mật qua `XoopsFormHiddenToken`.

---

## D

### DI (Tiêm phụ thuộc)
Một mẫu thiết kế được lên kế hoạch cho XOOPS 4.0 trong đó các phần phụ thuộc được đưa vào thay vì được tạo nội bộ.

### Tên dir
Tên thư mục của mô-đun, được sử dụng làm mã định danh duy nhất trong toàn hệ thống.

### DTYPE (Loại dữ liệu)
Các hằng số xác định cách lưu trữ và loại bỏ các biến XoopsObject:
- `XOBJ_DTYPE_INT` - Số nguyên
- `XOBJ_DTYPE_TXTBOX` - Văn bản (dòng đơn)
- `XOBJ_DTYPE_TXTAREA` - Văn bản (nhiều dòng)
- `XOBJ_DTYPE_EMAIL` - Địa chỉ email

---

## E

### Sự kiện
Một sự cố xảy ra trong vòng đời XOOPS có thể kích hoạt mã tùy chỉnh thông qua tải trước hoặc móc.

---

## F

### Khung
Xem XMF (Khung mô-đun XOOPS).

### Phần tử biểu mẫu
Một thành phần của hệ thống biểu mẫu XOOPS đại diện cho trường biểu mẫu HTML.

---

## G

### Nhóm
Một tập hợp người dùng có quyền được chia sẻ. Các nhóm cốt lõi include: Quản trị viên web, Người dùng đã đăng ký, Ẩn danh.

---

## H

### Trình xử lý
class quản lý các hoạt động CRUD cho các phiên bản XoopsObject.

```php
$handler = xoops_getModuleHandler('item', 'mymodule');
$item = $handler->get($id);
```

### Người trợ giúp
Tiện ích class cung cấp quyền truy cập dễ dàng vào trình xử lý mô-đun, cấu hình và dịch vụ.

```php
$helper = \XoopsModules\MyModule\Helper::getInstance();
```

---

## K

### hạt nhân
Lõi XOOPS classes cung cấp chức năng cơ bản: truy cập cơ sở dữ liệu, quản lý người dùng, bảo mật, v.v.

---

## L

### Tệp ngôn ngữ
Các tệp PHP chứa các hằng số quốc tế hóa, được lưu trữ trong các thư mục `language/[code]/`.

---

## M

### mainfile.php
Tệp cấu hình chính cho XOOPS chứa thông tin xác thực cơ sở dữ liệu và định nghĩa đường dẫn.

### MCP (Model-Controller-Presenter)
Một mẫu kiến trúc tương tự MVC, thường được sử dụng trong phát triển mô-đun XOOPS.

### Phần mềm trung gian
Phần mềm nằm giữa yêu cầu và phản hồi, được lên kế hoạch cho XOOPS 4.0 sử dụng PSR-15.

### mô-đun
Gói độc lập mở rộng chức năng XOOPS, được cài đặt trong thư mục `modules/`.

### MOC (Bản đồ nội dung)
Khái niệm Obsidian dành cho các ghi chú tổng quan liên kết đến nội dung liên quan.

---

## N### Không gian tên
Tính năng PHP tổ chức classes, dùng trong XOOPS 2.5+:
```php
namespace XoopsModules\MyModule;
```

### Thông báo
Hệ thống XOOPS cảnh báo người dùng về các sự kiện qua email hoặc PM.

---

## Ồ

### Đối tượng
Xem XoopsObject.

---

## P

### Quyền
Kiểm soát truy cập được quản lý thông qua các nhóm và trình xử lý quyền.

### Tải trước
class nối vào các sự kiện XOOPS, được tải tự động từ thư mục `preloads/`.

### PSR (Khuyến nghị tiêu chuẩn PHP)
Các tiêu chuẩn từ PHP-FIG mà XOOPS 4.0 sẽ triển khai đầy đủ.

---

## R

### Trình kết xuất
class xuất ra các phần tử biểu mẫu hoặc các thành phần giao diện người dùng khác ở các định dạng cụ thể (Bootstrap, v.v.).

---

## S

### Smarty
Công cụ mẫu được XOOPS sử dụng để tách bản trình bày khỏi logic.

```smarty
<{$variable}>
<{foreach item=item from=$items}>
    <{$item.title}>
<{/foreach}>
```

### Dịch vụ
class cung cấp logic nghiệp vụ có thể tái sử dụng, thường được truy cập thông qua Trình trợ giúp.

---

## T

### Mẫu
Tệp Smarty (`.tpl` hoặc `.html`) xác định lớp trình bày cho modules.

### Chủ đề
Một bộ sưu tập templates và assets xác định giao diện trực quan của trang web.

### Mã thông báo
Cơ chế bảo mật (bảo vệ CSRF) đảm bảo việc gửi biểu mẫu có nguồn gốc từ các nguồn hợp pháp.

---

## bạn

### uid
ID người dùng - mã định danh duy nhất cho mỗi người dùng trong hệ thống.

---

## V

### Biến (Var)
Trường được xác định trên XoopsObject bằng `initVar()`.

---

## W

### Tiện ích
Một thành phần giao diện người dùng nhỏ, khép kín, tương tự như các khối.

---

## X

### XMF (Khung mô-đun XOOPS)
Tập hợp các tiện ích và classes để phát triển mô-đun XOOPS hiện đại.

### XOBJ_DTYPE
Các hằng số để xác định kiểu dữ liệu biến trong XoopsObject.

### Cơ sở dữ liệu Xoops
Lớp trừu tượng hóa cơ sở dữ liệu cung cấp khả năng thực hiện và thoát truy vấn.

### XoopsForm
Hệ thống tạo biểu mẫu để tạo biểu mẫu HTML theo chương trình.

### XoopsObject
class cơ sở cho tất cả các đối tượng dữ liệu trong XOOPS, cung cấp khả năng quản lý và khử trùng biến đổi.

### xoops_version.php
Tệp kê khai mô-đun xác định các thuộc tính, bảng, khối, templates và cấu hình của mô-đun.

---

## Từ viết tắt thông dụng

| Từ viết tắt | Ý nghĩa |
|----------|----------|
| XOOPS | Hệ thống cổng thông tin hướng đối tượng có thể mở rộng |
| XMF | Khung mô-đun XOOPS |
| CSRF | Giả mạo yêu cầu trên nhiều trang web |
| XSS | Viết kịch bản chéo trang |
| ORM | Ánh xạ quan hệ đối tượng |
| PSR | Khuyến nghị về tiêu chuẩn PHP |
| DI | Tiêm phụ thuộc |
| MVC | Model-View-Controller |
| CRUD | Tạo, Đọc, Cập nhật, Xóa |

---

## 🔗 Tài liệu liên quan

- Khái niệm cốt lõi
- Tham khảo API
- Nguồn lực bên ngoài

---

#xoops #bảng thuật ngữ #tham khảo #thuật ngữ #định nghĩa