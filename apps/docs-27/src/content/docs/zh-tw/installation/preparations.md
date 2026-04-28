---
title: "phpinfo"
---

此步驟是可選的，但可以輕鬆為您節省數小時的困擾。

作為託管系統的預安裝測試，在本地建立一個非常小但有用的 PHP 腳本，並將其上傳到目標系統。

PHP 腳本只有一行：

```php
<?php phpinfo();
```

使用文本編輯器，建立一個名為 _info.php_ 的文件，只需這一行。

接下來，將此文件上傳到您的網頁根目錄。

![Filezilla info.php 上傳](/xoops-docs/2.7/img/installation/filezilla-01-info.png)

在瀏覽器中打開它來訪問您的腳本，即訪問 `http://example.com/info.php`。如果一切正常，您應該看到類似於以下內容的頁面：

![phpinfo() 示例](/xoops-docs/2.7/img/installation/php-info.png)

注意：某些主機服務可能會出於安全措施而禁用 _phpinfo()_ 函數。如果是這種情況，您通常會收到相應的消息。

腳本的輸出可能對故障排除有用，因此請考慮保存副本。

如果測試成功，您應該可以進行安裝了。您應該刪除 _info.php_ 腳本並繼續安裝。

如果測試失敗，請調查原因！任何阻止此簡單測試工作的問題 **將** 阻止真實安裝工作。
