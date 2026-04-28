---
title: "أفضل ممارسات اختبار PHPUnit"
description: "إعداد PHPUnit وكتابة اختبارات الوحدة والتكامل وتغطية الكود"
dir: rtl
lang: ar
---

# أفضل ممارسات اختبار PHPUnit في XOOPS

الاختبار ضروري لضمان جودة الكود ومنع الانحدار وتمكين إعادة الهيكلة الواثقة.

## تثبيت PHPUnit

```bash
# استخدام Composer
composer require --dev phpunit/phpunit ^9.0

# قم بتشغيل الاختبارات
./vendor/bin/phpunit
```

## تكوين phpunit.xml

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

## كتابة اختبارات الوحدة

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
        // ترتيب
        $this->mockRepository->expects($this->once())
            ->method('findByUsername')
            ->willReturn(null);
        
        $this->mockRepository->expects($this->once())
            ->method('save')
            ->willReturn(1);
        
        // عمل
        $result = $this->userService->register('user', 'test@test.com', 'pass');
        
        // تأكيد
        $this->assertNotNull($result);
    }
    
    public function testRegisterDuplicate()
    {
        // ترتيب
        $existingUser = new \stdClass();
        $this->mockRepository->expects($this->once())
            ->method('findByUsername')
            ->willReturn($existingUser);
        
        // عمل وتأكيد
        $this->expectException(\Exception::class);
        $this->userService->register('user', 'test@test.com', 'pass');
    }
}
?>
```

## اختبار كائنات البيانات

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

## تغطية الكود

```bash
# توليد تقرير التغطية
./vendor/bin/phpunit --coverage-html coverage

# عرض نسبة التغطية
./vendor/bin/phpunit --coverage-text
```

## أفضل الممارسات

- اكتب اختبار واحد لكل طريقة/سيناريو
- استخدم أسماء اختبار وصفية
- اتبع نمط ترتيب-عمل-تأكيد
- وهمي الاعتماديات الخارجية
- احفظ الاختبارات مركزة ومستقلة
- استهدف تغطية 80%+ من الكود
- اختبر شروط الخطأ
- اختبر حالات الحدود

## تنظيم الاختبار

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

## الوثائق ذات الصلة

انظر أيضاً:
- Error-Handling لاختبار الاستثناء
- ../Patterns/Repository-Pattern لاختبار المستودع
- ../Patterns/Service-Layer لاختبار الخدمة
- Code-Organization لهيكل الاختبار

---

Tags: #best-practices #testing #phpunit #code-coverage #module-development
