---
title: "附錄 3：將 XOOPS 翻譯成本地語言"
---

XOOPS 2.7.0 僅隨附英文語言文件。其他語言的翻譯由社區維護，並通過 GitHub 和各個本地 XOOPS 支持網站分發。

## 在哪裡找到現有翻譯

- **GitHub** — 社區翻譯越來越多地發佈為 [XOOPS 組織](https://github.com/XOOPS)下的單獨存儲庫和個人貢獻者帳戶上。搜索 GitHub 以尋找 `xoops-language-<your-language>` 或瀏覽 XOOPS 組織以尋找當前軟件包。
- **本地 XOOPS 支持網站** — 許多區域 XOOPS 社區在自己的網站上發佈翻譯。訪問 [https://xoops.org](https://xoops.org) 並跟踪指向本地社區的鏈接。
- **模塊翻譯** — 個別社區模塊的翻譯通常位於 `XoopsModules25x` GitHub 組織中模塊本身的旁邊（名稱中的 `25x` 是歷史性的；那裡的模塊針對 XOOPS 2.5.x 和 2.7.x 都進行了維護）。

如果您的語言的翻譯已存在，請將語言目錄放入您的 XOOPS 安裝中（請參閱下面的"如何安裝翻譯"）。

## 需要翻譯的內容

XOOPS 2.7.0 將語言文件保存在使用它們的代碼旁邊。完整翻譯涵蓋所有這些位置：

- **核心** — `htdocs/language/english/` — 每個頁面使用的網站範圍內的常量（登錄、常見錯誤、日期、郵件模板等）。
- **安裝程序** — `htdocs/install/language/english/` — 安裝嚮導顯示的字符串。如果您希望本地化的安裝體驗，請在運行安裝程序之前翻譯這些_。
- **系統模塊** — `htdocs/modules/system/language/english/` — 迄今為止最大的集合；涵蓋整個管理控制面板。
- **捆綁模塊** — `htdocs/modules/pm/language/english/`、`htdocs/modules/profile/language/english/`、`htdocs/modules/protector/language/english/` 和 `htdocs/modules/debugbar/language/english/` 中的每一個。
- **主題** — 一些主題自帶語言文件；如果存在 `htdocs/themes/<theme>/language/`，請檢查它。

"僅核心"翻譯是最少有用的單位，對應於上面的前兩個項目符號。

## 如何翻譯

1. 複製其旁邊的 `english/` 目錄並將副本重命名為您的語言。目錄名稱應為語言的小寫英文名稱（`spanish`、`german`、`french`、`japanese`、`arabic` 等）。

   ```
   htdocs/language/english/    →    htdocs/language/spanish/
   ```

2. 打開新目錄中的每個 `.php` 文件，並翻譯 `define()` 調用內的**字符串值**。不要**更改常數名稱** — 整個核心的 PHP 代碼都引用它們。

   ```php
   // 之前：
   define('_CM_COMDELETED',  'Comment(s) deleted.');
   define('_CM_COMDELETENG', 'Could not delete comment.');
   define('_CM_DELETESELECT', 'Delete all its child comments?');

   // 之後（西班牙語）：
   define('_CM_COMDELETED',  'Comentario(s) eliminado(s).');
   define('_CM_COMDELETENG', 'No se pudo eliminar el comentario.');
   define('_CM_DELETESELECT', '¿Eliminar también todos sus comentarios secundarios?');
   ```

3. **將每個文件保存為 UTF-8 *無* BOM。** XOOPS 2.7.0 端到端使用 `utf8mb4`（數據庫、會話、輸出），並拒絕帶有字節順序標記的文件。在 Notepad++ 中，這是**"UTF-8"**選項，*不是*"UTF-8-BOM"。在 VS Code 中，這是默認的；只需確認狀態欄中的編碼。

4. 更新每個文件頂部的語言和字符集元數據以匹配您的語言：

   ```php
   // _LANGCODE: es
   // _CHARSET : UTF-8
   // Translator: Your Name
   ```

   `_LANGCODE` 應為您的語言的 [ISO 639-1](https://www.loc.gov/standards/iso639-2/php/code_list.php) 代碼。`_CHARSET` 在 XOOPS 2.7.0 中始終是 `UTF-8` — 不再有 ISO-8859-1 變體。

5. 針對安裝程序、系統模塊和您需要的任何捆綁模塊重複。

## 如何安裝翻譯

如果您將已完成的翻譯作為目錄樹獲得：

1. 將每個 `<language>/` 目錄複製到 XOOPS 安裝中的匹配 `language/english/` 父目錄。例如，將 `language/spanish/` 複製到 `htdocs/language/`，將 `install/language/spanish/` 複製到 `htdocs/install/language/` 等。
2. 確保文件所有權和權限可被 Web 服務器讀取。
3. 在安裝時選擇新語言（嚮導掃描 `htdocs/language/` 以查找可用語言）或在現有網站上在**管理員 → 系統 → 偏好設置 → 常規設置**中更改語言。

## 與社區分享您的翻譯

請將您的翻譯貢獻回社區。

1. 創建 GitHub 存儲庫（或 Fork 現有語言存儲庫，如果您的語言存在一個）。
2. 使用清晰的名稱，如 `xoops-language-<language-code>`（例如 `xoops-language-es`、`xoops-language-pt-br`）。
3. 在您的存儲庫內鏡像 XOOPS 目錄結構，以便文件與複製到的位置對齊：

   ```
   xoops-language-es/
   ├── language/spanish/(files).php
   ├── install/language/spanish/(files).php
   └── modules/system/language/spanish/(files).php
   ```

4. 包括記錄以下內容的 `README.md`：
   - 語言名稱和 ISO 代碼
   - XOOPS 版本兼容性（例如 `XOOPS 2.7.0+`）
   - 譯者和感謝
   - 翻譯是否僅核心或涵蓋捆綁模塊
5. 針對相關模塊/核心存儲庫在 GitHub 上打開拉取請求，或在 [https://xoops.org](https://xoops.org) 上發佈公告，以便社區可以找到它。

> **注意**
>
> 如果您的語言需要對核心的更改以進行日期或日曆格式化，請在軟件包中包括這些更改。具有從右到左書寫系統的語言（阿拉伯語、希伯來語、波斯語、烏爾都語）在 XOOPS 2.7.0 中開箱即用 — 此版本中添加了 RTL 支持，個別主題會自動選擇它。
