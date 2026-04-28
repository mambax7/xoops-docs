---
title: "XOOPS 2.7.0 本指南相容性檢查"
---

本文件列出此儲存庫中需要的變更，以便安裝指南與 XOOPS 2.7.0 相符。

檢查基礎：

- 目前指南儲存庫：`L:\GitHub\XoopsDocs\xoops-installation-guide`
- XOOPS 2.7.0 核心審查位置：`L:\GitHub\MAMBAX7\CORE\XoopsCore27`
- 主要 2.7.0 來源已檢查：
  - `README.md`
  - `release_notes.txt`
  - `htdocs/install/language/english/welcome.php`
  - `htdocs/install/include/config.php`
  - `htdocs/install/include/page.php`
  - `htdocs/install/class/pathcontroller.php`
  - `htdocs/install/page_dbsettings.php`
  - `htdocs/install/page_configsave.php`
  - `htdocs/install/page_siteinit.php`
  - `htdocs/install/page_end.php`
  - `htdocs/mainfile.dist.php`
  - `upgrade/preflight.php`
  - `upgrade/README.md`
  - `upgrade/upd_2.5.11-to-2.7.0/index.php`

## 範圍

此儲存庫目前包含：

- 用作主要指南的根層級英文 Markdown 檔案。
- 部分 `en/` 副本。
- 完整的 `de/` 和 `fr/` 書籍樹及其自身資產。

根層級檔案需要首次通過。之後，等效變更需要鏡像到 `de/book/` 和 `fr/book/`。`en/` 樹也需要清理，因為它似乎只是部分維護。

## 1. 全域儲存庫變更

### 1.1 版本控制和中繼資料

更新所有指南層級參考，從 XOOPS 2.5.x 更新至 XOOPS 2.7.0。

受影響的檔案：

- `README.md`
- `SUMMARY.md` — 根指南的主要實時目錄；導覽標籤和章節標題需要與新章節標題和重新命名的歷史升級注意事項部分相符
- `en/README.md`
- `en/SUMMARY.md`
- `de/README.md`
- `de/SUMMARY.md`
- `fr/README.md`
- `fr/SUMMARY.md`
- `chapter-2-introduction.md`
- `about-xoops-cms.md`
- `appendix-1-working-with-the-new-admin-gui-our-dashboard.md`
- `appendix-5-increase-security-of-your-xoops-installation.md`
- 本地化 `de/book/*.md` 和 `fr/book/*.md`

所需變更：

- 將 `for XOOPS 2.5.7.x` 變更為 `for XOOPS 2.7.0`。
- 將著作權年份從 `2018` 更新為 `2026`。
- 在其中描述目前版本的舊 XOOPS 2.5.x 和 2.6.0 參考資料。
- 將 SourceForge 時代的下載指南替換為 GitHub 發行版：
  - `https://github.com/XOOPS/XoopsCore27/releases`

### 1.2 連結重新整理

`about-xoops-cms.md` 和本地化 `10aboutxoops.md` 檔案仍指向舊的 2.5.x 和 2.6.0 GitHub 位置。這些連結需要更新至目前的 2.7.x 專案位置。

### 1.3 螢幕擷取畫面重新整理

所有顯示安裝程式、升級 UI、管理員儀表板、主題選擇器、模組選擇器和安裝後畫面的螢幕擷取畫面都已過時。

受影響的資產樹：

- `.gitbook/assets/`
- `en/assets/`
- `de/assets/`
- `fr/assets/`

這是完整重新整理，不是部分重新整理。2.7.0 安裝程式使用不同的基於 Bootstrap 的佈局和不同的視覺結構。

## 2. 第 2 章：簡介

檔案：

- `chapter-2-introduction.md`

### 2.1 系統要求必須重新編寫

目前章節只說 Apache、MySQL 和 PHP。XOOPS 2.7.0 有明確的最小值：

| 元件 | 2.7.0 最小值 | 2.7.0 建議值 |
| --- | --- | --- |
| PHP | 8.2.0 | 8.4+ |
| MySQL | 5.7.8 | 8.4+ |
| 網頁伺服器 | 任何支援必需 PHP 的伺服器 | 建議 Apache 或 Nginx |

