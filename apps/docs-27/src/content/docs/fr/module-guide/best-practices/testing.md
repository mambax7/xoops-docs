---
title: "Meilleures pratiques de test PHPUnit"
description: "Configuration de PHPUnit, rédaction de tests unitaires et d'intégration, couverture de code"
---

# Meilleures pratiques de test PHPUnit dans XOOPS

Les tests sont essentiels pour assurer la qualité du code, prévenir les régressions et permettre une refactorisation confiante.

## Installation de PHPUnit

```bash
# Utiliser Composer
composer require --dev phpunit/phpunit ^9.0

# Exécuter les tests
./vendor/bin/phpunit
```

## Configuration phpunit.xml

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

## Rédaction de tests unitaires

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

## Test des objets de données

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

## Couverture du code

```bash
# Générer le rapport de couverture
./vendor/bin/phpunit --coverage-html coverage

# Afficher le pourcentage de couverture
./vendor/bin/phpunit --coverage-text
```

## Meilleures pratiques

- Rédiger un test par méthode/scénario
- Utiliser des noms de test descriptifs
- Suivre le motif Arrange-Act-Assert
- Simuler les dépendances externes
- Garder les tests ciblés et indépendants
- Viser une couverture de 80%+
- Tester les conditions d'erreur
- Tester les cas limites

## Organisation des tests

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

## Documentation connexe

Voir aussi:
- Gestion des erreurs pour les tests d'exception
- ../Patterns/Motif-Repository pour les tests de dépôt
- ../Patterns/Couche-Service pour les tests de service
- Organisation du code pour la structure des tests

---

Tags: #best-practices #testing #phpunit #code-coverage #module-development
