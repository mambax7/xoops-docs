---
title: 從 XOOPS 2.5 升級至 2.7
description: 安全升級 XOOPS 安裝的逐步指南，從 2.5.x 至 2.7.x。
---

:::caution[先備份]
在升級前，務必備份您的資料庫和檔案。無例外。
:::

## XOOPS 2.7 中的變更

- **PHP 8.2+ 必需** — PHP 7.x 不再受支援
- **Composer 管理的依賴項** — 核心庫透過 `composer.json` 進行管理
- **PSR-4 自動載入** — 模組類別可以使用命名空間
- **改進的 XoopsObject** — 新的 `getVar()` 類型安全性、已棄用 `obj2Array()`
- **Bootstrap 5 管理** — 管理面板使用 Bootstrap 5 重建

## 升級前檢查清單

- [ ] PHP 8.2+ 在伺服器上可用
- [ ] 完整資料庫備份 (`mysqldump -u user -p xoops_db > backup.sql`)
- [ ] 完整檔案備份您的安裝
- [ ] 已安裝模組及其版本的清單
- [ ] 自訂佈景主題單獨備份

## 升級步驟

### 1. 將網站置於維護模式

```php
// mainfile.php — 暫時新增
define('XOOPS_MAINTENANCE', true);
```

### 2. 下載 XOOPS 2.7

```bash
wget https://github.com/XOOPS/XoopsCore27/releases/latest/download/xoops-2.7.x.zip
unzip xoops-2.7.x.zip
```

### 3. 替換核心檔案

上傳新檔案，**除外**：
- `uploads/` — 您上傳的檔案
- `xoops_data/` — 您的組態
- `modules/` — 您安裝的模組
- `themes/` — 您的佈景主題
- `mainfile.php` — 您的網站組態

```bash
rsync -av --exclude='uploads/' --exclude='xoops_data/' \
  --exclude='modules/' --exclude='themes/' --exclude='mainfile.php' \
  xoops-2.7/ /var/www/html/
```

### 4. 執行升級指令碼

在瀏覽器中導覽至 `https://yourdomain.com/upgrade/`。
升級精靈將套用資料庫移轉。

### 5. 更新模組

XOOPS 2.7 模組必須相容 PHP 8.2。
檢查 [模組生態系統](/xoops-docs/2.7/module-guide/introduction/) 以取得更新版本。

在 Admin → Modules 中，對每個已安裝的模組按一下 **Update**。

### 6. 移除維護模式並測試

從 `mainfile.php` 移除 `XOOPS_MAINTENANCE` 行並
驗證所有頁面正確載入。

## 常見問題

**升級後出現「找不到類別」錯誤**
- 在 XOOPS 根目錄執行 `composer dump-autoload`
- 清除 `xoops_data/caches/` 目錄

**更新後模組損壞**
- 檢查模組的 GitHub 版本以取得 2.7 相容版本
- 該模組可能需要代碼變更以支援 PHP 8.2（已棄用函數、輸入型屬性）

**管理面板 CSS 損壞**
- 清除瀏覽器快取
- 確保 `xoops_lib/` 在檔案上傳期間完全替換
