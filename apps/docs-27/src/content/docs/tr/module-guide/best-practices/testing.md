---
title: "PHPUnit En İyi Uygulamaları Test Etme"
description: "PHPUnit kurulumu, birim ve entegrasyon testleri yazma, kod kapsamı"
---
# PHPUnit XOOPS'deki En İyi Uygulamaları Test Etme

Kod kalitesini sağlamak, gerilemeleri önlemek ve güvenli yeniden düzenlemeyi sağlamak için test yapmak önemlidir.

## PHPUnit kurulumu
```bash
# Using Composer
composer require --dev phpunit/phpunit ^9.0

# Run tests
./vendor/bin/phpunit
```
## phpunit.xml Yapılandırması
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
## Birim Testlerini Yazma
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
## Veri Nesnelerini Test Etme
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
## Kod Kapsamı
```bash
# Generate coverage report
./vendor/bin/phpunit --coverage-html coverage

# View coverage percentage
./vendor/bin/phpunit --coverage-text
```
## En İyi Uygulamalar

- method/scenario başına bir test yazın
- Açıklayıcı test adları kullanın
- Düzenle-Harekete Geç-İddia modelini takip edin
- Sahte dış bağımlılıklar
- Testleri odaklanmış ve bağımsız tutun
- %80+ kod kapsamını hedefleyin
- Hata koşullarını test edin
- Sınır durumlarını test edin

## Test Organizasyonu
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
## İlgili Belgeler

Ayrıca bakınız:
- İstisna testi için Hata İşleme
- ../Patterns/Repository-Pattern depo testi için
- ../Patterns/Service-Layer servis testi için
- Test yapısı için Kod Organizasyonu

---

Etiketler: #en iyi uygulamalar #test #phpunit #kod kapsamı #module geliştirme