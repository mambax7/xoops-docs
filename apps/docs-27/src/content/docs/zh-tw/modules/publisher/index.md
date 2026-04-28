---
title: "Publisher 模組"
description: "XOOPS Publisher 新聞和部落格模組的完整文件"
---

> XOOPS CMS 首選新聞和部落格發佈模組。

---

## 概述

Publisher 是 XOOPS 的終極內容管理模組，是 SmartSection 的進化版本，提供功能最豐富的部落格和新聞解決方案。它為建立、組織和發佈內容提供全面的工具，並支援完整的編輯工作流程。

**要求:**
- XOOPS 2.5.10+
- PHP 7.1+（建議使用 PHP 8.x）

---

## 🌟 主要功能

### 內容管理
- **分類和子分類** - 分層內容組織
- **富文字編輯** - 支援多個 WYSIWYG 編輯器
- **檔案附件** - 將檔案附加到文章
- **圖像管理** - 頁面和分類圖像
- **檔案包裝** - 將檔案作為文章包裝

### 發佈工作流程
- **排程發佈** - 設定未來發佈日期
- **過期日期** - 自動過期內容
- **審核** - 編輯批准工作流程
- **草稿管理** - 儲存進行中的工作

### 顯示和範本
- **四個基礎範本** - 多種顯示佈局
- **自訂範本** - 建立自己的設計
- **SEO 最佳化** - 搜尋引擎友善的 URL
- **回應式設計** - 行動裝置準備好的輸出

### 使用者互動
- **評分** - 文章評分系統
- **留言** - 讀者討論
- **社群分享** - 分享到社交網路

### 權限
- **提交控制** - 誰可以提交文章
- **欄位級權限** - 按群組控制表單欄位
- **分類權限** - 每個分類的存取控制
- **審核權限** - 全域審核設定

---

## 🗂️ 章節內容

### 使用者指南
- 安裝指南
- 基本設定
- 建立文章
- 管理分類
- 設定權限

### 開發人員指南
- 擴充 Publisher
- 建立自訂範本
- API 參考
- 掛鉤和事件

---

## 🚀 快速開始

### 1. 安裝

```bash
# 從 GitHub 下載
git clone https://github.com/XoopsModules25x/publisher.git

# 複製到模組目錄
cp -r publisher /path/to/xoops/htdocs/modules/
```

然後通過 XOOPS 管理員 → 模組 → 安裝進行安裝。

### 2. 建立您的第一個分類

1. 前往 **管理員 → Publisher → 分類**
2. 按一下 **新增分類**
3. 填入：
   - **名稱**：新聞
   - **說明**：最新新聞和更新
   - **圖像**：上傳分類圖像
4. 儲存

### 3. 建立您的第一篇文章

1. 前往 **管理員 → Publisher → 文章**
2. 按一下 **新增文章**
3. 填入：
   - **標題**：歡迎來到我們的網站
   - **分類**：新聞
   - **內容**：您的文章內容
4. 設定 **狀態**：已發佈
5. 儲存

---

## ⚙️ 設定選項

### 一般設定

| 設定 | 說明 | 預設值 |
|------|------|--------|
| 編輯器 | 要使用的 WYSIWYG 編輯器 | XOOPS 預設值 |
| 每頁項目 | 每頁顯示的文章 | 10 |
| 顯示麵包屑 | 顯示導覽軌跡 | 是 |
| 允許評分 | 啟用文章評分 | 是 |
| 允許留言 | 啟用文章留言 | 是 |

### SEO 設定

| 設定 | 說明 | 預設值 |
|------|------|--------|
| SEO URL | 啟用友善的 URL | 否 |
| URL 重寫 | Apache mod_rewrite | 無 |
| 中繼關鍵字 | 自動產生關鍵字 | 是 |

### 權限矩陣

| 權限 | 匿名 | 已註冊 | 編輯器 | 管理員 |
|------|------|--------|--------|--------|
| 檢視文章 | ✓ | ✓ | ✓ | ✓ |
| 提交文章 | ✗ | ✓ | ✓ | ✓ |
| 編輯自己的文章 | ✗ | ✓ | ✓ | ✓ |
| 編輯所有文章 | ✗ | ✗ | ✓ | ✓ |
| 批准文章 | ✗ | ✗ | ✓ | ✓ |
| 管理分類 | ✗ | ✗ | ✗ | ✓ |

---

## 📦 模組結構

```
modules/publisher/
├── admin/                  # 管理介面
│   ├── index.php
│   ├── category.php
│   ├── item.php
│   └── menu.php
├── class/                  # PHP 類別
│   ├── Category.php
│   ├── CategoryHandler.php
│   ├── Item.php
│   ├── ItemHandler.php
│   └── Helper.php
├── include/                # 包含檔案
│   ├── common.php
│   └── functions.php
├── templates/              # Smarty 範本
│   ├── publisher_index.tpl
│   ├── publisher_item.tpl
│   └── publisher_category.tpl
├── language/               # 翻譯
│   └── english/
├── sql/                    # 資料庫架構
│   └── mysql.sql
├── xoops_version.php       # 模組資訊
└── index.php               # 模組入口
```

---

## 🔄 遷移

### 從 SmartSection

Publisher 包括內建的遷移工具：

1. 前往 **管理員 → Publisher → 匯入**
2. 選擇 **SmartSection** 作為來源
3. 選擇匯入選項：
   - 分類
   - 文章
   - 留言
4. 按一下 **匯入**

### 從新聞模組

1. 前往 **管理員 → Publisher → 匯入**
2. 選擇 **新聞** 作為來源
3. 對應分類
4. 按一下 **匯入**

---

## 🔗 相關文件

- 模組開發指南
- Smarty 範本化
- XMF 框架

---

## 📚 資源

- [GitHub 儲存庫](https://github.com/XoopsModules25x/publisher)
- [問題追蹤器](https://github.com/XoopsModules25x/publisher/issues)
- [原始教程](https://xoops.gitbook.io/publisher-tutorial/)

---

#xoops #publisher #module #blog #news #cms #content-management
