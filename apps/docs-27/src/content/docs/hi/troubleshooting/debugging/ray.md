---
title: "रे डिबगर का उपयोग करना"
description: "रे डिबगर के साथ XOOPS अनुप्रयोगों को डिबग करना"
---
# XOOPS के लिए रे डिबगर का उपयोग करना

> रे के साथ आधुनिक डिबगिंग: अपने XOOPS एप्लिकेशन में वेरिएबल्स, लॉग संदेशों का निरीक्षण करें, SQL क्वेरीज़ और प्रोफ़ाइल प्रदर्शन को ट्रैक करें।

---

## रे क्या है?

रे एक हल्का डिबगिंग टूल है जो निष्पादन को रोके बिना या ब्रेकप्वाइंट का उपयोग किए बिना एप्लिकेशन स्थिति का निरीक्षण करने में आपकी सहायता करता है। यह XOOPS विकास के लिए बिल्कुल उपयुक्त है।

**विशेषताएं:**
- संदेश और चर लॉग करें
- SQL प्रश्नों का निरीक्षण करें
- ट्रैक प्रदर्शन
- प्रोफ़ाइल कोड
- समूह से संबंधित लॉग
- दृश्य समयरेखा

**आवश्यकताएँ:**
- PHP 7.4+
- रे एप्लिकेशन (मुफ़्त संस्करण उपलब्ध)
- संगीतकार

---

## स्थापना

### चरण 1: रे पैकेज स्थापित करें

```bash
cd /path/to/xoops

# Install Ray via Composer
composer require spatie/ray

# Or install globally
composer global require spatie/ray
```

### चरण 2: रे ऐप डाउनलोड करें

