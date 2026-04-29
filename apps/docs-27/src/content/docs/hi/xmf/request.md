---
title: "XMF अनुरोध"
description: 'Xmf\Request वर्ग के साथ सुरक्षित HTTP अनुरोध प्रबंधन और इनपुट सत्यापन'
---
`Xmf\Request` वर्ग अंतर्निहित स्वच्छता और प्रकार रूपांतरण के साथ HTTP अनुरोध चर तक नियंत्रित पहुंच प्रदान करता है। यह निर्दिष्ट प्रकारों के अनुरूप इनपुट करते समय डिफ़ॉल्ट रूप से संभावित हानिकारक इंजेक्शनों से बचाता है।

## अवलोकन

अनुरोध प्रबंधन वेब विकास के सबसे सुरक्षा-महत्वपूर्ण पहलुओं में से एक है। XMF अनुरोध वर्ग:

- XSS हमलों को रोकने के लिए इनपुट को स्वचालित रूप से सैनिटाइज़ करता है
- सामान्य डेटा प्रकारों के लिए टाइप-सुरक्षित एक्सेसर्स प्रदान करता है
- एकाधिक अनुरोध स्रोतों का समर्थन करता है (GET, POST, COOKIE, आदि)
- लगातार डिफ़ॉल्ट मान प्रबंधन प्रदान करता है

## बुनियादी उपयोग

```php
use Xmf\Request;

// Get string input
$name = Request::getString('name', '');

// Get integer input
$id = Request::getInt('id', 0);

// Get from specific source
$postData = Request::getString('data', '', 'POST');
```

## अनुरोध के तरीके

### getMethod()

वर्तमान अनुरोध के लिए HTTP अनुरोध विधि लौटाता है।

```php
$method = Request::getMethod();
// Returns: 'GET', 'HEAD', 'POST', or 'PUT'
```

### getVar($name, $default, $hash, $type, $mask)

वह मुख्य विधि जिसे अधिकांश अन्य `get*()` विधियाँ लागू करती हैं। अनुरोध डेटा से नामित वैरिएबल लाता है और लौटाता है।

**पैरामीटर:**
- `$name` - लाने के लिए परिवर्तनीय नाम
- `$default` - यदि वेरिएबल मौजूद नहीं है तो डिफ़ॉल्ट मान
- `$hash` - स्रोत हैश: GET, POST, FILES, COOKIE, ENV, SERVER, METHOD, या REQUEST (डिफ़ॉल्ट)
- `$type` - सफाई के लिए डेटा प्रकार (नीचे FilterInput प्रकार देखें)
- `$mask` - सफाई विकल्पों के लिए बिटमास्क

**मास्क मूल्य:**

| मास्क लगातार | प्रभाव |
|----------------------|--------|
| `MASK_NO_TRIM` | अग्रणी/अनुगामी रिक्त स्थान को ट्रिम न करें |
| `MASK_ALLOW_RAW` | सफाई छोड़ें, कच्चे इनपुट की अनुमति दें |
| `MASK_ALLOW_HTML` | HTML मार्कअप | के सीमित "सुरक्षित" सेट की अनुमति दें

```php
// Get raw input without cleaning
$rawHtml = Request::getVar('content', '', 'POST', 'STRING', Request::MASK_ALLOW_RAW);

// Allow safe HTML
$content = Request::getVar('body', '', 'POST', 'STRING', Request::MASK_ALLOW_HTML);
```

## प्रकार-विशिष्ट विधियाँ

### getInt($name, $default, $hash)

एक पूर्णांक मान लौटाता है. केवल अंकों की अनुमति है.

```php
$id = Request::getInt('id', 0);
$page = Request::getInt('page', 1, 'GET');
```

### getFloat($name, $default, $hash)

फ़्लोट मान लौटाता है. केवल अंकों और अवधियों की अनुमति है।

```php
$price = Request::getFloat('price', 0.0);
$rate = Request::getFloat('rate', 1.0, 'POST');
```

### getBool($name, $default, $hash)

एक बूलियन मान लौटाता है.

```php
$enabled = Request::getBool('enabled', false);
$subscribe = Request::getBool('subscribe', false, 'POST');
```

### getWord($name, $default, $hash)

केवल अक्षरों वाली एक स्ट्रिंग लौटाता है और `[A-Za-z_]` को अंडरस्कोर करता है।

