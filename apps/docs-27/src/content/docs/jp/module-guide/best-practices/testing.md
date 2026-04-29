---
title: "PHPUnitテストのベストプラクティス"
description: "PHPUnitの設定、ユニット・統合テストの記述、コードカバレッジ"
---

# XOOPSのPHPUnitテストのベストプラクティス

テストはコード品質の確保、リグレッションの防止、自信を持ったリファクタリングに不可欠です。

## PHPUnitのインストール

```bash
# Composerを使用
composer require --dev phpunit/phpunit ^9.0

# テストを実行
./vendor/bin/phpunit
```

## phpunit.xml設定

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

## ユニットテストの記述

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
        // 準備
        $this->mockRepository->expects($this->once())
            ->method('findByUsername')
            ->willReturn(null);
        
        $this->mockRepository->expects($this->once())
            ->method('save')
            ->willReturn(1);
        
        // 実行
        $result = $this->userService->register('user', 'test@test.com', 'pass');
        
        // 確認
        $this->assertNotNull($result);
    }
    
    public function testRegisterDuplicate()
    {
        // 準備
        $existingUser = new \stdClass();
        $this->mockRepository->expects($this->once())
            ->method('findByUsername')
            ->willReturn($existingUser);
        
        // 実行と確認
        $this->expectException(\Exception::class);
        $this->userService->register('user', 'test@test.com', 'pass');
    }
}
?>
```

## データオブジェクトのテスト

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

## コードカバレッジ

```bash
# カバレッジレポートを生成
./vendor/bin/phpunit --coverage-html coverage

# カバレッジパーセンテージを表示
./vendor/bin/phpunit --coverage-text
```

## ベストプラクティス

- メソッド/シナリオごとに1つのテストを記述
- 説明的なテスト名を使用
- Arrange-Act-Assertパターンに従う
- 外部依存関係をモック
- テストがフォーカスされ、独立している状態を保つ
- 80%以上のコードカバレッジを目指す
- エラー条件をテスト
- 境界ケースをテスト

## テスト組織

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

## 関連ドキュメント

関連トピック:
- エラーハンドリング - 例外テスト
- ../Patterns/Repository-Pattern - リポジトリテスト
- ../Patterns/Service-Layer - サービステスト
- コード組織 - テスト構造

---

タグ: #best-practices #testing #phpunit #code-coverage #module-development
