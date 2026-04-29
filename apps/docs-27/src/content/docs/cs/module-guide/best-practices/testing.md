---
title: "Doporučené postupy testování PHPUnit"
description: "Nastavení PHPUnit, psaní jednotek a integračních testů, pokrytí kódu"
---

# Doporučené postupy testování PHPUnit v XOOPS

Testování je nezbytné pro zajištění kvality kódu, předcházení regresím a umožnění spolehlivého refaktorování.

## Instalace PHPUnit

```bash
# Using Composer
composer require --dev phpunit/phpunit ^9.0

# Run tests
./vendor/bin/phpunit
```

## Konfigurace phpunit.xml

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

## Psaní jednotkových testů

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

## Testování datových objektů

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

## Pokrytí kódu

```bash
# Generate coverage report
./vendor/bin/phpunit --coverage-html coverage

# View coverage percentage
./vendor/bin/phpunit --coverage-text
```

## Nejlepší postupy

- Napište jeden test na method/scenario
- Používejte popisné názvy testů
- Postupujte podle vzoru Uspořádat-Jednej-Prosít
- Zesměšňovat externí závislosti
- Udržujte testy soustředěné a nezávislé
- Zaměřte se na 80%+ pokrytí kódem
- Testujte chybové podmínky
- Testovací hraniční případy

## Testovací organizace

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

## Související dokumentace

Viz také:
- Zpracování chyb pro testování výjimek
- ../Patterns/Repository-Pattern pro testování úložiště
- ../Patterns/Service-Layer pro servisní testování
- Organizace kódu pro strukturu testu

---

Tagy: #best-practices #testing #phpunit #code-coverage #module-development