```php
$action = Request::getWord('action', 'view');
```

### getCmd($name, $default, $hash)

केवल `[A-Za-z0-9.-_]` के साथ एक कमांड स्ट्रिंग लौटाता है, जिसे लोअरकेस में मजबूर किया जाता है।

```php
$op = Request::getCmd('op', 'list');
// Input "View_Item" becomes "view_item"
```

### getString($name, $default, $hash, $mask)

खराब HTML कोड को हटाकर साफ की गई स्ट्रिंग लौटाता है (जब तक कि मास्क द्वारा इसे ओवरराइड न किया गया हो)।

```php
$title = Request::getString('title', '');
$description = Request::getString('description', '', 'POST');

// Allow some HTML
$content = Request::getString('content', '', 'POST', Request::MASK_ALLOW_HTML);
```

### getArray($name, $default, $hash)

XSS और खराब कोड को हटाने के लिए पुनरावर्ती रूप से संसाधित एक सरणी लौटाता है।

```php
$items = Request::getArray('items', [], 'POST');
$selectedIds = Request::getArray('selected', []);
```

### getText($name, $default, $hash)

सफाई के बिना कच्चा पाठ लौटाता है। सावधानी के साथ प्रयोग करें.

```php
$rawContent = Request::getText('raw_content', '');
```

### getUrl($name, $default, $hash)

एक मान्य वेब URL (केवल सापेक्ष, http, या https योजनाएं) लौटाता है।

```php
$website = Request::getUrl('website', '');
$returnUrl = Request::getUrl('return', 'index.php');
```

### getPath($name, $default, $hash)

एक मान्य फ़ाइल सिस्टम या वेब पथ लौटाता है।

```php
$filePath = Request::getPath('file', '');
```

### getEmail($name, $default, $hash)

एक मान्य ईमेल पता या डिफ़ॉल्ट लौटाता है।

```php
$email = Request::getEmail('email', '');
$contactEmail = Request::getEmail('contact', 'default@example.com');
```

### getIP($name, $default, $hash)

एक मान्य IPv4 या IPv6 पता लौटाता है।

```php
$userIp = Request::getIP('client_ip', '');
```

### getHeader($headerName, $default)

HTTP अनुरोध हेडर मान लौटाता है।

```php
$contentType = Request::getHeader('Content-Type', '');
$userAgent = Request::getHeader('User-Agent', '');
$authHeader = Request::getHeader('Authorization', '');
```

## उपयोगिता विधियाँ

### hasVar($name, $hash)

जांचें कि निर्दिष्ट हैश में कोई वैरिएबल मौजूद है या नहीं।

```php
if (Request::hasVar('submit', 'POST')) {
    // Form was submitted
}

if (Request::hasVar('id', 'GET')) {
    // ID parameter exists
}
```

### setVar($name, $value, $hash, $overwrite)

निर्दिष्ट हैश में एक वेरिएबल सेट करें। पिछला मान या शून्य लौटाता है।

```php
// Set a value
$oldValue = Request::setVar('processed', true, 'POST');

// Only set if not already exists
Request::setVar('default_op', 'list', 'GET', false);
```

### get($hash, $mask)

संपूर्ण हैश सरणी की साफ़ की गई प्रतिलिपि लौटाता है।

```php
// Get all POST data cleaned
$postData = Request::get('POST');

// Get all GET data
$getData = Request::get('GET');

// Get REQUEST data with no trimming
$requestData = Request::get('REQUEST', Request::MASK_NO_TRIM);
```

### set($array, $hash, $overwrite)

किसी सरणी से एकाधिक चर सेट करता है।

```php
$defaults = [
    'page' => 1,
    'limit' => 10,
    'sort' => 'date'
];
Request::set($defaults, 'GET', false); // Don't overwrite existing
```

## FilterInput एकीकरण

