---
title: "主題常見問題解答"
description: "關於 XOOPS 主題的常見問題和解答"
---

# 主題常見問題解答

> 關於 XOOPS 主題、自訂和管理的常見問題和解答。

---

## 主題安裝和啟用

### 問：如何在 XOOPS 中安裝新主題？

**答：**
1. 下載主題 zip 檔案
2. 進入 XOOPS 管理員 > 外觀 > 主題
3. 按下「上傳」並選擇 zip 檔案
4. 主題出現在主題列表中
5. 按下啟用它作為您的網站

或者，手動提取到 `/themes/` 目錄並重新整理管理員面板。

---

### 問：主題上傳失敗並顯示「拒絕存取」

**答：** 修復主題目錄權限：

```bash
# 使主題目錄可寫入
chmod 755 /path/to/xoops/themes

# 修復上傳權限
chmod 777 /path/to/xoops/uploads

# 如果需要，修復所有權
chown -R www-data:www-data /path/to/xoops/themes
```

---

### 問：如何為特定使用者設定不同的主題？

**答：**
1. 進入使用者管理員 > 編輯使用者
2. 進入「其他」標籤
3. 在「使用者主題」下拉式功能表中選擇偏好主題
4. 儲存

使用者選擇的主題將覆寫預設網站主題。

---

### 問：能否為管理員和使用者網站設定不同的主題？

**答：** 是的，在 XOOPS 管理員 > 設定中設定：

1. **前端主題** - 預設網站主題
2. **管理員主題** - 管理控制面板主題 (通常為獨立)

尋找類似的設定：
- `theme_set` - 前端主題
- `admin_theme` - 管理員主題

---

## 主題自訂

### 問：如何自訂現有主題？

**答：** 建立子主題以保留更新：

```
themes/
├── original_theme/
│   ├── style.css
│   ├── templates/
│   └── images/
└── custom_theme/          {* 建立副本以進行編輯 *}
    ├── style.css
    ├── templates/
    └── images/
```

然後編輯自訂主題中的 `theme.html`。

---

### 問：如何變更主題顏色？

**答：** 編輯主題的 CSS 檔案：

```bash
# 尋找主題 CSS
themes/mytheme/style.css

# 或主題樣板
themes/mytheme/theme.html
```

對於 XOOPS 主題：

```css
/* themes/mytheme/style.css */
:root {
    --primary-color: #2c3e50;
    --secondary-color: #3498db;
    --accent-color: #e74c3c;
}

body {
    background-color: var(--primary-color);
    color: #333;
}

a {
    color: var(--secondary-color);
}

.button {
    background-color: var(--accent-color);
}
```

---

### 問：如何將自訂 CSS 新增到主題？

**答：** 有幾個選項：

**選項 1：編輯 theme.html**
```html
<!-- themes/mytheme/theme.html -->
<head>
    {* 現有 CSS *}
    <link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/custom.css">
</head>
```

**選項 2：建立 custom.css**
```bash
# 建立檔案
themes/mytheme/custom.css

# 新增您的樣式
body { background: #fff; }
```

**選項 3：管理員設定 (如果支援)**
進入 XOOPS 管理員 > 設定 > 主題設定並新增自訂 CSS。

---

### 問：如何修改主題 HTML 樣板？

**答：** 尋找樣板檔案：

```bash
# 列出主題樣板
ls -la themes/mytheme/templates/

# 常見樣板
themes/mytheme/templates/theme.html      {* 主要佈局 *}
themes/mytheme/templates/header.html     {* 頁首 *}
themes/mytheme/templates/footer.html     {* 頁尾 *}
themes/mytheme/templates/sidebar.html    {* 側邊欄 *}
```

使用適當的 Smarty 語法進行編輯：

```html
<!-- themes/mytheme/templates/theme.html -->
{* XOOPS 主題樣板 *}
<!DOCTYPE html>
<html>
<head>
    <meta charset="{$xoops_charset}">
    <title>{$xoops_pagetitle}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/style.css">
</head>
<body>
    <header>
        {include file="file:header.html"}
    </header>

    <main>
        <div class="container">
            <div class="row">
                <div class="col-md-9">
                    {$xoops_contents}
                </div>
                <aside class="col-md-3">
                    {include file="file:sidebar.html"}
                </aside>
            </div>
        </div>
    </main>

    <footer>
        {include file="file:footer.html"}
    </footer>
</body>
</html>
```

