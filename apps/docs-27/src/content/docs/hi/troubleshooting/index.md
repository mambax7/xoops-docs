---
title: "समस्या निवारण"
description: "सामान्य XOOPS समस्याओं के समाधान, डिबगिंग तकनीक और अक्सर पूछे जाने वाले प्रश्न"
---
> XOOPS सीएमएस के लिए सामान्य समस्याओं का समाधान और डिबगिंग तकनीक।

---

## 📋 शीघ्र निदान

विशिष्ट मुद्दों पर विचार करने से पहले, इन सामान्य कारणों की जाँच करें:

1. **फ़ाइल अनुमतियाँ** - निर्देशिकाओं को 755 की आवश्यकता है, फ़ाइलों को 644 की आवश्यकता है
2. **PHP संस्करण** - सुनिश्चित करें कि PHP 7.4+ (8.x अनुशंसित)
3. **त्रुटि लॉग** - `xoops_data/logs/` और PHP त्रुटि लॉग जांचें
4. **कैश** - एडमिन → सिस्टम → रखरखाव में कैश साफ़ करें

---

## 🗂️ अनुभाग सामग्री

### सामान्य मुद्दे
- मौत की सफेद स्क्रीन (WSOD)
- डेटाबेस कनेक्शन त्रुटियाँ
- अनुमति अस्वीकृत त्रुटियाँ
- मॉड्यूल स्थापना विफलताएँ
- टेम्पलेट संकलन त्रुटियाँ

### अक्सर पूछे जाने वाले प्रश्न
- स्थापना संबंधी अक्सर पूछे जाने वाले प्रश्न
- मॉड्यूल अक्सर पूछे जाने वाले प्रश्न
- थीम अक्सर पूछे जाने वाले प्रश्न
- प्रदर्शन अक्सर पूछे जाने वाले प्रश्न

### डिबगिंग
- डिबग मोड सक्षम करना
- रे डिबगर का उपयोग करना
- डेटाबेस क्वेरी डिबगिंग
- Smarty टेम्पलेट डिबगिंग

---

## 🚨 सामान्य मुद्दे एवं समाधान

### मौत की सफेद स्क्रीन (WSOD)

**लक्षण:** खाली सफेद पृष्ठ, कोई त्रुटि संदेश नहीं

**समाधान:**

1. **PHP त्रुटि प्रदर्शन को अस्थायी रूप से सक्षम करें:**
   ```php
   // Add to mainfile.php temporarily
   error_reporting(E_ALL);
   ini_set('display_errors', 1);
   ```

2. **PHP त्रुटि लॉग जांचें:**
   ```bash
   tail -f /var/log/php/error.log
   ```

3. **सामान्य कारण:**
   - मेमोरी सीमा पार हो गई
   - घातक PHP सिंटैक्स त्रुटि
   - आवश्यक एक्सटेंशन गुम है

4. **मेमोरी संबंधी समस्याएं ठीक करें:**
   ```php
   // In mainfile.php or php.ini
   ini_set('memory_limit', '256M');
   ```

---

### डेटाबेस कनेक्शन त्रुटियाँ

**लक्षण:** "डेटाबेस से कनेक्ट करने में असमर्थ" या समान

**समाधान:**

1. **mainfile.php में क्रेडेंशियल सत्यापित करें:**
   ```php
   define('XOOPS_DB_HOST', 'localhost');
   define('XOOPS_DB_USER', 'your_username');
   define('XOOPS_DB_PASS', 'your_password');
   define('XOOPS_DB_NAME', 'your_database');
   ```

2. **मैन्युअल रूप से कनेक्शन का परीक्षण करें:**
   ```php
   <?php
   $conn = new mysqli('localhost', 'user', 'pass', 'database');
   if ($conn->connect_error) {
       die("Connection failed: " . $conn->connect_error);
   }
   echo "Connected successfully";
   ```

3. **MySQL सेवा जांचें:**
   ```bash
   sudo systemctl status mysql
   sudo systemctl restart mysql
   ```

4. **उपयोगकर्ता अनुमतियाँ सत्यापित करें:**
   ```sql
   GRANT ALL PRIVILEGES ON xoops.* TO 'user'@'localhost';
   FLUSH PRIVILEGES;
   ```

