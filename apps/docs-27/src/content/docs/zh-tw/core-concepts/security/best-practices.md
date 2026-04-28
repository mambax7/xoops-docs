---
title: "安全最佳實踐"
description: "XOOPS模組開發的綜合安全指南"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::tip[安全API在各版本中保持穩定]
本文檔中記錄的安全實踐和API在XOOPS 2.5.x和XOOPS 4.0.x中都適用。核心安全類別（`XoopsSecurity`、`MyTextSanitizer`）保持穩定。
:::

本文檔為XOOPS模組開發人員提供了綜合的安全最佳實踐。遵循這些指南將幫助確保您的模組是安全的，不會在XOOPS安裝中引入漏洞。

## 安全原則

每個XOOPS開發人員都應遵循以下基本安全原則：

1. **縱深防禦**：實施多層安全控制
2. **最小權限原則**：僅提供必要的最小存取權
3. **輸入驗證**：永遠不要信任用戶輸入
4. **安全優先**：安全應該是預設配置
5. **簡單明瞭**：複雜的系統更難以保護

## 相關文檔

- CSRF保護 - 標記系統和XoopsSecurity類
- 輸入淨化 - MyTextSanitizer和驗證
- SQL注入預防 - 資料庫安全實踐

## 快速參考清單

在發佈模組前，驗證：

- [ ] 所有表單都包含XOOPS標記
- [ ] 所有用戶輸入都已驗證和淨化
- [ ] 所有輸出都已正確轉義
- [ ] 所有資料庫查詢都使用參數化語句
- [ ] 檔案上傳已驗證
- [ ] 驗證和授權檢查到位
- [ ] 錯誤處理不洩露敏感訊息
- [ ] 敏感配置受保護
- [ ] 第三方庫是最新的
- [ ] 安全測試已執行

## 驗證和授權

### 檢查用戶驗證

```php
// 檢查用戶是否已登錄
if (!is_object($GLOBALS['xoopsUser'])) {
    redirect_header(XOOPS_URL, 3, _NOPERM);
    exit();
}
```

### 檢查用戶權限

```php
// 檢查用戶是否有權訪問該模組
if (!$GLOBALS['xoopsUser']->isAdmin($xoopsModule->mid())) {
    redirect_header(XOOPS_URL, 3, _NOPERM);
    exit();
}

// 檢查特定權限
$moduleHandler = xoops_getHandler('module');
$module = $moduleHandler->getByDirname('mymodule');
$moduleperm_handler = xoops_getHandler('groupperm');
$groups = $GLOBALS['xoopsUser']->getGroups();

if (!$moduleperm_handler->checkRight('mymodule_view', $item_id, $groups, $module->getVar('mid'))) {
    redirect_header(XOOPS_URL, 3, _NOPERM);
    exit();
}
```

### 設定模組權限

```php
// 在安裝/更新函數中建立權限
$gpermHandler = xoops_getHandler('groupperm');
$gpermHandler->deleteByModule($module->getVar('mid'), 'mymodule_view');

// 為所有群組新增權限
$groups = [XOOPS_GROUP_ADMIN, XOOPS_GROUP_USERS, XOOPS_GROUP_ANONYMOUS];
foreach ($groups as $group_id) {
    $gpermHandler->addRight('mymodule_view', 1, $group_id, $module->getVar('mid'));
}
```

## 會話安全

### 會話處理最佳實踐

1. 不要在會話中儲存敏感訊息
2. 登錄/權限變更後重新產生會話ID
3. 使用前驗證會話數據

```php
// 登錄後重新產生會話ID
session_regenerate_id(true);

// 驗證會話數據
if (isset($_SESSION['mymodule_user_id'])) {
    $user_id = (int)$_SESSION['mymodule_user_id'];
    // 驗證用戶存在於資料庫中
}
```

### 防止會話固定

```php
// 成功登錄後
session_regenerate_id(true);
$_SESSION['mymodule_user_ip'] = $_SERVER['REMOTE_ADDR'];

// 在後續請求中
if ($_SESSION['mymodule_user_ip'] !== $_SERVER['REMOTE_ADDR']) {
    // 可能的會話劫持嘗試
    session_destroy();
    redirect_header('index.php', 3, 'Session error');
    exit();
}
```

## 檔案上傳安全

### 驗證檔案上傳

```php
// 檢查檔案是否已正確上傳
if (!isset($_FILES['userfile']) || $_FILES['userfile']['error'] != UPLOAD_ERR_OK) {
    redirect_header('index.php', 3, 'File upload error');
    exit();
}

// 檢查檔案大小
if ($_FILES['userfile']['size'] > 1000000) { // 1MB限制
    redirect_header('index.php', 3, 'File too large');
    exit();
}

// 檢查檔案類型
$allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
if (!in_array($_FILES['userfile']['type'], $allowed_types)) {
    redirect_header('index.php', 3, 'Invalid file type');
    exit();
}

// 驗證檔案副檔名
$filename = $_FILES['userfile']['name'];
$ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
$allowed_extensions = ['jpg', 'jpeg', 'png', 'gif'];
if (!in_array($ext, $allowed_extensions)) {
    redirect_header('index.php', 3, 'Invalid file extension');
    exit();
}
```

