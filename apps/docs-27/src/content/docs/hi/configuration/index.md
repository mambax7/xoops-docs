---
title: "बुनियादी विन्यास"
description: "प्रारंभिक XOOPS सेटअप जिसमें mainfile.php सेटिंग्स, साइट का नाम, ईमेल और टाइमज़ोन कॉन्फ़िगरेशन शामिल है"
---
# बुनियादी XOOPS कॉन्फ़िगरेशन

यह मार्गदर्शिका आपकी XOOPS साइट को इंस्टॉलेशन के बाद ठीक से चलाने के लिए आवश्यक कॉन्फ़िगरेशन सेटिंग्स को शामिल करती है।

## mainfile.php कॉन्फ़िगरेशन

`mainfile.php` फ़ाइल में आपके XOOPS इंस्टॉलेशन के लिए महत्वपूर्ण कॉन्फ़िगरेशन शामिल है। इसे इंस्टालेशन के दौरान बनाया गया है लेकिन आपको इसे मैन्युअल रूप से संपादित करने की आवश्यकता हो सकती है।

### स्थान

```
/var/www/html/xoops/mainfile.php
```

### फ़ाइल संरचना

```php
<?php
// Database Configuration
define('XOOPS_DB_TYPE', 'mysqli');  // Database type
define('XOOPS_DB_HOST', 'localhost');  // Database host
define('XOOPS_DB_USER', 'xoops_user');  // Database user
define('XOOPS_DB_PASS', 'password');  // Database password
define('XOOPS_DB_NAME', 'xoops_db');  // Database name
define('XOOPS_DB_PREFIX', 'xoops_');  // Table prefix

// Site Configuration
define('XOOPS_ROOT_PATH', '/var/www/html/xoops');  // File system path
define('XOOPS_URL', 'http://your-domain.com/xoops');  // Web URL
define('XOOPS_TRUST_PATH', '/var/www/html/xoops/var');  // Trusted path

// Character Set
define('XOOPS_DB_CHARSET', 'utf8mb4');  // Database charset
define('_CHARSET', 'UTF-8');  // Page charset

// Debug Mode (set to 0 in production)
define('XOOPS_DEBUG', 0);  // Set to 1 for debugging
?>
```

### महत्वपूर्ण सेटिंग्स समझाई गईं

| सेटिंग | उद्देश्य | उदाहरण |
|---|---|---|
| `XOOPS_DB_TYPE` | डेटाबेस सिस्टम | `mysqli`, `mysql`, `pdo` |
| `XOOPS_DB_HOST` | डेटाबेस सर्वर स्थान | `localhost`, `192.168.1.1` |
| `XOOPS_DB_USER` | डेटाबेस उपयोक्तानाम | `xoops_user` |
| `XOOPS_DB_PASS` | डेटाबेस पासवर्ड | [सुरक्षित_पासवर्ड] |
| `XOOPS_DB_NAME` | डेटाबेस का नाम | `xoops_db` |
| `XOOPS_DB_PREFIX` | तालिका का नाम उपसर्ग | `xoops_` (एक डीबी पर एकाधिक XOOPS की अनुमति देता है) |
| `XOOPS_ROOT_PATH` | भौतिक फ़ाइल सिस्टम पथ | `/var/www/html/xoops` |
| `XOOPS_URL` | वेब पहुंच योग्य URL | `http://your-domain.com` |
| `XOOPS_TRUST_PATH` | विश्वसनीय पथ (वेब ​​रूट के बाहर) | `/var/www/xoops_var` |

### mainfile.php का संपादन

टेक्स्ट एडिटर में mainfile.php खोलें:

```bash
# Using nano
nano /var/www/html/xoops/mainfile.php

# Using vi
vi /var/www/html/xoops/mainfile.php

# Using sed (find and replace)
sed -i "s|define('XOOPS_URL'.*|define('XOOPS_URL', 'http://new-domain.com');|" /var/www/html/xoops/mainfile.php
```

### सामान्य मेनफ़ाइल.php परिवर्तन

**साइट URL बदलें:**
```php
define('XOOPS_URL', 'https://yourdomain.com');
```

**डीबग मोड सक्षम करें (केवल विकास):**
```php
define('XOOPS_DEBUG', 1);
```

**तालिका उपसर्ग बदलें (यदि आवश्यक हो):**
```php
define('XOOPS_DB_PREFIX', 'myxoops_');
```

**विश्वास पथ को वेब रूट से बाहर ले जाएं (उन्नत):**
```php
define('XOOPS_TRUST_PATH', '/var/www/xoops_var');
```

## एडमिन पैनल कॉन्फ़िगरेशन

XOOPS व्यवस्थापक पैनल के माध्यम से बुनियादी सेटिंग्स कॉन्फ़िगर करें।

