---
title: "Amalan Terbaik Pengujian PHPUnit"
description: "Menyediakan PHPUnit, menulis unit dan ujian integrasi, liputan kod"
---
# Amalan Terbaik Pengujian PHPUnit dalam XOOPSUjian adalah penting untuk memastikan kualiti kod, mencegah regresi, dan membolehkan pemfaktoran semula yang yakin.## Memasang PHPUnit
```
bash
# Using Composer
composer require --dev phpunit/phpunit ^9.0

# Run tests
./vendor/bin/phpunit
```
## phpunit.xml Konfigurasi
```
xml
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
## Ujian Unit Penulisan
```
php
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
## Menguji Objek Data
```
php
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
## Liputan Kod
```
bash
# Generate coverage report
./vendor/bin/phpunit --coverage-html coverage

# View coverage percentage
./vendor/bin/phpunit --coverage-text
```
## Amalan Terbaik- Tulis satu ujian setiap method/scenario
- Gunakan nama ujian deskriptif
- Ikut corak Susun-Bertindak-Tegaskan
- Olok-olok kebergantungan luar
- Pastikan ujian fokus dan bebas
- Sasarkan untuk liputan kod 80%+
- Uji keadaan ralat
- Uji kes sempadan## Organisasi Ujian
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
## Dokumentasi BerkaitanLihat juga:
- Ralat-Pengendalian untuk ujian pengecualian
- ../Patterns/Repository-Pattern untuk ujian repositori
- ../Patterns/Service-Layer untuk ujian perkhidmatan
- Kod-Organisasi untuk struktur ujian---

Tag: #amalan terbaik #pengujian #phpunit #liputan-kod #pembangunan-modul