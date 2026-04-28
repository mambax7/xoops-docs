---
title: "開發者說明"
---

雖然 XOOPS 開發的實際安裝類似於已描述的正常安裝，但在構建開發者就緒系統時有關鍵區別。

開發人員安裝的一個大區別是，除了只關注 _htdocs_ 目錄的內容外，開發人員安裝還保留所有文件，並使用 git 將它們置於源代碼控制下。

另一個區別是 _xoops_data_ 和 _xoops_lib_ 目錄通常可以保留在原位不重命名，只要您的開發系統無法直接在開放互聯網上訪問（即在專網上，例如在路由器後面）。

大多數開發人員在 _localhost_ 系統上工作，該系統具有源代碼、Web 服務器堆棧和處理代碼和數據庫所需的任何工具。

您可以在[貿易工具](../tools/tools.md)章節找到更多信息。

## Git 和虛擬主機

大多數開發人員都希望能夠與當前源保持同步，並將更改貢獻回上游的 [XOOPS/XoopsCore27 GitHub 存儲庫](https://github.com/XOOPS/XoopsCore27)。這意味著，與其下載發行版存檔，不如 [fork](https://help.github.com/articles/fork-a-repo/) XOOPS 的副本，並使用 **git** [clone](https://help.github.com/categories/bootcamp/) 該存儲庫到您的開發框。

由於存儲庫具有特定結構，與其從 _htdocs_ 目錄將文件_複製_到 Web 服務器，不如讓 Web 服務器指向本地克隆存儲庫中的 htdocs 文件夾。為了實現這一點，我們通常創建新的_虛擬主機_或 _vhost_，指向我們的 git 控制源代碼。

在 [WAMP](http://www.wampserver.com/) 環境中，默認的 [localhost](http://localhost/) 頁面在_工具_部分中有一個鏈接到_添加虛擬主機_，該鏈接指向此處：

![WAMP 添加虛擬主機](/xoops-docs/2.7/img/installation/wamp-vhost-03.png)

使用此功能，您可以設置一個 VirtualHost 條目，該條目將直接進入您的（仍然）git 控制存儲庫。

以下是 `wamp64/bin/apache/apache2.x.xx/conf/extra/httpd-vhosts.conf` 中的示例條目

```text
<VirtualHost *:80>
    ServerName xoops.localhost
    DocumentRoot "c:/users/username/documents/github/xoopscore27/htdocs"
    <Directory  "c:/users/username/documents/github/xoopscore27/htdocs/">
        Options +Indexes +Includes +FollowSymLinks +MultiViews
        AllowOverride All
        Require local
    </Directory>
</VirtualHost>
```

您可能還需要在 `Windows/System32/drivers/etc/hosts` 中添加條目：

```text
127.0.0.1    xoops.localhost
```

現在，您可以在 `http://xoops.localhost/` 上安裝以進行測試，同時保持存儲庫完整，並使用簡單的 URL 將 Web 服務器保留在 htdocs 目錄中。此外，您可以隨時將 XOOPS 的本地副本更新到最新的主版本，而無需重新安裝或複製文件。並且，您可以對代碼進行增強和修復，以通過 GitHub 貢獻回 XOOPS。

## Composer 依賴

XOOPS 2.7.0 使用 [Composer](https://getcomposer.org/) 來管理其 PHP 依賴。依賴樹位於源存儲庫內的 `htdocs/xoops_lib/`：

* `composer.dist.json` 是隨發行版一起提供的依賴項的主列表。
* `composer.json` 是本地副本，如果需要，您可以為開發環境自定義。
* `composer.lock` 固定確切版本，以便安裝是可重現的。
* `vendor/` 包含已安裝的庫（Smarty 4、PHPMailer、HTMLPurifier、firebase/php-jwt、monolog、symfony/var-dumper、xoops/xmf、xoops/regdom 等）。

對於 XOOPS 2.7.0 的新 git Clone，從存儲庫根目錄開始，運行：

```text
cd htdocs/xoops_lib
composer install
```

請注意，存儲庫根目錄沒有 `composer.json` — 項目位於 `htdocs/xoops_lib/` 下，因此在運行 Composer 之前必須 `cd` 進入該目錄。

發行版 tarballs 預先填充 `vendor/`，但 git Clone 可能不會。在開發安裝上保持 `vendor/` 完整 — XOOPS 將在運行時從那裡加載其依賴。

[XMF (XOOPS 模塊框架)](https://github.com/XOOPS/xmf)庫在 2.7.0 中作為 Composer 依賴發佈，因此您可以在模塊代碼中使用 `Xmf\Request`、`Xmf\Database\TableLoad` 和相關類，無需任何額外安裝。

## DebugBar 模塊

XOOPS 2.7.0 提供了一個基於 Symfony VarDumper 的 **DebugBar** 模塊。它向呈現的頁面添加了一個調試工具欄，該工具欄暴露請求、數據庫和模板信息。在開發和測試網站上從模塊管理區域安裝它。除非您知道要這樣做，否則不要將其留在面向公眾的生產網站上。
