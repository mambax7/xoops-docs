---
title: "CSRF保護"
description: "在XOOPS中理解和實施CSRF保護，使用XoopsSecurity類"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

跨站要求偽造(CSRF)攻擊會欺騙使用者在其已驗證的網站上執行不想要的操作。XOOPS透過`XoopsSecurity`類別提供內置的CSRF保護。

## 相關文檔

- 安全最佳實踐 - 綜合安全指南
- 輸入淨化 - MyTextSanitizer和驗證
- SQL注入預防 - 資料庫安全實踐

## 理解CSRF攻擊

CSRF攻擊發生在以下情況：

1. 用戶在您的XOOPS網站上已驗證
2. 用戶訪問惡意網站
3. 惡意網站使用用戶的會話向您的XOOPS網站提交要求
4. 您的網站將該要求視為來自合法用戶的要求進行處理

## XoopsSecurity類別

XOOPS提供了`XoopsSecurity`類別來防止CSRF攻擊。該類別管理必須包含在表單中且在處理請求時驗證的安全標記。

### 標記產生

安全類別產生了必須儲存在用戶會話中並包含在表單中的唯一標記：

```php
$security = new XoopsSecurity();

// 取得標記HTML輸入欄位
$tokenHTML = $security->getTokenHTML();

// 僅取得標記值
$tokenValue = $security->createToken();
```

### 標記驗證

處理表單提交時，驗證標記是否有效：

```php
$security = new XoopsSecurity();

if (!$security->check()) {
    redirect_header('index.php', 3, _MD_TOKENEXPIRED);
    exit();
}
```

## 使用XOOPS標記系統

### 使用XoopsForm類別

使用XOOPS表單類別時，標記保護很簡單：

```php
// 建立表單
$form = new XoopsThemeForm('Add Item', 'form_name', 'submit.php');

// 新增表單元素
$form->addElement(new XoopsFormText('Title', 'title', 50, 255, ''));
$form->addElement(new XoopsFormTextArea('Content', 'content', ''));

// 新增隱藏標記欄位 - 務必包含此項
$form->addElement(new XoopsFormHiddenToken());

// 新增提交按鈕
$form->addElement(new XoopsFormButton('', 'submit', _SUBMIT, 'submit'));
```

### 使用自訂表單

對於不使用XoopsForm的自訂HTML表單：

```php
// 在表單範本或PHP檔案中
$security = new XoopsSecurity();
?>
<form method="post" action="submit.php">
    <input type="text" name="title" />
    <textarea name="content"></textarea>

    <!-- 包含標記 -->
    <?php echo $security->getTokenHTML(); ?>

    <button type="submit">Submit</button>
</form>
```

### 在Smarty範本中

在Smarty範本中產生表單時：

```php
// 在PHP檔案中
$security = new XoopsSecurity();
$GLOBALS['xoopsTpl']->assign('token', $security->getTokenHTML());
```

```smarty
{* 在範本中 *}
<form method="post" action="submit.php">
    <input type="text" name="title" />
    <textarea name="content"></textarea>

    {* 包含標記 *}
    <{$token}>

    <button type="submit">Submit</button>
</form>
```

## 處理表單提交

### 基本標記驗證

```php
// 在表單處理指令稿中
$security = new XoopsSecurity();

// 驗證標記
if (!$security->check()) {
    redirect_header('index.php', 3, _MD_TOKENEXPIRED);
    exit();
}

// 標記有效，處理表單
$title = $_POST['title'];
// ... 繼續處理
```

### 使用自訂錯誤處理

```php
$security = new XoopsSecurity();

if (!$security->check()) {
    // 取得詳細的錯誤訊息
    $errors = $security->getErrors();

    // 記錄錯誤
    error_log('CSRF token validation failed: ' . implode(', ', $errors));

    // 重新導向並顯示錯誤訊息
    redirect_header('form.php', 3, 'Security token expired. Please try again.');
    exit();
}
```

### 針對AJAX請求

使用AJAX請求時，在請求中包含標記：

```javascript
// JavaScript - 從隱藏欄位取得標記
var token = document.querySelector('input[name="XOOPS_TOKEN_REQUEST"]').value;

// 包含在AJAX請求中
fetch('ajax_handler.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'action=save&XOOPS_TOKEN_REQUEST=' + encodeURIComponent(token)
});
```

```php
// PHP AJAX處理器
$security = new XoopsSecurity();

if (!$security->check()) {
    echo json_encode(['error' => 'Invalid security token']);
    exit();
}

// 處理AJAX請求
```

## 檢查HTTP Referer

為了額外保護，特別是針對AJAX請求，您也可以檢查HTTP referer：

