---
title: "系統需求"
---

## 軟體環境（堆疊）

大多數 XOOPS 生產網站在 _LAMP_ 堆疊上運行（運行 **A**pache、**M**ySQL 和 **P**HP 的 **L**inux 系統），但有許多不同的可能堆疊。

在本地計算機上原型開發新網站通常最容易。在這種情況下，許多 XOOPS 用戶選擇 _WAMP_ 堆疊（使用 **W**indows 作為作業系統），而其他人執行 _LAMP_ 或 _MAMP_ (**M**AC) 堆疊。

### PHP

任何 PHP 版本 >= 8.2.0（強烈推薦 PHP 8.4 或更高版本）

> **重要：** XOOPS 2.7.0 需要 **PHP 8.2 或更新版本**。不再支援 PHP 7.x 及更早版本。如果要升級舊網站，在開始之前請確認您的主機提供 PHP 8.2+。

### MySQL

MySQL 伺服器 5.7 或更高版本（強烈推薦 MySQL 伺服器 8.4 或更高版本。）還支援 MySQL 9.0。MariaDB 是 MySQL 的向後相容的二進位一次性替換，也適用於 XOOPS。

### 網頁伺服器

支援執行 PHP 腳本的網頁伺服器，例如 Apache、NGINX、LiteSpeed 等。

### 必需的 PHP 延伸

XOOPS 安裝程序在允許安裝進行之前驗證以下延伸是否已載入：

* `mysqli` — MySQL 資料庫驅動程式
* `session` — 工作階段處理
* `pcre` — Perl 相容的正規運算式
* `filter` — 輸入篩選和驗證
* `fileinfo` — MIME 類型檢測上傳

### 必需的 PHP 設定

除了上述延伸外，安裝程序還驗證以下 `php.ini` 設定：

* `file_uploads` 必須是 **On** — 沒有它，XOOPS 無法接受上傳的文件

### 推薦的 PHP 延伸

安裝程序也會檢查這些延伸。雖然不是嚴格要求，但 XOOPS 和大多數模組依靠它們以獲得完整功能。盡可能啟用您的主機允許的許多：

* `mbstring` — 多位元組字符串處理
* `intl` — 國際化
* `iconv` — 字符集轉換
* `xml` — XML 分析
* `zlib` — 壓縮
* `gd` — 影像處理
* `exif` — 影像元數據
* `curl` — HTTP 客戶端用於提要和 API 呼叫

## 服務

### 文件系統訪問（用於網站管理員訪問）

您將需要某種方法（FTP、SFTP 等）來將 XOOPS 發行版文件傳輸到網頁伺服器。

### 文件系統訪問（用於網頁伺服器處理）

要執行 XOOPS，需要能夠建立、讀取和刪除文件和目錄。以下路徑必須可由網頁伺服器處理以進行常規安裝和日常操作：

* `uploads/`
* `uploads/avatars/`
* `uploads/files/`
* `uploads/images/`
* `uploads/ranks/`
* `uploads/smilies/`
* `mainfile.php`（在安裝和升級期間可寫）
* `xoops_data/`
* `xoops_data/caches/`
* `xoops_data/caches/xoops_cache/`
* `xoops_data/caches/smarty_cache/`
* `xoops_data/caches/smarty_compile/`
* `xoops_data/configs/`
* `xoops_data/configs/captcha/`
* `xoops_data/configs/textsanitizer/`
* `xoops_data/data/`
* `xoops_data/protector/`

### 資料庫

XOOPS 需要在 MySQL 中建立、修改和查詢表格。為此，您需要：

* MySQL 用戶帳戶和密碼
* 該用戶對其具有所有權限的 MySQL 資料庫（或者，該用戶可以有權限建立這樣的資料庫）

### 電郵

對於實時網站，您需要一個有效的電郵地址，XOOPS 可以用於用戶通信，例如帳戶啟用和密碼重設。儘管不是嚴格要求，但如果可能的話，建議使用與 XOOPS 執行的域匹配的電郵地址。這有助於避免您的通信被拒絕或標記為垃圾郵件。

## 工具

您可能需要一些其他工具來設置和自訂您的 XOOPS 安裝。這些可能包括：

* FTP 客戶端軟體
* 文本編輯器
* 檔案軟體以使用 XOOPS 版本（_.zip_ 或 _.tar.gz_）文件。

有關適合工具和網頁伺服器堆疊的一些建議，請參閱[貿易工具](../tools/tools.md)部分。

## 特殊主題

某些特定的系統軟體組合可能需要某些額外的配置才能使用 XOOPS。如果您使用 SELinux 環境或升級具有自訂主題的舊網站，請參閱[特殊主題](specialtopics.md)以了解更多信息。
