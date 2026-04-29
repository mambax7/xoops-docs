---
title: "XOOPSのDTOパターン"
description: "クリーンなデータハンドリング用のデータ転送オブジェクト"
---

# XOOPSのDTOパターン（データ転送オブジェクト）

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::tip[両バージョンで機能]
DTOはフレームワーク依存関係のないプレーンなPHPオブジェクトです。XOOPS 2.5.xとXOOPS 4.0.xで同一に機能します。PHP 8.2+の場合、コンストラクタプロパティプロモーションとreadonly クラスを使用してより クリーンな構文を実現します。
:::

データ転送オブジェクト（DTO）は、アプリケーションの異なるレイヤー間でデータを転送するために使用される単純なオブジェクトです。DTOはレイヤー間に明確な境界を保ち、エンティティオブジェクトへの依存関係を削減するのに役立ちます。

## DTO概念

### DTOとは?
DTOは:
- プロパティを持つ単純な値オブジェクト
- 作成後はイミュータブルまたは読み取り専用
- ビジネスロジックやメソッドなし
- データ転送用に最適化
- 永続化メカニズムから独立

### DTOを使用するとき

**DTOを使用する場合:**
- レイヤー間でデータを転送するとき
- API経由でデータを公開するとき
- 複数のエンティティのデータを集約するとき
- 内部実装の詳細を隠すとき
- 異なるコンシューマーに対してデータ構造を変更するとき

## 基本的なDTOの実装

```php
<?php
class UserDTO
{
    private $id;
    private $username;
    private $email;
    private $isActive;
    private $createdAt;
    
    public function __construct($entity = null)
    {
        if ($entity instanceof User) {
            $this->id = $entity->getId();
            $this->username = $entity->getUsername();
            $this->email = $entity->getEmail();
            $this->isActive = $entity->isActive();
            $this->createdAt = $entity->getCreatedAt();
        }
    }
    
    // 読み取り専用アクセッサー
    public function getId() { return $this->id; }
    public function getUsername() { return $this->username; }
    public function getEmail() { return $this->email; }
    public function isActive() { return $this->isActive; }
    public function getCreatedAt() { return $this->createdAt; }
    
    public function toArray()
    {
        return [
            'id' => $this->id,
            'username' => $this->username,
            'email' => $this->email,
            'isActive' => $this->isActive,
            'createdAt' => $this->createdAt,
        ];
    }
    
    public function toJson()
    {
        return json_encode($this->toArray());
    }
}
?>
```

## リクエスト/入力DTO

```php
<?php
class CreateUserRequestDTO
{
    private $username;
    private $email;
    private $password;
    private $errors = [];
    
    public function __construct(array $data)
    {
        $this->username = $data['username'] ?? '';
        $this->email = $data['email'] ?? '';
        $this->password = $data['password'] ?? '';
        
        $this->validate();
    }
    
    private function validate()
    {
        if (empty($this->username) || strlen($this->username) < 3) {
            $this->errors['username'] = 'ユーザー名が短すぎます';
        }
        
        if (empty($this->email) || !filter_var($this->email, FILTER_VALIDATE_EMAIL)) {
            $this->errors['email'] = '無効なメール';
        }
        
        if (empty($this->password) || strlen($this->password) < 6) {
            $this->errors['password'] = 'パスワードが短すぎます';
        }
    }
    
    public function isValid()
    {
        return empty($this->errors);
    }
    
    public function getErrors()
    {
        return $this->errors;
    }
    
    public function getUsername() { return $this->username; }
    public function getEmail() { return $this->email; }
    public function getPassword() { return $this->password; }
}
?>
```

## サービスでの使用

```php
<?php
class UserService
{
    public function createUserFromRequest(CreateUserRequestDTO $dto)
    {
        if (!$dto->isValid()) {
            throw new ValidationException('無効な入力', $dto->getErrors());
        }
        
        $user = new User();
        $user->setUsername($dto->getUsername());
        $user->setEmail($dto->getEmail());
        $user->setPassword($dto->getPassword());
        
        $userId = $this->userRepository->save($user);
        
        return new UserDTO($user);
    }
}
?>
```

## APIコントローラーでの使用

```php
<?php
class ApiController
{
    public function createUserAction()
    {
        $input = json_decode(file_get_contents('php://input'), true);
        $dto = new CreateUserRequestDTO($input);
        
        if (!$dto->isValid()) {
            http_response_code(400);
            return ['success' => false, 'errors' => $dto->getErrors()];
        }
        
        try {
            $userDTO = $this->userService->createUserFromRequest($dto);
            http_response_code(201);
            return ['success' => true, 'data' => $userDTO->toArray()];
        } catch (\Exception $e) {
            http_response_code(500);
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
}
?>
```

## ベストプラクティス

- DTOをフォーカスされたものにする
- DTOをイミュータブルまたは読み取り専用にする
- ビジネスロジックをDTOに含めない
- 入力と出力に別々のDTOを使用
- DTOプロパティを明確に文書化
- DTOをシンプルに保つ - データコンテナのみ

## 関連ドキュメント

関連トピック:
- [Service-Layer](../Patterns/Service-Layer.md) - サービス統合
- [Repository-Pattern](../Patterns/Repository-Pattern.md) - データアクセス
- [MVC-Pattern](../Patterns/MVC-Pattern.md) - コントローラー使用
- [Testing](../Best-Practices/Testing.md) - DTOテスト

---

タグ: #dto #data-transfer-objects #design-patterns #module-development
