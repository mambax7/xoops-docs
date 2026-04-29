---
title: "Najboljše prakse testiranja PHPUnit"
description: "Nastavitev PHPUnit, pisanje testov enote in integracije, pokritost kode"
---
# Najboljše prakse testiranja PHPUnit v XOOPS

Testiranje je bistvenega pomena za zagotavljanje kakovosti kode, preprečevanje regresij in omogočanje samozavestnega refaktoriranja.

## Namestitev PHPUnit
```bash
# Using Composer
composer require --dev phpunit/phpunit ^9.0

# Run tests
./vendor/bin/phpunit
```
## Konfiguracija phpunit.xml
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
## Pisanje testov enot
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
## Testiranje podatkovnih objektov
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
## Pokritost kode
```bash
# Generate coverage report
./vendor/bin/phpunit --coverage-html coverage

# View coverage percentage
./vendor/bin/phpunit --coverage-text
```
## Najboljše prakse

- Napišite en test na method/scenario
- Uporabite opisna imena testov
- Sledite vzorcu Uredi-Dejaj-Uveljavi
- Izigravanje zunanjih odvisnosti
- Naj bodo testi osredotočeni in neodvisni
- Prizadevajte si za 80%+ pokritost kode
- Pogoji testnih napak
- Test mejnih primerov

## Organizacija testiranja
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
## Povezana dokumentacija

Glej tudi:
- Obravnava napak za testiranje izjem
- ../Patterns/Repository-Pattern za testiranje repozitorija
- ../Patterns/Service-Layer za testiranje storitev
- Organizacija kode za testno strukturo

---

Oznake: #najboljše prakse #testiranje #phpunit #pokritost kode #razvoj-modula