---
title: "حالت Debug Mode را فعال کنید"
description: "نحوه فعال کردن و استفاده از حالت اشکال زدایی XOOPS برای عیب یابی"
---
> راهنمای جامع ویژگی ها و ابزارهای اشکال زدایی XOOPS.

---

## معماری اشکال زدایی

```mermaid
graph TB
    subgraph "Debug Sources"
        A[PHP Errors]
        B[SQL Queries]
        C[Template Variables]
        D[Execution Time]
        E[Memory Usage]
    end

    subgraph "Debug Output"
        F[On-Screen Display]
        G[Log Files]
        H[Debug Bar]
        I[Ray Debugger]
    end

    A --> F
    A --> G
    B --> F
    B --> H
    C --> F
    D --> H
    E --> H

    subgraph "Debug Levels"
        J[Level 0: Off]
        K[Level 1: PHP Only]
        L[Level 2: PHP + SQL]
        M[Level 3: Full Debug]
    end
```

---

## سطوح اشکال زدایی XOOPS

### در mainfile.php فعال کنید

```php
<?php
// Debug level settings
define('XOOPS_DEBUG_LEVEL', 2);

// Level 0: Debug off (production)
// Level 1: PHP debug only
// Level 2: PHP + SQL queries
// Level 3: PHP + SQL + Smarty templates
```

### جزئیات سطح

| سطح | خطاهای PHP | پرس و جوهای SQL | قالب Vars | توصیه شده برای |
|-------|------------|------------|---------------------------------|
| 0 | پنهان | نه | نه | تولید |
| 1 | نمایش داده شده | نه | نه | چک های سریع |
| 2 | نمایش داده شده | وارد شده | نه | توسعه |
| 3 | نمایش داده شده | وارد شده | نمایش داده شده | اشکال زدایی عمیق |

---

## نمایش خطای PHP

### تنظیمات توسعه

```php
// Add to mainfile.php for development
error_reporting(E_ALL);
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
ini_set('log_errors', '1');
ini_set('error_log', XOOPS_VAR_PATH . '/logs/php_errors.log');
```

### تنظیمات تولید

```php
// Secure settings for production
error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED);
ini_set('display_errors', '0');
ini_set('log_errors', '1');
ini_set('error_log', XOOPS_VAR_PATH . '/logs/php_errors.log');
```

---

## اشکال زدایی پرس و جوی SQL

### پرس و جوها را در حالت Debug مشاهده کنید

با تنظیم `XOOPS_DEBUG_LEVEL` روی 2 یا 3، پرس و جوهای SQL در پایین صفحات ظاهر می شوند.

### ثبت پرس و جو دستی

```php
// Log specific query
$sql = "SELECT * FROM " . $GLOBALS['xoopsDB']->prefix('mymodule_items');

// Before executing
error_log("SQL Query: " . $sql);

$result = $GLOBALS['xoopsDB']->query($sql);

// Log query time
$start = microtime(true);
$result = $GLOBALS['xoopsDB']->query($sql);
$time = microtime(true) - $start;
error_log("Query took: " . number_format($time * 1000, 2) . "ms");
```

### با استفاده از XoopsLogger

```php
// Access the logger
$logger = $GLOBALS['xoopsLogger'];

// Get all queries
$queries = $logger->queries;
foreach ($queries as $query) {
    echo "SQL: " . $query['sql'] . "\n";
    echo "Time: " . $query['time'] . "s\n";
    echo "---\n";
}

// Log custom message
$logger->addExtra('My Debug', 'Custom debug message');
```

---

## اشکال زدایی قالب هوشمند

### کنسول Smarty Debug را فعال کنید

```php
// In your module or template
{debug}

// Or in PHP
$GLOBALS['xoopsTpl']->debugging = true;
$GLOBALS['xoopsTpl']->debugging_ctrl = 'URL';  // Add SMARTY_DEBUG to URL
```

### متغیرهای اختصاص داده شده را مشاهده کنید

```smarty
{* In template, show all assigned variables *}
<pre>
{$smarty.template_object->tpl_vars|print_r}
</pre>

{* Show specific variable *}
{$myvar|@debug_print_var}
```

### اشکال زدایی در PHP

```php
// Before displaying template
echo "<pre>";
print_r($GLOBALS['xoopsTpl']->getTemplateVars());
echo "</pre>";
```

---

## Ray Debugger ادغام

### نصب

```bash
composer require spatie/ray --dev
```

### پیکربندی

```php
// ray.php in XOOPS root
return [
    'enable' => true,
    'host' => 'localhost',
    'port' => 23517,
    'remote_path' => null,
    'local_path' => null,
];
```

### مثال های استفاده

```php
// Basic output
ray('Hello from XOOPS');

// Variable inspection
ray($item)->label('Item Object');

// Expanded view
ray($complexArray)->expand();

// Measure execution time
ray()->measure();
// ... code to measure ...
ray()->measure();

// SQL queries
ray()->showQueries();

// Color coding
ray('Error occurred')->red();
ray('Success!')->green();
ray('Warning')->orange();

// Stack trace
ray()->trace();

// Pause execution (like breakpoint)
ray()->pause();
```

