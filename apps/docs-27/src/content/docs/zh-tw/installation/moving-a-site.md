---
title: "遷移網站"
---

在本地系統或開發伺服器上原型開發新的 XOOPS 網站可能非常有用。在測試對生產網站副本進行 XOOPS 升級之前也可能非常謹慎，以防萬一出現問題。要完成這些任務，您需要能夠將 XOOPS 網站從一個網站移動到另一個網站。以下是成功遷移 XOOPS 網站所需了解的內容。

第一步是建立您的新網站環境。[高級準備](../installation/preparations/)部分涵蓋的相同項目也適用於此。

總之，這些步驟是：

* 獲取主機，包括任何域名或電郵要求
* 獲取 MySQL 用戶帳戶和密碼
* 獲取上述用戶對其具有所有權限的 MySQL 資料庫

該過程的其餘部分與普通安裝非常相似，但：

* 您不會從 XOOPS 發行版複製文件，而是從現有網站複製它們
* 您不會執行安裝程序，而是導入已填充的資料庫
* 您不會在安裝程序中輸入答案，而是在文件和資料庫中更改之前的答案

## 複製現有網站文件

製作現有網站文件的完整副本到本地計算機，您可以在其中編輯它們。如果您正在使用遠端主機，您可以使用 FTP 來複製文件。您需要一份副本進行工作，即使網站在本地計算機上運行，只需在這種情況下製作網站目錄的另一個副本。

重要的是要記住包括 _xoops_data_ 和 _xoops_lib_ 目錄，即使它們被重新命名和/或重新定位。

為使事情更順利，您應該從副本中消除快取和 Smarty 編譯的範本文件。這些文件將在您的新環境中重新建立，如果不清除，可能會導致保留舊的不正確信息的問題。為此，刪除所有文件，除了所有三個目錄中的 _index.html_：

* _xoops_data_/caches/smarty_cache
* _xoops_data_/caches/smarty_compile
* _xoops_data_/caches/xoops_cache

> **注意：** 在將網站遷移到或從 XOOPS 2.7.0 遷移時，清除 `smarty_compile` 尤其重要。XOOPS 2.7.0 使用 Smarty 4，Smarty 4 編譯的範本與 Smarty 3 編譯的範本不可互換。將舊的編譯文件保留在位置將導致新網站首次頁面加載時出現範本錯誤。

### `xoops_lib` 和 Composer 依賴項

XOOPS 2.7.0 透過 `xoops_lib/` 中的 Composer 管理其 PHP 依賴項。`xoops_lib/vendor/` 目錄包含 XOOPS 在執行時需要的第三方庫（Smarty 4、PHPMailer、HTMLPurifier 等）。遷移網站時，您必須複製整個 `xoops_lib/` 樹 — 包括 `vendor/` — 到新主機。除非您是已自訂 `composer.json` 並且目標上有 Composer 的開發人員，否則不要嘗試在目標主機上重新生成 `vendor/`。

## 設置新環境

[高級準備](../installation/preparations/)部分涵蓋的相同項目也適用於此。我們將假設您已經為要遷移的網站獲得了您需要的任何託管。

### 關鍵信息（mainfile.php 和 secure.php）

成功遷移網站涉及更改對絕對文件和路徑名、URL、資料庫參數和訪問憑據的任何引用。

兩個文件，您網站網頁根目錄中的 `mainfile.php`，以及您網站（重新命名和/或重新定位）_xoops_data_ 目錄中的 `data/secure.php`，定義了您網站的基本參數，例如其 URL、它在主機文件系統中的位置，以及它如何連接到資料庫。

您需要知道舊系統中的值是什麼，以及它們在新系統中將是什麼。

#### mainfile.php

| 名稱 | mainfile.php 中的舊值 | mainfile.php 中的新值 |
| :--- | :--- | :--- |
| XOOPS_ROOT_PATH |  |  |
| XOOPS_PATH |  |  |
| XOOPS_VAR_PATH |  |  |
| XOOPS_URL |  |  |
| XOOPS_COOKIE_DOMAIN |  |  |

在編輯器中打開 _mainfile.php_。將上表所示定義的值從舊值更改為新網站的適當值。

保留舊值和新值的筆記，因為稍後的某些步驟中我們需要進行類似的更改。

例如，如果您將網站從本地電腦移動到商業託管服務，您的值可能如下所示：

| 名稱 | mainfile.php 中的舊值 | mainfile.php 中的新值 |
| :--- | :--- | :--- |
| XOOPS_ROOT_PATH | c:/wamp/xoopscore27/htdocs | /home8/example/public_html |
| XOOPS_PATH | c:/wamp/xoopscore27/htdocs/xoops_lib | /home8/example/private/xoops_lib |
| XOOPS_VAR_PATH | c:/wamp/xoopscore27/htdocs/xoops_data | /home8/example/private/xoops_data |
| XOOPS_URL | http://localhost/xoops | https://example.com |
| XOOPS_COOKIE_DOMAIN | localhost | example.com |

