---
title: "इनपुट स्वच्छता"
description: "MyTextSanitizer और XOOPS में सत्यापन तकनीकों का उपयोग करना"
---
उपयोगकर्ता इनपुट पर कभी भरोसा न करें. उपयोग करने से पहले सभी इनपुट डेटा को हमेशा सत्यापित और स्वच्छ करें। XOOPS टेक्स्ट इनपुट को सैनिटाइज करने के लिए `MyTextSanitizer` क्लास और सत्यापन के लिए विभिन्न सहायक कार्य प्रदान करता है।

## संबंधित दस्तावेज़ीकरण

- सुरक्षा-सर्वोत्तम अभ्यास - व्यापक सुरक्षा मार्गदर्शिका
- CSRF-संरक्षण - टोकन प्रणाली और XoopsSecurity वर्ग
- SQL-इंजेक्शन-रोकथाम - डेटाबेस सुरक्षा प्रथाएँ

## सुनहरा नियम

**उपयोगकर्ता इनपुट पर कभी भरोसा न करें।** बाहरी स्रोतों से प्राप्त सभी डेटा ये होने चाहिए:

1. **मान्य**: जांचें कि यह अपेक्षित प्रारूप और प्रकार से मेल खाता है
2. **स्वच्छता**: संभावित खतरनाक पात्रों को हटाएं या उनसे बचें
3. **एस्केप**: आउटपुट करते समय, विशिष्ट संदर्भ के लिए एस्केप (HTML, JavaScript, SQL)

## MyTextSanitizer कक्षा

XOOPS टेक्स्ट सैनिटाइजेशन के लिए `MyTextSanitizer` क्लास (आमतौर पर `$myts` के रूप में उपनाम) प्रदान करता है।

### उदाहरण प्राप्त करना

```php
// Get the singleton instance
$myts = MyTextSanitizer::getInstance();
```

### बुनियादी पाठ स्वच्छता

```php
$myts = MyTextSanitizer::getInstance();

// For plain text fields (no HTML allowed)
$title = $myts->htmlSpecialChars($_POST['title']);

// This converts:
// < to &lt;
// > to &gt;
// & to &amp;
// " to &quot;
// ' to &#039;
```

### टेक्स्टएरिया सामग्री प्रसंस्करण

`displayTarea()` विधि व्यापक टेक्स्टएरिया प्रोसेसिंग प्रदान करती है:

```php
$myts = MyTextSanitizer::getInstance();

$content = $myts->displayTarea(
    $_POST['content'],
    $allowhtml = 0,      // 0 = No HTML allowed, 1 = HTML allowed
    $allowsmiley = 1,    // 1 = Smilies enabled
    $allowxcode = 1,     // 1 = XOOPS codes enabled (BBCode)
    $allowimages = 1,    // 1 = Images allowed
    $allowlinebreak = 1  // 1 = Line breaks converted to <br>
);
```

### सामान्य स्वच्छता विधियाँ

```php
$myts = MyTextSanitizer::getInstance();

// HTML special characters escaping
$safe_text = $myts->htmlSpecialChars($text);

// Strip slashes if magic quotes are on
$text = $myts->stripSlashesGPC($text);

// Convert XOOPS codes (BBCode) to HTML
$html = $myts->xoopsCodeDecode($text);

// Convert smileys to images
$html = $myts->smiley($text);

// Make clickable links
$html = $myts->makeClickable($text);

// Complete text processing for preview
$preview = $myts->previewTarea($text, $allowhtml, $allowsmiley, $allowxcode);
```

## इनपुट सत्यापन

### पूर्णांक मान मान्य करना

```php
// Validate integer ID
$id = isset($_REQUEST['id']) ? (int)$_REQUEST['id'] : 0;

if ($id <= 0) {
    redirect_header('index.php', 3, 'Invalid ID');
    exit();
}

// Alternative with filter_var
$id = filter_var($_REQUEST['id'] ?? 0, FILTER_VALIDATE_INT);
if ($id === false || $id <= 0) {
    redirect_header('index.php', 3, 'Invalid ID');
    exit();
}
```

### ईमेल पते को मान्य करना

