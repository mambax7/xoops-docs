---
title: "XOOPSのサービスレイヤーパターン"
description: "ビジネスロジック抽象化と依存注入"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::note[正しいパターンか不確かですか?]
[データアクセスパターンの選択](../Choosing-Data-Access-Pattern.md) でハンドラー、リポジトリ、サービス、CQRSを比較した判定木を参照してください。
:::

:::tip[今日そして明日も機能]
サービスレイヤーパターンは **XOOPS 2.5.xとXOOPS 4.0.x の両方で機能します**。概念は普遍的です - 構文のみが異なります:

| 機能 | XOOPS 2.5.x | XOOPS 4.0 |
|---------|-------------|------------|
| PHPバージョン | 7.4+ | 8.2+ |
| コンストラクタ注入 | ✅ 手動配線 | ✅ コンテナオートワイア |
| 型付きプロパティ | `@var` docblock | ネイティブ型宣言 |
| Readonlyプロパティ | ❌ 利用不可 | ✅ `readonly`キーワード |

下記のコード例はPHP 8.2+ 構文を使用しています。2.5.xの場合は`readonly`を省略し、従来のプロパティ宣言を使用してください。
:::

サービスレイヤーパターンはビジネスロジックを専用のサービスクラスにカプセル化し、コントローラーとデータアクセスレイヤー間の明確な分離を提供します。このパターンはコード再利用性、テスト可能性、保守性を促進します。

## サービスレイヤーの概念

### 目的
サービスレイヤー:
- ドメインビジネスロジックを含む
- 複数のリポジトリを調整
- 複雑な操作を処理
- トランザクションを管理
- 検証と認可を実行
- コントローラーに高度な操作を提供

### メリット
- 複数のコントローラー全体で再利用可能なビジネスロジック
- 分離してテストしやすい
- 一元化されたビジネスルール実装
- 明確な関心事の分離
- 簡略化されたコントローラーコード

## 依存注入

```php
<?php
// 注入された依存関係を持つサービス
class UserService
{
    private $userRepository;
    private $emailService;
    
    public function __construct(
        UserRepositoryInterface $userRepository,
        EmailServiceInterface $emailService
    ) {
        $this->userRepository = $userRepository;
        $this->emailService = $emailService;
    }
    
    public function registerUser($username, $email, $password)
    {
        // 検証
        $this->validate($username, $email, $password);
        
        // ユーザーを作成
        $user = new User();
        $user->setUsername($username);
        $user->setEmail($email);
        $user->setPassword($password);
        
        // 保存
        $userId = $this->userRepository->save($user);
        
        // ウェルカムメールを送信
        $this->emailService->sendWelcome($email, $username);
        
        return $userId;
    }
    
    private function validate($username, $email, $password)
    {
        $errors = [];
        
        if (strlen($username) < 3) {
            $errors['username'] = 'ユーザー名が短すぎます';
        }
        
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = '無効なメール';
        }
        
        if (strlen($password) < 6) {
            $errors['password'] = 'パスワードが短すぎます';
        }
        
        if (!empty($errors)) {
            throw new ValidationException('無効な入力', $errors);
        }
    }
}
?>
```

## サービスコンテナー

```php
<?php
class ServiceContainer
{
    private $services = [];
    
    public function __construct($db)
    {
        // リポジトリを登録
        $this->services['userRepository'] = new UserRepository($db);
        
        // サービスを登録
        $this->services['userService'] = new UserService(
            $this->services['userRepository']
        );
    }
    
    public function get($name)
    {
        if (!isset($this->services[$name])) {
            throw new \InvalidArgumentException("サービスが見つかりません: $name");
        }
        return $this->services[$name];
    }
}
?>
```

## コントローラーでの使用

```php
<?php
class UserController
{
    private $userService;
    
    public function __construct(ServiceContainer $container)
    {
        $this->userService = $container->get('userService');
    }
    
    public function registerAction()
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            return [];
        }
        
        try {
            $userId = $this->userService->registerUser(
                $_POST['username'],
                $_POST['email'],
                $_POST['password']
            );
            
            return [
                'success' => true,
                'userId' => $userId,
            ];
        } catch (ValidationException $e) {
            return [
                'success' => false,
                'errors' => $e->getErrors(),
            ];
        }
    }
}
?>
```

## ベストプラクティス

- 各サービスはドメイン関心を1つ処理
- サービスは実装ではなくインターフェースに依存
- 依存関係にコンストラクタ注入を使用
- サービスは分離してテストできるべき
- ドメイン固有の例外をスロー
- サービスはHTTPリクエストの詳細に依存しないべき
- サービスはフォーカスされ、結合度は高い

## 関連ドキュメント

関連トピック:
- [MVC-Pattern](../Patterns/MVC-Pattern.md) - コントローラー統合
- [Repository-Pattern](../Patterns/Repository-Pattern.md) - データアクセス
- [DTO-Pattern](DTO-Pattern.md) - データ転送オブジェクト
- [Testing](../Best-Practices/Testing.md) - サービステスト

---

タグ: #service-layer #business-logic #dependency-injection #design-patterns