要新增的注意事項：

- 安裝程式中仍將 IIS 列為可能，但 Apache 和 Nginx 是推薦的範例。
- 發行版注意事項也指出了 MySQL 9.0 相容性。

### 2.2 新增必需和建議的 PHP 擴充套件清單

2.7.0 安裝程式現在將硬體要求與建議的擴充套件分開。

安裝程式顯示的必需檢查：

- MySQLi
- Session
- PCRE
- filter
- `file_uploads`
- fileinfo

建議的擴充套件：

- mbstring
- intl
- iconv
- xml
- zlib
- gd
- exif
- curl

### 2.3 移除校驗和指令

目前步驟 5 描述 `checksum.php` 和 `checksum.mdi`。這些檔案不是 XOOPS 2.7.0 的一部分。

動作：

- 完全移除校驗和驗證部分。

### 2.4 更新套件和上傳指令

保留 `docs/`、`extras/`、`htdocs/`、`upgrade/` 套件佈局說明，但更新上傳和準備文字以反映目前的可寫入路徑期望：

- `mainfile.php`
- `uploads/`
- `uploads/avatars/`
- `uploads/files/`
- `uploads/images/`
- `uploads/ranks/`
- `uploads/smilies/`
- `xoops_data/caches/`
- `xoops_data/caches/xoops_cache/`
- `xoops_data/caches/smarty_cache/`
- `xoops_data/caches/smarty_compile/`
- `xoops_data/configs/`
- `xoops_data/configs/captcha/`
- `xoops_data/configs/textsanitizer/`
- `xoops_data/data/`
- `xoops_data/protector/`

指南目前輕描淡寫了這一點。

### 2.5 取代 SourceForge 翻譯/下載語言

目前文字仍然說要造訪 SourceForge 上的 XOOPS 以獲取其他語言套件。這需要替換為目前專案/社群下載指南。

## 3. 第 3 章：伺服器設定檢查

檔案：

- `chapter-3-server-configuration-check.md`

所需變更：

- 圍繞目前的雙區塊佈局重新編寫頁面說明：
  - 要求
  - 建議的擴充套件
- 取代舊的螢幕擷取畫面。
- 明確記錄上面列出的要求檢查。

## 4. 第 4 章：選擇正確的路徑

檔案：

- `chapter-4-take-the-right-path.md`

所需變更：

- 新增新的 `Cookie 網域`欄位。
- 更新路徑欄位的名稱和描述以符合 2.7.0：
  - XOOPS 根路徑
  - XOOPS 資料路徑
  - XOOPS 程式庫路徑
  - XOOPS URL
  - Cookie 網域
- 新增注意事項，說明變更程式庫路徑現在需要在 `vendor/autoload.php` 有有效的 Composer 自動載入器。

這是 2.7.0 中的真實相容性檢查，應清楚記錄。目前指南根本未提及 Composer。

## 5. 第 5 章：資料庫連接

檔案：

- `chapter-5-database-connections.md`

所需變更：

- 保留只支援 MySQL 的陳述。
- 更新資料庫設定部分以反映：
  - 預設字元集現在是 `utf8mb4`
  - 當字元集變更時，校對選擇動態更新
- 為資料庫連接和設定頁面取代螢幕擷取畫面。

目前說字元集和校對不需要注意的文字對 2.7.0 來說太弱了。它至少應提及新的 `utf8mb4` 預設值和動態校對選擇器。

## 6. 第 6 章：最終系統設定

檔案：

- `chapter-6-final-system-configuration.md`

### 6.1 產生的設定檔案已變更

指南目前說安裝程式會寫入 `mainfile.php` 和 `secure.php`。

在 2.7.0 中，它也會將設定檔案安裝到 `xoops_data/configs/`，包括：

- `xoopsconfig.php`
- 驗證碼設定檔案
- textsanitizer 設定檔案

### 6.2 `xoops_data/configs/` 中的現有設定檔案不會被覆寫

非覆寫行為是**有作用域的**，不是全域的。`page_configsave.php` 中有兩個不同的程式碼路徑寫入設定檔案：

