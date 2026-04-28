---
title: "XOOPS 中的 DTO 模式"
description: "用於清潔數據處理的數據傳輸對象"
---

# XOOPS 中的 DTO 模式（數據傳輸對象）

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::tip[在兩個版本中都能運行]
DTO 是沒有框架依賴的普通 PHP 對象。它們在 XOOPS 2.5.x 和 XOOPS 4.0.x 中的工作方式相同。對於 PHP 8.2+，使用構造函數屬性提升和只讀類以獲得更清潔的語法。
:::

數據傳輸對象（DTO）是用於在應用程序的不同層之間傳輸數據的簡單對象。DTO 幫助維護層之間的清晰邊界並減少對實體對象的依賴。

## DTO 概念

### 什麼是 DTO？
DTO 是：
- 具有屬性的簡單值對象
- 創建後不可變或只讀
- 沒有業務邏輯或方法
- 針對數據傳輸進行優化
- 獨立於持久化機制

### 何時使用 DTO

**在以下情況下使用 DTO：**
- 在層之間傳輸數據
- 通過 API 公開數據
- 聚合來自多個實體的數據
- 隱藏內部實現細節
- 為不同的消費者更改數據結構

## 基本 DTO 實現

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
    
    // 只讀訪問器
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

## 請求/輸入 DTO

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
            $this->errors['username'] = 'Username too short';
        }
        
        if (empty($this->email) || !filter_var($this->email, FILTER_VALIDATE_EMAIL)) {
            $this->errors['email'] = 'Invalid email';
        }
        
        if (empty($this->password) || strlen($this->password) < 6) {
            $this->errors['password'] = 'Password too short';
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

## 在服務中的使用

```php
<?php
class UserService
{
    public function createUserFromRequest(CreateUserRequestDTO $dto)
    {
        if (!$dto->isValid()) {
            throw new ValidationException('Invalid input', $dto->getErrors());
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

## 在 API 控制器中的使用

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

## 最佳實踐

- 保持 DTO 專注且具體
- 使 DTO 不可變或只讀
- 不在 DTO 中包含業務邏輯
- 為輸入和輸出使用單獨的 DTO
- 清楚地記錄 DTO 屬性
- 保持 DTO 簡單 - 僅作為數據容器

## 相關文檔

另見：
- [Service-Layer](../Patterns/Service-Layer.md) 用於服務集成
- [Repository-Pattern](../Patterns/Repository-Pattern.md) 用於數據訪問
- [MVC-Pattern](../Patterns/MVC-Pattern.md) 用於控制器使用
- [Testing](../Best-Practices/Testing.md) 用於 DTO 測試

---

標籤: #dto #data-transfer-objects #design-patterns #module-development