### सिस्टम सेटिंग्स तक पहुँचना

1. एडमिन पैनल में लॉग इन करें: `http://your-domain.com/xoops/admin/`
2. यहां नेविगेट करें: **सिस्टम > प्राथमिकताएं > सामान्य सेटिंग्स**
3. सेटिंग्स संशोधित करें (नीचे देखें)
4. नीचे "सहेजें" पर क्लिक करें

### साइट का नाम और विवरण

कॉन्फ़िगर करें कि आपकी साइट कैसी दिखे:

```
Site Name: My XOOPS Site
Site Description: A dynamic content management system
Site Slogan: Built with XOOPS
```

### संपर्क जानकारी

साइट संपर्क विवरण सेट करें:

```
Site Admin Email: admin@your-domain.com
Site Admin Name: Site Administrator
Contact Form Email: support@your-domain.com
Support Email: help@your-domain.com
```

### भाषा और क्षेत्र

डिफ़ॉल्ट भाषा और क्षेत्र सेट करें:

```
Default Language: English
Default Timezone: America/New_York  (or your timezone)
Date Format: %Y-%m-%d
Time Format: %H:%M:%S
```

## ईमेल कॉन्फ़िगरेशन

सूचनाओं और उपयोगकर्ता संचार के लिए ईमेल सेटिंग्स कॉन्फ़िगर करें।

### ईमेल सेटिंग्स स्थान

**एडमिन पैनल:** सिस्टम > प्राथमिकताएँ > ईमेल सेटिंग्स

### SMTP कॉन्फ़िगरेशन

विश्वसनीय ईमेल डिलीवरी के लिए, PHP mail() के बजाय SMTP का उपयोग करें:

```
Use SMTP: Yes
SMTP Host: smtp.gmail.com  (or your SMTP provider)
SMTP Port: 587  (TLS) or 465 (SSL)
SMTP Username: your-email@gmail.com
SMTP Password: [app_password]
SMTP Security: TLS or SSL
```

### जीमेल कॉन्फ़िगरेशन उदाहरण

जीमेल के माध्यम से ईमेल भेजने के लिए XOOPS सेट करें:

```
SMTP Host: smtp.gmail.com
SMTP Port: 587
SMTP Security: TLS
SMTP Username: your-email@gmail.com
SMTP Password: [Google App Password - NOT regular password]
From Address: your-email@gmail.com
From Name: Your Site Name
```

**ध्यान दें:** जीमेल को ऐप पासवर्ड की आवश्यकता है, आपके जीमेल पासवर्ड की नहीं:
1. https://myaccount.google.com/apppasswords पर जाएं
2. "मेल" और "विंडोज कंप्यूटर" के लिए ऐप पासवर्ड जेनरेट करें
3. जनरेट किए गए पासवर्ड का उपयोग XOOPS में करें

### PHP mail() कॉन्फ़िगरेशन (सरल लेकिन कम विश्वसनीय)

यदि SMTP अनुपलब्ध है, तो PHP mail() का उपयोग करें:

```
Use SMTP: No
From Address: noreply@your-domain.com
From Name: Your Site Name
```

सुनिश्चित करें कि आपके सर्वर में सेंडमेल या पोस्टफ़िक्स कॉन्फ़िगर है:

```bash
# Check if sendmail is available
which sendmail

# Or check postfix
systemctl status postfix
```

### ईमेल फ़ंक्शन सेटिंग्स

ईमेल को ट्रिगर करने वाली चीज़ों को कॉन्फ़िगर करें:

```
Send Notifications: Yes
Notify Admin on User Registration: Yes
Send Welcome Email to New Users: Yes
Send Password Reset Link: Yes
Enable User Email: Yes
Enable Private Messages: Yes
Notify on Admin Actions: Yes
```

## समयक्षेत्र विन्यास

सही टाइमस्टैम्प और शेड्यूलिंग के लिए उचित समयक्षेत्र निर्धारित करें।

### एडमिन पैनल में टाइमज़ोन सेट करना

**पथ:** सिस्टम > प्राथमिकताएँ > सामान्य सेटिंग्स

```
Default Timezone: [Select your timezone]
```

**सामान्य समयक्षेत्र:**
- अमेरिका/न्यूयॉर्क (ईएसटी/ईडीटी)
- अमेरिका/शिकागो (सीएसटी/सीडीटी)
- अमेरिका/डेनवर (एमएसटी/एमडीटी)
- अमेरिका/लॉस एंजेल्स (पीएसटी/पीडीटी)
- यूरोप/लंदन (जीएमटी/बीएसटी)
- यूरोप/पेरिस (CET/CEST)
- एशिया/टोक्यो (जेएसटी)
- एशिया/शंघाई (सीएसटी)
- ऑस्ट्रेलिया/सिडनी (AEDT/AEST)

