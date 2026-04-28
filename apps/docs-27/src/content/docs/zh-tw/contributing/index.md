---
title: "貢獻指南"
description: "如何為 XOOPS CMS 開發做出貢獻，編碼標準和社區指南"
---

# 🤝 為 XOOPS 做出貢獻

> 加入 XOOPS 社區，幫助使其成為世界上最好的 CMS。

---

## 📋 概述

XOOPS 是一個開源項目，欣然接受社區貢獻。無論您是修復錯誤、添加功能、改進文檔還是幫助他人，您的貢獻都很有價值。

---

## 🗂️ 部分內容

### 指南
- 行為準則
- 貢獻工作流程
- 拉取請求指南
- 問題報告

### 代碼風格
- PHP 編碼標準
- JavaScript 標準
- CSS 指南
- Smarty 模板標準

### 架構決策
- ADR 索引
- ADR 模板
- ADR-001：模塊化架構
- ADR-002：數據庫抽象

---

## 🚀 入門

### 1. 設置開發環境

```bash
# 在 GitHub 上 Fork 存儲庫
# 然後 Clone 您的 Fork
git clone https://github.com/YOUR_USERNAME/XoopsCore27.git
cd XoopsCore27

# 添加上游遠程
git remote add upstream https://github.com/XOOPS/XoopsCore27.git

# 安裝依賴
composer install
```

### 2. 創建功能分支

```bash
# 與上游同步
git fetch upstream
git checkout -b feature/my-feature upstream/main
```

### 3. 進行更改

遵循編碼標準並為新功能編寫測試。

### 4. 提交拉取請求

```bash
# 提交更改
git add .
git commit -m "Add: 變更簡要說明"

# 推送到您的 Fork
git push origin feature/my-feature
```

然後在 GitHub 上創建拉取請求。

---

## 📝 編碼標準

### PHP 標準

XOOPS 遵循 PSR-1、PSR-4 和 PSR-12 編碼標準。

```php
<?php

declare(strict_types=1);

namespace XoopsModules\MyModule;

use Xmf\Request;
use XoopsObject;

/**
 * 類 Item
 *
 * 代表模塊中的一項
 */
class Item extends XoopsObject
{
    /**
     * 構造函數
     */
    public function __construct()
    {
        $this->initVar('id', \XOBJ_DTYPE_INT, null, false);
        $this->initVar('title', \XOBJ_DTYPE_TXTBOX, '', true, 255);
        $this->initVar('content', \XOBJ_DTYPE_TXTAREA, '', false);
        $this->initVar('created', \XOBJ_DTYPE_INT, time(), false);
    }

    /**
     * 獲取格式化的標題
     *
     * @return string
     */
    public function getTitle(): string
    {
        return $this->getVar('title', 'e');
    }
}
```

### 關鍵約定

| 規則 | 示例 |
|------|---------|
| 類名 | `PascalCase` |
| 方法名 | `camelCase` |
| 常量 | `UPPER_SNAKE_CASE` |
| 變量 | `$camelCase` |
| 文件 | `ClassName.php` |
| 縮進 | 4 個空格 |
| 行長 | 最多 120 個字符 |

### Smarty 模板

```smarty
{* 文件：templates/mymodule_index.tpl *}
{* 說明：索引頁面模板 *}

<{include file="db:mymodule_header.tpl"}>

<div class="mymodule-container">
    <h1><{$page_title}></h1>

    <{if $items|@count > 0}>
        <ul class="item-list">
            <{foreach item=item from=$items}>
                <li class="item">
                    <a href="<{$item.url}>"><{$item.title}></a>
                </li>
            <{/foreach}>
        </ul>
    <{else}>
        <p class="no-items"><{$smarty.const._MD_MYMODULE_NO_ITEMS}></p>
    <{/if}>
</div>

<{include file="db:mymodule_footer.tpl"}>
```

---

## 🔀 Git 工作流程

### 分支命名

| 類型 | 模式 | 示例 |
|------|---------|---------|
| 功能 | `feature/description` | `feature/add-user-export` |
| 錯誤修復 | `fix/description` | `fix/login-validation` |
| 緊急修復 | `hotfix/description` | `hotfix/security-patch` |
| 發行版 | `release/version` | `release/2.7.0` |

