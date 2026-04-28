---
title: "運行升級"
---

在運行主升級程序之前，請確保您已完成[飛行前檢查](preflight.md)。升級UI要求飛行前至少運行一次，如果您尚未運行，將引導您到那裡。

通過將您的瀏覽器指向網站的_upgrade_目錄來啟動升級：

```text
http://example.com/upgrade/
```

這應該顯示類似這樣的頁面：

![XOOPS升級啟動](/xoops-docs/2.7/img/installation/upgrade-01.png)

選擇"繼續"按鈕以繼續。

每個"繼續"會推進另一個補丁。繼續進行直到應用所有補丁，並顯示系統模塊更新頁面。

![XOOPS升級應用的補丁](/xoops-docs/2.7/img/installation/upgrade-05-applied.png)

## 2.5.11 → 2.7.0升級應用的內容

從XOOPS 2.5.11升級到2.7.0時，升級程序應用以下補丁。每個都作為精靈中的單獨步驟呈現，這樣您可以確認正在更改的內容：

1. **移除過時的捆綁PHPMailer。** Protector模塊內的PHPMailer捆綁副本被刪除。PHPMailer現在通過`xoops_lib/vendor/`中的Composer供應。
2. **移除過時的HTMLPurifier文件夾。** 類似地，Protector模塊內的舊HTMLPurifier文件夾被刪除。HTMLPurifier現在通過Composer供應。
3. **創建`tokens`表。** 為通用作用域令牌存儲添加了新的`tokens`表。該表具有令牌id、用戶id、作用域、哈希和發佈/過期/使用時間戳的列，由XOOPS 2.7.0中的基於令牌的功能使用。
4. **擴寬`bannerclient.passwd`。** `bannerclient.passwd`列被擴寬為`VARCHAR(255)`，以便它可以存儲現代密碼哈希（bcrypt、argon2），而不是舊的狹窄列。
5. **添加會話cookie偏好設置。** 插入兩個新偏好設置：`session_cookie_samesite`（用於SameSite cookie屬性）和`session_cookie_secure`（強制僅HTTPS cookie）。請參閱[升級後](ustep-04.md)瞭解如何在升級完成後檢查這些。

這些步驟都不涉及您的內容數據。您的用戶、帖子、圖像和模塊數據保持不變。

## 選擇語言

主XOOPS分發附帶英文支持。對其他區域設置的支持由[XOOPS本地支持網站](https://xoops.org/modules/xoopspartners/)供應。此支持可以採用自定義分發或要添加到主分發的其他文件的形式。

XOOPS翻譯在[transifex](https://www.transifex.com/xoops/public/)上維護

如果您的XOOPS升級程序有其他語言支持，您可以通過選擇頂部菜單中的語言圖標並選擇不同的語言來更改語言。

![XOOPS升級語言](/xoops-docs/2.7/img/installation/upgrade-02-change-language.png)
