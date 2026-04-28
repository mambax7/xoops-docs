---
title: "交易工具"
---

有許多事情是自訂和維護 XOOPS 網站所需的，這些事情需要在 XOOPS 外部進行，或在那裡更容易完成。

這是您可能想要使用的工具類型的清單，以及一些 XOOPS 網站管理員認為有用的特定工具的建議。

## 編輯器

編輯器是一個非常個人的選擇，人們可能會對他們最喜歡的編輯器充滿熱情。我們將只介紹眾多可能性中的幾個。

對於 XOOPS 的使用，您需要一個編輯器來調整一些組態選項以及為您的網站自訂佈景主題。對於這些用途，擁有一個可以同時處理多個檔案、能夠在許多檔案中進行搜尋和替換，並提供語法突出顯示的編輯器會非常有幫助。您可以使用一個非常簡單、無麻煩的編輯器，但您在完成一些任務時會更加努力。

**PhpStorm** 來自 _JetBrains_ 是一個整合開發環境 (IDE)，特別為 PHP 網頁開發量身訂製。_JetBrains_ 在贊助 XOOPS 方面幫助很大，其產品是許多開發人員的最愛。這是一個商業產品，對於一些新的網站管理員來說可能會成本高昂，但它可以節省的時間對於有經驗的開發人員很有吸引力。

**Visual Studio Code** 是 Microsoft 提供的免費多平臺原始碼編輯器。它對核心網頁技術（如 HTML、JavaScript 和 PHP）具有內建或透過擴充功能的支援，使其成為 XOOPS 使用的良好選擇。

**Notepad++** 是 Windows 的免費且備受尊敬的爭奪者，擁有忠實的使用者。

**Meld** 不是編輯器，而是比較文本檔案以顯示差異，並允許選擇性合併變更和進行小編輯。在比較組態檔案、佈景主題範本以及當然 PHP 代碼時非常有用。

| 名稱 | 連結 | 授權 | 平臺 |
| :--- | :--- | :--- | :--- |
| PhpStorm | [https://www.jetbrains.com/phpstorm/](https://www.jetbrains.com/phpstorm/) | 商業 | 任何 |
| Visual Studio Code | [https://code.visualstudio.com/](https://code.visualstudio.com/) | MIT | 任何 |
| Notepad++ | [https://notepad-plus-plus.org/](https://notepad-plus-plus.org/) | GPL | Win |
| Meld | [https://meldmerge.org/](https://meldmerge.org/) | GPL | 任何 |

## FTP 用戶端

檔案傳輸協定 (FTP) 或其變體用於在一台電腦和另一台電腦之間移動檔案。大多數 XOOPS 安裝將需要 FTP 用戶端來移動來自 XOOPS 發佈的檔案到將部署網站的主機系統。

**FileZilla** 是一個免費且強大的 FTP 用戶端，適用於大多數平臺。跨平臺的一致性使其成為本書中 FTP 範例的選擇。

**PuTTY** 是一個免費的 SSH 用戶端，對於 Shell 存取伺服器以及使用 SCP 提供檔案傳輸功能很有用

**WinSCP** 是適用於 Windows 系統的 FTP/SFTP/SCP 用戶端。

| 名稱 | 連結 | 授權 | 平臺 |
| :--- | :--- | :--- | :--- |
| FileZilla | [https://filezilla-project.org/](https://filezilla-project.org/) | GPL | 任何 |
| PuTTY | [https://www.chiark.greenend.org.uk/~sgtatham/putty/](https://www.chiark.greenend.org.uk/~sgtatham/putty/) | BSD | Win/*nix |
| WinSCP | [https://winscp.net/eng/index.php](https://winscp.net/eng/index.php) | GPL | Windows |

## MySQL/MariaDB

資料庫包含您網站的所有內容、自訂您網站的組態、有關您網站使用者的資訊等。保護和維護該資訊可能會因為一些特別處理資料庫的額外工具而更容易。

**phpMyAdmin** 是最流行的網頁型 MySQL 資料庫工具，包括進行一次性備份。

**BigDump** 對於有限的主機帳戶來說是天堂，因為它有助於在避免逾時和大小限制的情況下還原大型資料庫備份轉儲。

**srdb**，XOOPS 的搜尋取代 DB 是 [Search and Replace DB](https://github.com/interconnectit/Search-Replace-DB) 的 XOOPS 適應版本。特別適合在移動網站時變更 MySQL 資料中的 URL 和檔案系統參考。

| 名稱 | 連結 | 授權 | 平臺 |
| :--- | :--- | :--- | :--- |
| phpMyAdmin | [https://www.phpmyadmin.net/](https://www.phpmyadmin.net/) | GPL | 任何 |
| BigDump | [http://www.ozerov.de/bigdump/](http://www.ozerov.de/bigdump/) | GPL | 任何 |
| srdb | [https://github.com/geekwright/srdb](https://github.com/geekwright/srdb) | GPL3 | 任何 |

## 開發人員堆疊

某些平臺（如 Ubuntu）具備執行 XOOPS 所需的整個堆疊，而其他平臺則需要一些新增。

**WAMP** 和 **Uniform Server Zero** 都是 Windows 的一體化堆疊。

**XAMPP**，Apache Friends 的一體化堆疊，適用於多個平臺。

**bitnami** 提供各種預建的應用程式堆疊，包括虛擬機器和容器映像。他們的供應品對於快速嘗試應用程式（包括 XOOPS）或各種網頁技術是一個寶貴的資源。他們也可能適合生產以及開發使用。

**Docker** 是一個應用程式容器平臺，用於建立和執行容器以實施自訂環境。

**Devilbox** 是一個易於組態的基於 Docker 的開發堆疊。它為所有堆疊元件提供了廣泛的版本，並允許開發人員在可重現和可共享的環境中測試。

| 名稱 | 連結 | 授權 | 平臺 |
| :--- | :--- | :--- | :--- |
| WAMP | [http://www.wampserver.com/](http://www.wampserver.com/) | 多個 | Win |
| Uniform Server Zero | [http://www.uniformserver.com/](http://www.uniformserver.com/) | 多個 | Win |
| XAMPP | [https://www.apachefriends.org/index.html](https://www.apachefriends.org/index.html) | 多個 | 任何 |
| bitnami | [https://bitnami.com/](https://bitnami.com/) | 多個 | 任何 |
| Docker | [https://www.docker.com/](https://www.docker.com/) | 多個 | 任何 |
| Devilbox | [http://devilbox.org/](http://devilbox.org/) | MIT | 任何 |
