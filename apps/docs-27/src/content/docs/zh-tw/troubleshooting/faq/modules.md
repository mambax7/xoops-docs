---
title: "模組常見問題解答"
description: "關於 XOOPS 模組的常見問題和解答"
---

# 模組常見問題解答

> 關於 XOOPS 模組、安裝和管理的常見問題和解答。

---

## 安裝和啟用

### 問：如何在 XOOPS 中安裝模組？

**答：**
1. 下載模組 zip 檔案
2. 進入 XOOPS 管理員 > 模組 > 管理模組
3. 按下「瀏覽」並選擇 zip 檔案
4. 按下「上傳」
5. 模組出現在列表中 (通常已停用)
6. 按下啟用圖示以啟用它

或者，將 zip 直接提取到 `/xoops_root/modules/` 並導覽到管理員面板。

---

### 問：為什麼我在安裝後在管理員面板中看不到模組？

**答：** 檢查下列情況：

1. **模組未啟用** - 按下模組列表中的眼睛圖示
2. **缺少管理員頁面** - 模組必須在 xoopsversion.php 中有 `hasAdmin = 1`
3. **缺少語言檔案** - 需要 `language/english/admin.php`
4. **快取未清除** - 清除快取並重新整理瀏覽器

```bash
# 清除 XOOPS 快取
rm -rf /path/to/xoops/xoops_data/caches/*
```

---

### 問：我如何卸載模組？

**答：**
1. 進入 XOOPS 管理員 > 模組 > 管理模組
2. 停用模組 (按下眼睛圖示)
3. 按下垃圾/刪除圖示
4. 如果要完全移除，手動刪除模組資料夾：

```bash
rm -rf /path/to/xoops/modules/modulename
```

---

## 模組管理

### 問：禁用和卸載有什麼區別？

**答：**
- **禁用**：停用模組 (按下眼睛圖示)。資料庫表保留。
- **卸載**：移除模組。刪除資料庫表並從列表中移除。

要完全移除，也要刪除資料夾：
```bash
rm -rf modules/modulename
```

---

### 問：模組出現在列表中但無法啟用

**答：** 檢查：
1. xoopsversion.php 語法 - 使用 PHP linter：
```bash
php -l modules/mymodule/xoopsversion.php
```

2. 資料庫 SQL 檔案：
```bash
# 檢查 SQL 語法
grep -n "CREATE TABLE" modules/mymodule/sql/mysql.sql
```

3. 語言檔案：
```bash
ls -la modules/mymodule/language/english/
```

請參閱模組安裝失敗以取得詳細的診斷。

---

## 模組配置

### 問：我在哪裡設定模組設置？

**答：**
1. 進入 XOOPS 管理員 > 模組
2. 按下模組旁的設置/齒輪圖示
3. 設定偏好設定

設置儲存在 `xoops_config` 表中。

**在程式碼中訪問：**
```php
<?php
$module_handler = xoops_getHandler('module');
$module = $module_handler->getByDirname('modulename');
$config_handler = xoops_getHandler('config');
$settings = $config_handler->getConfigsByCat(0, $module->mid());

foreach ($settings as $setting) {
    echo $setting->getVar('conf_name') . ": " . $setting->getVar('conf_value');
}
?>
```

---

## 模組功能

### 問：如何向我的模組新增管理員頁面？

**答：** 建立結構：

```
modules/mymodule/
├── admin/
│   ├── index.php
│   ├── menu.php
│   └── menu_en.php
```

在 xoopsversion.php 中：
```php
<?php
$modversion['hasAdmin'] = 1;
$modversion['adminindex'] = 'admin/index.php';
?>
```

建立 `admin/index.php`：
```php
<?php
require_once XOOPS_ROOT_PATH . '/kernel/admin.php';

xoops_cp_header();
echo "<h1>Module Administration</h1>";
xoops_cp_footer();
?>
```

---

## 效能

### 問：模組很慢，我如何最佳化？

**答：**
1. **檢查資料庫查詢** - 使用查詢記錄
2. **快取資料** - 使用 XOOPS 快取：
```php
<?php
$cache = xoops_cache_handler::getInstance();
$data = $cache->read('mykey');
if ($data === false) {
    $data = expensive_operation();
    $cache->write('mykey', $data, 3600);  // 1 小時
}
?>
```

3. **最佳化樣板** - 避免在樣板中迴圈
4. **啟用 PHP opcode 快取** - APCu、XDebug 等

請參閱效能常見問題解答以取得更多詳細資訊。

---

## 相關文件

- 模組安裝失敗
- 模組結構
- 效能常見問題解答
- 啟用除錯模式

---

#xoops #modules #faq #troubleshooting