- `writeConfigurationFile()` (在第 59 和 66 行呼叫) **總是**從嚮導輸入重新產生 `xoops_data/data/secure.php` 和 `mainfile.php`。沒有存在檢查；現有副本被取代。
- `copyConfigDistFiles()` (在第 62 行呼叫，在第 317 行定義) 只複製 `xoops_data/configs/` 檔案 (`xoopsconfig.php`、驗證碼設定、textsanitizer 設定) **如果目標不存在**。

章節改寫必須清楚地反映兩種行為：

- 對於 `mainfile.php` 和 `secure.php`：警告對這些檔案的任何手動編輯都會在重新執行安裝程式時被覆寫。
- 對於 `xoops_data/configs/` 檔案：說明本地自訂會在重新執行和升級中保留，恢復發佈預設需要刪除檔案並重新執行 (或手動複製對應的 `.dist.php`)。

不要將「現有檔案已保留」概括為所有安裝程式寫入的設定檔案 — 這是不正確的，會誤導編輯 `mainfile.php` 或 `secure.php` 的管理員。

### 6.3 HTTPS 和反向代理處理已變更

產生的 `mainfile.php` 現在支援更廣泛的協定偵測，包括反向代理標頭。指南應提及這一點，而不是暗示只有直接 `http` 或 `https` 偵測。

### 6.4 表數量錯誤

目前章節說新網站建立 `32` 個表。

XOOPS 2.7.0 建立 `33` 個表。遺失的表是：

- `tokens`

動作：

- 將計數從 32 更新為 33。
- 將 `tokens` 新增到表清單。

## 7. 第 7 章：管理設定

檔案：

- `chapter-7-administration-settings.md`

### 7.1 密碼 UI 說明已過時

安裝程式仍包含密碼產生，但現在還包括：

- 基於 zxcvbn 的密碼強度計
- 視覺強度標籤
- 16 字元產生器和複製流程

更新文字和螢幕擷取畫面以描述目前的密碼面板。

### 7.2 電子郵件驗證現已強制執行

管理員電子郵件使用 `FILTER_VALIDATE_EMAIL` 進行驗證。章節應提及無效的電子郵件值會被拒絕。

### 7.3 授權金鑰部分錯誤

這是最重要的事實修正之一。

目前指南說：

- 有一個 `License System Key`
- 它儲存在 `/include/license.php`
- 安裝期間必須可寫入 `/include/license.php`

那已不再準確。

2.7.0 實際上做的事：

- 安裝會授權資料寫入 `xoops_data/data/license.php`
- `htdocs/include/license.php` 現在只是一個已棄用的包裝程式，從 `XOOPS_VAR_PATH` 載入檔案
- 應移除舊有關使 `/include/license.php` 可寫入的措辭

動作：

- 重新編寫本節而不是刪除它。
- 將路徑從 `/include/license.php` 更新為 `xoops_data/data/license.php`。

### 7.4 主題清單已過時

目前指南仍提及 Zetagenesis 和較舊的 2.5 時代主題集。

XOOPS 2.7.0 中存在的主題：

- `default`
- `xbootstrap`
- `xbootstrap5`
- `xswatch4`
- `xswatch5`
- `xtailwind`
- `xtailwind2`

另請注意：

- `xswatch4` 是由安裝程式資料插入的目前預設主題。
- Zetagenesis 不再是打包主題清單的一部分。

### 7.5 模組清單已過時

2.7.0 套件中存在的模組：

- `system` — 在表填充/資料插入步驟期間自動安裝。始終存在，在選擇器中永不可見。
- `debugbar` — 在安裝程式步驟中可選。
- `pm` — 在安裝程式步驟中可選。
- `profile` — 在安裝程式步驟中可選。
- `protector` — 在安裝程式步驟中可選。

重要事項：模組安裝程式頁面 (`htdocs/install/page_moduleinstaller.php`) 透過迭代 `XoopsLists::getModulesList()` 並**篩選掉已在模組表中的任何內容** (第 95-102 行收集 `$listed_mods`；第 116 行跳過該清單中存在的任何目錄) 來建立其候選清單。因為 `system` 在此步驟執行前安裝，它永遠不會作為核取方塊出現。

需要的指南變更：

