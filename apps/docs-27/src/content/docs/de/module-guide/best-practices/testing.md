---
title: "Best Practices für PHPUnit-Tests"
description: "Einrichten von PHPUnit, Schreiben von Unit- und Integrationstests, Code-Abdeckung"
---

# Best Practices für PHPUnit-Tests in XOOPS

Testen ist für die Gewährleistung der Codequalität, die Vermeidung von Regressionen und die sichere Umgestaltung unerlässlich.

## PHPUnit installieren

```bash
# Using Composer
composer require --dev phpunit/phpunit ^9.0

# Run tests
./vendor/bin/phpunit
```

## phpunit.xml-Konfiguration

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

## Unit-Tests schreiben

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

## Datenenobjekte testen

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

## Code-Abdeckung

```bash
# Generate coverage report
./vendor/bin/phpunit --coverage-html coverage

# View coverage percentage
./vendor/bin/phpunit --coverage-text
```

## Best Practices

- Schreiben Sie einen Test pro Methode/Szenario
- Verwenden Sie aussagekräftige Testnamen
- Folgen Sie dem Arrange-Act-Assert-Muster
- Verspotten Sie externe Abhängigkeiten
- Halten Sie Tests fokussiert und unabhängig
- Streben Sie mindestens 80% Code-Abdeckung an
- Testen Sie Fehlerbedingungen
- Testen Sie Grenzfälle

## Test-Organisation

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

## Verwandte Dokumentation

Siehe auch:
- Error-Handling für Ausnahmetests
- ../Patterns/Repository-Pattern für Repository-Tests
- ../Patterns/Service-Layer für Service-Tests
- Code-Organization für Teststruktur

---

Tags: #best-practices #testing #phpunit #code-coverage #module-development