### 使用XOOPS上傳器

```php
include_once XOOPS_ROOT_PATH . '/class/uploader.php';

$allowed_mimetypes = ['image/gif', 'image/jpeg', 'image/png'];
$maxsize = 1000000; // 1MB
$maxwidth = 1024;
$maxheight = 768;
$upload_dir = XOOPS_ROOT_PATH . '/uploads/mymodule';

$uploader = new XoopsMediaUploader(
    $upload_dir,
    $allowed_mimetypes,
    $maxsize,
    $maxwidth,
    $maxheight
);

if ($uploader->fetchMedia('userfile')) {
    $uploader->setPrefix('mymodule_');

    if ($uploader->upload()) {
        $filename = $uploader->getSavedFileName();
        // 將檔案名儲存到資料庫
    } else {
        echo $uploader->getErrors();
    }
} else {
    echo $uploader->getErrors();
}
```

### 安全存儲上傳的檔案

```php
// 在Web根目錄外定義上傳目錄
$upload_dir = XOOPS_VAR_PATH . '/uploads/mymodule';

// 如果目錄不存在則建立
if (!is_dir($upload_dir)) {
    mkdir($upload_dir, 0755, true);
}

// 移動上傳的檔案
move_uploaded_file($_FILES['userfile']['tmp_name'], $upload_dir . '/' . $safe_filename);
```

## 錯誤處理和日誌記錄

### 安全的錯誤處理

```php
try {
    $result = someFunction();
    if (!$result) {
        throw new Exception('Operation failed');
    }
} catch (Exception $e) {
    // 記錄錯誤
    xoops_error($e->getMessage());

    // 向用戶顯示通用錯誤訊息
    redirect_header('index.php', 3, 'An error occurred. Please try again later.');
    exit();
}
```

### 記錄安全事件

```php
// 記錄安全事件
xoops_loadLanguage('logger', 'mymodule');
$GLOBALS['xoopsLogger']->addExtra('Security', 'Failed login attempt for user: ' . $username);
```

## 配置安全

### 儲存敏感配置

```php
// 在Web根目錄外定義配置路徑
$config_path = XOOPS_VAR_PATH . '/configs/mymodule/config.php';

// 載入配置
if (file_exists($config_path)) {
    include $config_path;
} else {
    // 處理缺少的配置
}
```

### 保護配置檔案

使用`.htaccess`保護配置檔案：

```apache
# 在.htaccess中
<Files "config.php">
    Order Allow,Deny
    Deny from all
</Files>
```

## 第三方庫

### 選擇庫

1. 選擇積極維護的庫
2. 檢查安全漏洞
3. 驗證庫的授權與XOOPS相容

### 更新庫

```php
// 檢查庫版本
if (version_compare(LIBRARY_VERSION, '1.2.3', '<')) {
    xoops_error('Please update the library to version 1.2.3 or higher');
}
```

### 隔離庫

```php
// 以受控方式載入庫
function loadLibrary($file)
{
    $allowed = ['parser.php', 'formatter.php'];

    if (!in_array($file, $allowed)) {
        return false;
    }

    include_once XOOPS_ROOT_PATH . '/modules/mymodule/libraries/' . $file;
    return true;
}
```

## 安全測試

### 手動測試清單

1. 用無效輸入測試所有表單
2. 嘗試繞過驗證和授權
3. 測試檔案上傳功能，上傳惡意檔案
4. 檢查所有輸出中是否存在XSS漏洞
5. 測試所有資料庫查詢中是否存在SQL注入

### 自動化測試

使用自動化工具掃描漏洞：

1. 靜態程式碼分析工具
2. Web應用程式掃描器
3. 第三方庫的依賴檢查器

## 輸出轉義

### HTML上下文

```php
// 針對常規HTML內容
echo htmlspecialchars($variable, ENT_QUOTES, 'UTF-8');

// 使用MyTextSanitizer
$myts = MyTextSanitizer::getInstance();
echo $myts->htmlSpecialChars($variable);
```

### JavaScript上下文

```php
// 用於JavaScript中的數據
echo json_encode($variable);

// 針對內聯JavaScript
echo 'var data = ' . json_encode($variable) . ';';
```

### URL上下文

```php
// 用於URL中使用的數據
echo htmlspecialchars(urlencode($variable), ENT_QUOTES, 'UTF-8');
```

### 模板變量

```php
// 將變量指派給Smarty模板
$GLOBALS['xoopsTpl']->assign('title', htmlspecialchars($title, ENT_QUOTES, 'UTF-8'));

// 針對應按原樣顯示的HTML內容
$GLOBALS['xoopsTpl']->assign('content', $myts->displayTarea($content, 1, 1, 1, 1, 1));
```

## 資源

- [OWASP前10名](https://owasp.org/www-project-top-ten/)
- [PHP安全速查表](https://cheatsheetseries.owasp.org/cheatsheets/PHP_Configuration_Cheat_Sheet.html)
- [XOOPS文檔](https://xoops.org/)

---

#security #best-practices #xoops #module-development #authentication #authorization