### समयक्षेत्र सत्यापित करें

वर्तमान सर्वर समय क्षेत्र की जाँच करें:

```bash
# Show current timezone
timedatectl

# Or check date
date +%Z

# List available timezones
timedatectl list-timezones
```

### सिस्टम टाइमज़ोन सेट करें (लिनक्स)

```bash
# Set timezone
timedatectl set-timezone America/New_York

# Or use symlink method
ln -sf /usr/share/zoneinfo/America/New_York /etc/localtime

# Verify
date
```

## URL कॉन्फ़िगरेशन

### स्वच्छ URL सक्षम करें (अनुकूल URL)

`/index.php?page=about` के बजाय `/page/about` जैसे URL के लिए

**आवश्यकताएँ:**
- mod_rewrite सक्षम के साथ अपाचे
- `.htaccess` फ़ाइल XOOPS रूट में

**व्यवस्थापक पैनल में सक्षम करें:**1. यहां जाएं: **सिस्टम > प्राथमिकताएं > URL सेटिंग्स**
2. जांचें: "अनुकूल URL सक्षम करें"
3. चुनें: "URL प्रकार" (पथ जानकारी या क्वेरी)
4. सहेजें

**सत्यापित करें कि .htaccess मौजूद है:**

```bash
cat /var/www/html/xoops/.htaccess
```

नमूना .htaccess सामग्री:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /xoops/
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ index.php?$1 [L,QSA]
</IfModule>
```

**स्वच्छ URL की समस्या का निवारण:**

```bash
# Verify mod_rewrite enabled
apache2ctl -M | grep rewrite

# Enable if needed
a2enmod rewrite

# Restart Apache
systemctl restart apache2

# Test rewrite rule
curl -I http://your-domain.com/xoops/index.php
```

### साइट URL कॉन्फ़िगर करें

**एडमिन पैनल:** सिस्टम > प्राथमिकताएँ > सामान्य सेटिंग्स

अपने डोमेन के लिए सही URL सेट करें:

```
Site URL: http://your-domain.com/xoops/
```

या यदि XOOPS रूट में है:

```
Site URL: http://your-domain.com/
```

## खोज इंजन अनुकूलन (एसईओ)

बेहतर खोज इंजन दृश्यता के लिए SEO सेटिंग्स कॉन्फ़िगर करें।

### मेटा टैग

वैश्विक मेटा टैग सेट करें:

**एडमिन पैनल:** सिस्टम > प्राथमिकताएँ > SEO सेटिंग्स

```
Meta Keywords: xoops, cms, content management
Meta Description: A dynamic content management system
```

ये पृष्ठ `<head>` में दिखाई देते हैं:

```html
<meta name="keywords" content="xoops, cms, content management">
<meta name="description" content="A dynamic content management system">
```

### साइटमैप

खोज इंजन के लिए XML साइटमैप सक्षम करें:

1. यहां जाएं: **सिस्टम > मॉड्यूल**
2. "साइटमैप" मॉड्यूल ढूंढें
3. इंस्टॉल और सक्षम करने के लिए क्लिक करें
4. साइटमैप तक पहुंचें: `/xoops/sitemap.xml`

### रोबोट्स.txt

खोज इंजन क्रॉलिंग को नियंत्रित करें:

`/var/www/html/xoops/robots.txt` बनाएं:

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /templates_c/
Disallow: /install/
Disallow: /upgrade/

Sitemap: https://your-domain.com/xoops/sitemap.xml
```

## उपयोगकर्ता सेटिंग्स

डिफ़ॉल्ट उपयोगकर्ता-संबंधित सेटिंग्स कॉन्फ़िगर करें।

### उपयोगकर्ता पंजीकरण

**एडमिन पैनल:** सिस्टम > प्राथमिकताएँ > उपयोगकर्ता सेटिंग्स

```
Allow User Registration: Yes/No
User Registration Type:
  - Instant (Automatic approval)
  - Approval Required (Admin approval needed)
  - Email Verification (Email confirmation required)

Email Confirmation Required: Yes/No
Account Activation Method: Automatic/Manual
```

### उपयोगकर्ता प्रोफ़ाइल

```
Enable User Profiles: Yes
Show User Avatar: Yes
Maximum Avatar Size: 100KB
Avatar Dimensions: 100x100 pixels
```

### उपयोगकर्ता ईमेल प्रदर्शन

```
Show User Email: No (for privacy)
Users Can Hide Email: Yes
Users Can Change Avatar: Yes
Users Can Upload Files: Yes
```

## कैश कॉन्फ़िगरेशन

उचित कैशिंग के साथ प्रदर्शन में सुधार करें।

### कैश सेटिंग्स

