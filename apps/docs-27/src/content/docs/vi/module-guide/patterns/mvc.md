---
title: "Mẫu MVC trong XOOPS"
description: "Triển khai kiến ​​trúc Model-View-Controller trong XOOPS modules"
---
<span class="version-badge version-xmf">Bắt buộc phải có XMF</span> <span class="version-badge version-40x">4.0.x Bản địa</span>

:::note[Không chắc đây có phải là mẫu phù hợp không?]
Xem [Chọn mẫu truy cập dữ liệu](../Choosing-Data-Access-Pattern.md) để biết hướng dẫn về thời điểm sử dụng MVC so với các mẫu đơn giản hơn.
:::

:::thận trọng[Làm rõ: Kiến trúc XOOPS]
**XOOPS 2.5.x** tiêu chuẩn sử dụng mẫu **Trình điều khiển trang** (còn gọi là Tập lệnh giao dịch), không phải MVC. modules cũ sử dụng `index.php` với includes trực tiếp, các đối tượng chung (`$xoopsUser`, `$xoopsDB`) và truy cập dữ liệu dựa trên trình xử lý.

**Để sử dụng MVC trong XOOPS 2.5.x**, bạn cần **XMF Framework** cung cấp hỗ trợ định tuyến và bộ điều khiển.

**XOOPS 4.0** sẽ hỗ trợ nguyên bản MVC với phần mềm trung gian PSR-15 và định tuyến thích hợp.

Xem thêm: [Kiến trúc XOOPS hiện tại](../../02-Core-Concepts/Architecture/XOOPS-Architecture.md)
:::

Mẫu Model-View-Controller (MVC) là mẫu kiến trúc cơ bản để phân tách các mối quan tâm trong XOOPS modules. Mẫu này chia ứng dụng thành ba thành phần được kết nối với nhau.

## MVC Giải thích

### Người mẫu
**Mô hình** thể hiện dữ liệu và logic nghiệp vụ của ứng dụng của bạn. Nó:
- Quản lý tính bền vững của dữ liệu
- Thực hiện các quy định kinh doanh
- Xác thực dữ liệu
- Giao tiếp với cơ sở dữ liệu
- Độc lập với giao diện người dùng

### Xem
**Chế độ xem** chịu trách nhiệm hiển thị dữ liệu cho người dùng. Nó:
- Kết xuất HTML templates
- Hiển thị dữ liệu mô hình
- Xử lý việc trình bày giao diện người dùng
- Gửi hành động của người dùng đến bộ điều khiển
- Nên chứa logic tối thiểu

### Bộ điều khiển
**Bộ điều khiển** xử lý các tương tác và tọa độ của người dùng giữa Model và View. Nó:
- Tiếp nhận yêu cầu của người dùng
- Xử lý dữ liệu đầu vào
- Gọi các phương thức mô hình
- Lựa chọn các góc nhìn phù hợp
- Quản lý luồng ứng dụng

## Triển khai XOOPS

Trong XOOPS, mẫu MVC được triển khai bằng cách sử dụng trình xử lý và templates với công cụ Smarty cung cấp hỗ trợ mẫu.

### Cấu trúc mô hình cơ bản
```php
<?php
class UserModel
{
    private $db;
    
    public function getUserById($id)
    {
        // Database query implementation
    }
    
    public function createUser($data)
    {
        // Create user implementation
    }
}
?>
```

### Triển khai bộ điều khiển
```php
<?php
class UserController
{
    private $model;
    
    public function listAction()
    {
        $users = $this->model->getAllUsers();
        return ['users' => $users];
    }
}
?>
```

### Xem mẫu
```smarty
{foreach from=$users item=user}
    <div>{$user.username|escape}</div>
{/foreach}
```

## Các phương pháp hay nhất

- Giữ logic nghiệp vụ trong Mô hình
- Giữ bản trình bày trong Chế độ xem  
- Giữ định tuyến/điều phối trong Bộ điều khiển
- Không trộn lẫn mối quan tâm giữa các lớp
- Xác thực tất cả đầu vào ở cấp Bộ điều khiển

## Tài liệu liên quan

Xem thêm:
- [Repository-Pattern](../Patterns/Repository-Pattern.md) để truy cập dữ liệu nâng cao
- [Lớp dịch vụ](../Patterns/Service-Layer.md) để trừu tượng hóa logic nghiệp vụ
- [Code-Organization](../Best-Practices/Code-Organization.md) cho cấu trúc dự án
- [Thử nghiệm](../Best-Practices/Testing.md) cho các chiến lược thử nghiệm MVC

---

Tags: #mvc #patterns #architecture #module-development #design-patterns