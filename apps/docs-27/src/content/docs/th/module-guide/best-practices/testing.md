---
title: "แนวทางปฏิบัติที่ดีที่สุดในการทดสอบ PHPUnit"
description: "การตั้งค่า PHPUnit การเขียนหน่วยและการทดสอบการรวม การครอบคลุมโค้ด"
---
# แนวทางปฏิบัติที่ดีที่สุดในการทดสอบ PHPUnit ใน XOOPS

การทดสอบถือเป็นสิ่งสำคัญในการรับรองคุณภาพของโค้ด การป้องกันการถดถอย และการเปิดใช้งานการปรับโครงสร้างใหม่อย่างมั่นใจ

## กำลังติดตั้ง PHPUnit
```bash
# Using Composer
composer require --dev phpunit/phpunit ^9.0

# Run tests
./vendor/bin/phpunit
```
## phpunit.xml การกำหนดค่า
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
## การเขียนแบบทดสอบหน่วย
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
## การทดสอบวัตถุข้อมูล
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
## ความคุ้มครองรหัส
```bash
# Generate coverage report
./vendor/bin/phpunit --coverage-html coverage

# View coverage percentage
./vendor/bin/phpunit --coverage-text
```
## แนวทางปฏิบัติที่ดีที่สุด

- เขียนการทดสอบหนึ่งครั้งต่อวิธี/สถานการณ์
- ใช้ชื่อการทดสอบเชิงพรรณนา
- ทำตามรูปแบบ Arrange-Act-Assert
- จำลองการพึ่งพาภายนอก
- ให้การทดสอบเน้นและเป็นอิสระ
- ตั้งเป้าที่จะครอบคลุมโค้ดมากกว่า 80%
- ทดสอบเงื่อนไขข้อผิดพลาด
- ทดสอบกรณีขอบเขต

## องค์กรทดสอบ
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
## เอกสารที่เกี่ยวข้อง

ดูเพิ่มเติมที่:
- การจัดการข้อผิดพลาดสำหรับการทดสอบข้อยกเว้น
- ../Patterns/Repository-Pattern สำหรับการทดสอบ Repository
- ../Patterns/Service-Layer สำหรับการทดสอบบริการ
- Code-Organization สำหรับโครงสร้างการทดสอบ

---

Tags: #แนวปฏิบัติที่ดีที่สุด #การทดสอบ #phpunit #การครอบคลุมโค้ด #การพัฒนาโมดูล