**एडमिन पैनल:** सिस्टम > प्राथमिकताएँ > कैश सेटिंग्स

```
Enable Caching: Yes
Cache Method: File (or APCu/Memcache if available)
Cache Lifetime: 3600 seconds (1 hour)
```

### कैश साफ़ करें

पुरानी कैश फ़ाइलें साफ़ करें:

```bash
# Manual cache clear
rm -rf /var/www/html/xoops/cache/*
rm -rf /var/www/html/xoops/templates_c/*

# From admin panel:
# System > Dashboard > Tools > Clear Cache
```

## प्रारंभिक सेटिंग्स चेकलिस्ट

स्थापना के बाद, कॉन्फ़िगर करें:

- [ ] साइट का नाम और विवरण सही ढंग से सेट किया गया है
- [ ] व्यवस्थापक ईमेल कॉन्फ़िगर किया गया
- [ ] SMTP ईमेल सेटिंग्स कॉन्फ़िगर और परीक्षण की गईं
- [ ] समयक्षेत्र आपके क्षेत्र के अनुसार निर्धारित किया गया है
- [ ] URL सही तरीके से कॉन्फ़िगर किया गया है
- [ ] यदि वांछित हो तो स्वच्छ URL (अनुकूल URL) सक्षम करें
- [ ] उपयोगकर्ता पंजीकरण सेटिंग्स कॉन्फ़िगर की गईं
- [ ] एसईओ के लिए मेटा टैग कॉन्फ़िगर किया गया
- [ ] डिफ़ॉल्ट भाषा चयनित
- [ ] कैश सेटिंग्स सक्षम
- [ ] व्यवस्थापक उपयोगकर्ता पासवर्ड मजबूत है (16+ अक्षर)
- [ ] उपयोगकर्ता पंजीकरण का परीक्षण करें
- [ ] ईमेल कार्यक्षमता का परीक्षण करें
- [ ] परीक्षण फ़ाइल अपलोड
- [ ] मुखपृष्ठ पर जाएँ और उपस्थिति सत्यापित करें

## परीक्षण कॉन्फ़िगरेशन

### टेस्ट ईमेल

एक परीक्षण ईमेल भेजें:

**एडमिन पैनल:** सिस्टम > ईमेल टेस्ट

या मैन्युअल रूप से:

```php
<?php
// Create test file: /var/www/html/xoops/test-email.php
require_once __DIR__ . '/mainfile.php';
require_once XOOPS_ROOT_PATH . '/class/mail/phpmailer/class.phpmailer.php';

$mailer = xoops_getMailer();
$mailer->addRecipient('admin@your-domain.com');
$mailer->setSubject('XOOPS Email Test');
$mailer->setBody('This is a test email from XOOPS');

if ($mailer->send()) {
    echo "Email sent successfully!";
} else {
    echo "Failed to send email: " . $mailer->getError();
}
?>
```

### डेटाबेस कनेक्शन का परीक्षण करें

```php
<?php
// Create test file: /var/www/html/xoops/test-db.php
require_once __DIR__ . '/mainfile.php';

$connection = XoopsDatabaseFactory::getDatabaseConnection();
if ($connection) {
    echo "Database connected successfully!";
    $result = $connection->query("SELECT COUNT(*) FROM " . $connection->prefix("users"));
    if ($result) {
        echo "Query successful!";
    }
} else {
    echo "Database connection failed!";
}
?>
```

**महत्वपूर्ण:** परीक्षण के बाद परीक्षण फ़ाइलें हटा दें!

```bash
rm /var/www/html/xoops/test-*.php
```

## कॉन्फ़िगरेशन फ़ाइलें सारांश

| फ़ाइल | उद्देश्य | विधि संपादित करें |
|---|---|---|
| मेनफ़ाइल.php | डेटाबेस और कोर सेटिंग्स | पाठ संपादक |
| एडमिन पैनल | अधिकांश सेटिंग्स | वेब इंटरफ़ेस |
| .htaccess | URL पुनर्लेखन | पाठ संपादक |
| रोबोट.txt | खोज इंजन क्रॉलिंग | पाठ संपादक |

## अगले चरण

बुनियादी विन्यास के बाद:

1. सिस्टम सेटिंग्स को विस्तार से कॉन्फ़िगर करें
2. कड़ी सुरक्षा
3. व्यवस्थापक पैनल का अन्वेषण करें
4. अपनी पहली सामग्री बनाएं
5. उपयोगकर्ता खाते सेट करें

---

**टैग्स:** #कॉन्फिगरेशन #सेटअप #ईमेल #टाइमज़ोन #एसईओ

**संबंधित लेख:**
- ../स्थापना/स्थापना
- सिस्टम-सेटिंग्स
- सुरक्षा-विन्यास
- प्रदर्शन-अनुकूलन