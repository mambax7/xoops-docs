---
title: "Các phương pháp hay nhất về thử nghiệm PHPUnit"
description: "Thiết lập PHPUnit, viết bài kiểm thử đơn vị và tích hợp, bao quát mã"
---
# Các phương pháp thực hành tốt nhất về kiểm thử PHPUnit trong XOOPS

Kiểm tra là điều cần thiết để đảm bảo chất lượng mã, ngăn ngừa hồi quy và cho phép tái cấu trúc một cách tự tin.

## Cài đặt PHPUnit

```bash
# Using Composer
composer require --dev phpunit/phpunit ^9.0

# Run tests
./vendor/bin/phpunit
```

## Cấu hình phpunit.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<phpunit bootstrap="tests/bootstrap.php"
         colors="true"
         verbose="true">
    <testsuites>
        <testsuite name="Unit">
            <directory>tests/unit</directory>
        </testsuite>
        <testsuite name="Integration">
            <directory>tests/integration</directory>
        </testsuite>
    </testsuites>
    
    <coverage processUncoveredFiles="true">
        <include>
            <directory suffix=".php">class</directory>
        </include>
        <report>
            <html outputDirectory="coverage"/>
        </report>
    </coverage>
</phpunit>
```

## Bài kiểm tra đơn vị viết

```php
<?php
namespace Xoops\Module\Mymodule\Tests\Unit;

use PHPUnit\Framework\TestCase;
use Xoops\Module\Mymodule\Service\UserService;

class UserServiceTest extends TestCase
{
    private $userService;
    private $mockRepository;
    
    protected function setUp(): void
    {
        parent::setUp();
        $this->mockRepository = $this->createMock(
            \Xoops\Module\Mymodule\Repository\UserRepositoryInterface::class
        );
        $this->userService = new UserService($this->mockRepository);
    }
    
    public function testRegisterSuccess()
    {
        // Arrange
        $this->mockRepository->expects($this->once())
            ->method('findByUsername')
            ->willReturn(null);
        
        $this->mockRepository->expects($this->once())
            ->method('save')
            ->willReturn(1);
        
        // Act
        $result = $this->userService->register('user', 'test@test.com', 'pass');
        
        // Assert
        $this->assertNotNull($result);
    }
    
    public function testRegisterDuplicate()
    {
        // Arrange
        $existingUser = new \stdClass();
        $this->mockRepository->expects($this->once())
            ->method('findByUsername')
            ->willReturn($existingUser);
        
        // Act & Assert
        $this->expectException(\Exception::class);
        $this->userService->register('user', 'test@test.com', 'pass');
    }
}
?>
```

## Kiểm tra đối tượng dữ liệu

```php
<?php
class UserDTOTest extends TestCase
{
    public function testDTOCreation()
    {
        $user = new User();
        $user->setId(1)
            ->setUsername('testuser')
            ->setEmail('test@test.com');
        
        $dto = new UserDTO($user);
        
        $this->assertEquals(1, $dto->getId());
        $this->assertEquals('testuser', $dto->getUsername());
    }
    
    public function testDTOToArray()
    {
        $user = new User();
        $user->setId(1)->setUsername('testuser');
        
        $dto = new UserDTO($user);
        $array = $dto->toArray();
        
        $this->assertIsArray($array);
        $this->assertEquals(1, $array['id']);
    }
}
?>
```

## Phạm vi mã

```bash
# Generate coverage report
./vendor/bin/phpunit --coverage-html coverage

# View coverage percentage
./vendor/bin/phpunit --coverage-text
```

## Các phương pháp hay nhất

- Viết một bài kiểm tra cho mỗi phương pháp/kịch bản
- Sử dụng tên thử nghiệm mang tính mô tả
- Thực hiện theo mô hình Sắp xếp-Act-Assert
- Giả lập các phụ thuộc bên ngoài
- Giữ các bài kiểm tra tập trung và độc lập
- Đặt mục tiêu bao phủ mã trên 80%
- Điều kiện kiểm tra lỗi
- Kiểm tra các trường hợp ranh giới

## Tổ chức kiểm tra

```
tests/
├── unit/
│   ├── UserServiceTest.php
│   ├── UserRepositoryTest.php
│   └── UserDTOTest.php
├── integration/
│   ├── UserControllerTest.php
│   └── UserServiceTest.php
├── fixtures/
│   └── users.php
├── bootstrap.php
└── phpunit.xml
```

## Tài liệu liên quan

Xem thêm:
- Xử lý lỗi để kiểm tra ngoại lệ
- ../Patterns/Repository-Pattern để kiểm tra kho lưu trữ
- ../Patterns/Service-Layer để kiểm tra dịch vụ
- Tổ chức mã cho cấu trúc thử nghiệm

---

Tags: #thực hành tốt nhất #kiểm tra #phpunit #code-coverage #module-development