- 停止說只有三個捆綁模組。
- 將安裝程式步驟描述為顯示**四個可選模組** (`debugbar`、`pm`、`profile`、`protector`)，而不是五個。
- 單獨記錄 `system` 作為不在選擇器中出現的始終安裝的核心模組。
- 將 `debugbar` 新增至 2.7.0 中捆綁模組說明為新的。
- 注意安裝程式的預設模組預先選擇現在是空的；模組可供選擇，但不會被安裝程式設定預先檢查。

## 8. 第 8 章：準備好前進

檔案：

- `chapter-8-ready-to-go.md`

### 8.1 安裝清理程序需要重新編寫

目前指南說安裝程式將安裝資料夾重新命名為唯一名稱。

這在實踐中仍然為真，但機制已變更：

- 在網頁根目錄中建立外部清理指令碼
- 最終頁面透過 AJAX 觸發清理
- 安裝資料夾重新命名為 `install_remove_<unique suffix>`
- 後備到 `cleanup.php` 仍存在

動作：

- 更新說明。
- 保持使用者端指令簡單：安裝後刪除重新命名的安裝目錄。

### 8.2 管理員儀表板附錄參考已過時

第 8 章仍將讀者指向舊的 Oxygen 時代管理員體驗。這需要與目前的管理員主題對齊：

- `default`
- `dark`
- `modern`
- `transition`

### 8.3 安裝後路徑編輯指南需要更正

目前文字告訴讀者使用路徑定義更新 `secure.php`。在 2.7.0 中，這些路徑常數在 `mainfile.php` 中定義，而 `secure.php` 保有安全資料。本章中的範例區塊應進行相應更正。

### 8.4 應新增生產設定

指南應明確提及現在存在於 `mainfile.dist.php` 中的生產預設值：

- `XOOPS_DB_LEGACY_LOG` 應保留 `false`
- `XOOPS_DEBUG` 應保留 `false`

## 9. 第 9 章：升級現有 XOOPS 安裝

檔案：

- `chapter-9-upgrade-existing-xoops-installation.md`

本章需要最大的改寫。

### 9.1 新增強制性 Smarty 4 預檢步驟

XOOPS 2.7.0 升級流程現在在升級完成前強制執行預檢程序。

新的必需流程：

1. 將 `upgrade/` 目錄複製到網站根目錄。
2. 執行 `/upgrade/preflight.php`。
3. 掃描 `/themes/` 和 `/modules/` 中的舊 Smarty 語法。
4. 在適當的地方使用選擇性修復模式。
5. 重新執行直到清潔。
6. 繼續進行 `/upgrade/`。

目前章節根本未提及這一點，這使其與 2.7.0 指南不相容。

### 9.2 取代手動 2.5.2 時代合併敘述

目前章節仍描述手動 2.5.2 風格升級，具有框架合併、AltSys 注意事項和手動管理的檔案重組。這應替換為 `release_notes.txt` 和 `upgrade/README.md` 中的實際 2.7.x 升級順序。

建議的章節大綱：

1. 備份檔案和資料庫。
2. 關閉網站。
3. 將 `htdocs/` 複製到實際根目錄。
4. 將 `htdocs/xoops_lib` 複製到活躍程式庫路徑。
5. 將 `htdocs/xoops_data` 複製到活躍資料路徑。
6. 將 `upgrade/` 複製到網頁根目錄。
7. 執行 `preflight.php`。
8. 執行 `/upgrade/`。
9. 完成更新程式提示。
10. 更新 `system` 模組。
11. 如果安裝，更新 `pm`、`profile` 和 `protector`。
12. 刪除 `upgrade/`。
13. 打開網站。

### 9.3 記錄真實 2.7.0 升級變更

2.7.0 的更新程式包括至少這些具體變更：

- 建立 `tokens` 表
- 為現代密碼雜湊擴大 `bannerclient.passwd`
- 新增工作階段 Cookie 偏好設定
- 移除過時的捆綁目錄

指南不需要公開每個實作細節，但應停止暗示升級只是檔案複製加模組更新。

## 10. 歷史升級頁面

檔案：

