---
title: "XoopsObject कक्षा"
description: "संपत्ति प्रबंधन, सत्यापन और क्रमबद्धता प्रदान करने वाले XOOPS सिस्टम में सभी डेटा ऑब्जेक्ट के लिए बेस क्लास"
---
`XoopsObject` वर्ग XOOPS सिस्टम में सभी डेटा ऑब्जेक्ट के लिए मौलिक आधार वर्ग है। यह ऑब्जेक्ट गुणों, सत्यापन, डर्टी ट्रैकिंग और क्रमबद्धता के प्रबंधन के लिए एक मानकीकृत इंटरफ़ेस प्रदान करता है।

## कक्षा अवलोकन

```php
namespace Xoops\Core;

class XoopsObject
{
    protected array $vars = [];
    protected array $cleanVars = [];
    protected bool $isNew = true;
    protected array $errors = [];
}
```

## वर्ग पदानुक्रम

```
XoopsObject
├── XoopsUser
├── XoopsGroup
├── XoopsModule
├── XoopsBlock
├── XoopsComment
├── XoopsNotification
├── XoopsConfig
└── [Custom Module Objects]
```

## गुण

| संपत्ति | प्रकार | दृश्यता | विवरण |
|---|------|---|---|
| `$vars` | सारणी | संरक्षित | परिवर्तनीय परिभाषाओं और मूल्यों को संग्रहीत करता है |
| `$cleanVars` | सारणी | संरक्षित | डेटाबेस संचालन के लिए स्वच्छ मूल्यों को संग्रहीत करता है |
| `$isNew` | बूल | संरक्षित | इंगित करता है कि क्या वस्तु नई है (अभी डेटाबेस में नहीं है) |
| `$errors` | सारणी | संरक्षित | सत्यापन और त्रुटि संदेश संग्रहीत करता है |

## निर्माता

```php
public function __construct()
```

एक नया XoopsObject उदाहरण बनाता है। ऑब्जेक्ट को डिफ़ॉल्ट रूप से नए के रूप में चिह्नित किया गया है।

**उदाहरण:**
```php
$object = new XoopsObject();
// Object is new and has no defined variables
```

## कोर तरीके

### initVar

ऑब्जेक्ट के लिए एक वैरिएबल परिभाषा प्रारंभ करता है।

```php
public function initVar(
    string $key,
    int $dataType,
    mixed $value = null,
    bool $required = false,
    int $maxlength = null,
    string $options = ''
): void
```

**पैरामीटर:**

| पैरामीटर | प्रकार | विवरण |
|----|------|----|
| `$key` | स्ट्रिंग | परिवर्तनीय नाम |
| `$dataType` | int | डेटा प्रकार स्थिरांक (डेटा प्रकार देखें) |
| `$value` | मिश्रित | डिफ़ॉल्ट मान |
| `$required` | बूल | क्या फ़ील्ड आवश्यक है |
| `$maxlength` | int | स्ट्रिंग प्रकारों के लिए अधिकतम लंबाई |
| `$options` | स्ट्रिंग | अतिरिक्त विकल्प |

**डेटा प्रकार:**

| लगातार | मूल्य | विवरण |
|---|-------|---|
| `XOBJ_DTYPE_TXTBOX` | 1 | टेक्स्ट बॉक्स इनपुट |
| `XOBJ_DTYPE_TXTAREA` | 2 | पाठक्षेत्र सामग्री |
| `XOBJ_DTYPE_INT` | 3 | पूर्णांक मान |
| `XOBJ_DTYPE_URL` | 4 | URL स्ट्रिंग |
| `XOBJ_DTYPE_EMAIL` | 5 | ईमेल पता |
| `XOBJ_DTYPE_ARRAY` | 6 | क्रमबद्ध सरणी |
| `XOBJ_DTYPE_OTHER` | 7 | कस्टम प्रकार |
| `XOBJ_DTYPE_SOURCE` | 8 | स्रोत कोड |
| `XOBJ_DTYPE_STIME` | 9 | अल्प समय प्रारूप |
| `XOBJ_DTYPE_MTIME` | 10 | मध्यम समय प्रारूप |
| `XOBJ_DTYPE_LTIME` | 11 | दीर्घकालीन प्रारूप |
| `XOBJ_DTYPE_FLOAT` | 12 | फ़्लोटिंग पॉइंट |
| `XOBJ_DTYPE_DECIMAL` | 13 | दशमलव संख्या |
| `XOBJ_DTYPE_ENUM` | 14 | गणना |