```php
$email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);

if (!$email) {
    redirect_header('form.php', 3, 'Invalid email address');
    exit();
}
```

### URL मान्य किया जा रहा है

```php
$url = filter_var($_POST['url'], FILTER_VALIDATE_URL);

if (!$url) {
    redirect_header('form.php', 3, 'Invalid URL');
    exit();
}

// Additional check for allowed protocols
$parsed = parse_url($url);
$allowed_schemes = ['http', 'https'];
if (!in_array($parsed['scheme'], $allowed_schemes)) {
    redirect_header('form.php', 3, 'Only HTTP and HTTPS URLs are allowed');
    exit();
}
```

### मान्य तिथियाँ

```php
$date = $_POST['date'] ?? '';

// Validate date format (YYYY-MM-DD)
if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
    redirect_header('form.php', 3, 'Invalid date format');
    exit();
}

// Validate actual date validity
$parts = explode('-', $date);
if (!checkdate($parts[1], $parts[2], $parts[0])) {
    redirect_header('form.php', 3, 'Invalid date');
    exit();
}
```

### फ़ाइल नाम मान्य करना

```php
// Remove all characters except alphanumeric, underscore, and hyphen
$filename = preg_replace('/[^a-zA-Z0-9_-]/', '', $_POST['filename']);

// Or use a whitelist approach
$allowed_chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-';
$filename = '';
foreach (str_split($_POST['filename']) as $char) {
    if (strpos($allowed_chars, $char) !== false) {
        $filename .= $char;
    }
}
```

## विभिन्न इनपुट प्रकारों को संभालना

### स्ट्रिंग इनपुट

```php
$myts = MyTextSanitizer::getInstance();

// Short text (titles, names)
$title = $myts->htmlSpecialChars(trim($_POST['title']));

// Limit length
if (strlen($title) > 255) {
    $title = substr($title, 0, 255);
}

// Check for empty required fields
if (empty($title)) {
    redirect_header('form.php', 3, 'Title is required');
    exit();
}
```

### संख्यात्मक इनपुट

```php
// Integer
$count = (int)$_POST['count'];
$count = max(0, min($count, 1000)); // Ensure range 0-1000

// Float
$price = (float)$_POST['price'];
$price = round($price, 2); // Round to 2 decimal places

// Validate range
if ($price < 0 || $price > 99999.99) {
    redirect_header('form.php', 3, 'Invalid price');
    exit();
}
```

### बूलियन इनपुट

```php
// Checkbox values
$is_active = isset($_POST['is_active']) ? 1 : 0;

// Or with explicit value check
$is_active = ($_POST['is_active'] ?? '') === '1' ? 1 : 0;
```

### ऐरे इनपुट

```php
// Validate array input (e.g., multiple checkboxes)
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

### चयन/विकल्प इनपुट

```php
// Validate against allowed values
$allowed_statuses = ['draft', 'published', 'archived'];
$status = $_POST['status'] ?? '';

if (!in_array($status, $allowed_statuses)) {
    redirect_header('form.php', 3, 'Invalid status');
    exit();
}
```

## अनुरोध वस्तु (XMF)

XMF का उपयोग करते समय, अनुरोध वर्ग क्लीनर इनपुट हैंडलिंग प्रदान करता है:

```php
use Xmf\Request;

// Get integer
$id = Request::getInt('id', 0);

// Get string
$title = Request::getString('title', '');

// Get array
$ids = Request::getArray('ids', []);

// Get with method specification
$id = Request::getInt('id', 0, 'POST');
$search = Request::getString('q', '', 'GET');

// Check request method
if (Request::getMethod() !== 'POST') {
    redirect_header('form.php', 3, 'Invalid request method');
    exit();
}
```

## एक वैलिडेशन क्लास बनाना

जटिल रूपों के लिए, एक समर्पित सत्यापन वर्ग बनाएं:

```php
<?php
namespace XoopsModules\MyModule;

class Validator
{
    private $errors = [];

