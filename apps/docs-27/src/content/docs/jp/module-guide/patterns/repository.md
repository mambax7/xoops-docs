---
title: "XOOPSのリポジトリパターン"
description: "データアクセス抽象化レイヤー実装"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::note[正しいパターンか不確かですか?]
[データアクセスパターンの選択](../Choosing-Data-Access-Pattern.md) でハンドラー、リポジトリ、サービス、CQRSを比較した判定木を参照してください。
:::

:::tip[今日そして明日も機能]
リポジトリパターンは **XOOPS 2.5.xとXOOPS 4.0.x の両方で機能します**。概念は普遍的です - 構文のみが異なります:

| アプローチ | XOOPS 2.5.x | XOOPS 4.0 |
|----------|-------------|------------|
| 直接ハンドラーアクセス | `xoops_getModuleHandler()` | DI コンテナ経由 |
| リポジトリラッパー | ✅ 推奨 | ✅ ネイティブパターン |
| モックでテスト | ✅ 手動 DI で | ✅ コンテナオートワイア |

**今日からリポジトリパターンを開始** して、XOOPSモジュールをXOOPS 4.0移行に備えてください。
:::

リポジトリパターンはデータベース操作を抽象化し、データアクセスのクリーンなインターフェースを提供するデータアクセスパターンです。ビジネスロジックとデータマッピングレイヤー間の中間者として機能します。

## リポジトリの概念

リポジトリパターンは以下を提供します:
- データベース実装の詳細を抽象化
- ユニットテストのための簡単なモック
- データアクセスロジックの一元化
- ビジネスロジックに影響を与えずにデータベースを変更する柔軟性
- アプリケーション全体で再利用可能なデータアクセスロジック

## リポジトリを使用するとき

**リポジトリを使用する場合:**
- アプリケーションレイヤー間でデータを転送するとき
- データベース実装を変更する必要があるとき
- モックを使用してテストしやすいコードを記述するとき
- データアクセスパターンを抽象化するとき

## 実装パターン

```php
<?php
// リポジトリインターフェースを定義
interface UserRepositoryInterface
{
    public function find($id);
    public function findAll($limit = null, $offset = 0);
    public function findBy(array $criteria);
    public function save($entity);
    public function update($id, $entity);
    public function delete($id);
}

// リポジトリを実装
class UserRepository implements UserRepositoryInterface
{
    private $db;
    
    public function __construct($connection)
    {
        $this->db = $connection;
    }
    
    public function find($id)
    {
        // 実装
    }
    
    public function save($entity)
    {
        // 実装
    }
}
?>
```

## サービスでの使用

```php
<?php
class UserService
{
    private $userRepository;
    
    public function __construct(UserRepositoryInterface $userRepository)
    {
        $this->userRepository = $userRepository;
    }
    
    public function registerUser($username, $email, $password)
    {
        // ユーザーが存在するか確認
        if ($this->userRepository->findByUsername($username)) {
            throw new \InvalidArgumentException('ユーザー名は既に存在します');
        }
        
        // ユーザーを作成
        $user = new User();
        $user->setUsername($username);
        $user->setEmail($email);
        $user->setPassword($password);
        
        return $this->userRepository->save($user);
    }
}
?>
```

## ベストプラクティス

- インターフェースを使用してリポジトリ契約を定義
- 各リポジトリはエンティティ型を1つ処理
- ビジネスロジックをサービスに保つ、リポジトリには保たない
- エンティティオブジェクトを使用してデータマッピング
- 無効な操作に対して適切な例外をスロー

## 関連ドキュメント

関連トピック:
- [MVC-Pattern](../Patterns/MVC-Pattern.md) - コントローラー統合
- [Service-Layer](../Patterns/Service-Layer.md) - サービス実装
- [DTO-Pattern](DTO-Pattern.md) - データ転送オブジェクト
- [Testing](../Best-Practices/Testing.md) - リポジトリテスト

---

タグ: #repository-pattern #data-access #design-patterns #module-development