---

### अनुमति अस्वीकृत त्रुटियाँ

**लक्षण:** फ़ाइलें अपलोड नहीं की जा सकतीं, सेटिंग्स सहेजी नहीं जा सकतीं

**समाधान:**

1. **सही अनुमतियाँ सेट करें:**
   ```bash
   # Directories
   find /path/to/xoops -type d -exec chmod 755 {} \;

   # Files
   find /path/to/xoops -type f -exec chmod 644 {} \;

   # Writable directories
   chmod -R 777 xoops_data/
   chmod -R 777 uploads/
   ```

2. **सही स्वामित्व निर्धारित करें:**
   ```bash
   chown -R www-data:www-data /path/to/xoops
   ```

3. **SELinux जांचें (CentOS/RHEL):**
   ```bash
   # Check status
   sestatus

   # Allow httpd to write
   setsebool -P httpd_unified 1
   ```

---

### मॉड्यूल स्थापना विफलताएँ

**लक्षण:** मॉड्यूल स्थापित नहीं होगा, SQL त्रुटियाँ

**समाधान:**

1. **मॉड्यूल आवश्यकताओं की जाँच करें:**
   - PHP संस्करण अनुकूलता
   - आवश्यक PHP एक्सटेंशन
   - XOOPS संस्करण अनुकूलता

2. **मैनुअल SQL इंस्टालेशन:**
   ```bash
   mysql -u user -p database < modules/mymodule/sql/mysql.sql
   ```

3. **मॉड्यूल कैश साफ़ करें:**
   ```php
   // In xoops_data/caches/
   rm -rf xoops_cache/*
   rm -rf smarty_cache/*
   rm -rf smarty_compile/*
   ```

4. **xoops_version.php सिंटेक्स जांचें:**
   ```bash
   php -l modules/mymodule/xoops_version.php
   ```

---

### टेम्पलेट संकलन त्रुटियाँ

**लक्षण:** Smarty त्रुटियाँ, टेम्पलेट नहीं मिला

**समाधान:**

1. **Smarty कैश साफ़ करें:**
   ```bash
   rm -rf xoops_data/caches/smarty_cache/*
   rm -rf xoops_data/caches/smarty_compile/*
   ```

2. **टेम्पलेट सिंटैक्स जांचें:**
   ```smarty
   {* Correct *}
   {$variable}

   {* Incorrect - missing $ *}
   {variable}
   ```

3. **सत्यापित करें कि टेम्पलेट मौजूद है:**
   ```bash
   ls modules/mymodule/templates/
   ```

4. **टेम्प्लेट पुन: उत्पन्न करें:**
   - एडमिन → सिस्टम → रखरखाव → टेम्प्लेट → पुनर्जीवित

---

## 🐛 डिबगिंग तकनीक

### XOOPS डिबग मोड सक्षम करें

```php
// In mainfile.php
define('XOOPS_DEBUG_LEVEL', 2);

// Levels:
// 0 = Off
// 1 = PHP debug
// 2 = PHP + SQL debug
// 3 = PHP + SQL + Smarty templates
```

### रे डिबगर का उपयोग करना

रे PHP के लिए एक उत्कृष्ट डिबगिंग टूल है:

```php
// Install via Composer
composer require spatie/ray --dev

// Usage in your code
ray($variable);
ray($object)->expand();
ray()->measure();

// Database queries
ray($sql)->label('Query');
```

### Smarty डिबग कंसोल

```smarty
{* Enable in template *}
{debug}

{* Or in PHP *}
$xoopsTpl->debugging = true;
```

### डेटाबेस क्वेरी लॉगिंग

```php
// Enable query logging
$GLOBALS['xoopsDB']->setLogger(new XoopsLogger());

// Get all queries
$queries = $GLOBALS['xoopsLogger']->queries;
foreach ($queries as $query) {
    echo $query['sql'] . " - " . $query['time'] . "s\n";
}
```

---

## ❓ अक्सर पूछे जाने वाले प्रश्न

### स्थापना