### پرس و جوهای پایگاه داده اشکال زدایی

```php
// Log all queries
ray()->showQueries();

// Or specific query
$sql = "SELECT * FROM items WHERE status = 'active'";
ray($sql)->label('Query');

$result = $db->query($sql);
ray($result)->label('Result');
```

---

## PHP Debug Bar

### نصب

```bash
composer require maximebf/debugbar
```

### یکپارچه سازی

```php
<?php
// include/debugbar.php

use DebugBar\StandardDebugBar;

$debugbar = new StandardDebugBar();
$debugbarRenderer = $debugbar->getJavascriptRenderer();

// Add to header
echo $debugbarRenderer->renderHead();

// Log messages
$debugbar['messages']->addMessage('Hello World!');

// Log exceptions
$debugbar['exceptions']->addException(new Exception('Test'));

// Time operations
$debugbar['time']->startMeasure('operation', 'My Operation');
// ... code ...
$debugbar['time']->stopMeasure('operation');

// Add to footer
echo $debugbarRenderer->render();
```

---

## راهنمای اشکال زدایی سفارشی

```php
<?php
// class/Debug.php

namespace XoopsModules\MyModule;

class Debug
{
    private static bool $enabled = true;
    private static array $logs = [];
    private static float $startTime;

    public static function init(): void
    {
        self::$startTime = microtime(true);
        self::$enabled = (defined('XOOPS_DEBUG_LEVEL') && XOOPS_DEBUG_LEVEL > 0);
    }

    public static function log(string $message, string $level = 'info'): void
    {
        if (!self::$enabled) return;

        self::$logs[] = [
            'time' => microtime(true) - self::$startTime,
            'level' => $level,
            'message' => $message,
            'memory' => memory_get_usage(true)
        ];

        // Also write to file
        $logFile = XOOPS_VAR_PATH . '/logs/debug_' . date('Y-m-d') . '.log';
        $logMessage = sprintf(
            "[%s] [%s] [%.4fs] [%s MB] %s\n",
            date('H:i:s'),
            strtoupper($level),
            microtime(true) - self::$startTime,
            round(memory_get_usage(true) / 1024 / 1024, 2),
            $message
        );
        error_log($logMessage, 3, $logFile);
    }

    public static function dump($var, string $label = ''): void
    {
        if (!self::$enabled) return;

        $output = $label ? "$label: " : '';
        $output .= print_r($var, true);
        self::log($output, 'dump');

        if (php_sapi_name() !== 'cli') {
            echo "<pre style='background:#f5f5f5;padding:10px;margin:10px;border:1px solid #ddd;'>";
            if ($label) echo "<strong>$label:</strong>\n";
            var_dump($var);
            echo "</pre>";
        }
    }

    public static function time(string $label): callable
    {
        $start = microtime(true);
        return function() use ($start, $label) {
            $elapsed = microtime(true) - $start;
            self::log("$label: " . number_format($elapsed * 1000, 2) . "ms", 'timing');
        };
    }

    public static function render(): string
    {
        if (!self::$enabled || empty(self::$logs)) return '';

        $html = '<div style="background:#333;color:#fff;padding:20px;margin:20px;font-family:monospace;font-size:12px;">';
        $html .= '<h3 style="margin-top:0;">Debug Log</h3>';
        $html .= '<table style="width:100%;border-collapse:collapse;">';

        foreach (self::$logs as $log) {
            $color = match($log['level']) {
                'error' => '#ff6b6b',
                'warning' => '#ffd93d',
                'dump' => '#6bcb77',
                'timing' => '#4d96ff',
                default => '#fff'
            };

            $html .= sprintf(
                '<tr style="border-bottom:1px solid #555;">
                    <td style="padding:5px;width:80px;">%.4fs</td>
                    <td style="padding:5px;width:80px;color:%s">%s</td>
                    <td style="padding:5px;">%s</td>
                    <td style="padding:5px;width:100px;">%s MB</td>
                </tr>',
                $log['time'],
                $color,
                strtoupper($log['level']),
                htmlspecialchars($log['message']),
                round($log['memory'] / 1024 / 1024, 2)
            );
        }

        $html .= '</table></div>';
        return $html;
    }
}

// Usage
Debug::init();
Debug::log('Page started');
$timer = Debug::time('Database query');
// ... query ...
$timer();
Debug::dump($result, 'Query Result');
echo Debug::render();
```

---

## جریان خروجی اشکال زدایی

```mermaid
sequenceDiagram
    participant Code
    participant Debug
    participant Logger
    participant Output

    Code->>Debug: Debug::log('message')
    Debug->>Logger: Write to log file
    Debug->>Debug: Store in memory

    Code->>Debug: Debug::dump($var)
    Debug->>Output: Display formatted output

    Code->>Debug: Debug::render()
    Debug->>Output: Display all logs
```

---

## مستندات مرتبط

- صفحه سفید مرگ
- استفاده از ری دیباگر
- بهترین شیوه های امنیتی

---

#xoops #debugging #عیب یابی #توسعه #logging