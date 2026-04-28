---
title: "拉取請求指南"
description: "提交拉取請求到 XOOPS 項目的指南"
---

本文檔為提交拉取請求到 XOOPS 項目提供了全面的指南。遵循這些指南可確保代碼審查順利進行並加快合併時間。

## 創建拉取請求前

### 步驟 1：檢查現有問題

```
1. 訪問 GitHub 存儲庫
2. 轉到問題選項卡
3. 搜索與您的更改相關的現有問題
4. 檢查開放和已關閉的問題
```

### 步驟 2：分叉和克隆存儲庫

```bash
# 在 GitHub 上分叉存儲庫
# 單擊存儲庫頁面上的 "Fork" 按鈕

# 克隆您的分叉
git clone https://github.com/YOUR_USERNAME/XOOPS.git
cd XOOPS

# 添加上游遠程
git remote add upstream https://github.com/XOOPS/XOOPS.git

# 驗證遠程
git remote -v
# 應顯示: origin (您的分叉) 和 upstream (官方)
```

### 步驟 3：創建功能分支

```bash
# 更新主分支
git fetch upstream
git checkout main
git merge upstream/main

# 創建功能分支
# 使用描述性名稱: bugfix/issue-number 或 feature/description
git checkout -b bugfix/123-fix-database-connection
git checkout -b feature/add-psr-7-support
```

### 步驟 4：做出您的更改

```bash
# 對文件進行更改
# 遵循代碼樣式指南

# 暫存更改
git add .

# 使用清晰的消息進行提交
git commit -m "Fix database connection timeout issue"

# 為邏輯更改創建多個提交
git commit -m "Add connection retry logic"
git commit -m "Improve error messages for debugging"
```

## 提交消息標準

### 好的提交消息

使用遵循以下模式的清晰、描述性消息：

```
# 格式
<type>: <subject>

<body>

<footer>

# 示例 1: 漏洞修復
fix: resolve database connection timeout

Add exponential backoff retry mechanism to database connection.
Connections now retry up to 3 times with increasing delays.

Fixes #123
```

```
# 示例 2: 功能
feat: implement PSR-7 HTTP message interfaces

Implement Psr\Http\Message interfaces for request/response handling.
Provides type-safe HTTP message handling across the framework.

BREAKING CHANGE: Updated RequestHandler signature
```

### 提交類型類別

| 類型 | 描述 | 示例 |
|------|-------------|---------|
| `feat` | 新功能 | `feat: add user dashboard widget` |
| `fix` | 漏洞修復 | `fix: resolve cache invalidation bug` |
| `docs` | 文檔 | `docs: update API reference` |
| `style` | 代碼樣式（無邏輯變化） | `style: format imports` |
| `refactor` | 代碼重構 | `refactor: simplify service layer` |
| `perf` | 性能改進 | `perf: optimize database queries` |
| `test` | 測試更改 | `test: add integration tests` |
| `chore` | 構建/工具更改 | `chore: update dependencies` |

## 拉取請求描述

### PR 模板

```markdown
## 描述
所做更改的清晰描述和原因。

## 更改類型
- [ ] 漏洞修復
- [ ] 新功能
- [ ] 破壞性更改
- [ ] 文檔更新

## 相關問題
關閉 #123
相關 #456

## 所做的更改
- 更改 1
- 更改 2
- 更改 3

## 測試
- [ ] 本地測試
- [ ] 所有測試通過
- [ ] 添加新測試
- [ ] 包含手動測試步驟

## 檢查清單
- [ ] 代碼遵循樣式指南
- [ ] 已完成自審
- [ ] 為複雜邏輯添加了註釋
- [ ] 文檔已更新
- [ ] 沒有生成新的警告
- [ ] 為新功能添加了測試
- [ ] 所有測試通過
```

## 代碼質量要求

### 代碼樣式

遵循代碼樣式指南：

```php
<?php
// Good: PSR-12 style
namespace MyModule\Controller;

use MyModule\Model\Item;
use MyModule\Repository\ItemRepository;

class ItemController
{
    private ItemRepository $repository;

    public function __construct(ItemRepository $repository)
    {
        $this->repository = $repository;
    }

    public function indexAction()
    {
        $items = $this->repository->findAll();
        return $this->render('items', ['items' => $items]);
    }
}
```

## 測試要求

### 單元測試

