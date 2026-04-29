---
title: "Praktik Terbaik Pengujian Unit PHP"
description: "Menyiapkan PHPUnit, unit penulisan dan pengujian integrasi, cakupan kode"
---

# Praktik Terbaik Pengujian PHPUnit di XOOPS

Pengujian sangat penting untuk memastikan kualitas kode, mencegah regresi, dan memungkinkan pemfaktoran ulang yang percaya diri.

## Menginstal PHPUnit

```bash
# Using Composer
composer require --dev phpunit/phpunit ^9.0

# Run tests
./vendor/bin/phpunit
```

## Konfigurasi phpunit.xml

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

## Tes Unit Penulisan

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

## Menguji Objek Data

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

## Cakupan Kode

```bash
# Generate coverage report
./vendor/bin/phpunit --coverage-html coverage

# View coverage percentage
./vendor/bin/phpunit --coverage-text
```

## Praktik Terbaik

- Tulis satu tes per method/scenario
- Gunakan nama tes deskriptif
- Ikuti pola Arrange-Act-Assert
- Tiruan ketergantungan eksternal
- Jaga agar tes tetap fokus dan independen
- Targetkan 80%+ cakupan kode
- Uji kondisi kesalahan
- Uji kasus batas

## Organisasi Uji

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

## Dokumentasi Terkait

Lihat juga:
- Penanganan Kesalahan untuk pengujian pengecualian
- ../Patterns/Repository-Pattern untuk pengujian repositori
- ../Patterns/Service-Layer untuk pengujian layanan
- Kode-Organisasi untuk struktur pengujian

---

Tag: #praktik terbaik #pengujian #phpunit #cakupan kode #pengembangan module
