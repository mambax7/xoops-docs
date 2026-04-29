---
title: "Mẫu lớp dịch vụ trong XOOPS"
description: "Tóm tắt logic nghiệp vụ và chèn phụ thuộc"
---
<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::note[Không chắc đây có phải là mẫu phù hợp không?]
Xem [Chọn mẫu truy cập dữ liệu](../Choosing-Data-Access-Pattern.md) để biết cây quyết định so sánh trình xử lý, kho lưu trữ, dịch vụ và CQRS.
:::

:::tip[Hoạt động hôm nay và ngày mai]
Mẫu Lớp dịch vụ **hoạt động trong cả XOOPS 2.5.x và XOOPS 4.0.x**. Các khái niệm đều phổ biến—chỉ có cú pháp là khác nhau:

| Tính năng | XOOPS 2.5.x | XOOPS 4.0 |
|----------|-------------|-------------|
| Phiên bản PHP | 7.4+ | 8.2+ |
| Tiêm hàm tạo | ✅ Đi dây thủ công | ✅ Tự động nối dây container |
| Thuộc tính đã nhập | Khối tài liệu `@var` | Khai báo kiểu gốc |
| Thuộc tính chỉ đọc | ❌ Không có sẵn | ✅ Từ khóa `readonly` |

Các ví dụ mã bên dưới sử dụng cú pháp PHP 8.2+. Đối với 2.5.x, hãy bỏ qua `readonly` và sử dụng các khai báo thuộc tính truyền thống.
:::

Mẫu lớp dịch vụ đóng gói logic nghiệp vụ trong dịch vụ chuyên dụng classes, cung cấp sự tách biệt rõ ràng giữa bộ điều khiển và lớp truy cập dữ liệu. Mẫu này thúc đẩy khả năng sử dụng lại mã, khả năng kiểm tra và bảo trì.

## Khái niệm lớp dịch vụ

### Mục đích
Lớp dịch vụ:
- Chứa logic nghiệp vụ miền
- Phối hợp nhiều kho lưu trữ
- Xử lý các hoạt động phức tạp
- Quản lý các giao dịch
- Thực hiện xác nhận và ủy quyền
- Cung cấp các hoạt động cấp cao cho bộ điều khiển

### Lợi ích
- Logic nghiệp vụ có thể tái sử dụng trên nhiều bộ điều khiển
- Dễ dàng kiểm tra một cách độc lập
- Thực hiện quy tắc kinh doanh tập trung
- Tách bạch mối quan tâm rõ ràng
- Mã điều khiển đơn giản

## Tiêm phụ thuộc

```php
<?php
// Service with injected dependencies
class UserService
{
    private $userRepository;
    private $emailService;
    
    public function __construct(
        UserRepositoryInterface $userRepository,
        EmailServiceInterface $emailService
    ) {
        $this->userRepository = $userRepository;
        $this->emailService = $emailService;
    }
    
    public function registerUser($username, $email, $password)
    {
        // Validate
        $this->validate($username, $email, $password);
        
        // Create user
        $user = new User();
        $user->setUsername($username);
        $user->setEmail($email);
        $user->setPassword($password);
        
        // Save
        $userId = $this->userRepository->save($user);
        
        // Send welcome email
        $this->emailService->sendWelcome($email, $username);
        
        return $userId;
    }
    
    private function validate($username, $email, $password)
    {
        $errors = [];
        
        if (strlen($username) < 3) {
            $errors['username'] = 'Username too short';
        }
        
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'Invalid email';
        }
        
        if (strlen($password) < 6) {
            $errors['password'] = 'Password too short';
        }
        
        if (!empty($errors)) {
            throw new ValidationException('Invalid input', $errors);
        }
    }
}
?>
```

## Thùng chứa dịch vụ

```php
<?php
class ServiceContainer
{
    private $services = [];
    
    public function __construct($db)
    {
        // Register repositories
        $this->services['userRepository'] = new UserRepository($db);
        
        // Register services
        $this->services['userService'] = new UserService(
            $this->services['userRepository']
        );
    }
    
    public function get($name)
    {
        if (!isset($this->services[$name])) {
            throw new \InvalidArgumentException("Service not found: $name");
        }
        return $this->services[$name];
    }
}
?>
```

## Cách sử dụng trong Bộ điều khiển

```php
<?php
class UserController
{
    private $userService;
    
    public function __construct(ServiceContainer $container)
    {
        $this->userService = $container->get('userService');
    }
    
    public function registerAction()
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            return [];
        }
        
        try {
            $userId = $this->userService->registerUser(
                $_POST['username'],
                $_POST['email'],
                $_POST['password']
            );
            
            return [
                'success' => true,
                'userId' => $userId,
            ];
        } catch (ValidationException $e) {
            return [
                'success' => false,
                'errors' => $e->getErrors(),
            ];
        }
    }
}
?>
```

## Các phương pháp hay nhất

- Mỗi dịch vụ xử lý một vấn đề tên miền
- Dịch vụ phụ thuộc vào giao diện, không phải việc triển khai
- Sử dụng nội dung xây dựng cho các phần phụ thuộc
- Dịch vụ phải được kiểm thử một cách độc lập
- Ném các ngoại lệ dành riêng cho tên miền
- Dịch vụ không nên phụ thuộc vào chi tiết yêu cầu HTTP
- Giữ cho các dịch vụ tập trung và gắn kết

## Tài liệu liên quan

Xem thêm:
- [MVC-Pattern](../Patterns/MVC-Pattern.md) để tích hợp bộ điều khiển
- [Repository-Pattern](../Patterns/Repository-Pattern.md) để truy cập dữ liệu
- [DTO-Pattern](DTO-Pattern.md) cho các đối tượng truyền dữ liệu
- [Thử nghiệm](../Best-Practices/Testing.md) để thử nghiệm dịch vụ

---

Tags: #lớp dịch vụ #logic nghiệp vụ #tiêm phụ thuộc #mẫu thiết kế