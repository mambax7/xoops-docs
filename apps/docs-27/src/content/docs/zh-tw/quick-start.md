---
title: 快速開始
description: 在 5 分鐘內讓 XOOPS 2.7 運行起來。
---

## 系統需求

| 組件  | 最低要求                 | 推薦配置   |
|------------|-------------------------|---------------|
| PHP        | 8.2                    | 8.4+         |
| MySQL      | 5.7                     | 8.0+          |
| MariaDB    | 10.4                    | 10.11+        |
| 網頁伺服器 | Apache 2.4 / Nginx 1.20 | 最新穩定版本 |

## 下載

從 [GitHub Releases](https://github.com/XOOPS/XoopsCore27/releases) 下載最新版本。

```bash
# 或直接克隆
git clone https://github.com/XOOPS/XoopsCore27.git mysite
cd mysite
```

## 安裝步驟

1. **上傳文件**到您的網頁伺服器文件根目錄（例如 `public_html/`）。
2. **建立 MySQL 資料庫**並建立一個具有完全權限的用戶。
3. **在瀏覽器中打開**並導航至您的域名 — XOOPS 安裝程序會自動啟動。
4. **跟隨 5 步驟精靈** — 它會配置路徑、建立表格並設定您的管理員帳戶。
5. **刪除 `install/` 文件夾**（系統提示時）。這對安全性是必需的。

## 驗證安裝

設置後，請訪問：

- **首頁：** `https://yourdomain.com/`
- **管理面板：** `https://yourdomain.com/xoops_data/` *（您在安裝期間選擇的路徑）*

## 後續步驟

- [完整安裝指南](./installation/) — 伺服器配置、權限、故障排除
- [模組指南](./module-guide/introduction/) — 構建您的第一個模組
- [主題指南](./theme-guide/introduction/) — 建立或自訂主題
