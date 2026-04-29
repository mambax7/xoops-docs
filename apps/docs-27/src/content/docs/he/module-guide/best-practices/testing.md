---
title: "PHPUnit שיטות עבודה מומלצות לבדיקה"
description: "הגדרת PHPUnit, כתיבת יחידות ובדיקות אינטגרציה, כיסוי קוד"
---

# PHPUnit שיטות עבודה מומלצות לבדיקה ב-XOOPS

בדיקה חיונית להבטחת איכות הקוד, מניעת רגרסיות ומאפשרת עיבוד מחדש בטוח.

## התקנת PHPUnit

```bash
# Using Composer
composer require --dev phpunit/phpunit ^9.0

# Run tests
./vendor/bin/phpunit
```

## phpunit.xml תצורה

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

## בדיקות יחידות כתיבה

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

## בדיקת אובייקטי נתונים

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

## כיסוי קוד

```bash
# Generate coverage report
./vendor/bin/phpunit --coverage-html coverage

# View coverage percentage
./vendor/bin/phpunit --coverage-text
```

## שיטות עבודה מומלצות

- כתוב מבחן אחד לכל method/scenario
- השתמש בשמות מבחנים תיאוריים
- עקוב אחר דפוס Arrange-Act-Assert
- לעג לתלות חיצונית
- שמור על מבחנים ממוקדים ועצמאיים
- כוון לכיסוי קוד של 80%+
- תנאי שגיאה בבדיקה
- מקרי גבול בדיקה

## ארגון בדיקה

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

## תיעוד קשור

ראה גם:
- טיפול בשגיאות לבדיקת חריגים
- ../Patterns/Repository-Pattern לבדיקת מאגר
- ../Patterns/Service-Layer לבדיקת שירות
- קוד-ארגון למבנה הבדיקה

---

תגיות: #שיטות עבודה מומלצות #בדיקות #phpunit #כיסוי-קוד #פיתוח-מודולים