[ray.so](https://ray.so) से डाउनलोड करें:
- मैक: Ray.app
- विंडोज़: Ray.exe
- लिनक्स: रे (AppImage)

### चरण 3: फ़ायरवॉल कॉन्फ़िगर करें (यदि आवश्यक हो)

रे डिफ़ॉल्ट रूप से पोर्ट 23517 का उपयोग करता है:

```bash
# UFW
sudo ufw allow 23517/udp

# iptables
sudo iptables -A INPUT -p udp --dport 23517 -j ACCEPT
```

---

## बुनियादी उपयोग

### सरल लॉगिंग

```php
<?php
require_once 'mainfile.php';
require 'vendor/autoload.php';

// Initialize Ray
$ray = ray();

// Log a simple message
$ray->info('Page loaded');

// Log a variable
$user = ['name' => 'John', 'email' => 'john@example.com'];
$ray->dump($user);

// Log with label
$ray->label('User Data')->dump($user);
?>
```

**रे ऐप में आउटपुट:**
```
ℹ Page loaded
👁 User Data: ['name' => 'John', 'email' => 'john@example.com']
```

---

### विभिन्न लॉग स्तर

```php
<?php
$ray = ray();

// Info
$ray->info('Informational message');

// Success
$ray->success('Operation completed');

// Warning
$ray->warning('Potential issue');

// Error
$ray->error('An error occurred');

// Debug
$ray->debug('Debug information');

// Notice
$ray->notice('Notice message');
?>
```

---

### डंपिंग वेरिएबल्स

```php
<?php
$ray = ray();

// Simple dump
$ray->dump($variable);

// Multiple dumps
$ray->dump($var1, $var2, $var3);

// With labels
$ray->label('User')->dump($user);
$ray->label('Post')->dump($post);

// Dump array with formatting
$config = [
    'debug' => true,
    'cache' => 'redis',
    'db_host' => 'localhost'
];
$ray->label('Configuration')->dump($config);
?>
```

---

## उन्नत सुविधाएँ

### 1. SQL क्वेरी ट्रैकिंग

```php
<?php
$ray = ray();

// Log database query
$ray->notice('Running query');
$result = $GLOBALS['xoopsDB']->query("SELECT * FROM xoops_users LIMIT 10");

// Log result
while ($row = $result->fetch_assoc()) {
    $ray->dump($row);
}

// Or log with label
$query = "SELECT COUNT(*) as total FROM xoops_articles";
$ray->label('Article Count Query')->info($query);
$result = $GLOBALS['xoopsDB']->query($query);
?>
```

### 2. प्रदर्शन प्रोफ़ाइलिंग

```php
<?php
$ray = ray();

// Start a profile
$ray->showQueries();  // Show all queries

// Your code
$start = microtime(true);
expensive_operation();
$end = microtime(true);

$ray->label('Execution Time')->info(($end - $start) . ' seconds');

// Or measure directly
$ray->measure(function() {
    expensive_operation();
});
?>
```

### 3. सशर्त डिबगिंग

```php
<?php
$ray = ray();

// Only in development
if (defined('XOOPS_DEBUG_LEVEL') && XOOPS_DEBUG_LEVEL > 0) {
    $ray->debug('Debug mode enabled');
}

// Only for specific user
if ($xoopsUser && $xoopsUser->getVar('uid') == 1) {
    $ray->dump($sensitive_data);
}

// Only in specific section
if ($_GET['debug'] == 'module') {
    $ray->label('Module Debug')->dump($_GET);
}
?>
```

### 4. संबंधित लॉग्स को समूहीकृत करना

```php
<?php
$ray = ray();

// Start a group
$ray->group('User Authentication');
    $ray->info('Checking credentials');
    $ray->info('Password verified');
    $ray->success('User authenticated');
$ray->groupEnd();

// Or use closure
$ray->group('Database Operations', function($ray) {
    $ray->info('Connecting to database');
    $ray->info('Running queries');
    $ray->success('Operations complete');
});
?>
```

---

## XOOPS-विशिष्ट डिबगिंग

### मॉड्यूल डिबगिंग

```php
<?php
// modules/mymodule/index.php
require_once '../../mainfile.php';
require_once XOOPS_ROOT_PATH . '/vendor/autoload.php';

$ray = ray();

// Log module initialization
$ray->group('Module Initialization');
    $ray->info('Module: ' . XOOPS_MODULE_NAME);

    // Check module is active
    if (is_object($xoopsModule)) {
        $ray->success('Module loaded');
        $ray->dump($xoopsModule->getValues());
    }

    // Check user permissions
    if (xoops_isUser()) {
        $ray->info('User: ' . $xoopsUser->getVar('uname'));
    } else {
        $ray->warning('Anonymous user');
    }
$ray->groupEnd();

// Get module config
$config_handler = xoops_getHandler('config');
$module = xoops_getHandler('module')->getByDirname(XOOPS_MODULE_NAME);
$settings = $config_handler->getConfigsByCat(0, $module->mid());

$ray->label('Module Settings')->dump($settings);
?>
```

### टेम्प्लेट डिबगिंग

```php
<?php
// In template or PHP code
$ray = ray();

// Log assigned variables
$tpl = new XoopsTpl();
$ray->label('Template Variables')->dump($tpl->get_template_vars());

// Log specific variables
$ray->label('User Variable')->dump($tpl->get_template_vars('user'));

// Log Smarty engine state
$ray->label('Smarty Config')->dump([
    'compile_dir' => $tpl->getCompileDir(),
    'cache_dir' => $tpl->getCacheDir(),
    'debugging' => $tpl->debugging
]);
?>
```

### डेटाबेस डिबगिंग

```php
<?php
$ray = ray();

// Log database operations
$ray->group('Database Operations');

// Count queries
$ray->info('Database Prefix: ' . XOOPS_DB_PREFIX);

// List tables
$result = $GLOBALS['xoopsDB']->query("SHOW TABLES");
$tables = [];
while ($row = $result->fetch_row()) {
    $tables[] = $row[0];
}
$ray->label('Tables')->dump($tables);

// Check connection
if ($GLOBALS['xoopsDB']) {
    $ray->success('Database connected');
} else {
    $ray->error('Database connection failed');
}

$ray->groupEnd();
?>
```

---

## कस्टम रे फ़ंक्शन

### सहायक फ़ंक्शन बनाएं

```php
<?php
// Create file: class/rayhelper.php

class RayHelper {
    public static function init() {
        return ray();
    }

    public static function module($module_name) {
        $ray = ray();
        $module = xoops_getHandler('module')->getByDirname($module_name);

        if (!$module) {
            $ray->error("Module '$module_name' not found");
            return;
        }

        $ray->group("Module: $module_name");
        $ray->dump([
            'name' => $module->getVar('name'),
            'version' => $module->getVar('version'),
            'active' => $module->getVar('isactive'),
            'mid' => $module->getVar('mid')
        ]);
        $ray->groupEnd();
    }

    public static function user() {
        global $xoopsUser;
        $ray = ray();

        if (!$xoopsUser) {
            $ray->info('Anonymous user');
            return;
        }

        $ray->group('User Information');
        $ray->dump([
            'uname' => $xoopsUser->getVar('uname'),
            'uid' => $xoopsUser->getVar('uid'),
            'email' => $xoopsUser->getVar('email'),
            'admin' => $xoopsUser->isAdmin()
        ]);
        $ray->groupEnd();
    }

    public static function config($module_name) {
        $ray = ray();

        $module = xoops_getHandler('module')->getByDirname($module_name);
        if (!$module) {
            $ray->error("Module '$module_name' not found");
            return;
        }

        $config_handler = xoops_getHandler('config');
        $settings = $config_handler->getConfigsByCat(0, $module->mid());

        $ray->label("$module_name Configuration")->dump($settings);
    }
}
?>
```

उपयोग:
```php
<?php
require 'class/rayhelper.php';

RayHelper::user();
RayHelper::module('mymodule');
RayHelper::config('mymodule');
?>
```

---

## प्रदर्शन की निगरानी

### क्वेरी प्रदर्शन

```php
<?php
$ray = ray();

// Measure query time
$ray->group('Query Performance');

$queries = [
    "SELECT COUNT(*) FROM xoops_users",
    "SELECT * FROM xoops_articles LIMIT 1000",
    "SELECT a.*, u.uname FROM xoops_articles a JOIN xoops_users u"
];

foreach ($queries as $query) {
    $start = microtime(true);
    $result = $GLOBALS['xoopsDB']->query($query);
    $time = (microtime(true) - $start) * 1000;  // ms

    $ray->label(substr($query, 0, 40) . '...')->info("${time}ms");
}

$ray->groupEnd();
?>
```

### प्रदर्शन का अनुरोध करें

```php
<?php
$ray = ray();

// Measure total request time
$ray->group('Request Metrics');

// Memory usage
$memory = memory_get_usage() / 1024 / 1024;
$peak = memory_get_peak_usage() / 1024 / 1024;
$ray->info("Memory: {$memory}MB / Peak: {$peak}MB");

// Check execution time
if (function_exists('microtime')) {
    $elapsed = isset($_SERVER['REQUEST_TIME_FLOAT'])
        ? microtime(true) - $_SERVER['REQUEST_TIME_FLOAT']
        : 0;
    $ray->info("Execution time: {$elapsed}s");
}

// File inclusion count
if (function_exists('get_included_files')) {
    $files = count(get_included_files());
    $ray->info("Files included: $files");
}

$ray->groupEnd();
?>
```

---

## डिबगिंग वर्कफ़्लोज़

### मॉड्यूल इंस्टालेशन डिबगिंग

```php
<?php
// Create modules/mymodule/debug_install.php
require_once '../../mainfile.php';
require_once XOOPS_ROOT_PATH . '/vendor/autoload.php';

$ray = ray();

$ray->group('Module Installation Debug');

// Check xoopsversion.php
$version_file = __DIR__ . '/xoopsversion.php';
if (file_exists($version_file)) {
    $modversion = [];
    include $version_file;
    $ray->label('xoopsversion.php')->dump($modversion);
} else {
    $ray->error('xoopsversion.php not found');
}

// Check language files
$lang_files = glob(__DIR__ . '/language/*/');
$ray->label('Language files')->info("Found " . count($lang_files) . " language(s)");

// Check database tables
$module = xoops_getHandler('module')->getByDirname(basename(__DIR__));
if ($module) {
    $ray->label('Module ID')->info($module->mid());
} else {
    $ray->warning('Module not in database');
}

$ray->groupEnd();

echo "Debug information sent to Ray";
?>
```

### टेम्प्लेट त्रुटि डिबगिंग

```php
<?php
// Check template rendering
$ray = ray();

$tpl = new XoopsTpl();

$ray->group('Template Debug');

// Log variables
$vars = $tpl->get_template_vars();
$ray->label('Available Variables')->dump(array_keys($vars));

// Check template exists
$template = 'file:templates/page.html';
$ray->info("Template: $template");

// Check compilation
$compile_dir = $tpl->getCompileDir();
$files = glob($compile_dir . '*.php');
$ray->label('Compiled Templates')->info(count($files) . " compiled templates");

$ray->groupEnd();
?>
```

---

## सर्वोत्तम प्रथाएँ

```mermaid
graph TD
    A[Ray Best Practices] --> B["1. Label your logs"]
    A --> C["2. Group related logs"]
    A --> D["3. Use appropriate levels"]
    A --> E["4. Clean up before production"]
    A --> F["5. Measure performance"]

    B --> B1["ray.label().dump()"]
    C --> C1["ray.group()"]
    D --> D1["info, warning, error"]
    E --> E1["Remove ray() calls"]
    F --> F1["Use ray.measure()"]
```

### क्लीनअप स्क्रिप्ट

```php
<?php
// Remove Ray from production
// Create script to strip Ray calls

function remove_ray_calls($file) {
    $content = file_get_contents($file);

    // Remove ray() calls
    $content = preg_replace('/\$ray\s*=\s*ray\(\);/', '', $content);
    $content = preg_replace('/\$?ray\->[a-zA-Z_][a-zA-Z0-9_]*\([^)]*\);?/', '', $content);
    $content = preg_replace('/ray\(\)->[a-zA-Z_][a-zA-Z0-9_]*\([^)]*\);?/', '', $content);

    file_put_contents($file, $content);
}

// Find all PHP files with ray() and remove
$files = glob('modules/**/*.php', GLOB_RECURSIVE);
foreach ($files as $file) {
    if (strpos(file_get_contents($file), 'ray()') !== false) {
        remove_ray_calls($file);
        echo "Cleaned: $file\n";
    }
}
?>
```

---

## समस्या निवारण रे

### प्रश्न: रे को संदेश प्राप्त नहीं होते

**ए:**
1. चेक रे ऐप चल रहा है
2. जांचें कि फ़ायरवॉल पोर्ट 23517 की अनुमति देता है
3. सत्यापित करें कि रे स्थापित है:
```bash
composer require spatie/ray
```

### प्रश्न: SQL क्वेरीज़ नहीं देख सकता

**ए:**
```php
<?php
// Log queries manually
$ray = ray();

$query = "SELECT * FROM xoops_users";
$ray->info("Query: $query");

$result = $GLOBALS['xoopsDB']->query($query);

if (!$result) {
    $ray->error($GLOBALS['xoopsDB']->error);
}
?>
```

### प्रश्न: रे का प्रदर्शन प्रभाव

**ए:** रे के पास न्यूनतम ओवरहेड है। उत्पादन के लिए, रे कॉल हटाएं या अक्षम करें:
```php
<?php
// Disable Ray in production
if (defined('ENVIRONMENT') && ENVIRONMENT == 'production') {
    function ray(...$args) {
        return new class {
            public function __call($name, $args) { return $this; }
        };
    }
}
?>
```

---

## संबंधित दस्तावेज़ीकरण

- डिबग मोड सक्षम करें
- डेटाबेस डिबगिंग
- प्रदर्शन अक्सर पूछे जाने वाले प्रश्न
- समस्या निवारण गाइड

---

#xoops #डिबगिंग #रे #प्रोफाइलिंग #निगरानी