---

## 主題結構

### 問：主題中需要什麼檔案？

**答：** 最小結構：

```
themes/mytheme/
├── theme.html              {* 主樣板 (必需) *}
├── style.css              {* 樣式表 (選擇性但建議) *}
├── screenshot.png         {* 管理員預覽圖 (選擇性) *}
├── images/                {* 主題圖像 *}
│   └── logo.png
└── templates/             {* 選擇性：額外樣板 *}
    ├── header.html
    ├── footer.html
    └── sidebar.html
```

如需詳細資訊，請參閱主題結構。

---

### 問：如何從頭開始建立主題？

**答：** 建立結構：

```bash
mkdir -p themes/mytheme/images
cd themes/mytheme
```

建立 `theme.html`：
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="{$xoops_charset}">
    <title>{$xoops_pagetitle}</title>
    <link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/style.css">
</head>
<body>
    <header>{$xoops_headers}</header>
    <main>{$xoops_contents}</main>
    <footer>{$xoops_footers}</footer>
</body>
</html>
```

建立 `style.css`：
```css
* { margin: 0; padding: 0; }
body { font-family: Arial, sans-serif; }
header { background: #333; color: #fff; padding: 20px; }
main { padding: 20px; }
footer { background: #f5f5f5; padding: 20px; border-top: 1px solid #ddd; }
```

---

## 主題變數

### 問：主題樣板中可用的變數有哪些？

**答：** 常見的 XOOPS 主題變數：

```smarty
{* 網站資訊 *}
{$xoops_sitename}          {* 網站名稱 *}
{$xoops_url}               {* 網站 URL *}
{$xoops_theme}             {* 目前主題名稱 *}

{* 頁面內容 *}
{$xoops_contents}          {* 主頁面內容 *}
{$xoops_pagetitle}         {* 頁面標題 *}
{$xoops_headers}           {* 頁首中的 meta 標籤、樣式 *}

{* 模組資訊 *}
{$xoops_module_header}     {* 模組特定頁首 *}
{$xoops_moduledesc}        {* 模組說明 *}

{* 使用者資訊 *}
{$xoops_isuser}            {* 使用者是否已登入？ *}
{$xoops_userid}            {* 使用者 ID *}
{$xoops_uname}             {* 使用者名稱 *}

{* 區塊 *}
{$xoops_blocks}            {* 所有區塊內容 *}

{* 其他 *}
{$xoops_charset}           {* 文件字元集 *}
{$xoops_version}           {* XOOPS 版本 *}
```

---

### 問：如何將自訂變數新增到我的主題？

**答：** 在呈現前於 PHP 程式碼中：

```php
<?php
// 在模組或管理員程式碼中
require_once XOOPS_ROOT_PATH . '/class/xoopstpl.php';
$xoopsTpl = new XoopsTpl();

// 新增自訂變數
$xoopsTpl->assign('my_variable', 'value');
$xoopsTpl->assign('data_array', ['key1' => 'val1', 'key2' => 'val2']);

// 在主題樣板中使用
$xoopsTpl->display('file:theme.html');
?>
```

在主題中：
```smarty
<p>{$my_variable}</p>
<p>{$data_array.key1}</p>
```

---

## 主題樣式

### 問：如何使我的主題回應式？

**答：** 使用 CSS Grid 或 Flexbox：

```css
/* themes/mytheme/style.css */

/* 行動優先方法 */
body {
    font-size: 14px;
}

.container {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
}

main {
    order: 2;
}

aside {
    order: 3;
}

/* 平板電腦及以上 */
@media (min-width: 768px) {
    .container {
        grid-template-columns: 2fr 1fr;
    }
}

/* 桌面及以上 */
@media (min-width: 1200px) {
    .container {
        grid-template-columns: 3fr 1fr;
    }
}
```

或使用 Bootstrap 整合：
```html
<head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5/dist/css/bootstrap.min.css" rel="stylesheet">
</head>

<div class="container">
    <div class="row">
        <div class="col-md-9">{$xoops_contents}</div>
        <div class="col-md-3">{* 側邊欄 *}</div>
    </div>
</div>
```

---

### 問：如何將深色模式新增到我的主題？

**答：**
```css
/* themes/mytheme/style.css */

/* 淺色模式 (預設) */
:root {
    --bg-color: #ffffff;
    --text-color: #000000;
    --border-color: #cccccc;
}

body {
    background-color: var(--bg-color);
    color: var(--text-color);
    transition: background-color 0.3s, color 0.3s;
}

/* 深色模式 */
@media (prefers-color-scheme: dark) {
    :root {
        --bg-color: #1a1a1a;
        --text-color: #ffffff;
        --border-color: #444444;
    }
}

/* 或使用 CSS 類別 */
body.dark-mode {
    --bg-color: #1a1a1a;
    --text-color: #ffffff;
    --border-color: #444444;
}
```

使用 JavaScript 切換：
```html
<script>
document.getElementById('dark-mode-toggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
});

// 載入偏好設定
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}
</script>
```

---

## 主題問題

### 問：主題顯示「無法識別的樣板變數」錯誤

**答：** 變數未傳遞到樣板。檢查：

1. **變數在 PHP 中已分配**：
```php
<?php
$xoopsTpl->assign('variable_name', $value);
?>
```

2. **樣板存在於指定位置**
3. **樣板語法正確**：
```smarty
{* 正確 *}
{$variable_name}