    public function validateItem(array $data): bool
    {
        $this->errors = [];

        // Title validation
        if (empty($data['title'])) {
            $this->errors['title'] = 'Title is required';
        } elseif (strlen($data['title']) > 255) {
            $this->errors['title'] = 'Title must be 255 characters or less';
        }

        // Email validation
        if (!empty($data['email'])) {
            if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
                $this->errors['email'] = 'Invalid email format';
            }
        }

        // Status validation
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

उपयोग:

```php
$validator = new Validator();
$data = [
    'title' => $_POST['title'],
    'email' => $_POST['email'],
    'status' => $_POST['status'],
];

if (!$validator->validateItem($data)) {
    $errors = $validator->getErrors();
    // Display errors to user
}
```

## डेटाबेस भंडारण के लिए स्वच्छता

डेटाबेस में डेटा संग्रहीत करते समय:

```php
$myts = MyTextSanitizer::getInstance();

// For storage (will be processed again on display)
$title = $myts->addSlashes($_POST['title']);

// Better: Use prepared statements (see SQL Injection Prevention)
$sql = "INSERT INTO " . $xoopsDB->prefix('mytable') . " (title) VALUES (?)";
$result = $xoopsDB->query($sql, [$_POST['title']]);
```

## प्रदर्शन के लिए स्वच्छता

अलग-अलग संदर्भों में अलग-अलग भागने की आवश्यकता होती है:

```php
$myts = MyTextSanitizer::getInstance();

// HTML context
echo $myts->htmlSpecialChars($title);

// Within HTML attributes
echo htmlspecialchars($title, ENT_QUOTES, 'UTF-8');

// JavaScript context
echo json_encode($title);

// URL parameter
echo urlencode($title);

// Full URL
echo htmlspecialchars($url, ENT_QUOTES, 'UTF-8');
```

## सामान्य ख़तरे

### डबल एन्कोडिंग

**समस्या**: डेटा कई बार एन्कोड किया जाता है

```php
// Wrong - double encoding
$title = $myts->htmlSpecialChars($myts->htmlSpecialChars($_POST['title']));

// Right - encode once, at the appropriate time
$title = $_POST['title']; // Store raw
echo $myts->htmlSpecialChars($title); // Encode on output
```

### असंगत एन्कोडिंग

**समस्या**: कुछ आउटपुट एन्कोडेड हैं, कुछ नहीं

**समाधान**: हमेशा एक सुसंगत दृष्टिकोण का उपयोग करें, अधिमानतः आउटपुट पर एन्कोडिंग:

```php
// Template assignment
$GLOBALS['xoopsTpl']->assign('title', htmlspecialchars($title, ENT_QUOTES, 'UTF-8'));
```

### सत्यापन गुम है

**समस्या**: सत्यापन किए बिना केवल सैनिटाइज़ करना

**समाधान**: हमेशा पहले पुष्टि करें, फिर साफ़ करें:

```php
// First validate
if (!preg_match('/^[a-z0-9_]+$/', $_POST['username'])) {
    redirect_header('form.php', 3, 'Username contains invalid characters');
    exit();
}

// Then sanitize for storage/display
$username = $myts->htmlSpecialChars($_POST['username']);
```

## सर्वोत्तम प्रथाओं का सारांश

1. **पाठ सामग्री प्रसंस्करण के लिए MyTextSanitizer** का उपयोग करें
2. **विशिष्ट प्रारूप सत्यापन के लिए filter_var()** का उपयोग करें
3. संख्यात्मक मानों के लिए **टाइप कास्टिंग** का उपयोग करें
4. चुनिंदा इनपुट के लिए **श्वेतसूची अनुमत मान**
5. **सैनिटाइज़ करने से पहले सत्यापित करें**
6. **आउटपुट पर पलायन**, इनपुट पर नहीं
7. डेटाबेस प्रश्नों के लिए **तैयार कथनों का उपयोग करें**
8. **जटिल रूपों के लिए सत्यापन कक्षाएं बनाएं**
9. **क्लाइंट-साइड सत्यापन पर कभी भरोसा न करें** - हमेशा सर्वर-साइड को मान्य करें

---

#सुरक्षा #स्वच्छता #सत्यापन #xoops #MyTextSanitizer #इनपुट-हैंडलिंग