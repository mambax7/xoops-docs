---
title: "कोड संगठन की सर्वोत्तम प्रथाएँ"
description: "मॉड्यूल संरचना, नामकरण परंपराएँ, और PSR-4 ऑटोलोडिंग"
---
# कोड संगठन XOOPS में सर्वोत्तम अभ्यास

रखरखाव, मापनीयता और टीम सहयोग के लिए उचित कोड संगठन आवश्यक है।

## मॉड्यूल निर्देशिका संरचना

एक सुव्यवस्थित XOOPS मॉड्यूल को इस संरचना का पालन करना चाहिए:

```
mymodule/
├── xoops_version.php           # Module metadata
├── index.php                    # Frontend entry point
├── admin.php                    # Admin entry point
├── class/
│   ├── Controller/             # Request handlers
│   ├── Handler/                # Data handlers
│   ├── Repository/             # Data access
│   ├── Entity/                 # Domain objects
│   ├── Service/                # Business logic
│   ├── DTO/                    # Data transfer objects
│   └── Exception/              # Custom exceptions
├── templates/                  # Smarty templates
│   ├── admin/                  # Admin templates
│   └── blocks/                 # Block templates
├── assets/
│   ├── css/                    # Stylesheets
│   ├── js/                     # JavaScript
│   └── images/                 # Images
├── sql/                        # Database schemas
├── tests/                      # Unit and integration tests
├── docs/                       # Documentation
└── composer.json              # Composer configuration
```

## नामकरण परंपराएँ

### PHP नामकरण मानक (PSR-12)

```
Classes:      PascalCase         (UserController, PostRepository)
Methods:      camelCase          (getUserById, createUser)
Properties:   camelCase          ($userId, $username)
Constants:    UPPER_SNAKE_CASE   (DEFAULT_LIMIT, MAX_USERS)
Functions:    snake_case         (get_user_data, validate_email)
Files:        PascalCase.php     (UserController.php)
```

### फ़ाइल और निर्देशिका संगठन

- प्रति फ़ाइल एक वर्ग
-फ़ाइलनाम वर्ग नाम से मेल खाता है
- निर्देशिका संरचना नेमस्पेस पदानुक्रम से मेल खाती है
- संबंधित कक्षाएं एक साथ रखें
- मॉड्यूल में लगातार नामकरण का प्रयोग करें

## पीएसआर-4 ऑटोलोडिंग

### संगीतकार विन्यास

```json
{
  "autoload": {
    "psr-4": {
      "Xoops\\Module\\Mymodule\\": "class/"
    }
  }
}
```

### मैनुअल ऑटोलोडर

```php
<?php
class Autoloader
{
    public static function register()
    {
        spl_autoload_register([self::class, 'autoload']);
    }
    
    public static function autoload($class)
    {
        $prefix = 'Xoops\\Module\\Mymodule\\';
        if (strpos($class, $prefix) !== 0) {
            return;
        }
        
        $relative = substr($class, strlen($prefix));
        $file = __DIR__ . '/' . 
                str_replace('\\', '/', $relative) . '.php';
        
        if (file_exists($file)) {
            require $file;
        }
    }
}
?>
```

## सर्वोत्तम प्रथाएँ

### 1. एकल जिम्मेदारी
- प्रत्येक वर्ग के पास बदलाव का एक कारण होना चाहिए
- विभिन्न वर्गों में चिंताओं को अलग करें
- कक्षाओं को केंद्रित और एकजुट रखें

### 2. लगातार नामकरण
- सार्थक, वर्णनात्मक नामों का प्रयोग करें
- PSR-12 कोडिंग मानकों का पालन करें
- जब तक स्पष्ट न हो संक्षिप्ताक्षरों से बचें
- सुसंगत पैटर्न का प्रयोग करें

### 3. निर्देशिका संगठन
- संबंधित कक्षाओं को एक साथ समूहित करें
- चिंताओं को उपनिर्देशिकाओं में अलग करें
- टेम्प्लेट और संपत्तियों को व्यवस्थित रखें
- सुसंगत फ़ाइल नामकरण का प्रयोग करें

### 4. नेमस्पेस उपयोग
- सभी कक्षाओं के लिए उचित नामस्थान का उपयोग करें
- PSR-4 ऑटोलोडिंग का पालन करें
- नेमस्पेस निर्देशिका संरचना से मेल खाता है

### 5. कॉन्फ़िगरेशन प्रबंधन
- कॉन्फ़िगरेशन निर्देशिका में कॉन्फ़िगरेशन को केंद्रीकृत करें
- पर्यावरण-आधारित कॉन्फ़िगरेशन का उपयोग करें
- सेटिंग्स को हार्डकोड न करें

## मॉड्यूल बूटस्ट्रैप

```php
<?php
class Bootstrap
{
    private static $serviceContainer;
    private static $initialized = false;
    
    public static function initialize()
    {
        if (self::$initialized) {
            return;
        }
        
        global $xoopsDB;
        self::$serviceContainer = new ServiceContainer($xoopsDB);
        self::$initialized = true;
    }
    
    public static function getServiceContainer()
    {
        if (!self::$initialized) {
            self::initialize();
        }
        return self::$serviceContainer;
    }
}
?>
```

## संबंधित दस्तावेज़ीकरण

यह भी देखें:
- अपवाद प्रबंधन के लिए त्रुटि-हैंडलिंग
- परीक्षण संगठन के लिए परीक्षण
- नियंत्रक संरचना के लिए ../पैटर्न/एमवीसी-पैटर्न

---

टैग: #सर्वोत्तम अभ्यास #कोड-संगठन #पीएसआर-4 #मॉड्यूल-विकास