更改 _mainfile.php_ 後，儲存它。

某些其他文件可能包含對您的 URL 甚至路徑的硬編碼引用。這在自訂主題和菜單中更有可能，但使用您的編輯器，您可以搜索所有文件以確保。

在編輯器中，在副本中的文件中搜索舊 XOOPS_URL 值，並將其替換為新值。

對舊 XOOPS_ROOT_PATH 值執行相同操作，用新值替換所有出現。

保留您的筆記，因為稍後當我們移動資料庫時，我們需要再次使用它們。

#### data/secure.php

| 名稱 | data/secure.php 中的舊值 | data/secure.php 中的新值 |
| :--- | :--- | :--- |
| XOOPS_DB_HOST |  |  |
| XOOPS_DB_USER |  |  |
| XOOPS_DB_PASS |  |  |
| XOOPS_DB_NAME |  |  |

在重新命名和/或重新定位的 _xoops_data_ 目錄中的編輯器中打開 _data/secure.php_。將上表所示定義的值從舊值更改為新網站的適當值。

#### 其他文件

遷移網站時，某些其他文件可能需要注意。一些常見示例是可能與域綁定的各種服務的 API 密鑰，例如：

* Google 地圖
* Recaptch2
* 讚按鈕
* 連結分享和/或廣告，如 Shareaholic 或 AddThis

更改這些類型的關聯無法輕鬆自動化，因為與舊域的連接通常是服務端註冊的一部分。在某些情況下，這可能只是添加或更改與服務相關聯的域。

### 將文件複製到新網站

將您現在修改的文件複製到您的新網站。這些技術與 [安裝](../installation/installation/)期間使用的技術相同，即使用 FTP。

## 複製現有網站資料庫

### 從舊伺服器備份資料庫

對於此步驟，強烈建議使用 _phpMyAdmin_。登錄到 _phpMyAdmin_ 以進行現有網站，選擇您的資料庫，並選擇 _Export_。

預設設置通常是可以的，所以只需選擇 _Quick_ 的 "Export method" 和 _SQL_ 的 "Format"。

使用 _Go_ 按鈕下載資料庫備份。

![使用 phpMyAdmin 匯出資料庫](/xoops-docs/2.7/img/installation/phpmyadmin-export-01.png)

如果您的資料庫中有不來自 XOOPS 或其模組的表格，且不應該移動，您應該選擇 _Custom_ 的 "Export method"，並在資料庫中選擇只有 XOOPS 相關的表格。（這些從您在安裝期間指定的 "prefix" 開始。您可以在 `xoops_data/data/secure.php` 文件中查找您的資料庫前綴。）

### 將資料庫還原到新伺服器

在您的新主機上，使用您的新資料庫，使用[工具](../tools/tools.md)（例如 _phpMyAdmin_ 中的 _Import_ 選項卡（或如果需要 _bigdump_））還原資料庫。

### 更新資料庫中的 URL 和路徑

更新資料庫中對網站上資源的任何 HTTP 連結。這可能是一項巨大的工作，並且有一個[工具](../tools/tools.md)可以更輕鬆地進行此操作。

Interconnect/it 有一個名為 Search-Replace-DB 的產品可以幫助解決此問題。它內置了對 Wordpress 和 Drupal 環境的認識。按原樣，此工具可能非常有幫助，但當它了解您的 XOOPS 時，它會更好。您可以在 [https://github.com/geekwright/srdb](https://github.com/geekwright/srdb) 找到 XOOPS 感知版本

按照 README.md 文件中的說明下載此實用程式並將其臨時安裝在您的網站上。之前，我們更改了 XOOPS_URL 定義。運行此工具時，您需要用新定義替換原始 XOOPS_URL 定義，即用 [https://example.com](https://example.com) 替換 [http://localhost/xoops](http://localhost/xoops)

![使用搜索和替換資料庫](/xoops-docs/2.7/img/installation/srdb-01.png)

輸入您的舊值和新 URL，並選擇模擬執行選項。檢查更改，如果一切看起來不錯，請進行實時執行選項。此步驟將捕獲配置項和內容內部的連結，這些連結引用您的網站 URL。

![在 SRDB 中檢查更改](/xoops-docs/2.7/img/installation/srdb-02.png)

使用舊值和新值 XOOPS_ROOT_PATH 重複該過程。

#### 不使用 SRDB 的替代方法

在沒有 srdb 工具的情況下完成此步驟的另一種方法是轉儲您的資料庫，在文本編輯器中編輯轉儲以更改 URL 和路徑，然後從編輯後的轉儲重新載入資料庫。是的，該過程涉及足夠的風險，以至於人們被激勵創建 Search-Replace-DB 等專門工具。

## 嘗試您遷移的網站

此時，您的網站應該準備好在其新環境中運行！

當然，總可能出現問題。不要害怕在 [xoops.org 論壇](https://xoops.org/modules/newbb/index.php)上發送任何問題。