### 提交信息

遵循常規提交：

```
<type>(<scope>): <subject>

<body>

<footer>
```

**類型：**
- `feat`：新功能
- `fix`：錯誤修復
- `docs`：文檔
- `style`：代碼風格（格式化）
- `refactor`：代碼重構
- `test`：添加測試
- `chore`：維護

**示例：**
```
feat(auth)：添加雙因素認證

實現基於 TOTP 的 2FA 用於用戶帳戶。
- 為身份驗證器應用添加二維碼生成
- 在用戶配置文件中存儲加密密鑰
- 添加備用代碼功能

關閉 #123
```

```
fix(forms)：解決文本輸入中的 XSS 漏洞

在 XoopsFormText 渲染方法中正確轉義用戶輸入。

安全：CVE-2024-XXXX
```

---

## 🧪 測試

### 運行測試

```bash
# 運行所有測試
./vendor/bin/phpunit

# 運行特定測試套件
./vendor/bin/phpunit --testsuite unit

# 運行覆蓋率報告
./vendor/bin/phpunit --coverage-html coverage/
```

### 編寫測試

```php
<?php

namespace XoopsModulesTest\MyModule;

use PHPUnit\Framework\TestCase;
use XoopsModules\MyModule\Item;

class ItemTest extends TestCase
{
    private Item $item;

    protected function setUp(): void
    {
        $this->item = new Item();
    }

    public function testInitialValues(): void
    {
        $this->assertNull($this->item->getVar('id'));
        $this->assertEquals('', $this->item->getVar('title'));
    }

    public function testSetTitle(): void
    {
        $this->item->setVar('title', 'Test Title');
        $this->assertEquals('Test Title', $this->item->getVar('title'));
    }

    public function testTitleEscaping(): void
    {
        $this->item->setVar('title', '<script>alert("xss")</script>');
        $escaped = $this->item->getTitle();
        $this->assertStringNotContainsString('<script>', $escaped);
    }
}
```

---

## 📋 拉取請求檢查清單

在提交 PR 之前，請確保：

- [ ] 代碼遵循 XOOPS 編碼標準
- [ ] 所有測試通過
- [ ] 新功能有測試
- [ ] 必要時更新文檔
- [ ] 與主分支沒有合併衝突
- [ ] 提交信息有描述
- [ ] PR 說明解釋了更改
- [ ] 相關問題已鏈接

---

## 🏗️ 架構決策記錄

ADR 記錄重要的架構決策。

### ADR 模板

```markdown
# ADR-XXX：標題

## 狀態
提議 | 已接受 | 已棄用 | 已取代

## 上下文
我們正在解決什麼問題？

## 決策
提議的變化是什麼？

## 後果
有什麼積極和消極的影響？

## 考慮的替代方案
評估了哪些其他選項？
```

### 當前 ADR

| ADR | 標題 | 狀態 |
|-----|-------|--------|
| ADR-001 | 模塊化架構 | 已接受 |
| ADR-002 | 面向對象數據庫訪問 | 已接受 |
| ADR-003 | Smarty 模板引擎 | 已接受 |
| ADR-004 | 安全系統設計 | 已接受 |
| ADR-005 | PSR-15 中間件 (4.0.x) | 提議 |

---

## 🎖️ 認可

貢獻者通過以下方式獲得認可：

- **貢獻者列表** - 在存儲庫中列出
- **發行說明** - 在發行版中獲得信譽
- **名人堂** - 傑出貢獻者
- **模塊認證** - 模塊質量徽章

---

## 🔗 相關文檔

- XOOPS 4.0 路線圖
- 核心概念
- 模塊開發

---

## 📚 資源

- [GitHub 存儲庫](https://github.com/XOOPS/XoopsCore27)
- [問題跟踪器](https://github.com/XOOPS/XoopsCore27/issues)
- [XOOPS 論壇](https://xoops.org/modules/newbb/)
- [Discord 社區](https://discord.gg/xoops)

---

#xoops #contributing #open-source #community #development #coding-standards
