---
title: "保存設定"
---

此頁面顯示保存到目前為止您輸入的設定資訊的結果。

檢閱並修正任何問題後，選擇「繼續」按鈕以繼續。

## 成功時

_保存您的系統設定_ 部分顯示了已保存的資訊。設定儲存在兩個檔案之一中。一個檔案是網頁根中的 _mainfile.php_。另一個是 _xoops_data_ 目錄中的 _data/secure.php_。

![XOOPS 安裝程式保存設定](/xoops-docs/2.7/img/installation/installer-07.png)

兩個檔案都是從 XOOPS 2.7.0 隨附的範本檔案產生的：

* `mainfile.php` 是從網頁根中的 `mainfile.dist.php` 產生的。
* `xoops_data/data/secure.php` 是從 `xoops_data/data/secure.dist.php` 產生的。

除了您輸入的路徑和 URL，`mainfile.php` 現在還包括 XOOPS 2.7.0 中新增的幾個常數：

* `XOOPS_TRUST_PATH` — 保留為 `XOOPS_PATH` 的向後相容別名；您不需要單獨設定它。
* `XOOPS_COOKIE_DOMAIN_USE_PSL` — 預設為 `true`；使用公共字尾清單來衍生正確的 Cookie 網域。
* `XOOPS_DB_LEGACY_LOG` — 預設為 `false`；在開發中設定為 `true` 以記錄舊版資料庫 API 的使用。
* `XOOPS_DEBUG` — 預設為 `false`；在開發中設定為 `true` 以啟用額外的錯誤報告。

在安裝期間，您不需要手動編輯這些常數 — 預設值適用於生產網站。此處提及這些常數是為了讓您知道在稍後開啟 `mainfile.php` 時要尋找什麼。

## 錯誤

如果 XOOPS 偵測到寫入設定檔案的錯誤，它將顯示詳細說明問題的訊息。

![XOOPS 安裝程式保存設定錯誤](/xoops-docs/2.7/img/installation/installer-07-errors.png)

在許多情況下，使用 Apache 中的 mod_php 的 Debian 衍生系統的預設安裝是錯誤的來源。大多數主機提供商的設定不具有這些問題。

### 群組權限問題

PHP 處理程序使用某個使用者的權限執行。檔案也由某個使用者擁有。如果這兩個不是同一使用者，可以使用群組權限來允許 PHP 處理程序與您的使用者帳戶共用檔案。這通常表示您需要變更 XOOPS 需要寫入的檔案和目錄的群組。

對於上述預設設定，這表示 _www-data_ 群組需要指定為檔案和目錄的群組，這些檔案和目錄需要對群組可寫入。

您應該仔細檢查您的設定，並謹慎地選擇如何為在開放網際網路上可用的伺服器解決這些問題。

範例命令可能包括：

```text
chgrp -R www-data xoops_data
chmod -R g+w xoops_data
chgrp -R www-data uploads
chmod -R g+w uploads
```

### 無法建立 mainfile.php

在類 Unix 系統中，建立新檔案的權限取決於授予父資料夾的權限。在某些情況下，該權限不可用，授予它可能是安全問題。

如果您的設定有問題，可以在 XOOPS 發行版中的 _extras_ 目錄中找到虛擬 _mainfile.php_。將該檔案複製到網頁根並設定檔案權限：

```text
chgrp www-data mainfile.php
chmod g+w mainfile.php
```

### SELinux 環境

SELinux 安全內容可能是問題的來源。如果這可能適用，請參閱[特殊主題](../specialtopics.md)以取得更多資訊。

