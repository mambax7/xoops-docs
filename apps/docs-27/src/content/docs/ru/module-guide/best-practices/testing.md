---
title: "Лучшие практики тестирования PHPUnit"
description: "Установка PHPUnit, написание модульных и интеграционных тестов, покрытие кода"
---

# Лучшие практики тестирования PHPUnit в XOOPS

Тестирование необходимо для обеспечения качества кода, предотвращения регрессий и уверенного рефакторинга.

## Установка PHPUnit

```bash
# Используя Composer
composer require --dev phpunit/phpunit ^9.0

# Запустите тесты
./vendor/bin/phpunit
```

## Конфигурация phpunit.xml

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

## Написание модульных тестов

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
        // Подготовка
        $this->mockRepository->expects($this->once())
            ->method('findByUsername')
            ->willReturn(null);
        
        $this->mockRepository->expects($this->once())
            ->method('save')
            ->willReturn(1);
        
        // Действие
        $result = $this->userService->register('user', 'test@test.com', 'pass');
        
        // Проверка
        $this->assertNotNull($result);
    }
    
    public function testRegisterDuplicate()
    {
        // Подготовка
        $existingUser = new \stdClass();
        $this->mockRepository->expects($this->once())
            ->method('findByUsername')
            ->willReturn($existingUser);
        
        // Действие и проверка
        $this->expectException(\Exception::class);
        $this->userService->register('user', 'test@test.com', 'pass');
    }
}
?>
```

## Тестирование объектов данных

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

## Покрытие кода

```bash
# Генерируйте отчет покрытия
./vendor/bin/phpunit --coverage-html coverage

# Посмотрите процент покрытия
./vendor/bin/phpunit --coverage-text
```

## Лучшие практики

- Напишите один тест на метод/сценарий
- Используйте описательные имена тестов
- Следуйте паттерну Arrange-Act-Assert
- Макируйте внешние зависимости
- Держите тесты сфокусированными и независимыми
- Стремитесь к 80%+ покрытию кода
- Тестируйте условия ошибок
- Тестируйте граничные случаи

## Организация тестов

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

## Связанная документация

Смотрите также:
- Error-Handling для тестирования исключений
- ../Patterns/Repository-Pattern для тестирования репозитория
- ../Patterns/Service-Layer для тестирования сервиса
- Code-Organization для структуры тестов

---

Tags: #best-practices #testing #phpunit #code-coverage #module-development
