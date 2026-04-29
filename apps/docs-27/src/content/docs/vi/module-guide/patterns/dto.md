---
title: "Mẫu DTO trong XOOPS"
description: "Đối tượng truyền dữ liệu để xử lý dữ liệu sạch"
---
# DTO Mẫu (Đối tượng truyền dữ liệu) trong XOOPS

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::tip[Hoạt động ở cả hai phiên bản]
DTO là các đối tượng PHP đơn giản không có phụ thuộc khung. Chúng hoạt động giống hệt nhau trong XOOPS 2.5.x và XOOPS 4.0.x. Đối với PHP 8.2+, hãy sử dụng quảng bá thuộc tính hàm tạo và classes chỉ đọc để có cú pháp rõ ràng hơn.
:::

Đối tượng truyền dữ liệu (DTO) là các đối tượng đơn giản được sử dụng để truyền dữ liệu giữa các lớp khác nhau của ứng dụng. DTO giúp duy trì ranh giới rõ ràng giữa các lớp và giảm sự phụ thuộc vào các đối tượng thực thể.

## Khái niệm DTO

### DTO là gì?
DTO là:
- Một đối tượng giá trị đơn giản với các thuộc tính
- Không thay đổi hoặc chỉ đọc sau khi tạo
- Không có logic hoặc phương thức kinh doanh
- Tối ưu hóa để truyền dữ liệu
- Độc lập với cơ chế kiên trì

### Khi nào nên sử dụng DTO

**Sử dụng DTO khi:**
- Truyền dữ liệu giữa các lớp
- Hiển thị dữ liệu thông qua API
- Tổng hợp dữ liệu từ nhiều thực thể
- Ẩn chi tiết triển khai nội bộ
- Thay đổi cấu trúc dữ liệu cho những người tiêu dùng khác nhau

## Triển khai DTO cơ bản

```php
<?php
class UserDTO
{
    private $id;
    private $username;
    private $email;
    private $isActive;
    private $createdAt;
    
    public function __construct($entity = null)
    {
        if ($entity instanceof User) {
            $this->id = $entity->getId();
            $this->username = $entity->getUsername();
            $this->email = $entity->getEmail();
            $this->isActive = $entity->isActive();
            $this->createdAt = $entity->getCreatedAt();
        }
    }
    
    // Read-only accessors
    public function getId() { return $this->id; }
    public function getUsername() { return $this->username; }
    public function getEmail() { return $this->email; }
    public function isActive() { return $this->isActive; }
    public function getCreatedAt() { return $this->createdAt; }
    
    public function toArray()
    {
        return [
            'id' => $this->id,
            'username' => $this->username,
            'email' => $this->email,
            'isActive' => $this->isActive,
            'createdAt' => $this->createdAt,
        ];
    }
    
    public function toJson()
    {
        return json_encode($this->toArray());
    }
}
?>
```

## Yêu cầu/Đầu vào DTO

```php
<?php
class CreateUserRequestDTO
{
    private $username;
    private $email;
    private $password;
    private $errors = [];
    
    public function __construct(array $data)
    {
        $this->username = $data['username'] ?? '';
        $this->email = $data['email'] ?? '';
        $this->password = $data['password'] ?? '';
        
        $this->validate();
    }
    
    private function validate()
    {
        if (empty($this->username) || strlen($this->username) < 3) {
            $this->errors['username'] = 'Username too short';
        }
        
        if (empty($this->email) || !filter_var($this->email, FILTER_VALIDATE_EMAIL)) {
            $this->errors['email'] = 'Invalid email';
        }
        
        if (empty($this->password) || strlen($this->password) < 6) {
            $this->errors['password'] = 'Password too short';
        }
    }
    
    public function isValid()
    {
        return empty($this->errors);
    }
    
    public function getErrors()
    {
        return $this->errors;
    }
    
    public function getUsername() { return $this->username; }
    public function getEmail() { return $this->email; }
    public function getPassword() { return $this->password; }
}
?>
```

## Cách sử dụng trong Dịch vụ

```php
<?php
class UserService
{
    public function createUserFromRequest(CreateUserRequestDTO $dto)
    {
        if (!$dto->isValid()) {
            throw new ValidationException('Invalid input', $dto->getErrors());
        }
        
        $user = new User();
        $user->setUsername($dto->getUsername());
        $user->setEmail($dto->getEmail());
        $user->setPassword($dto->getPassword());
        
        $userId = $this->userRepository->save($user);
        
        return new UserDTO($user);
    }
}
?>
```

## Cách sử dụng trong Bộ điều khiển API

```php
<?php
class ApiController
{
    public function createUserAction()
    {
        $input = json_decode(file_get_contents('php://input'), true);
        $dto = new CreateUserRequestDTO($input);
        
        if (!$dto->isValid()) {
            http_response_code(400);
            return ['success' => false, 'errors' => $dto->getErrors()];
        }
        
        try {
            $userDTO = $this->userService->createUserFromRequest($dto);
            http_response_code(201);
            return ['success' => true, 'data' => $userDTO->toArray()];
        } catch (\Exception $e) {
            http_response_code(500);
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
}
?>
```

## Các phương pháp hay nhất

- Giữ DTO tập trung và cụ thể
- Làm cho DTO trở nên bất biến hoặc chỉ đọc
- Không logic kinh doanh include trong DTO
- Sử dụng DTO riêng biệt cho đầu vào và đầu ra
- Ghi rõ thuộc tính DTO
- Giữ DTO đơn giản - chỉ là nơi chứa dữ liệu

## Tài liệu liên quan

Xem thêm:
- [Lớp dịch vụ](../Patterns/Service-Layer.md) để tích hợp dịch vụ
- [Repository-Pattern](../Patterns/Repository-Pattern.md) để truy cập dữ liệu
- [MVC-Pattern](../Patterns/MVC-Pattern.md) để sử dụng bộ điều khiển
- [Thử nghiệm](../Best-Practices/Testing.md) để thử nghiệm DTO

---

Tags: #dto #data-transfer-objects #design-patterns #module-development