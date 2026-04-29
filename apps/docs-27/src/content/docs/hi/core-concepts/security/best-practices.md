---
title: "सुरक्षा सर्वोत्तम अभ्यास"
description: "XOOPS मॉड्यूल विकास के लिए व्यापक सुरक्षा मार्गदर्शिका"
---
<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::टिप[सुरक्षा API सभी संस्करणों में स्थिर हैं]
यहां प्रलेखित सुरक्षा प्रथाएं और API XOOPS 2.5.x और XOOPS 4.0.x दोनों में काम करते हैं। मुख्य सुरक्षा वर्ग (`XoopsSecurity`, `MyTextSanitizer`) स्थिर बने हुए हैं।
:::

यह दस्तावेज़ XOOPS मॉड्यूल डेवलपर्स के लिए व्यापक सुरक्षा सर्वोत्तम अभ्यास प्रदान करता है। इन दिशानिर्देशों का पालन करने से यह सुनिश्चित करने में मदद मिलेगी कि आपके मॉड्यूल सुरक्षित हैं और XOOPS इंस्टॉलेशन में कमजोरियां नहीं पेश करते हैं।

## सुरक्षा सिद्धांत

प्रत्येक XOOPS डेवलपर को इन मूलभूत सुरक्षा सिद्धांतों का पालन करना चाहिए:

1. **गहराई से रक्षा**: सुरक्षा नियंत्रण की कई परतें लागू करें
2. **न्यूनतम विशेषाधिकार**: केवल न्यूनतम आवश्यक पहुंच अधिकार प्रदान करें
3. **इनपुट सत्यापन**: उपयोगकर्ता इनपुट पर कभी भरोसा न करें
4. **डिफ़ॉल्ट रूप से सुरक्षित**: सुरक्षा डिफ़ॉल्ट कॉन्फ़िगरेशन होनी चाहिए
5. **इसे सरल रखें**: जटिल प्रणालियों को सुरक्षित करना कठिन होता है

## संबंधित दस्तावेज़ीकरण

- CSRF-संरक्षण - टोकन प्रणाली और XoopsSecurity वर्ग
- इनपुट-स्वच्छता - MyTextSanitizer और सत्यापन
- SQL-इंजेक्शन-रोकथाम - डेटाबेस सुरक्षा प्रथाएँ

## त्वरित संदर्भ चेकलिस्ट

अपना मॉड्यूल जारी करने से पहले, सत्यापित करें:

- [ ] सभी फॉर्मों में XOOPS टोकन शामिल हैं
- [ ] सभी उपयोगकर्ता इनपुट मान्य और स्वच्छ हैं
- [ ] सभी आउटपुट ठीक से बच गए हैं
- [ ] सभी डेटाबेस क्वेरीज़ पैरामीटरयुक्त कथनों का उपयोग करती हैं
- [ ] फ़ाइल अपलोड ठीक से मान्य हैं
- [ ] प्रमाणीकरण और प्राधिकरण जांच मौजूद हैं
- [ ] त्रुटि प्रबंधन से संवेदनशील जानकारी का पता नहीं चलता
- [ ] संवेदनशील कॉन्फ़िगरेशन सुरक्षित है
- [ ] तृतीय-पक्ष लाइब्रेरीज़ अद्यतित हैं
- [ ] सुरक्षा परीक्षण किया गया है

## प्रमाणीकरण और प्राधिकरण

### उपयोगकर्ता प्रमाणीकरण की जाँच करना

```php
// Check if user is logged in
if (!is_object($GLOBALS['xoopsUser'])) {
    redirect_header(XOOPS_URL, 3, _NOPERM);
    exit();
}
```

### उपयोगकर्ता अनुमतियाँ जाँचना

```php
// Check if user has permission to access this module
if (!$GLOBALS['xoopsUser']->isAdmin($xoopsModule->mid())) {
    redirect_header(XOOPS_URL, 3, _NOPERM);
    exit();
}

// Check specific permission
$moduleHandler = xoops_getHandler('module');
$module = $moduleHandler->getByDirname('mymodule');
$moduleperm_handler = xoops_getHandler('groupperm');
$groups = $GLOBALS['xoopsUser']->getGroups();

if (!$moduleperm_handler->checkRight('mymodule_view', $item_id, $groups, $module->getVar('mid'))) {
    redirect_header(XOOPS_URL, 3, _NOPERM);
    exit();
}
```

