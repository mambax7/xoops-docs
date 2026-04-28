---
title: "XOOPS 2.7.0 的新增功能"
---

XOOPS 2.7.0 是從 2.5.x 系列的重要更新。在安裝或升級前，請檢查本頁上的變更，以便您知道會發生什麼。下面的清單專注於影響安裝和網站管理的項目 — 如需完整的變更清單，請參閱隨發行版一起提供的發行版注意事項。

## PHP 8.2 是新的最小值

XOOPS 2.7.0 需要 **PHP 8.2 或更新版本**。不再支援 PHP 7.x 及更早版本。強烈建議使用 PHP 8.4 或更高版本。

**動作：** 開始前，請確認您的主機提供 PHP 8.2+。請參閱[要求](installation/requirements.md)。

## MySQL 5.7 是新的最小值

新的最小值是 **MySQL 5.7** (或相容的 MariaDB)。強烈建議使用 MySQL 8.4 或更高版本。也支援 MySQL 9.0。

舊有關於 PHP/MySQL 8 相容性問題的警告不再適用，因為受影響的 PHP 版本不再受 XOOPS 支援。

## Smarty 4 取代 Smarty 3

這是現有網站單一最大的變更。XOOPS 2.7.0 使用 **Smarty 4** 作為其樣板引擎。Smarty 4 對樣板語法的要求比 Smarty 3 更嚴格，某些自訂主題和模組樣板在正確呈現前可能需要調整。

為幫助您識別和修復這些問題，XOOPS 2.7.0 在 `upgrade/` 目錄中附帶一個**預檢掃描器**，它檢查現有樣板中已知的 Smarty 4 不相容之處，並可自動修復其中許多。

**動作：** 如果您正從 2.5.x 升級並有自訂主題或較舊模組，請在執行主要升級程式前執行[預檢檢查](upgrading/upgrade/preflight.md)。

## Composer 管理的相依性

XOOPS 2.7.0 使用 **Composer** 管理其 PHP 相依性。這些住在 `xoops_lib/vendor/` 中。以前捆綁到核心或模組中的第三方程式庫 — PHPMailer、HTMLPurifier、Smarty 等 — 現在透過 Composer 提供。

**動作：** 大多數網站營運者不需要做任何事 — 發行 tarball 隨附已填充的 `vendor/`。如果您移動或升級網站，請複製整個 `xoops_lib/` 樹，包括 `vendor/`。複製 git 儲存庫的開發人員應在 `htdocs/xoops_lib/` 內執行 `composer install`。請參閱[開發人員注意事項](notes-for-developers/developers.md)。

## 新的加強工作階段 Cookie 偏好設定

在升級期間新增兩個新偏好設定：

* **`session_cookie_samesite`** — 控制工作階段 Cookie 上的 SameSite 屬性 (`Lax`、`Strict` 或 `None`)。
* **`session_cookie_secure`** — 啟用時，工作階段 Cookie 只能透過 HTTPS 傳送。

**動作：** 升級後，在系統選項 → 偏好設定 → 一般設定下檢查這些。請參閱[升級後](upgrading/upgrade/ustep-04.md)。

## 新的 `tokens` 表

XOOPS 2.7.0 新增了一個 `tokens` 資料庫表，用於通用有作用域的權杖儲存。升級程式在 2.5.11 → 2.7.0 升級期間自動建立此表。

## 現代化的密碼儲存

`bannerclient.passwd` 欄位已擴大為 `VARCHAR(255)`，以便它可以容納現代密碼雜湊 (bcrypt、argon2)。升級程式自動擴大欄位。

## 更新的主題和模組陣容

XOOPS 2.7.0 隨附更新的前端主題：

* `default`、`xbootstrap` (舊版)、`xbootstrap5`、`xswatch4`、`xswatch5`、`xtailwind`、`xtailwind2`

新的**現代**管理員主題隨現有的過渡主題一起包含。

新的 **DebugBar** 模組基於 Symfony VarDumper，作為可選的可安裝模組之一提供。它適用於開發和中繼環境，但通常不在公開生產網站上安裝。

請參閱[選擇主題](installation/installation/step-12.md)和[模組安裝](installation/installation/step-13.md)。

## 複製新版本不再覆寫設定

以前，將新 XOOPS 發行版複製到現有網站上需要小心，以避免覆寫 `mainfile.php` 和其他設定檔案。在 2.7.0 中，複製程序保留現有設定檔案，這使升級明顯更安全。

您仍應在任何升級前進行完整備份。

## 系統管理員主題中的樣板超載功能

XOOPS 2.7.0 中的管理員主題現在可以覆寫個別系統管理員樣板，更容易自訂管理 UI，無需複製整個系統模組。

## 未變更的項目

為了放心，XOOPS 在 2.7.0 中的這些部分與 2.5.x 中的工作方式相同：

* 安裝程式頁面順序和整體流程
* `mainfile.php` 加上 `xoops_data/data/secure.php` 設定分割
* 將 `xoops_data` 和 `xoops_lib` 重新定位到網頁根目錄外的建議做法
* 模組安裝模型和 `xoops_version.php` 資訊清單格式
* 網站移動工作流程 (備份、編輯 `mainfile.php`/`secure.php`、使用 SRDB 或類似)

## 接下來要去的地方

* 從頭開始？繼續進行[要求](installation/requirements.md)。
* 從 2.5.x 升級？開始使用[升級](upgrading/upgrade/README.md)，然後執行[預檢檢查](upgrading/upgrade/preflight.md)。