```php
$security = new XoopsSecurity();

// 檢查referer標題
if (!$security->checkReferer()) {
    echo json_encode(['error' => 'Invalid request']);
    exit();
}

// 同時驗證標記
if (!$security->check()) {
    echo json_encode(['error' => 'Invalid token']);
    exit();
}
```

### 合併的安全檢查

```php
$security = new XoopsSecurity();

// 執行兩個檢查
if (!$security->checkReferer() || !$security->check()) {
    redirect_header('index.php', 3, 'Security validation failed');
    exit();
}
```

## 標記配置

### 標記生命周期

標記的生命周期有限，以防止重放攻擊。您可以在XOOPS設定中配置此項或優雅地處理過期的標記：

```php
$security = new XoopsSecurity();

if (!$security->check()) {
    // 標記可能已過期
    // 使用新標記重新產生表單
    redirect_header('form.php', 3, 'Your session has expired. Please submit the form again.');
    exit();
}
```

### 同一頁面上的多個表單

在同一頁面上有多個表單時，每個表單應有自己的標記：

```php
// 表單1
$form1 = new XoopsThemeForm('Form 1', 'form1', 'submit1.php');
$form1->addElement(new XoopsFormHiddenToken('token1'));

// 表單2
$form2 = new XoopsThemeForm('Form 2', 'form2', 'submit2.php');
$form2->addElement(new XoopsFormHiddenToken('token2'));
```

## 最佳實踐

### 為狀態改變操作始終使用標記

在以下任何表單中包含標記：

- 建立數據
- 更新數據
- 刪除數據
- 更改用戶設定
- 執行任何管理操作

### 不要單獨依賴Referer檢查

HTTP referer標題可以：

- 被隱私工具刪除
- 在某些瀏覽器中遺失
- 在某些情況下被偽造

始終使用標記驗證作為主要防禦。

### 適當地重新產生標記

考慮在以下情況下重新產生標記：

- 成功提交表單後
- 登錄/登出後
- 在長會話中定期

### 優雅地處理標記過期

```php
$security = new XoopsSecurity();

if (!$security->check()) {
    // 臨時儲存表單數據
    $_SESSION['form_backup'] = $_POST;

    // 重新導向回表單並顯示訊息
    redirect_header('form.php?restore=1', 3, 'Please resubmit the form.');
    exit();
}
```

## 常見問題和解決方案

### 標記找不到錯誤

**問題**：安全檢查失敗，顯示「找不到標記」

**解決方案**：確保標記欄位包含在表單中：

```php
$form->addElement(new XoopsFormHiddenToken());
```

### 標記過期錯誤

**問題**：使用者在填寫較長的表單後看到「標記已過期」

**解決方案**：考慮使用JavaScript定期刷新標記：

```javascript
// 每10分鐘刷新一次標記
setInterval(function() {
    fetch('refresh_token.php')
        .then(response => response.json())
        .then(data => {
            document.querySelector('input[name="XOOPS_TOKEN_REQUEST"]').value = data.token;
        });
}, 600000);
```

### AJAX標記問題

**問題**：AJAX請求失敗標記驗證

**解決方案**：確保標記隨每個AJAX請求傳遞並在伺服器端驗證：

```php
// AJAX處理器
header('Content-Type: application/json');

$security = new XoopsSecurity();
if (!$security->check(true, false)) { // 不要為AJAX清除標記
    http_response_code(403);
    echo json_encode(['error' => 'Invalid token']);
    exit();
}
```

## 範例：完整的表單實施

```php
<?php
// form.php
require_once dirname(__DIR__) . '/mainfile.php';

$security = new XoopsSecurity();

// 處理表單提交
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!$security->check()) {
        redirect_header('form.php', 3, 'Security token expired. Please try again.');
        exit();
    }

    // 處理有效的提交
    $title = $myts->htmlSpecialChars($_POST['title']);
    // ... 儲存到資料庫

    redirect_header('success.php', 3, 'Item saved successfully!');
    exit();
}

// 顯示表單
$GLOBALS['xoopsOption']['template_main'] = 'mymodule_form.tpl';
include XOOPS_ROOT_PATH . '/header.php';

$form = new XoopsThemeForm('Add Item', 'add_item', 'form.php');
$form->addElement(new XoopsFormText('Title', 'title', 50, 255, ''));
$form->addElement(new XoopsFormTextArea('Content', 'content', ''));
$form->addElement(new XoopsFormHiddenToken());
$form->addElement(new XoopsFormButton('', 'submit', _SUBMIT, 'submit'));

$GLOBALS['xoopsTpl']->assign('form', $form->render());

include XOOPS_ROOT_PATH . '/footer.php';
```

---

#security #csrf #xoops #forms #tokens #XoopsSecurity