- `upgrading-from-xoops-2.4.5-easy-way.md`
- `upgrading-from-xoops-2.0.-above-2.0.14-and-2.2..md`
- `upgrading-from-any-xoops-2.0.7-to-2.0.13.2.md`
- `upgrading-a-non-utf-8-site.md`
- `upgrading-xoopseditor-package.md`

**狀態：** 結構決定已經解決 — 根 `SUMMARY.md` 將這些移到專用的**歷史升級注意事項**部分，每個檔案都帶有「歷史參考」標註，指向讀者在第 9 章中查看 2.7.0 升級。它們不再是一流升級指南。

**剩餘工作 (僅一致性)：**

- 確保 `README.md` (根) 在相同「歷史升級注意事項」標題下列出這些，而不是在泛型「升級」標題下。
- 在 `de/README.md`、`de/SUMMARY.md`、`fr/README.md`、`fr/SUMMARY.md` 和 `en/SUMMARY.md` 中鏡像相同分離。
- 確保每個歷史升級頁面 (根和本地化 `de/book/upg*.md` / `fr/book/upg*.md` 副本) 都帶有過時內容標註，連結回第 9 章。

## 11. 附錄 1：管理 GUI

檔案：

- `appendix-1-working-with-the-new-admin-gui-our-dashboard.md`

此附錄與 Oxygen 管理 GUI 相關，需要改寫。

所需變更：

- 取代所有 Oxygen 參考資料
- 取代舊的圖示/功能表螢幕擷取畫面
- 記錄目前的管理員主題：
  - default
  - dark
  - modern
  - transition
- 提及發行版注意事項中指出的目前 2.7.0 管理員功能：
  - 系統管理員主題中的樣板超載功能
  - 更新的管理員主題集

## 12. 附錄 2：透過 FTP 上傳 XOOPS

檔案：

- `appendix-2-uploading-xoops-via-ftp.md`

所需變更：

- 移除 HostGator 特定和 cPanel 特定假設
- 使檔案上傳措辭現代化
- 注意 `xoops_lib` 現在包含 Composer 相依性，因此上傳更大，不應有選擇地修剪

## 13. 附錄 5：安全

檔案：

- `appendix-5-increase-security-of-your-xoops-installation.md`

所需變更：

- 完全移除 `register_globals` 討論
- 移除過時的主機票證語言
- 在打算唯讀的地方將權限文字從 `404` 更正為 `0444`
- 更新 `mainfile.php` 和 `secure.php` 討論以符合 2.7.0 佈局
- 新增新的 Cookie 網域安全相關常數內容：
  - `XOOPS_COOKIE_DOMAIN_USE_PSL`
  - `XOOPS_COOKIE_DOMAIN`
- 新增生產指南：
  - `XOOPS_DB_LEGACY_LOG`
  - `XOOPS_DEBUG`

## 14. 跨語言維護影響

修正根層級英文檔案後，`de/book/`、`fr/book/`、`de/README.md`、`fr/README.md`、`de/SUMMARY.md` 和 `fr/SUMMARY.md` 中需要等效更新。

`en/` 樹也需要檢查，因為它包含獨立的 README 和資產集，但似乎只有部分 `book/` 樹。

## 15. 優先順序

### 發佈前的關鍵事項

1. 將儲存庫/版本參考更新至 2.7.0。
2. 圍繞實際 2.7.0 升級流程和 Smarty 4 預檢重新編寫第 9 章。
3. 將系統要求更新至 PHP 8.2+ 和 MySQL 5.7.8+。
4. 更正第 7 章授權金鑰檔案路徑。
5. 更正主題和模組清單。
6. 將第 6 章表計數從 32 更正為 33。

### 準確性的重要事項

7. 重新編寫可寫入路徑指南。
8. 將 Composer 自動載入器要求新增到路徑設定。
9. 將資料庫字元集指南更新至 `utf8mb4`。
10. 修復第 8 章路徑編輯指南，以便常數在正確的檔案中記錄。
11. 移除校驗和指令。
12. 移除 `register_globals` 和其他已棄用的 PHP 指南。

### 發佈品質清理

13. 取代所有安裝程式和管理員螢幕擷取畫面。
14. 將歷史升級頁面移出主流程。
15. 在修正英文後同步德文和法文副本。
16. 清理過時連結和重複 README 行。