**उदाहरण:**
```php
class MyObject extends XoopsObject
{
    public function __construct()
    {
        parent::__construct();
        $this->initVar('id', XOBJ_DTYPE_INT, null, false);
        $this->initVar('title', XOBJ_DTYPE_TXTBOX, '', true, 255);
        $this->initVar('content', XOBJ_DTYPE_TXTAREA, '', false);
        $this->initVar('email', XOBJ_DTYPE_EMAIL, '', true, 100);
        $this->initVar('created', XOBJ_DTYPE_INT, time(), false);
        $this->initVar('status', XOBJ_DTYPE_INT, 1, true);
    }
}
```

---

### सेटवार

किसी वेरिएबल का मान सेट करता है.

```php
public function setVar(
    string $key,
    mixed $value,
    bool $notGpc = false
): bool
```

**पैरामीटर:**

| पैरामीटर | प्रकार | विवरण |
|----|------|----|
| `$key` | स्ट्रिंग | परिवर्तनीय नाम |
| `$value` | मिश्रित | सेट करने के लिए मान |
| `$notGpc` | बूल | यदि सत्य है, तो मान GET/POST/COOKIE से नहीं है |

**रिटर्न:** `bool` - सफल होने पर सही, अन्यथा गलत

**उदाहरण:**
```php
$object = new MyObject();
$object->setVar('title', 'Hello World');
$object->setVar('content', '<p>Content here</p>', true); // Not from user input
$object->setVar('status', 1);
```

---

### getVar

वैकल्पिक स्वरूपण के साथ एक चर का मान पुनर्प्राप्त करता है।

```php
public function getVar(
    string $key,
    string $format = 's'
): mixed
```

**पैरामीटर:**

| पैरामीटर | प्रकार | विवरण |
|----|------|----|
| `$key` | स्ट्रिंग | परिवर्तनीय नाम |
| `$format` | स्ट्रिंग | आउटपुट स्वरूप |

**प्रारूप विकल्प:**

| प्रारूप | विवरण |
|-------|----|
| `'s'` | दिखाएँ - HTML इकाइयाँ प्रदर्शन के लिए बच गईं |
| `'e'` | संपादित करें - प्रपत्र इनपुट मानों के लिए |
| `'p'` | पूर्वावलोकन - शो के समान |
| `'f'` | प्रपत्र डेटा - प्रपत्र प्रसंस्करण के लिए कच्चा |
| `'n'` | कोई नहीं - कच्चा मान, कोई फ़ॉर्मेटिंग नहीं |

**रिटर्न:** `mixed` - स्वरूपित मान

**उदाहरण:**
```php
$object = new MyObject();
$object->setVar('title', 'Hello <World>');

echo $object->getVar('title', 's'); // "Hello &lt;World&gt;"
echo $object->getVar('title', 'e'); // "Hello &lt;World&gt;" (for input value)
echo $object->getVar('title', 'n'); // "Hello <World>" (raw)

// For array data types
$object->setVar('options', ['a', 'b', 'c']);
$options = $object->getVar('options', 'n'); // Returns array
```

---

### सेटवर्स

किसी सरणी से एक साथ कई वेरिएबल सेट करता है।

```php
public function setVars(
    array $values,
    bool $notGpc = false
): void
```

**पैरामीटर:**

| पैरामीटर | प्रकार | विवरण |
|----|------|----|
| `$values` | सारणी | कुंजी की सहयोगी सरणी => मान जोड़े |
| `$notGpc` | बूल | यदि सत्य है, तो मान GET/POST/COOKIE से नहीं हैं |

**उदाहरण:**
```php
$object = new MyObject();
$object->setVars([
    'title' => 'My Title',
    'content' => 'My content',
    'status' => 1
]);

// From database (not user input)
$object->setVars($row, true);
```

---

### मूल्य प्राप्त करें

सभी परिवर्तनीय मान पुनर्प्राप्त करता है।

```php
public function getValues(
    array $keys = null,
    string $format = 's',
    int $maxDepth = 1
): array
```