### मॉड्यूल अनुमतियाँ सेट करना

```php
// Create permission in install/update function
$gpermHandler = xoops_getHandler('groupperm');
$gpermHandler->deleteByModule($module->getVar('mid'), 'mymodule_view');

// Add permission for all groups
$groups = [XOOPS_GROUP_ADMIN, XOOPS_GROUP_USERS, XOOPS_GROUP_ANONYMOUS];
foreach ($groups as $group_id) {
    $gpermHandler->addRight('mymodule_view', 1, $group_id, $module->getVar('mid'));
}
```

## सत्र सुरक्षा

### सत्र संचालन की सर्वोत्तम प्रथाएँ

1. सत्र में संवेदनशील जानकारी संग्रहीत न करें
2. लॉगिन/विशेषाधिकार परिवर्तन के बाद सत्र आईडी पुन: उत्पन्न करें
3. सत्र डेटा का उपयोग करने से पहले उसे सत्यापित करें

```php
// Regenerate session ID after login
session_regenerate_id(true);

// Validate session data
if (isset($_SESSION['mymodule_user_id'])) {
    $user_id = (int)$_SESSION['mymodule_user_id'];
    // Verify user exists in database
}
```

### सत्र निर्धारण को रोकना

```php
// After successful login
session_regenerate_id(true);
$_SESSION['mymodule_user_ip'] = $_SERVER['REMOTE_ADDR'];

// On subsequent requests
if ($_SESSION['mymodule_user_ip'] !== $_SERVER['REMOTE_ADDR']) {
    // Possible session hijacking attempt
    session_destroy();
    redirect_header('index.php', 3, 'Session error');
    exit();
}
```

## फ़ाइल अपलोड सुरक्षा

### फ़ाइल अपलोड को मान्य करना

```php
// Check if file was uploaded properly
if (!isset($_FILES['userfile']) || $_FILES['userfile']['error'] != UPLOAD_ERR_OK) {
    redirect_header('index.php', 3, 'File upload error');
    exit();
}

// Check file size
if ($_FILES['userfile']['size'] > 1000000) { // 1MB limit
    redirect_header('index.php', 3, 'File too large');
    exit();
}

// Check file type
$allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
if (!in_array($_FILES['userfile']['type'], $allowed_types)) {
    redirect_header('index.php', 3, 'Invalid file type');
    exit();
}

// Validate file extension
$filename = $_FILES['userfile']['name'];
$ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
$allowed_extensions = ['jpg', 'jpeg', 'png', 'gif'];
if (!in_array($ext, $allowed_extensions)) {
    redirect_header('index.php', 3, 'Invalid file extension');
    exit();
}
```

### XOOPS अपलोडर का उपयोग करना

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
        // Save filename to database
    } else {
        echo $uploader->getErrors();
    }
} else {
    echo $uploader->getErrors();
}
```

### अपलोड की गई फ़ाइलों को सुरक्षित रूप से संग्रहीत करना

```php
// Define upload directory outside web root
$upload_dir = XOOPS_VAR_PATH . '/uploads/mymodule';

// Create directory if it doesn't exist
if (!is_dir($upload_dir)) {
    mkdir($upload_dir, 0755, true);
}

// Move uploaded file
move_uploaded_file($_FILES['userfile']['tmp_name'], $upload_dir . '/' . $safe_filename);
```

## त्रुटि प्रबंधन और लॉगिंग

### सुरक्षित त्रुटि प्रबंधन

```php
try {
    $result = someFunction();
    if (!$result) {
        throw new Exception('Operation failed');
    }
} catch (Exception $e) {
    // Log the error
    xoops_error($e->getMessage());

    // Display a generic error message to the user
    redirect_header('index.php', 3, 'An error occurred. Please try again later.');
    exit();
}
```

### सुरक्षा ईवेंट लॉग करना

```php
// Log security events
xoops_loadLanguage('logger', 'mymodule');
$GLOBALS['xoopsLogger']->addExtra('Security', 'Failed login attempt for user: ' . $username);
```

## कॉन्फ़िगरेशन सुरक्षा

### संवेदनशील कॉन्फ़िगरेशन संग्रहीत करना

```php
// Define configuration path outside web root
$config_path = XOOPS_VAR_PATH . '/configs/mymodule/config.php';

