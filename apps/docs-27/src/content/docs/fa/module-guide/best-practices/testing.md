---
title: "بهترین روش های تست PHPUnit"
description: "راه اندازی PHPUnit، واحد نوشتن و تست های یکپارچه سازی، پوشش کد"
---
بهترین روش‌های تست PHPUnit در XOOPS

تست برای اطمینان از کیفیت کد، جلوگیری از رگرسیون، و فعال کردن دوباره فاکتورسازی مطمئن ضروری است.

## در حال نصب PHPUnit

```bash
# Using Composer
composer require --dev phpunit/phpunit ^9.0

# Run tests
./vendor/bin/phpunit
```

## پیکربندی phpunit.xml

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

## تست های واحد نوشتاری

```php
<?php
namespace XOOPS\Module\Mymodule\Tests\Unit;

use PHPUnit\Framework\TestCase;
use XOOPS\Module\Mymodule\Service\UserService;

class UserServiceTest extends TestCase
{
    private $userService;
    private $mockRepository;
    
    protected function setUp(): void
    {
        parent::setUp();
        $this->mockRepository = $this->createMock(
            \XOOPS\Module\Mymodule\Repository\UserRepositoryInterface::class
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

## آزمایش اشیاء داده

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

## پوشش کد

```bash
# Generate coverage report
./vendor/bin/phpunit --coverage-html coverage

# View coverage percentage
./vendor/bin/phpunit --coverage-text
```

## بهترین شیوه ها

- برای هر method/scenario یک تست بنویسید
- از اسامی آزمون تشریحی استفاده کنید
- الگوی Arrange-Act-Assert را دنبال کنید
- وابستگی های خارجی را مسخره کنید
- آزمون ها را متمرکز و مستقل نگه دارید
- هدف 80% پوشش کد را افزایش دهید
- شرایط خطای تست
- موارد مرزی را آزمایش کنید

## سازمان آزمون

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

## مستندات مرتبط

همچنین ببینید:
- مدیریت خطا برای تست استثنا
- ../Patterns/Repository-Pattern برای تست مخزن
- ../Patterns/Service-Layer برای تست خدمات
- Code-Organization برای ساختار تست

---

برچسب‌ها: #بهترین تمرینات #تست #phpunit #کد-پوشش #توسعه ماژول