**पैरामीटर:**| पैरामीटर | प्रकार | विवरण |
|----|------|----|
| `$keys` | सारणी | पुनर्प्राप्त करने के लिए विशिष्ट कुंजियाँ (सभी के लिए शून्य) |
| `$format` | स्ट्रिंग | आउटपुट स्वरूप |
| `$maxDepth` | int | नेस्टेड वस्तुओं के लिए अधिकतम गहराई |

**रिटर्न:** `array` - मानों की सहयोगी सारणी

**उदाहरण:**
```php
$object = new MyObject();

// Get all values
$allValues = $object->getValues();

// Get specific values
$subset = $object->getValues(['title', 'status']);

// Get raw values for database
$rawValues = $object->getValues(null, 'n');
```

---

### असाइनवर

सत्यापन के बिना सीधे मान निर्दिष्ट करता है (सावधानीपूर्वक उपयोग करें)।

```php
public function assignVar(
    string $key,
    mixed $value
): void
```

**पैरामीटर:**

| पैरामीटर | प्रकार | विवरण |
|----|------|----|
| `$key` | स्ट्रिंग | परिवर्तनीय नाम |
| `$value` | मिश्रित | असाइन करने के लिए मान |

**उदाहरण:**
```php
// Direct assignment from trusted source (e.g., database)
$object->assignVar('id', $row['id']);
$object->assignVar('created', $row['created']);
```

---

### क्लीनवर्स

डेटाबेस संचालन के लिए सभी वेरिएबल्स को स्वच्छ करता है।

```php
public function cleanVars(): bool
```

**रिटर्न:** `bool` - यदि सभी चर मान्य हैं तो सत्य है

**उदाहरण:**
```php
$object = new MyObject();
$object->setVar('title', 'Test');
$object->setVar('email', 'user@example.com');

if ($object->cleanVars()) {
    // Variables are sanitized and ready for database
    $cleanData = $object->cleanVars;
} else {
    // Validation errors occurred
    $errors = $object->getErrors();
}
```

---

### नया है

जाँच या सेट करता है कि वस्तु नई है या नहीं।

```php
public function isNew(): bool
public function setNew(): void
public function unsetNew(): void
```

**उदाहरण:**
```php
$object = new MyObject();
echo $object->isNew(); // true

$object->unsetNew();
echo $object->isNew(); // false

$object->setNew();
echo $object->isNew(); // true
```

---

## त्रुटि प्रबंधन के तरीके

### सेटत्रुटियाँ

एक त्रुटि संदेश जोड़ता है.

```php
public function setErrors(string|array $error): void
```

**उदाहरण:**
```php
$object->setErrors('Title is required');
$object->setErrors(['Field 1 error', 'Field 2 error']);
```

---

### त्रुटियाँ प्राप्त करें

सभी त्रुटि संदेशों को पुनः प्राप्त करता है।

```php
public function getErrors(): array
```

**उदाहरण:**
```php
$errors = $object->getErrors();
foreach ($errors as $error) {
    echo $error . "\n";
}
```

---

### getHtmlErrors

HTML के रूप में स्वरूपित त्रुटियाँ लौटाता है।

```php
public function getHtmlErrors(): string
```

**उदाहरण:**
```php
if (!$object->cleanVars()) {
    echo '<div class="error">' . $object->getHtmlErrors() . '</div>';
}
```

---

## उपयोगिता विधियाँ

### से सारणीबद्ध करना

ऑब्जेक्ट को एक सरणी में परिवर्तित करता है।

```php
public function toArray(): array
```

**उदाहरण:**
```php
$object = new MyObject();
$object->setVar('title', 'Test');
$data = $object->toArray();
// ['title' => 'Test', ...]
```

---

### गेटवर्स

परिवर्तनीय परिभाषाएँ लौटाता है।

```php
public function getVars(): array
```

**उदाहरण:**
```php
$vars = $object->getVars();
foreach ($vars as $key => $definition) {
    echo "Field: $key, Type: {$definition['data_type']}\n";
}
```

---

## पूर्ण उपयोग उदाहरण