// Load configuration
if (file_exists($config_path)) {
    include $config_path;
} else {
    // Handle missing configuration
}
```

### कॉन्फ़िगरेशन फ़ाइलों की सुरक्षा करना

कॉन्फ़िगरेशन फ़ाइलों की सुरक्षा के लिए `.htaccess` का उपयोग करें:

```apache
# In .htaccess
<Files "config.php">
    Order Allow,Deny
    Deny from all
</Files>
```

## तृतीय पक्ष पुस्तकालय

### पुस्तकालयों का चयन

1. सक्रिय रूप से संधारित पुस्तकालय चुनें
2. सुरक्षा कमजोरियों की जाँच करें
3. सत्यापित करें कि लाइब्रेरी का लाइसेंस XOOPS के साथ संगत है

### पुस्तकालयों को अद्यतन करना

```php
// Check library version
if (version_compare(LIBRARY_VERSION, '1.2.3', '<')) {
    xoops_error('Please update the library to version 1.2.3 or higher');
}
```

### पुस्तकालयों को अलग करना

```php
// Load library in a controlled way
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

## सुरक्षा परीक्षण

### मैन्युअल परीक्षण चेकलिस्ट

1. अमान्य इनपुट वाले सभी प्रपत्रों का परीक्षण करें
2. प्रमाणीकरण और प्राधिकरण को बायपास करने का प्रयास
3. दुर्भावनापूर्ण फ़ाइलों के साथ फ़ाइल अपलोड कार्यक्षमता का परीक्षण करें
4. सभी आउटपुट में XSS कमजोरियों की जाँच करें
5. सभी डेटाबेस क्वेरीज़ में SQL इंजेक्शन के लिए परीक्षण करें

### स्वचालित परीक्षण

कमजोरियों को स्कैन करने के लिए स्वचालित टूल का उपयोग करें:

1. स्थैतिक कोड विश्लेषण उपकरण
2. वेब एप्लिकेशन स्कैनर
3. तृतीय-पक्ष पुस्तकालयों के लिए निर्भरता चेकर्स

## आउटपुट एस्केपिंग

### HTML प्रसंग

```php
// For regular HTML content
echo htmlspecialchars($variable, ENT_QUOTES, 'UTF-8');

// Using MyTextSanitizer
$myts = MyTextSanitizer::getInstance();
echo $myts->htmlSpecialChars($variable);
```

### JavaScript प्रसंग

```php
// For data used in JavaScript
echo json_encode($variable);

// For inline JavaScript
echo 'var data = ' . json_encode($variable) . ';';
```

### URL प्रसंग

```php
// For data used in URLs
echo htmlspecialchars(urlencode($variable), ENT_QUOTES, 'UTF-8');
```

### टेम्पलेट वेरिएबल्स

```php
// Assign variables to Smarty template
$GLOBALS['xoopsTpl']->assign('title', htmlspecialchars($title, ENT_QUOTES, 'UTF-8'));

// For HTML content that should be displayed as-is
$GLOBALS['xoopsTpl']->assign('content', $myts->displayTarea($content, 1, 1, 1, 1, 1));
```

## संसाधन- [OWASP टॉप टेन](@000019@@)
- [PHP सिक्योरिटी चीट शीट](https://cheatsheetseries.owasp.org/cheatsheets/PHP_Configuration_Cheat_Sheet.html)
- [XOOPS दस्तावेज़ीकरण](@000021@@)

---

#सुरक्षा #सर्वोत्तम अभ्यास #xoops #मॉड्यूल-विकास #प्रमाणीकरण #प्राधिकरण