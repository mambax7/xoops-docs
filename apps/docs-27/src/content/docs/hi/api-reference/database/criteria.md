---
title: "Criteria और CriteriaCompo कक्षाएं"
description: "Criteria कक्षाओं का उपयोग करके क्वेरी निर्माण और उन्नत फ़िल्टरिंग"
---
`Criteria` और `CriteriaCompo` कक्षाएं जटिल डेटाबेस क्वेरीज़ के निर्माण के लिए एक धाराप्रवाह, ऑब्जेक्ट-ओरिएंटेड इंटरफ़ेस प्रदान करती हैं। ये कक्षाएं SQL WHERE क्लॉज को अमूर्त करती हैं, जिससे डेवलपर्स को सुरक्षित और पठनीय रूप से गतिशील क्वेरी बनाने की अनुमति मिलती है।

## कक्षा अवलोकन

### Criteria कक्षा

`Criteria` वर्ग WHERE खंड में एकल स्थिति का प्रतिनिधित्व करता है:

```php
namespace Xoops\Database;

class Criteria
{
    protected $column;
    protected $operator;
    protected $value;
    protected $function;

    public function __construct(
        string $column,
        mixed $value = null,
        string $operator = '=',
        string $function = ''
    ) {}

    public function render(string $prefix = ''): string {}
}
```

## बुनियादी उपयोग

### सरल Criteria

```php
use Xoops\Database\Criteria;
use Xoops\Database\CriteriaCompo;

// Single condition
$criteria = new Criteria('status', 'active');
// Renders: `status` = 'active'
```

### विभिन्न ऑपरेटर

```php
// Equality (default)
$criteria = new Criteria('status', 'active', '=');

// Not equal
$criteria = new Criteria('status', 'active', '<>');

// Greater than
$criteria = new Criteria('age', 18, '>');

// Less than or equal
$criteria = new Criteria('age', 65, '<=');

// LIKE (for pattern matching)
$criteria = new Criteria('email', '%@example.com', 'LIKE');

// IN (for multiple values)
$criteria = new Criteria('status', ['active', 'pending', 'review'], 'IN');
```

## बिल्डिंग कॉम्प्लेक्स प्रश्न

### और तर्क (डिफ़ॉल्ट)

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'active'));
$criteria->add(new Criteria('age', 18, '>='));
$criteria->add(new Criteria('verified', 1));
// Renders: `status` = 'active' AND `age` >= 18 AND `verified` = 1
```

### या तर्क

```php
$criteria = new CriteriaCompo('OR');
$criteria->add(new Criteria('role', 'admin'));
$criteria->add(new Criteria('role', 'moderator'));
$criteria->add(new Criteria('role', 'editor'));
```

## रिपॉजिटरी पैटर्न के साथ एकीकरण

### रिपॉजिटरी उदाहरण

```php
namespace MyModule\Repository;

use Xoops\Database\XoopsDatabase;
use Xoops\Database\Criteria;
use Xoops\Database\CriteriaCompo;

class UserRepository
{
    private $db;
    private $table = 'users';

    public function __construct(XoopsDatabase $db)
    {
        $this->db = $db;
    }

    public function findByCriteria(CriteriaCompo $criteria): array
    {
        $sql = "SELECT * FROM {$this->table}";

        if ($criteria->count() > 0) {
            $sql .= " WHERE " . $criteria->render();
        }

        $result = $this->db->query($sql);
        $users = [];

        while ($row = $this->db->fetchArray($result)) {
            $users[] = new User($row);
        }

        return $users;
    }
}
```

## सुरक्षा और संरक्षा

### स्वचालित पलायन

`Criteria` वर्ग SQL इंजेक्शन को रोकने के लिए स्वचालित रूप से मानों से बच जाता है:

```php
// Safe - value is automatically escaped
$userInput = "'; DROP TABLE users; --";
$criteria = new Criteria('username', $userInput);
// Safely renders: `username` = '\''; DROP TABLE users; --'
```

## API संदर्भ

### Criteria तरीके

| विधि | विवरण | वापसी |
|--------|---|--------|
| `__construct()` | एक मानदंड शर्त प्रारंभ करें | शून्य |
| `render($prefix = '')` | SQL WHERE क्लॉज़ सेगमेंट में रेंडर करें | स्ट्रिंग |
| `getColumn()` | कॉलम का नाम प्राप्त करें | स्ट्रिंग |
| `getValue()` | तुलना मूल्य प्राप्त करें | मिश्रित |
| `getOperator()` | तुलना ऑपरेटर प्राप्त करें | स्ट्रिंग |

### CriteriaCompo तरीके

| विधि | विवरण | वापसी |
|--------|---|--------|
| `__construct($logic = 'AND')` | समग्र मानदंड आरंभ करें | शून्य |
| `add($criteria, $logic = null)` | मानदंड या नेस्टेड समग्र जोड़ें | शून्य |
| `render($prefix = '')` | WHERE क्लॉज को पूरा करने के लिए रेंडर करें | स्ट्रिंग |
| `count()` | मानदंडों की संख्या प्राप्त करें | int |
| `clear()` | सभी मानदंड हटाएं | शून्य |

## संबंधित दस्तावेज़ीकरण

- XoopsDatabase - डेटाबेस वर्ग संदर्भ
- ../../03-मॉड्यूल-डेवलपमेंट/पैटर्न/रिपोजिटरी-पैटर्न - XOOPS में रिपोजिटरी पैटर्न
- ../../03-मॉड्यूल-विकास/पैटर्न/सेवा-परत-पैटर्न - सेवा परत पैटर्न

## संस्करण जानकारी

- **परिचय:** XOOPS 2.5.0
- **अंतिम अद्यतन:** XOOPS 4.0
- **संगतता:** PHP 7.4+