{* 錯誤 *}
$variable_name
{variable_name}
```

---

### 問：CSS 變更未出現在瀏覽器中

**答：** 清除瀏覽器快取：

1. 硬重新整理：`Ctrl+Shift+R` (Mac 上為 Cmd+Shift+R)
2. 清除伺服器上的主題快取：
```bash
rm -rf xoops_data/caches/smarty_cache/themes/*
rm -rf xoops_data/caches/smarty_compile/themes/*
```

3. 檢查主題中的 CSS 檔案路徑：
```bash
ls -la themes/mytheme/style.css
```

---

### 問：主題中的圖像無法載入

**答：** 檢查圖像路徑：

```html
{* 錯誤 - 相對於網頁根目錄的相對路徑 *}
<img src="themes/mytheme/images/logo.png">

{* 正確 - 使用 xoops_url *}
<img src="{$xoops_url}/themes/{$xoops_theme}/images/logo.png">

{* 或在 CSS 中 *}
background-image: url('{$xoops_url}/themes/{$xoops_theme}/images/bg.png');
```

---

### 問：主題樣板遺失或導致錯誤

**答：** 如需除錯，請參閱樣板錯誤。

---

## 主題發佈

### 問：如何打包主題以進行發佈？

**答：** 建立可發佈 zip：

```bash
# 結構
mytheme/
├── theme.html           {* 必需 *}
├── style.css
├── screenshot.png       {* 建議 300x225 *}
├── README.txt
├── LICENSE
├── images/
│   ├── logo.png
│   └── favicon.ico
└── templates/           {* 選擇性 *}
    ├── header.html
    └── footer.html

# 建立 zip
zip -r mytheme.zip mytheme/
```

---

### 問：能否出售我的 XOOPS 主題？

**答：** 檢查 XOOPS 授權：
- 使用 XOOPS 類別/樣板的主題必須尊重 XOOPS 授權
- 純 CSS/HTML 主題的限制較少
- 如需詳細資訊，請檢查 XOOPS 貢獻指南

---

## 主題效能

### 問：如何最佳化主題效能？

**答：**
1. **縮小 CSS/JS** - 移除未使用的程式碼
2. **最佳化圖像** - 使用適當的格式 (WebP、AVIF)
3. **使用 CDN** 提供資源
4. **延遲載入**圖像：
```html
<img src="image.jpg" loading="lazy">
```

5. **快取清除版本**：
```html
<link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/style.css?v={$xoops_version}">
```

如需更多詳細資訊，請參閱效能常見問題解答。

---

## 相關文件

- 樣板錯誤
- 主題結構
- 效能常見問題解答
- Smarty 除錯

---

#xoops #themes #faq #troubleshooting #customization
