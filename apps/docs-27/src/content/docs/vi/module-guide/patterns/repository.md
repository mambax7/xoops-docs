---
title: "Mẫu lưu trữ trong XOOPS"
description: "Triển khai lớp trừu tượng truy cập dữ liệu"
---
<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::note[Không chắc đây có phải là mẫu phù hợp không?]
Xem [Chọn mẫu truy cập dữ liệu](../Choosing-Data-Access-Pattern.md) để biết cây quyết định so sánh trình xử lý, kho lưu trữ, dịch vụ và CQRS.
:::

:::tip[Hoạt động hôm nay và ngày mai]
Mẫu Kho lưu trữ ** hoạt động ở cả XOOPS 2.5.x và XOOPS 4.0.x**. Trong 2.5.x, hãy bọc `XoopsPersistableObjectHandler` hiện có của bạn trong Kho lưu trữ class để nhận được các lợi ích trừu tượng:

| Tiếp cận | XOOPS 2.5.x | XOOPS 4.0 |
|----------|-------------|-------------|
| Truy cập xử lý trực tiếp | `xoops_getModuleHandler()` | Qua container DI |
| Trình bao bọc kho lưu trữ | ✅ Được đề xuất | ✅ Mẫu bản địa |
| Thử nghiệm với mô hình | ✅ Có hướng dẫn sử dụng DI | ✅ Tự động nối dây container |

**Bắt đầu với mẫu Kho lưu trữ ngay hôm nay** để chuẩn bị modules cho quá trình di chuyển XOOPS 4.0.
:::

Mẫu lưu trữ là mẫu truy cập dữ liệu trừu tượng hóa các hoạt động cơ sở dữ liệu, cung cấp giao diện rõ ràng để truy cập dữ liệu. Nó hoạt động như một người trung gian giữa logic nghiệp vụ và các lớp ánh xạ dữ liệu.

## Khái niệm kho lưu trữ

Mẫu Kho lưu trữ cung cấp:
- Tóm tắt chi tiết triển khai cơ sở dữ liệu
- Dễ dàng mô phỏng để kiểm tra đơn vị
- Logic truy cập dữ liệu tập trung
- Linh hoạt thay đổi cơ sở dữ liệu mà không ảnh hưởng đến logic nghiệp vụ
- Logic truy cập dữ liệu có thể tái sử dụng trên ứng dụng

## Khi nào nên sử dụng kho lưu trữ

**Sử dụng Kho lưu trữ khi:**
- Truyền dữ liệu giữa các lớp ứng dụng
- Cần thay đổi việc thực hiện cơ sở dữ liệu
- Viết mã có thể kiểm tra được bằng mock
- Tóm tắt các mô hình truy cập dữ liệu

## Mẫu triển khai

```php
<?php
// Define repository interface
interface UserRepositoryInterface
{
    public function find($id);
    public function findAll($limit = null, $offset = 0);
    public function findBy(array $criteria);
    public function save($entity);
    public function update($id, $entity);
    public function delete($id);
}

// Implement repository
class UserRepository implements UserRepositoryInterface
{
    private $db;
    
    public function __construct($connection)
    {
        $this->db = $connection;
    }
    
    public function find($id)
    {
        // Implementation
    }
    
    public function save($entity)
    {
        // Implementation
    }
}
?>
```

## Cách sử dụng trong Dịch vụ

```php
<?php
class UserService
{
    private $userRepository;
    
    public function __construct(UserRepositoryInterface $userRepository)
    {
        $this->userRepository = $userRepository;
    }
    
    public function registerUser($username, $email, $password)
    {
        // Check if user exists
        if ($this->userRepository->findByUsername($username)) {
            throw new \InvalidArgumentException('Username exists');
        }
        
        // Create user
        $user = new User();
        $user->setUsername($username);
        $user->setEmail($email);
        $user->setPassword($password);
        
        return $this->userRepository->save($user);
    }
}
?>
```

## Các phương pháp hay nhất

- Sử dụng giao diện để xác định hợp đồng kho lưu trữ
- Mỗi kho lưu trữ xử lý một loại thực thể
- Giữ logic kinh doanh trong các dịch vụ, không phải kho lưu trữ
- Sử dụng các đối tượng thực thể để ánh xạ dữ liệu
- Ném ra ngoại lệ thích hợp cho các hoạt động không hợp lệ

## Tài liệu liên quan

Xem thêm:
- [MVC-Pattern](../Patterns/MVC-Pattern.md) để tích hợp bộ điều khiển
- [Lớp dịch vụ](../Patterns/Service-Layer.md) để triển khai dịch vụ
- [DTO-Pattern](DTO-Pattern.md) dành cho đối tượng truyền dữ liệu
- [Thử nghiệm](../Best-Practices/Testing.md) để kiểm tra kho lưu trữ

---

Tags: #repository-pattern #data-access #design-patterns #module-development