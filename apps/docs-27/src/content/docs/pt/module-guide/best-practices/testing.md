---
title: "Boas Práticas de Testes PHPUnit"
description: "Configuração de PHPUnit, escrita de testes unitários e integração, cobertura de código"
---

# Boas Práticas de Testes PHPUnit em XOOPS

Testes são essenciais para garantir qualidade de código, prevenir regressões e permitir refatoração confiante.

## Instalando PHPUnit

```bash
# Usando Composer
composer require --dev phpunit/phpunit ^9.0

# Executar testes
./vendor/bin/phpunit
```

## Configuração phpunit.xml

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

## Escrevendo Testes Unitários

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

## Testes de Objetos de Dados

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

## Cobertura de Código

```bash
# Gerar relatório de cobertura
./vendor/bin/phpunit --coverage-html coverage

# Ver percentagem de cobertura
./vendor/bin/phpunit --coverage-text
```

## Boas Práticas

- Escrever um teste por método/cenário
- Usar nomes de teste descritivos
- Seguir padrão Arrange-Act-Assert
- Mockar dependências externas
- Manter testes focados e independentes
- Almejar cobertura 80%+
- Testar condições de erro
- Testar casos limites

## Organização de Testes

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

## Documentação Relacionada

Veja também:
- Tratamento-de-Erros para teste de exceção
- ../Padrões/Padrão-Repository para teste de repositório
- ../Padrões/Camada-de-Serviço para teste de serviço
- Organização-de-Código para estrutura de teste

---

Tags: #boas-práticas #testes #phpunit #cobertura-de-código #desenvolvimento-de-módulo
