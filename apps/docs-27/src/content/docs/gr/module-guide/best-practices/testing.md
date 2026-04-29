---
title: "Βέλτιστες πρακτικές δοκιμών PHPUnit"
description: "Ρύθμιση PHPUnit, δοκιμές γραφής και ολοκλήρωσης, κάλυψη κώδικα"
---

# Βέλτιστες πρακτικές δοκιμής PHPUnit στο XOOPS

Η δοκιμή είναι απαραίτητη για τη διασφάλιση της ποιότητας του κώδικα, την αποφυγή παλινδρόμησης και τη δυνατότητα σίγουρης αναδιαμόρφωσης.

## Εγκατάσταση PHPUnit

```bash
# Using Composer
composer require --dev phpunit/phpunit ^9.0

# Run tests
./vendor/bin/phpunit
```

## phpunit.xml Διαμόρφωση

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

## Δοκιμές γραπτής ενότητας

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

## Δοκιμή αντικειμένων δεδομένων

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

## Κάλυψη κωδικού

```bash
# Generate coverage report
./vendor/bin/phpunit --coverage-html coverage

# View coverage percentage
./vendor/bin/phpunit --coverage-text
```

## Βέλτιστες πρακτικές

- Γράψτε ένα τεστ ανά method/scenario
- Χρησιμοποιήστε περιγραφικά ονόματα δοκιμών
- Ακολουθήστε το μοτίβο Arrange-Act-Assert
- Κλείστε τις εξωτερικές εξαρτήσεις
- Διατηρήστε τις δοκιμές εστιασμένες και ανεξάρτητες
- Στοχεύστε σε 80%+ κάλυψη κωδικών
- Συνθήκες σφάλματος δοκιμής
- Περιπτώσεις ορίων δοκιμής

## Οργάνωση δοκιμών

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

## Σχετική τεκμηρίωση

Δείτε επίσης:
- Χειρισμός σφαλμάτων για δοκιμή εξαίρεσης
- ../Patterns/Repository-Pattern για δοκιμή αποθετηρίου
- ../Patterns/Service-Layer για δοκιμή σέρβις
- Κώδικας-Οργάνωση για τη δομή δοκιμής

---

Ετικέτες: #best-practices #testing #phpunit #code-coverage #module-development
