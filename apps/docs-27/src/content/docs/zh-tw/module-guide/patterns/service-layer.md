---
title: "XOOPS 中的 Service Layer 模式"
description: "業務邏輯抽象和依賴注入"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::note[不確定這是否是正確的模式？]
請查看[選擇數據訪問模式](../Choosing-Data-Access-Pattern.md)以獲取比較處理程序、存儲庫、服務和 CQRS 的決策樹。
:::

:::tip[今天和明天都能運行]
Service Layer 模式**適用於 XOOPS 2.5.x 和 XOOPS 4.0.x**。這些概念是通用的，只有語法不同：

| 功能 | XOOPS 2.5.x | XOOPS 4.0 |
|---------|-------------|------------|
| PHP 版本 | 7.4+ | 8.2+ |
| 構造函數注入 | ✅ 手動連接 | ✅ 容器自動連接 |
| 類型化屬性 | `@var` 文檔塊 | 原生類型聲明 |
| 只讀屬性 | ❌ 不可用 | ✅ `readonly` 關鍵字 |

下面的代碼示例使用 PHP 8.2+ 語法。對於 2.5.x，請省略 `readonly` 並使用傳統的屬性聲明。
:::

Service Layer 模式在專用服務類中封裝業務邏輯，提供控制器和數據訪問層之間的清晰分離。此模式促進代碼可重用性、可測試性和可維護性。

## Service Layer 概念

### 目的
Service Layer：
- 包含領域業務邏輯
- 協調多個 Repository
- 處理複雜操作
- 管理事務
- 執行驗證和授權
- 為控制器提供高級操作

### 優勢
- 跨多個控制器重用業務邏輯
- 易於單獨測試
- 集中式業務規則實現
- 清晰的關注點分離
- 簡化的控制器代碼

## 依賴注入

```php
<?php
// 具有注入依賴的服務
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
        // 驗證
        $this->validate($username, $email, $password);
        
        // 創建用戶
        $user = new User();
        $user->setUsername($username);
        $user->setEmail($email);
        $user->setPassword($password);
        
        // 保存
        $userId = $this->userRepository->save($user);
        
        // 發送歡迎電子郵件
        $this->emailService->sendWelcome($email, $username);
        
        return $userId;
    }
    
    private function validate($username, $email, $password)
    {
        $errors = [];
        
        if (strlen($username) < 3) {
            $errors['username'] = 'Username too short';
        }
        
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'Invalid email';
        }
        
        if (strlen($password) < 6) {
            $errors['password'] = 'Password too short';
        }
        
        if (!empty($errors)) {
            throw new ValidationException('Invalid input', $errors);
        }
    }
}
?>
```

## Service 容器

```php
<?php
class ServiceContainer
{
    private $services = [];
    
    public function __construct($db)
    {
        // 註冊 Repository
        $this->services['userRepository'] = new UserRepository($db);
        
        // 註冊服務
        $this->services['userService'] = new UserService(
            $this->services['userRepository']
        );
    }
    
    public function get($name)
    {
        if (!isset($this->services[$name])) {
            throw new \InvalidArgumentException("Service not found: $name");
        }
        return $this->services[$name];
    }
}
?>
```

## 在控制器中的使用

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

## 最佳實踐

- 每個服務處理一個領域關注點
- 服務依賴於接口，而不是實現
- 使用構造函數注入進行依賴注入
- 服務應該能夠單獨測試
- 拋出領域特定的異常
- 服務不應依賴於 HTTP 請求詳情
- 保持服務專注和有凝聚力

## 相關文檔

另見：
- [MVC-Pattern](../Patterns/MVC-Pattern.md) 用於控制器集成
- [Repository-Pattern](../Patterns/Repository-Pattern.md) 用於數據訪問
- [DTO-Pattern](DTO-Pattern.md) 用於數據傳輸對象
- [Testing](../Best-Practices/Testing.md) 用於服務測試

---

標籤: #service-layer #business-logic #dependency-injection #design-patterns
