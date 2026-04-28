---
title: "附錄 2：透過 FTP 上傳 XOOPS"
---

本附錄介紹如何使用 FTP 或 SFTP 將 XOOPS 2.7.0 部署到遠端主機。任何控制面板（cPanel、Plesk、DirectAdmin 等）都會暴露相同的基本步驟。

## 1. 準備資料庫

透過您的主機控制面板：

1. 為 XOOPS 建立一個新的 MySQL 資料庫。
2. 建立一個具有強密碼的資料庫用戶。
3. 授予該用戶對新建立資料庫的完全權限。
4. 記錄資料庫名稱、用戶名、密碼和主機 — 您需要在 XOOPS 安裝程序中輸入它們。

> **提示**
>
> 現代控制面板會為您生成強密碼。由於應用程序將密碼存儲在 `xoops_data/data/secure.php`，您不需要經常輸入它 — 推薦使用長的、隨機生成的值。

## 2. 建立管理員郵箱

建立一個郵箱，該郵箱將接收網站管理通知。XOOPS 安裝程序在網站管理員帳戶設置期間會要求此地址，並使用 `FILTER_VALIDATE_EMAIL` 進行驗證。

## 3. 上傳文件

XOOPS 2.7.0 在 `xoops_lib/vendor/` 中預安裝了第三方依賴項（Composer 套件、Smarty 4、HTMLPurifier、PHPMailer、Monolog、TCPDF 等）。這使得 `xoops_lib/` 的大小明顯大於 2.5.x — 預期有數十兆字節。

**不要選擇性地跳過 `xoops_lib/vendor/` 內部的文件。** 跳過 Composer vendor 樹中的文件將破壞自動載入，安裝將失敗。

上傳結構（假設 `public_html` 是文件根目錄）：

1. 將 `xoops_data/` 和 `xoops_lib/` **上傳到** `public_html` **旁邊**，而不是裡面。將它們放在網頁根目錄外是 2.7.0 推薦的安全做法。

   ```
   /home/your-user/
   ├── public_html/
   ├── xoops_data/     ← 在此上傳
   └── xoops_lib/      ← 在此上傳
   ```

   ![](/xoops-docs/2.7/img/installation/img_66.jpg)
   ![](/xoops-docs/2.7/img/installation/img_67.jpg)

2. 將分發版 `htdocs/` 目錄的其餘內容上傳到 `public_html/`。

   ![](/xoops-docs/2.7/img/installation/img_68.jpg)

> **如果您的主機不允許網頁根目錄外的目錄**
>
> 將 `xoops_data/` 和 `xoops_lib/` **上傳到** `public_html/` **內部**，並**將它們重新命名為非顯眼的名稱**（例如 `xdata_8f3k2/` 和 `xlib_7h2m1/`）。您需要在安裝程序詢問 XOOPS 資料路徑和 XOOPS 庫路徑時輸入重新命名的路徑。

## 4. 使可寫入目錄可寫入

透過 FTP 客戶端的 CHMOD 對話框（或 SSH），使第 2 章中列出的目錄可被網頁伺服器寫入。在大多數共享主機上，目錄使用 `0775`，`mainfile.php` 使用 `0664` 足夠。如果您的主機在 FTP 用戶以外的用戶下執行 PHP，安裝期間 `0777` 是可以接受的，但安裝完成後應該加嚴權限。

## 5. 啟動安裝程序

在網站的公開 URL 處打開瀏覽器。如果所有文件都已就位，XOOPS 安裝精靈將啟動，您可以從 [第 2 章](chapter-2-introduction.md) 開始跟隨本指南的其餘部分。