अनुरोध वर्ग सफाई के लिए `Xmf\FilterInput` का उपयोग करता है। उपलब्ध फ़िल्टर प्रकार:| प्रकार | विवरण |
|------|----||
| ALPHANUM / ALNUM | केवल अक्षरांकीय |
| ARRAY | प्रत्येक तत्व को पुनरावर्ती रूप से साफ़ करें |
| BASE64 | बेस64 एन्कोडेड स्ट्रिंग |
| BOOLEAN / BOOL | सत्य या असत्य |
| सीएमडी | कमांड - ए-जेड, 0-9, अंडरस्कोर, डैश, अवधि (लोअरकेस) |
| EMAIL | वैध ईमेल पता |
| FLOAT / DOUBLE | फ़्लोटिंग पॉइंट नंबर |
| INTEGER / INT | पूर्णांक मान |
| आईपी ​​| वैध आईपी पता |
| PATH | फ़ाइल सिस्टम या वेब पथ |
| STRING | सामान्य स्ट्रिंग (डिफ़ॉल्ट) |
| USERNAME | उपयोक्तानाम प्रारूप |
| WEBURL | वेब URL |
| WORD | केवल अक्षर A-Z और अंडरस्कोर |

## व्यावहारिक उदाहरण

### फॉर्म प्रोसेसिंग

```php
use Xmf\Request;

if ('POST' === Request::getMethod()) {
    // Validate form submission
    $title = Request::getString('title', '');
    $content = Request::getString('content', '', 'POST', Request::MASK_ALLOW_HTML);
    $categoryId = Request::getInt('category_id', 0);
    $tags = Request::getArray('tags', []);
    $published = Request::getBool('published', false);

    if (empty($title)) {
        $errors[] = 'Title is required';
    }

    if ($categoryId <= 0) {
        $errors[] = 'Please select a category';
    }
}
```

### AJAX हैंडलर

```php
use Xmf\Request;

// Verify AJAX request
$isAjax = (Request::getHeader('X-Requested-With', '') === 'XMLHttpRequest');

if ($isAjax) {
    $action = Request::getCmd('action', '');
    $itemId = Request::getInt('item_id', 0);

    switch ($action) {
        case 'delete':
            // Handle delete
            break;
        case 'update':
            $data = Request::getArray('data', []);
            // Handle update
            break;
    }
}
```

### पृष्ठांकन

```php
use Xmf\Request;

$page = Request::getInt('page', 1);
$limit = Request::getInt('limit', 20);
$sort = Request::getCmd('sort', 'date');
$order = Request::getWord('order', 'DESC');

// Validate ranges
$page = max(1, $page);
$limit = min(100, max(10, $limit));
$order = in_array($order, ['ASC', 'DESC']) ? $order : 'DESC';

$offset = ($page - 1) * $limit;
```

### खोज फ़ॉर्म

```php
use Xmf\Request;

$query = Request::getString('q', '');
$category = Request::getInt('cat', 0);
$dateFrom = Request::getString('from', '');
$dateTo = Request::getString('to', '');

// Build search criteria
$criteria = new CriteriaCompo();

if (!empty($query)) {
    $criteria->add(new Criteria('title', '%' . $query . '%', 'LIKE'));
}

if ($category > 0) {
    $criteria->add(new Criteria('category_id', $category));
}
```

## सुरक्षा सर्वोत्तम प्रथाएँ

1. **हमेशा प्रकार-विशिष्ट तरीकों का उपयोग करें** - आईडी के लिए `getInt()`, ईमेल आदि के लिए `getEmail()` का उपयोग करें।

2. **समझदार डिफ़ॉल्ट प्रदान करें** - कभी भी यह न मानें कि इनपुट मौजूद है

3. **सैनिटाइजेशन के बाद मान्य करें** - सेनिटाइजेशन खराब डेटा को हटा देता है, सत्यापन सही डेटा सुनिश्चित करता है

4. **उचित हैश का उपयोग करें** - फॉर्म डेटा के लिए POST निर्दिष्ट करें, क्वेरी पैरामीटर के लिए प्राप्त करें

5. **कच्चे इनपुट से बचें** - अत्यंत आवश्यक होने पर ही `getText()` या `MASK_ALLOW_RAW` का उपयोग करें

```php
// Good - type-specific with default
$id = Request::getInt('id', 0);

// Bad - using getString for numeric data
$id = (int) Request::getString('id', '0');
```

## यह भी देखें

- XMF के साथ शुरुआत करना - बुनियादी XMF अवधारणाएं
- XMF-मॉड्यूल-हेल्पर - मॉड्यूल सहायक वर्ग
- ../XMF-फ्रेमवर्क - फ्रेमवर्क सिंहावलोकन

---

#xmf #अनुरोध #सुरक्षा #इनपुट-सत्यापन #स्वच्छता