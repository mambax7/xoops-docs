---
title: "輸入淨化"
description: "在XOOPS中使用MyTextSanitizer和驗證技術"
---

永遠不要信任用戶輸入。使用前始終驗證和淨化所有輸入數據。XOOPS提供了`MyTextSanitizer`類別用於淨化文本輸入和各種驗證幫助函數。

## 相關文檔

- 安全最佳實踐 - 綜合安全指南
- CSRF保護 - 標記系統和XoopsSecurity類
- SQL注入預防 - 資料庫安全實踐

## 黃金規則

**永遠不要信任用戶輸入。**所有來自外部來源的數據必須是：

1. **驗證**：檢查其是否符合預期的格式和類型
2. **淨化**：移除或轉義可能危險的字符
3. **轉義**：輸出時，根據特定上下文(HTML、JavaScript、SQL)進行轉義

## MyTextSanitizer類別

XOOPS提供了`MyTextSanitizer`類別(通常別名為`$myts`)用於文本淨化。

### 取得實例

```php
// 取得單一實例
$myts = MyTextSanitizer::getInstance();
```

### 基本文本淨化

```php
$myts = MyTextSanitizer::getInstance();

// 針對純文本欄位(不允許HTML)
$title = $myts->htmlSpecialChars($_POST['title']);

// 這會轉換：
// < 至 &lt;
// > 至 &gt;
// & 至 &amp;
// " 至 &quot;
// ' 至 &#039;
```

### Textarea內容處理

`displayTarea()`方法提供了全面的textarea處理：

```php
$myts = MyTextSanitizer::getInstance();

$content = $myts->displayTarea(
    $_POST['content'],
    $allowhtml = 0,      // 0 = 不允許HTML，1 = 允許HTML
    $allowsmiley = 1,    // 1 = 啟用表情符號
    $allowxcode = 1,     // 1 = 啟用XOOPS代碼(BBCode)
    $allowimages = 1,    // 1 = 允許圖像
    $allowlinebreak = 1  // 1 = 將換行符轉換為<br>
);
```

### 常見淨化方法

```php
$myts = MyTextSanitizer::getInstance();

// HTML特殊字符轉義
$safe_text = $myts->htmlSpecialChars($text);

// 在magic quotes開啟時移除斜杠
$text = $myts->stripSlashesGPC($text);

// 將XOOPS代碼(BBCode)轉換為HTML
$html = $myts->xoopsCodeDecode($text);

// 將表情符號轉換為圖像
$html = $myts->smiley($text);

// 將連結轉換為可點擊的連結
$html = $myts->makeClickable($text);

// 預覽的完整文本處理
$preview = $myts->previewTarea($text, $allowhtml, $allowsmiley, $allowxcode);
```

## 輸入驗證

### 驗證整數值

```php
// 驗證整數ID
$id = isset($_REQUEST['id']) ? (int)$_REQUEST['id'] : 0;

if ($id <= 0) {
    redirect_header('index.php', 3, 'Invalid ID');
    exit();
}

// 使用filter_var的替代方案
$id = filter_var($_REQUEST['id'] ?? 0, FILTER_VALIDATE_INT);
if ($id === false || $id <= 0) {
    redirect_header('index.php', 3, 'Invalid ID');
    exit();
}
```

### 驗證電子郵件地址

```php
$email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);

if (!$email) {
    redirect_header('form.php', 3, 'Invalid email address');
    exit();
}
```

### 驗證URL

```php
$url = filter_var($_POST['url'], FILTER_VALIDATE_URL);

if (!$url) {
    redirect_header('form.php', 3, 'Invalid URL');
    exit();
}

// 檢查允許的協議
$parsed = parse_url($url);
$allowed_schemes = ['http', 'https'];
if (!in_array($parsed['scheme'], $allowed_schemes)) {
    redirect_header('form.php', 3, 'Only HTTP and HTTPS URLs are allowed');
    exit();
}
```

### 驗證日期

```php
$date = $_POST['date'] ?? '';

// 驗證日期格式(YYYY-MM-DD)
if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
    redirect_header('form.php', 3, 'Invalid date format');
    exit();
}

// 驗證實際日期有效性
$parts = explode('-', $date);
if (!checkdate($parts[1], $parts[2], $parts[0])) {
    redirect_header('form.php', 3, 'Invalid date');
    exit();
}
```

### 驗證檔案名稱

```php
// 移除除英數字、底線和連字號以外的所有字符
$filename = preg_replace('/[^a-zA-Z0-9_-]/', '', $_POST['filename']);

// 或使用白名單方法
$allowed_chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-';
$filename = '';
foreach (str_split($_POST['filename']) as $char) {
    if (strpos($allowed_chars, $char) !== false) {
        $filename .= $char;
    }
}
```

## 處理不同的輸入類型

### 字符串輸入

```php
$myts = MyTextSanitizer::getInstance();

// 短文本(標題、名稱)
$title = $myts->htmlSpecialChars(trim($_POST['title']));

// 限制長度
if (strlen($title) > 255) {
    $title = substr($title, 0, 255);
}

// 檢查空的必填欄位
if (empty($title)) {
    redirect_header('form.php', 3, 'Title is required');
    exit();
}
```

### 數字輸入

```php
// 整數
$count = (int)$_POST['count'];
$count = max(0, min($count, 1000)); // 確保範圍0-1000

// 浮點數
$price = (float)$_POST['price'];
$price = round($price, 2); // 四捨五入到2位小數

// 驗證範圍
if ($price < 0 || $price > 99999.99) {
    redirect_header('form.php', 3, 'Invalid price');
    exit();
}
```

