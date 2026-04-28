---
title: "XOOPS 中的 MVC 模式"
description: "XOOPS 模塊中的模型-視圖-控制器架構實現"
---

<span class="version-badge version-xmf">XMF Required</span> <span class="version-badge version-40x">4.0.x Native</span>

:::note[不確定這是否是正確的模式？]
請查看[選擇數據訪問模式](../Choosing-Data-Access-Pattern.md)以獲取關於何時使用 MVC 與更簡單模式的指導。
:::

:::caution[澄清：XOOPS 架構]
**標準 XOOPS 2.5.x** 使用**頁面控制器**模式（也稱為事務腳本），而非 MVC。舊版模塊使用 `index.php` 包含直接包含、全局對象（`$xoopsUser`、`$xoopsDB`）和基於處理程序的數據訪問。

**要在 XOOPS 2.5.x 中使用 MVC**，您需要提供路由和控制器支持的 **XMF Framework**。

**XOOPS 4.0** 將原生支持帶有 PSR-15 中間件和適當路由的 MVC。

另見：[當前 XOOPS 架構](../../02-Core-Concepts/Architecture/XOOPS-Architecture.md)
:::

模型-視圖-控制器 (MVC) 模式是用於在 XOOPS 模塊中分離關注點的基礎架構模式。此模式將應用程序分為三個相互連接的組件。

## MVC 解釋

### 模型
**模型**代表應用程序的數據和業務邏輯。它：
- 管理數據持久化
- 實現業務規則
- 驗證數據
- 與數據庫通信
- 獨立於 UI

### 視圖
**視圖**負責向用戶呈現數據。它：
- 呈現 HTML 模板
- 顯示模型數據
- 處理用戶界面呈現
- 將用戶操作發送給控制器
- 應包含最少的邏輯

### 控制器
**控制器**處理用戶交互並協調模型和視圖之間的交互。它：
- 接收用戶請求
- 處理輸入數據
- 調用模型方法
- 選擇適當的視圖
- 管理應用程序流

## XOOPS 實現

在 XOOPS 中，MVC 模式使用處理程序和模板實現，Smarty 引擎提供模板支持。

### 基本模型結構
```php
<?php
class UserModel
{
    private $db;
    
    public function getUserById($id)
    {
        // 數據庫查詢實現
    }
    
    public function createUser($data)
    {
        // 創建用戶實現
    }
}
?>
```

### 控制器實現
```php
<?php
class UserController
{
    private $model;
    
    public function listAction()
    {
        $users = $this->model->getAllUsers();
        return ['users' => $users];
    }
}
?>
```

### 視圖模板
```smarty
{foreach from=$users item=user}
    <div>{$user.username|escape}</div>
{/foreach}
```

## 最佳實踐

- 保持業務邏輯在模型中
- 保持呈現在視圖中
- 保持路由/協調在控制器中
- 不要混合層之間的關注點
- 在控制器級別驗證所有輸入

## 相關文檔

另見：
- [Repository-Pattern](../Patterns/Repository-Pattern.md) 用於高級數據訪問
- [Service-Layer](../Patterns/Service-Layer.md) 用於業務邏輯抽象
- [Code-Organization](../Best-Practices/Code-Organization.md) 用於項目結構
- [Testing](../Best-Practices/Testing.md) 用於 MVC 測試策略

---

標籤: #mvc #patterns #architecture #module-development #design-patterns
