---
title: "特殊主題"
---

某些特定的系統軟體組合可能需要某些額外的配置才能與 XOOPS 配合使用。以下是已知問題的一些詳細信息以及處理它們的指導。

## SELinux 環境

某些文件和目錄需要在 XOOPS 的安裝、升級和常規操作期間可寫。在傳統的 Linux 環境中，這是透過確保網頁伺服器執行的系統用戶對 XOOPS 目錄具有權限來完成的，通常透過為這些目錄設定適當的群組。

啟用 SELinux 的系統（例如 CentOS 和 RHEL）有一個額外的安全背景，可以限制流程更改文件系統的能力。這些系統可能需要更改 XOOPS 的安全背景才能正確運作。

XOOPS 期望在常規操作期間能夠自由地寫入某些目錄。此外，在 XOOPS 安裝和升級期間，某些文件也必須可寫。

在常規操作期間，XOOPS 期望能夠在這些目錄中寫入文件和建立子目錄：

- 主要 XOOPS 網頁根目錄中的 `uploads`
- 安裝期間重新定位的任何位置的 `xoops_data`

在安裝或升級過程中，XOOPS 需要能夠寫入此文件：

- 主要 XOOPS 網頁根目錄中的 `mainfile.php`

對於典型的基於 CentOS Apache 的系統，安全背景變更可能會透過以下命令完成：

```
chcon -Rv --type=httpd_sys_rw_content_t /path/to/web/root/uploads/
chcon -Rv --type=httpd_sys_rw_content_t /path/to/xoops_data/
```

您可以使用以下命令使 mainfile.php 可寫：

```
chcon -v --type=httpd_sys_rw_content_t /path/to/web/root/mainfile.php
```

注意：安裝時，您可以從 *extras* 目錄複製空的 mainfile.php。

您還應該允許 httpd 發送郵件：

```
setsebool -P httpd_can_sendmail=1
```

您可能需要的其他設定包括：

允許 httpd 進行網路連接，即獲取 RSS 提要或進行 API 呼叫：

```
setsebool -P httpd_can_network_connect 1
```

使用以下命令啟用與資料庫的網路連接：

```
setsebool -P httpd_can_network_connect_db=1
```

如需詳細信息，請諮詢您的系統文件和/或系統管理員。

## Smarty 4 和自訂主題

XOOPS 2.7.0 將其範本引擎從 Smarty 3 升級到 **Smarty 4**。Smarty 4 對範本語法的要求比 Smarty 3 更嚴格，在舊範本中被容許的一些模式現在會導致錯誤。如果您正在安裝 XOOPS 2.7.0 的全新副本，並且只使用發行版隨附的主題和模組，就不用擔心 — 每個隨附的範本都已針對 Smarty 4 相容性進行了更新。

該問題適用於您何時：

- 升級具有自訂主題的現有 XOOPS 2.5.x 網站，或
- 將自訂主題或舊版第三方模組安裝到 XOOPS 2.7.0。

在將實時流量切換到升級的網站之前，執行 `/upgrade/` 目錄中隨附的預檢掃描器。它掃描 `/themes/` 和 `/modules/` 以查找 Smarty 4 不相容的問題，並且可以自動修復許多問題。有關詳細信息，請參閱[預檢檢查](../upgrading/upgrade/preflight.md)頁面。

如果在安裝或升級後遇到範本錯誤：

1. 重新執行 `/upgrade/preflight.php` 並解決任何報告的問題。
2. 透過從 `xoops_data/caches/smarty_compile/` 刪除除 `index.html` 外的所有內容來清除編譯的範本快取。
3. 暫時切換到隨附的主題（如 `xbootstrap5` 或 `default`）以確認問題是主題特定的而不是站點範圍的。
4. 在將網站返回生產前，驗證任何自訂主題或模組範本變更。