### 布林輸入

```php
// 複選框值
$is_active = isset($_POST['is_active']) ? 1 : 0;

// 或使用明確的值檢查
$is_active = ($_POST['is_active'] ?? '') === '1' ? 1 : 0;
```

### 數組輸入

```php
// 驗證數組輸入(例如，多個複選框)
$selected_ids = [];
if (isset($_POST['ids']) && is_array($_POST['ids'])) {
    foreach ($_POST['ids'] as $id) {
        $clean_id = (int)$id;
        if ($clean_id > 0) {
            $selected_ids[] = $clean_id;
        }
    }
}
```

### 選擇/選項輸入

```php
// 根據允許的值驗證
$allowed_statuses = ['draft', 'published', 'archived'];
$status = $_POST['status'] ?? '';

if (!in_array($status, $allowed_statuses)) {
    redirect_header('form.php', 3, 'Invalid status');
    exit();
}
```

## Request對象(XMF)

使用XMF時，Request類提供了更清潔的輸入處理：

```php
use Xmf\Request;

// 取得整數
$id = Request::getInt('id', 0);

// 取得字符串
$title = Request::getString('title', '');

// 取得數組
$ids = Request::getArray('ids', []);

// 使用方法規範
$id = Request::getInt('id', 0, 'POST');
$search = Request::getString('q', '', 'GET');

// 檢查請求方法
if (Request::getMethod() !== 'POST') {
    redirect_header('form.php', 3, 'Invalid request method');
    exit();
}
```

## 建立驗證類

對於複雜的表單，建立一個專用的驗證類：

```php
<?php
namespace XoopsModules\MyModule;

class Validator
{
    private $errors = [];

    public function validateItem(array $data): bool
    {
        $this->errors = [];

        // 標題驗證
        if (empty($data['title'])) {
            $this->errors['title'] = 'Title is required';
        } elseif (strlen($data['title']) > 255) {
            $this->errors['title'] = 'Title must be 255 characters or less';
        }

        // 電子郵件驗證
        if (!empty($data['email'])) {
            if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
                $this->errors['email'] = 'Invalid email format';
            }
        }

        // 狀態驗證
        $allowed = ['draft', 'published'];
        if (!in_array($data['status'], $allowed)) {
            $this->errors['status'] = 'Invalid status';
        }

        return empty($this->errors);
    }

    public function getErrors(): array
    {
        return $this->errors;
    }

    public function getError(string $field): ?string
    {
        return $this->errors[$field] ?? null;
    }
}
```

用法：

```php
$validator = new Validator();
$data = [
    'title' => $_POST['title'],
    'email' => $_POST['email'],
    'status' => $_POST['status'],
];

if (!$validator->validateItem($data)) {
    $errors = $validator->getErrors();
    // 向用戶顯示錯誤
}
```

## 淨化以存儲在資料庫中

在資料庫中儲存數據時：

```php
$myts = MyTextSanitizer::getInstance();

// 用於儲存(在顯示時將再次處理)
$title = $myts->addSlashes($_POST['title']);

// 更好：使用參數化語句(見SQL注入預防)
$sql = "INSERT INTO " . $xoopsDB->prefix('mytable') . " (title) VALUES (?)";
$result = $xoopsDB->query($sql, [$_POST['title']]);
```

## 淨化以供顯示

不同的上下文需要不同的轉義：

```php
$myts = MyTextSanitizer::getInstance();

// HTML上下文
echo $myts->htmlSpecialChars($title);

// 在HTML屬性中
echo htmlspecialchars($title, ENT_QUOTES, 'UTF-8');

// JavaScript上下文
echo json_encode($title);

// URL參數
echo urlencode($title);

// 完整URL
echo htmlspecialchars($url, ENT_QUOTES, 'UTF-8');
```

## 常見陷阱

### 雙重編碼

**問題**：數據被編碼多次

```php
// 不好 - 雙重編碼
$title = $myts->htmlSpecialChars($myts->htmlSpecialChars($_POST['title']));

// 正確 - 在適當的時間編碼一次
$title = $_POST['title']; // 儲存原始數據
echo $myts->htmlSpecialChars($title); // 輸出時編碼
```

### 不一致的編碼

**問題**：某些輸出已編碼，某些則沒有

**解決方案**：始終使用一致的方法，最好在輸出時進行編碼：

```php
// 範本指派
$GLOBALS['xoopsTpl']->assign('title', htmlspecialchars($title, ENT_QUOTES, 'UTF-8'));
```

### 遺漏驗證

**問題**：只淨化而不驗證

**解決方案**：始終先驗證，然後淨化：

```php
// 首先驗證
if (!preg_match('/^[a-z0-9_]+$/', $_POST['username'])) {
    redirect_header('form.php', 3, 'Username contains invalid characters');
    exit();
}

// 然後淨化以供儲存/顯示
$username = $myts->htmlSpecialChars($_POST['username']);
```

## 最佳實踐摘要

1. **使用MyTextSanitizer**進行文本內容處理
2. **使用filter_var()**進行特定格式驗證
3. **使用類型轉換**針對數值
4. **白名單允許的值**對於選擇輸入
5. **在淨化前驗證**
6. **在輸出時轉義**，不要在輸入時
7. **使用參數化語句**用於資料庫查詢
8. **建立驗證類**對於複雜表單
9. **永遠不要信任客戶端驗證** - 始終在伺服器端驗證
10. **使用XMF Request對象**用於乾淨的輸入處理

---

#security #sanitization #validation #xoops #MyTextSanitizer #input-handling
