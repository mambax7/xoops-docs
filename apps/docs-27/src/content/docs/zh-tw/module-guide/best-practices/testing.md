---
title: "PHPUnit 測試最佳實踐"
description: "設定 PHPUnit、編寫單元和整合測試、程式碼涵蓋範圍"
---

# XOOPS 中的 PHPUnit 測試最佳實踐

測試對於確保程式碼品質、防止迴歸和支援自信重構至關重要。

## 安裝 PHPUnit

```bash
# 使用 Composer
composer require --dev phpunit/phpunit ^9.0

# 執行測試
./vendor/bin/phpunit
```

## phpunit.xml 組態

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

## 編寫單元測試

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
        // 安排
        $this->mockRepository->expects($this->once())
            ->method('findByUsername')
            ->willReturn(null);
        
        $this->mockRepository->expects($this->once())
            ->method('save')
            ->willReturn(1);
        
        // 行動
        $result = $this->userService->register('user', 'test@test.com', 'pass');
        
        // 判斷
        $this->assertNotNull($result);
    }
    
    public function testRegisterDuplicate()
    {
        // 安排
        $existingUser = new \stdClass();
        $this->mockRepository->expects($this->once())
            ->method('findByUsername')
            ->willReturn($existingUser);
        
        // 行動並判斷
        $this->expectException(\Exception::class);
        $this->userService->register('user', 'test@test.com', 'pass');
    }
}
?>
```

## 測試資料物件

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

## 程式碼涵蓋範圍

```bash
# 產生涵蓋範圍報告
./vendor/bin/phpunit --coverage-html coverage

# 檢視涵蓋範圍百分比
./vendor/bin/phpunit --coverage-text
```

## 最佳實踐

- 每個方法/案例編寫一個測試
- 使用描述性測試名稱
- 遵循安排-行動-判斷模式
- 模擬外部依賴
- 保持測試集中且獨立
- 目標 80%+ 程式碼涵蓋範圍
- 測試錯誤條件
- 測試邊界情況

## 測試組織

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

## 相關文件

另外參閱：
- Error-Handling 以進行例外狀況測試
- ../Patterns/Repository-Pattern 以進行 repository 測試
- ../Patterns/Service-Layer 以進行服務測試
- Code-Organization 以進行測試結構

---

標籤: #best-practices #testing #phpunit #code-coverage #module-development
