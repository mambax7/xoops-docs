---
title: "故障排除"
---

## Smarty 4模板錯誤

從XOOPS 2.5.x升級到2.7.0時最常見的一類問題是Smarty 4模板不兼容。如果您跳過或未完成[飛行前檢查](preflight.md)，在升級後您可能會在前端或管理區域看到模板錯誤。

要恢復：

1. **重新運行飛行前掃描器**在`/upgrade/preflight.php`。應用它提供的任何自動修復，或手動修復標記的模板。
2. **清除編譯的模板緩存。** 從`xoops_data/caches/smarty_compile/`中移除除`index.html`外的所有內容。Smarty 3編譯模板與Smarty 4不兼容，過時的文件可能導致混亂錯誤。
3. **暫時切換到隨附主題。** 從管理區域，選擇`xbootstrap5`或`default`作為活動主題。這將確認問題是否僅限於自定義主題或是網站範圍。
4. **驗證任何自定義主題和模塊模板**在切換生產流量回來之前。特別注意使用`{php}`塊、棄用修飾符或非標準分隔符語法的模板 -- 這些是最常見的Smarty 4故障。

另請參閱[特殊主題](../../installation/specialtopics.md)中的Smarty 4部分。

## 權限問題

XOOPS升級可能需要寫入之前已設為只讀的文件。如果是這種情況，您將看到類似於以下的消息：

![XOOPS升級使可寫錯誤](/xoops-docs/2.7/img/installation/upgrade-03-make-writable.png)

解決方案是更改權限。如果您沒有更直接的訪問權限，可以使用FTP更改權限。以下是使用FileZilla的示例：

![FileZilla更改權限](/xoops-docs/2.7/img/installation/upgrade-04-change-permissions.png)

## 調試輸出

您可以通過向用於啟動升級的URL添加調試參數來啟用記錄器中的額外調試輸出：

```text
http://example.com/upgrade/?debug=1
```