**प्रश्न: इंस्टालेशन विज़ार्ड खाली पेज दिखाता है**
उ: PHP त्रुटि लॉग की जाँच करें, सुनिश्चित करें कि PHP में पर्याप्त मेमोरी है, फ़ाइल अनुमतियाँ सत्यापित करें।

**प्रश्न: इंस्टालेशन के दौरान mainfile.php पर नहीं लिख सकता**
उ: अनुमतियाँ सेट करें: `chmod 666 mainfile.php` इंस्टालेशन के दौरान, फिर `chmod 444` उसके बाद।

**प्रश्न: डेटाबेस तालिकाएँ नहीं बनाई गईं**
उ: जांचें कि MySQL उपयोगकर्ता के पास CREATE TABLE विशेषाधिकार हैं, सत्यापित करें कि डेटाबेस मौजूद है।

### मॉड्यूल

**प्रश्न: मॉड्यूल व्यवस्थापक पृष्ठ रिक्त है**
उत्तर: कैश साफ़ करें, सिंटैक्स त्रुटियों के लिए मॉड्यूल की admin/menu.php जांचें।

**प्रश्न: मॉड्यूल ब्लॉक प्रदर्शित नहीं हो रहे हैं**
ए: एडमिन → ब्लॉक में ब्लॉक अनुमतियों की जांच करें, सत्यापित करें कि ब्लॉक पेजों को सौंपा गया है।

**प्रश्न: मॉड्यूल अद्यतन विफल**
उ: बैकअप डेटाबेस, मैन्युअल SQL अपडेट आज़माएं, संस्करण आवश्यकताओं की जांच करें।

### थीम्स**प्रश्न: थीम सही ढंग से लागू नहीं हो रही**
उ: Smarty कैश साफ़ करें, जाँचें कि थीम.html मौजूद है, थीम अनुमतियाँ सत्यापित करें।

**प्रश्न: कस्टम CSS लोड नहीं हो रहा**
उ: फ़ाइल पथ जांचें, ब्राउज़र कैश साफ़ करें, CSS सिंटैक्स सत्यापित करें।

**प्रश्न: छवियाँ प्रदर्शित नहीं हो रही हैं**
उ: छवि पथ जांचें, अपलोड फ़ोल्डर अनुमतियां सत्यापित करें।

### प्रदर्शन

**प्रश्न: साइट बहुत धीमी है**
उत्तर: कैशिंग सक्षम करें, डेटाबेस अनुकूलित करें, धीमी क्वेरी की जांच करें, OpCache सक्षम करें।

**प्रश्न: उच्च मेमोरी उपयोग**
ए: मेमोरी_लिमिट बढ़ाएं, बड़ी क्वेरीज़ को अनुकूलित करें, पेजिनेशन लागू करें।

---

## 🔧 रखरखाव आदेश

### सभी कैश साफ़ करें

```bash
#!/bin/bash
# clear_cache.sh
rm -rf xoops_data/caches/xoops_cache/*
rm -rf xoops_data/caches/smarty_cache/*
rm -rf xoops_data/caches/smarty_compile/*
echo "Cache cleared!"
```

### डेटाबेस अनुकूलन

```sql
-- Optimize all tables
OPTIMIZE TABLE xoops_config;
OPTIMIZE TABLE xoops_users;
OPTIMIZE TABLE xoops_session;
-- Repeat for other tables

-- Or optimize all at once
mysqlcheck -o -u user -p database
```

### फ़ाइल की सत्यनिष्ठा की जाँच करें

```bash
# Compare against fresh install
diff -r /path/to/xoops /path/to/fresh-xoops
```

---

## 🔗संबंधित दस्तावेज

- आरंभ करना
- सुरक्षा सर्वोत्तम प्रथाएँ
- XOOPS 4.0 रोडमैप

---

## 📚 बाहरी संसाधन

- [XOOPS फोरम](https://xoops.org/modules/newbb/)
- [GitHub मुद्दे]https://github.com/XOOPS/XoopsCore27/issues)
- [PHP त्रुटि संदर्भ](https://www.php.net/manual/en/errorfunc.constants.php)

---

#xoops #समस्या निवारण #डीबगिंग #faq #त्रुटियाँ #समाधान