```php
<?php
/**
 * Custom Article Object
 */
class Article extends XoopsObject
{
    /**
     * Constructor - Initialize all variables
     */
    public function __construct()
    {
        parent::__construct();

        // Primary key
        $this->initVar('article_id', XOBJ_DTYPE_INT, null, false);

        // Required fields
        $this->initVar('title', XOBJ_DTYPE_TXTBOX, '', true, 255);
        $this->initVar('author_id', XOBJ_DTYPE_INT, 0, true);

        // Optional fields
        $this->initVar('summary', XOBJ_DTYPE_TXTAREA, '', false);
        $this->initVar('content', XOBJ_DTYPE_TXTAREA, '', false);
        $this->initVar('category_id', XOBJ_DTYPE_INT, 0, false);

        // Timestamps
        $this->initVar('created', XOBJ_DTYPE_INT, time(), false);
        $this->initVar('updated', XOBJ_DTYPE_INT, time(), false);

        // Status flags
        $this->initVar('published', XOBJ_DTYPE_INT, 0, false);
        $this->initVar('views', XOBJ_DTYPE_INT, 0, false);

        // Metadata as array
        $this->initVar('meta', XOBJ_DTYPE_ARRAY, [], false);
    }

    /**
     * Get formatted creation date
     */
    public function getCreatedDate(string $format = 'Y-m-d H:i:s'): string
    {
        return date($format, $this->getVar('created', 'n'));
    }

    /**
     * Check if article is published
     */
    public function isPublished(): bool
    {
        return $this->getVar('published', 'n') == 1;
    }

    /**
     * Increment view counter
     */
    public function incrementViews(): void
    {
        $views = $this->getVar('views', 'n');
        $this->setVar('views', $views + 1);
    }

    /**
     * Custom validation
     */
    public function validate(): bool
    {
        $this->errors = [];

        // Title validation
        $title = trim($this->getVar('title', 'n'));
        if (empty($title)) {
            $this->setErrors('Title is required');
        } elseif (strlen($title) < 5) {
            $this->setErrors('Title must be at least 5 characters');
        }

        // Author validation
        if ($this->getVar('author_id', 'n') <= 0) {
            $this->setErrors('Author is required');
        }

        return empty($this->errors);
    }
}

// Usage
$article = new Article();
$article->setVar('title', 'My First Article');
$article->setVar('author_id', 1);
$article->setVar('content', '<p>Article content here...</p>', true);
$article->setVar('meta', [
    'keywords' => ['xoops', 'cms', 'php'],
    'description' => 'An example article'
]);

if ($article->validate() && $article->cleanVars()) {
    // Save to database via handler
    $handler = xoops_getModuleHandler('article', 'mymodule');
    $handler->insert($article);

    echo "Article saved with ID: " . $article->getVar('article_id');
} else {
    echo "Errors: " . $article->getHtmlErrors();
}
```

## सर्वोत्तम प्रथाएँ

1. **वेरिएबल्स को हमेशा इनिशियलाइज़ करें**: `initVar()` का उपयोग करके कंस्ट्रक्टर में सभी वेरिएबल्स को परिभाषित करें

2. **उपयुक्त डेटा प्रकारों का उपयोग करें**: सत्यापन के लिए सही `XOBJ_DTYPE_*` स्थिरांक चुनें

3. **उपयोगकर्ता इनपुट को सावधानी से संभालें**: उपयोगकर्ता इनपुट के लिए `$notGpc = false` के साथ `setVar()` का उपयोग करें

4. **सहेजने से पहले सत्यापित करें**: डेटाबेस संचालन से पहले हमेशा `cleanVars()` पर कॉल करें

5. **प्रारूप पैरामीटर का उपयोग करें**: संदर्भ के लिए `getVar()` में उचित प्रारूप का उपयोग करें

6. **कस्टम लॉजिक के लिए विस्तार**: उपवर्गों में डोमेन-विशिष्ट तरीके जोड़ें

## संबंधित दस्तावेज़ीकरण

- XoopsObjectHandler - ऑब्जेक्ट दृढ़ता के लिए हैंडलर पैटर्न
- ../डेटाबेस/Criteria - Criteria के साथ क्वेरी बिल्डिंग
- ../डेटाबेस/XoopsDatabase - डेटाबेस संचालन

---

*यह भी देखें: [XOOPS सोर्स कोड](https://github.com/XOOPS/XoopsCore27/blob/master/htdocs/class/xoopsobject.php)*