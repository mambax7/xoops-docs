---
title: "XOOPS 中的 Repository 模式"
description: "數據訪問抽象層實現"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::note[不確定這是否是正確的模式？]
請查看[選擇數據訪問模式](../Choosing-Data-Access-Pattern.md)以獲取比較處理程序、存儲庫、服務和 CQRS 的決策樹。
:::

:::tip[今天和明天都能運行]
Repository 模式**適用於 XOOPS 2.5.x 和 XOOPS 4.0.x**。在 2.5.x 中，將現有 `XoopsPersistableObjectHandler` 包裝在 Repository 類中以獲得抽象優勢：

| 方法 | XOOPS 2.5.x | XOOPS 4.0 |
|----------|-------------|------------|
| 直接處理程序訪問 | `xoops_getModuleHandler()` | 通過 DI 容器 |
| Repository 包裝器 | ✅ 推薦 | ✅ 原生模式 |
| 使用模擬進行測試 | ✅ 手動 DI | ✅ 容器自動連接 |

**立即開始使用 Repository 模式**以準備您的模塊進行 XOOPS 4.0 遷移。
:::

Repository 模式是一種數據訪問模式，用於抽象數據庫操作，為訪問數據提供清潔界面。它充當業務邏輯和數據映射層之間的中介。

## Repository 概念

Repository 模式提供：
- 對數據庫實現細節的抽象
- 用於單元測試的簡單模擬
- 集中的數據訪問邏輯
- 無需影響業務邏輯即可更改數據庫的靈活性
- 整個應用程序中可重用的數據訪問邏輯

## 何時使用 Repository

**在以下情況下使用 Repository：**
- 在應用程序層之間傳輸數據
- 需要更改數據庫實現時
- 使用模擬編寫可測試的代碼
- 抽象數據訪問模式時

## 實現模式

```php
<?php
// 定義 Repository 接口
interface UserRepositoryInterface
{
    public function find($id);
    public function findAll($limit = null, $offset = 0);
    public function findBy(array $criteria);
    public function save($entity);
    public function update($id, $entity);
    public function delete($id);
}

// 實現 Repository
class UserRepository implements UserRepositoryInterface
{
    private $db;
    
    public function __construct($connection)
    {
        $this->db = $connection;
    }
    
    public function find($id)
    {
        // 實現
    }
    
    public function save($entity)
    {
        // 實現
    }
}
?>
```

## 在服務中的使用

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
        // 檢查用戶是否存在
        if ($this->userRepository->findByUsername($username)) {
            throw new \InvalidArgumentException('Username exists');
        }
        
        // 創建用戶
        $user = new User();
        $user->setUsername($username);
        $user->setEmail($email);
        $user->setPassword($password);
        
        return $this->userRepository->save($user);
    }
}
?>
```

## 最佳實踐

- 使用接口定義 Repository 合約
- 每個 Repository 處理一種實體類型
- 將業務邏輯保持在服務中，而不是 Repository 中
- 使用實體對象進行數據映射
- 為無效操作拋出適當的異常

## 相關文檔

另見：
- [MVC-Pattern](../Patterns/MVC-Pattern.md) 用於控制器集成
- [Service-Layer](../Patterns/Service-Layer.md) 用於服務實現
- [DTO-Pattern](DTO-Pattern.md) 用於數據傳輸對象
- [Testing](../Best-Practices/Testing.md) 用於 Repository 測試

---

標籤: #repository-pattern #data-access #design-patterns #module-development
