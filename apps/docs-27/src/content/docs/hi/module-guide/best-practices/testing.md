---
title: "PHPUnit परीक्षण सर्वोत्तम अभ्यास"
description: "PHPUnit की स्थापना, लेखन इकाई और एकीकरण परीक्षण, कोड कवरेज"
---
# PHPUnit परीक्षण सर्वोत्तम अभ्यास XOOPS में

कोड की गुणवत्ता सुनिश्चित करने, प्रतिगमन को रोकने और आत्मविश्वासपूर्ण रीफैक्टरिंग को सक्षम करने के लिए परीक्षण आवश्यक है।

## PHPUnit स्थापित करना

```bash
# Using Composer
composer require --dev phpunit/phpunit ^9.0

# Run tests
./vendor/bin/phpunit
```

## phpunit.xml कॉन्फ़िगरेशन

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

## यूनिट टेस्ट लिखना

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

## डेटा ऑब्जेक्ट का परीक्षण

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

## कोड कवरेज

```bash
# Generate coverage report
./vendor/bin/phpunit --coverage-html coverage

# View coverage percentage
./vendor/bin/phpunit --coverage-text
```

## सर्वोत्तम प्रथाएँ

- प्रति विधि/परिदृश्य में एक परीक्षण लिखें
- वर्णनात्मक परीक्षण नामों का प्रयोग करें
- अरेंज-एक्ट-एसर्ट पैटर्न का पालन करें
- बाहरी निर्भरता का मजाक उड़ाएं
- परीक्षणों को केंद्रित और स्वतंत्र रखें
- 80%+ कोड कवरेज का लक्ष्य रखें
- परीक्षण त्रुटि की स्थिति
- परीक्षण सीमा मामले

## परीक्षण संगठन

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

## संबंधित दस्तावेज़ीकरण

यह भी देखें:
- अपवाद परीक्षण के लिए त्रुटि-हैंडलिंग
- ../पैटर्न/रिपॉजिटरी-रिपॉजिटरी परीक्षण के लिए पैटर्न
- सेवा परीक्षण के लिए ../पैटर्न/सेवा-परत
- परीक्षण संरचना के लिए कोड-संगठन

---

टैग: #सर्वोत्तम अभ्यास #परीक्षण #phpunit #कोड-कवरेज #मॉड्यूल-विकास