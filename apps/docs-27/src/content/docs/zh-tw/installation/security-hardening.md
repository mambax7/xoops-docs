---
title: "附錄 5：增加 XOOPS 安裝的安全性"
---

安裝 XOOPS 2.7.0 後，採取以下步驟來強化該網站。每個步驟都是可選的，但將它們組合在一起會顯著提高安裝的基線安全性。

## 1. 安裝並配置 Protector 模組

捆綁的 `protector` 模組是 XOOPS 防火牆。如果您在初始精靈期間未安裝它，請立即從 Admin → Modules 畫面安裝它。

![](/xoops-docs/2.7/img/installation/img_73.jpg)

打開 Protector 的管理面板並檢查它顯示的警告。傳統 PHP 指令（如 `register_globals`）不再存在（PHP 8.2+ 已將其刪除），因此您將不會再看到那些警告。目前的警告通常與目錄權限、工作階段設定和信任路徑配置有關。

## 2. 鎖定 `mainfile.php` 和 `secure.php`

當安裝程序完成時，它會嘗試將兩個文件標記為唯讀，但某些主機會還原權限。驗證並根據需要重新應用：

- `mainfile.php` → `0444`（所有者、群組、其他唯讀）
- `xoops_data/data/secure.php` → `0444`

`mainfile.php` 定義路徑常數（`XOOPS_ROOT_PATH`、`XOOPS_PATH`、`XOOPS_VAR_PATH`、`XOOPS_URL`、`XOOPS_COOKIE_DOMAIN`、`XOOPS_COOKIE_DOMAIN_USE_PSL`）和生產標誌。`secure.php` 儲存資料庫認證：

- 在 2.5.x 中，資料庫認證曾經在 `mainfile.php` 中。它們現在儲存在 `xoops_data/data/secure.php` 中，該文件在執行時由 `mainfile.php` 載入。將 `secure.php` 保留在 `xoops_data/` 內 — 一個您被鼓勵在文件根目錄外重新定位的目錄 — 使攻擊者更難透過 HTTP 訪問認證。

## 3. 將 `xoops_lib/` 和 `xoops_data/` 移到文件根目錄外

如果您還沒有這樣做，請將這兩個目錄移到網頁根目錄上方一個級別並重新命名它們。然後更新 `mainfile.php` 中的相應常數：

```php
define('XOOPS_ROOT_PATH', '/home/you/www');
define('XOOPS_PATH',      '/home/you/zubra_mylib');
define('XOOPS_VAR_PATH',  '/home/you/zubra_mydata');
define('XOOPS_TRUST_PATH', XOOPS_PATH);
```

將這些目錄放在文件根目錄外可防止直接訪問 Composer 的 `vendor/` 樹、快取範本、工作階段文件、上傳的資料和 `secure.php` 中的資料庫認證。

## 4. Cookie 域配置

XOOPS 2.7.0 在 `mainfile.php` 中引入了兩個 Cookie 域常數：

```php
// 使用公開尾碼列表 (PSL) 派生可註冊域。
define('XOOPS_COOKIE_DOMAIN_USE_PSL', true);

// 明確的 Cookie 域；可能為空、完整主機或可註冊域。
define('XOOPS_COOKIE_DOMAIN', '');
```

指引：

- 如果您從單個主機名或 IP 提供 XOOPS，請將 `XOOPS_COOKIE_DOMAIN` 保留為空。
- 使用完整主機（例如 `www.example.com`）將 Cookie 的範圍限定為該主機名。
- 當您想在 `www.example.com`、`blog.example.com` 等之間共享 Cookie 時，使用可註冊域（例如 `example.com`）。
- `XOOPS_COOKIE_DOMAIN_USE_PSL = true` 讓 XOOPS 正確分割複合 TLD（`co.uk`、`com.au` 等），而不是意外地在有效 TLD 上設定 Cookie。

## 5. `mainfile.php` 中的生產標誌

`mainfile.dist.php` 使用這兩個標誌設定為 `false` 進行生產：

```php
define('XOOPS_DB_LEGACY_LOG', false); // 禁用舊版 SQL 用法日誌
define('XOOPS_DEBUG',         false); // 禁用偵錯注意事項
```

在生產上將它們關閉。當您想在開發或暫存環境中暫時啟用它們以：

- 追蹤舊版資料庫呼叫（`XOOPS_DB_LEGACY_LOG = true`）；
- 顯示 `E_USER_DEPRECATED` 注意事項和其他偵錯輸出（`XOOPS_DEBUG = true`）。

## 6. 刪除安裝程序

安裝完成後：

1. 刪除網頁根目錄中任何重新命名的 `install_remove_*` 目錄。
2. 刪除精靈在清理期間建立的任何 `install_cleanup_*.php` 腳本。
3. 確認 `install/` 目錄不再可透過 HTTP 訪問。

留下已禁用但仍存在的安裝程序目錄是低嚴重性但可避免的風險。

## 7. 保持 XOOPS 和模組最新

XOOPS 遵循定期補丁週期。訂閱 XoopsCore27 GitHub 儲存庫以獲取發行版通知，並在新發行版發佈時更新您的網站和任何第三方模組。2.7.x 的安全更新透過儲存庫的 Releases 頁面發佈。
