---
title: "升級準備"
---

## 關閉網站

在開始XOOPS升級過程之前，您應該在管理菜單中的"首選項 -> 系統選項 -> 常規設置"頁面中將"關閉您的網站？"項設置為_是_。

這可以防止用戶在升級期間遇到損壞的網站。它還可以將資源爭用保持在最低限度，以確保更平穩的升級。

用戶將看到類似以下內容，而不是錯誤和損壞的網站：

![移動設備上的網站已關閉](/xoops-docs/2.7/img/installation/mobile-site-closed.png)

## 備份

在進行完整備份前清除所有緩存是個好主意，可以在管理菜單中的XOOPS管理_維護_部分使用_清理緩存文件夾_。關閉網站後，使用_清空sessions表_也是推薦的，這樣如果需要恢復，舊sessions將不是它的一部分。

### 文件

可以使用FTP進行文件備份，將所有文件複製到本地計算機。如果您擁有對伺服器的直接shell訪問權限，可以_快得多_地製作副本（或存檔副本）。

### 數據庫

要進行數據庫備份，您可以使用XOOPS管理_維護_部分中的內置函數。您也可以使用_phpMyAdmin_（如果可用）中的_導出_函數。如果您擁有shell訪問權限，可以使用_mysql_命令轉儲您的數據庫。

精通備份和_恢復_您的數據庫是重要的網站管理員技能。有許多在線資源可供您了解更多關於這些操作，如[http://webcheatsheet.com/sql/mysql_backup_restore.php](http://webcheatsheet.com/sql/mysql_backup_restore.php)

![phpMyAdmin導出](/xoops-docs/2.7/img/installation/phpmyadmin-export-01.png)

## 將新文件複製到網站

將新文件複製到您的網站與安裝期間的[準備](../../installation/preparations/)步驟幾乎相同。您應該將_xoops_data_和_xoops_lib_目錄複製到安裝期間重新定位這些目錄的任何地方。然後，將分發_htdocs_目錄的其餘內容（下一部分涵蓋的幾個例外除外）複製到網絡根目錄中的現有文件和目錄上。

在XOOPS 2.7.0中，在現有網站上複製新分發**不會覆蓋現有配置文件**，例如`mainfile.php`或`xoops_data/data/secure.php`。這比早期版本是一個受歡迎的改變，但您仍應在開始前進行完整備份。

將整個_upgrade_目錄從分發複製到您的網絡根目錄，在那裡創建_upgrade_目錄。

## 運行Smarty 4飛行前檢查

在啟動主`/upgrade/`工作流之前，您必須運行`upgrade/`目錄中附帶的飛行前掃描器。它檢查您的現有主題和模塊模板的Smarty 4兼容性問題，並可以自動修復許多問題。

1. 將您的瀏覽器指向_您的網站URL_/upgrade/preflight.php
2. 使用管理員帳戶登錄
3. 運行掃描並查看報告
4. 應用提供的任何自動修復，或手動修復標記的模板
5. 重新運行掃描直到乾淨
6. 只有這樣才能繼續主升級

請參閱[飛行前檢查](preflight.md)頁面獲取完整演練。

### 您可能不想複製的內容

您不應該將_install_目錄重新複製到正在運行的XOOPS系統中。在您的XOOPS安裝中留下install文件夾會暴露您的系統於潛在的安全問題。安裝程序隨機重命名它，但您應該刪除它並確保不複製另一個。

有些文件您可能已編輯以自定義您的網站，您會想保留這些文件。以下是常見自定義的列表。

* _xoops_data/configs/xoopsconfig.php_如果自安裝網站以來已更改
* _themes_中的任何目錄（如果已為您的網站自定義）。在這種情況下，您可能想比較文件以識別有用的更新。
* _class/captcha/_中以"config"開頭的任何文件（如果自安裝網站以來已更改）
* _class/textsanitizer_中的任何自定義
* _class/xoopseditor_中的任何自定義

如果您在升級後意識到某些內容被意外覆蓋，不用擔心 -- 這就是為什麼您開始時進行了完整備份。_（您確實進行了備份，對吧？）_

## 檢查mainfile.php（從升級前2.5 XOOPS）

此步驟僅適用於如果您要從舊XOOPS版本（2.3或更早版本）升級。如果您要從XOOPS 2.5.x升級，可以跳過此部分。

舊版本的XOOPS需要在`mainfile.php`中進行一些手動更改以啟用Protector模塊。在您的網絡根目錄中，您應該有一個名為`mainfile.php`的文件。在編輯器中打開該文件，並查找以下行：

```php
include XOOPS_TRUST_PATH.'/modules/protector/include/precheck.inc.php' ;
```

和

```php
include XOOPS_TRUST_PATH.'/modules/protector/include/postcheck.inc.php' ;
```

如果您找到這些行，請移除它們，並在繼續前保存文件。
