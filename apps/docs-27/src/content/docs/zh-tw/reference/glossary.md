---
title: "XOOPS 術語表"
description: "XOOPS 特定術語和概念的定義"
---

> XOOPS 特定術語和概念的綜合術語表。

---

## A

### 管理框架
XOOPS 2.3 引入的標準化管理介面框架，在模組間提供一致的管理頁面。

### 自動載入
使用現代 XOOPS 中的 PSR-4 標準在需要時自動載入 PHP 類別。

---

## B

### 區塊
可以位於主題區域的自包含內容單元。區塊可以顯示模組內容、自訂 HTML 或動態資料。

```php
// 區塊定義
$modversion['blocks'][] = [
    'file'      => 'myblock.php',
    'name'      => 'My Block',
    'show_func' => 'mymodule_block_show'
];
```

### Bootstrap
在執行模組程式碼前初始化 XOOPS 核心的程序，通常透過 `mainfile.php` 和 `header.php`。

---

## C

### 條件 / CriteriaCompo
以物件導向方式建立資料庫查詢條件的類別。

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 1));
```

### CSRF (跨網站請求偽造)
XOOPS 中透過 `XoopsFormHiddenToken` 使用安全權杖防止的安全攻擊。

---

## D

### DI (相依性注入)
XOOPS 4.0 計畫的設計模式，其中相依性被注入而不是在內部建立。

### Dirname
模組的目錄名稱，在整個系統中用作唯一識別碼。

### DTYPE (資料型態)
定義 XoopsObject 變數如何儲存和清理的常數：
- `XOBJ_DTYPE_INT` - 整數
- `XOBJ_DTYPE_TXTBOX` - 文字 (單行)
- `XOBJ_DTYPE_TXTAREA` - 文字 (多行)
- `XOBJ_DTYPE_EMAIL` - 電子郵件位址

---

## E

### 事件
XOOPS 生命週期中的發生，可以透過預載或掛鉤觸發自訂程式碼。

---

## F

### 框架
請參閱 XMF (XOOPS 模組框架)。

### 表單元素
代表 HTML 表單欄位的 XOOPS 表單系統元件。

---

## G

### 群組
具有共享權限的使用者集合。核心群組包括：Webmasters、Registered Users、Anonymous。

---

## H

### 處理程式
管理 XoopsObject 執行個體之 CRUD 操作的類別。

```php
$handler = xoops_getModuleHandler('item', 'mymodule');
$item = $handler->get($id);
```

### 助手
提供對模組處理程式、設定和服務的輕鬆存取的公用程式類別。

```php
$helper = \XoopsModules\MyModule\Helper::getInstance();
```

---

## K

### 核心
提供基本功能的核心 XOOPS 類別：資料庫存取、使用者管理、安全性等。

---

## L

### 語言檔案
包含國際化常數的 PHP 檔案，儲存在 `language/[code]/` 目錄中。

---

## M

### mainfile.php
包含資料庫認證和路徑定義的 XOOPS 主要設定檔案。

### MCP (模型-控制器-簡報者)
類似於 MVC 的建築模式，通常在 XOOPS 模組開發中使用。

### 中介軟體
位於請求和回應之間的軟體，計畫為 XOOPS 4.0 使用 PSR-15。

### 模組
安裝在 `modules/` 目錄中的自包含套件，擴充 XOOPS 功能。

### MOC (內容對應)
Obsidian 概念，用於連結相關內容的總覽注意事項。

---

## N

### 命名空間
PHP 功能用於組織類別，在 XOOPS 2.5+ 中使用：
```php
namespace XoopsModules\MyModule;
```

### 通知
XOOPS 系統，用於透過電子郵件或 PM 警示使用者有關事件。

---

## O

### 物件
請參閱 XoopsObject。

---

## P

### 權限
透過群組和權限處理程式管理的存取控制。

### 預載
掛鉤到 XOOPS 事件的類別，從 `preloads/` 目錄自動載入。

### PSR (PHP 標準建議)
PHP-FIG 的標準，XOOPS 4.0 將完全實作。

---

## R

### 呈現器
以特定格式 (Bootstrap 等) 輸出表單元素或其他 UI 元件的類別。

---

## S

### Smarty
XOOPS 使用的樣板引擎，用於將呈現與邏輯分開。

```smarty
<{$variable}>
<{foreach item=item from=$items}>
    <{$item.title}>
<{/foreach}>
```

### 服務
提供可重複使用商務邏輯的類別，通常透過 Helper 存取。

---

## T

### 樣板
定義模組呈現層的 Smarty 檔案 (`.tpl` 或 `.html`)。

### 主題
定義網站視覺外觀的樣板和資產集合。

### 權杖
確保表單提交來自合法來源的安全機制 (CSRF 保護)。

---

## U

### uid
使用者 ID - 系統中每個使用者的唯一識別碼。

---

## V

### 變數 (Var)
使用 `initVar()` 在 XoopsObject 上定義的欄位。

---

## W

### Widget
小的自包含 UI 元件，類似於區塊。

---

## X

### XMF (XOOPS 模組框架)
用於現代 XOOPS 模組開發的公用程式和類別集合。

### XOBJ_DTYPE
用於在 XoopsObject 中定義變數資料型態的常數。

### XoopsDatabase
提供查詢執行和轉義的資料庫抽象層。

### XoopsForm
用於以程式設計方式建立 HTML 表單的表單產生系統。

### XoopsObject
XOOPS 中所有資料物件的基礎類別，提供變數管理和清理。

### xoops_version.php
模組資訊清單檔案，定義模組屬性、表格、區塊、樣板和設定。

---

## 常見首字母縮寫

| 首字母縮寫 | 含義 |
|---------|---------|
| XOOPS | eXtensible Object-Oriented Portal System (可擴充物件導向入口系統) |
| XMF | XOOPS Module Framework (XOOPS 模組框架) |
| CSRF | Cross-Site Request Forgery (跨網站請求偽造) |
| XSS | Cross-Site Scripting (跨網站指令碼) |
| ORM | Object-Relational Mapping (物件關聯式對應) |
| PSR | PHP Standards Recommendation (PHP 標準建議) |
| DI | Dependency Injection (相依性注入) |
| MVC | Model-View-Controller (模型-檢視-控制器) |
| CRUD | Create, Read, Update, Delete (建立、讀取、更新、刪除) |

---

## 相關文件

- 核心概念
- API 參考
- 外部資源

---

#xoops #glossary #reference #terminology #definitions