```php
// tests/Feature/DatabaseConnectionTest.php
namespace Tests\Feature;

use PHPUnit\Framework\TestCase;
use Xoops\Database\XoopsDatabase;

class DatabaseConnectionTest extends TestCase
{
    private XoopsDatabase $database;

    protected function setUp(): void
    {
        $this->database = new XoopsDatabase();
    }

    public function testConnectionWithValidCredentials()
    {
        $result = $this->database->connect();
        $this->assertTrue($result);
    }

    public function testConnectionWithInvalidCredentials()
    {
        $this->database->setCredentials('invalid', 'invalid');
        $result = $this->database->connect();
        $this->assertFalse($result);
    }
}
```

### 運行測試

```bash
# 運行所有測試
vendor/bin/phpunit

# 運行特定測試文件
vendor/bin/phpunit tests/Feature/DatabaseConnectionTest.php

# 運行覆蓋率
vendor/bin/phpunit --coverage-html coverage/
```

## 使用分支

### 保持分支更新

```bash
# 從上游獲取最新
git fetch upstream

# 在最新主分支上變基
git rebase upstream/main

# 或者如果您願意合併
git merge upstream/main

# 如果變基則強制推送（警告：僅在您的分支上！）
git push -f origin bugfix/123-fix-database-connection
```

## 創建拉取請求

### PR 標題格式

```
[Type] Short description (fix/feature/docs)

示例:
- [FIX] Resolve database connection timeout issue (#123)
- [FEATURE] Implement PSR-7 HTTP message interfaces
- [DOCS] Update API reference for Criteria class
```

## 代碼審查過程

### 審查者尋找的內容

1. **正確性**
   - 代碼是否解決了既定問題？
   - 邊界情況是否得到處理？
   - 錯誤處理是否適當？

2. **質量**
   - 是否遵循編碼標準？
   - 是否可維護？
   - 是否經過充分測試？

3. **性能**
   - 有任何性能回歸嗎？
   - 查詢是否優化？
   - 內存使用是否合理？

4. **安全**
   - 輸入驗證？
   - SQL 注入防護？
   - 身份驗證/授權？

### 回應反饋

```bash
# 解決反饋
# 根據審查評論編輯文件

# 提交更改
git commit -m "Address code review feedback

- Add additional error handling
- Improve test coverage for edge cases
- Update documentation"

# 推送更改
git push origin bugfix/123-fix-database-connection
```

## 常見 PR 問題和解決方案

### 問題 1：PR 太大

**問題：** 審查者無法有效審查巨大的 PR

**解決方案：** 分解為更小的 PR
- 第一個 PR: 核心更改
- 第二個 PR: 測試
- 第三個 PR: 文檔

### 問題 2：沒有包括測試

**問題：** 審查者無法驗證功能

**解決方案：** 在提交前添加全面測試

### 問題 3：與主分支衝突

**問題：** 您的分支與主分支不同步

**解決方案：** 在最新主分支上變基

```bash
git fetch upstream
git rebase upstream/main
git push -f origin your-branch
```

## 合併後

### 清理

```bash
# 切換到主分支
git checkout main

# 更新主分支
git pull upstream main

# 刪除本地分支
git branch -d bugfix/123-fix-database-connection

# 刪除遠程分支
git push origin --delete bugfix/123-fix-database-connection
```

## 最佳實踐總結

### 做

- 創建描述性提交消息
- 製作有針對性的、單一目的的 PR
- 為新功能包括測試
- 更新文檔
- 參考相關問題
- 保持 PR 描述清晰
- 及時回應審查

### 不做

- 包括無關的更改
- 將主分支合併到您的分支中（使用變基）
- 在審查開始後強制推送
- 跳過測試
- 提交正在進行的工作
- 忽略代碼審查反饋

## 相關文檔

- ../Contributing - 貢獻概述
- Code-Style - 代碼樣式指南
- ../../03-Module-Development/Best-Practices/Testing - 測試最佳實踐
- ../Architecture-Decisions/ADR-Index - 架構指南

## 資源

- [Git 文檔](https://git-scm.com/doc)
- [GitHub 拉取請求幫助](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests)
- [常規提交](https://www.conventionalcommits.org/)
- [XOOPS GitHub 組織](https://github.com/XOOPS)

---

**最後更新：** 2026-01-31
**適用於：** 所有 XOOPS 項目
**存儲庫：** https://github.com/XOOPS/XOOPS
