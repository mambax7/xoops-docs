---
title: "Debug-Modus aktivieren"
description: "Aktivierung und Verwendung des XOOPS Debug-Modus zur Fehlerbehebung"
---

> Umfassender Leitfaden zu XOOPS-Debugging-Funktionen und -Tools.

---

## Debug-Architektur

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

## XOOPS Debug-Stufen

### In mainfile.php aktivieren

```php
<?php
// Debug-Level-Einstellungen
define('XOOPS_DEBUG_LEVEL', 2);

// Level 0: Debug aus (Produktion)
// Level 1: Nur PHP-Debug
// Level 2: PHP + SQL-Abfragen
// Level 3: PHP + SQL + Smarty-Templates
```

### Stufen-Details

| Stufe | PHP-Fehler | SQL-Abfragen | Template-Vars | Empfohlen für |
|-------|------------|-------------|---------------|-----------------|
| 0 | Verborgen | Nein | Nein | Produktion |
| 1 | Angezeigt | Nein | Nein | Schnelle Überprüfungen |
| 2 | Angezeigt | Protokolliert | Nein | Entwicklung |
| 3 | Angezeigt | Protokolliert | Angezeigt | Tiefes Debugging |

---

## PHP-Fehleranzeige

### Entwicklungseinstellungen

```php
// Zur mainfile.php hinzufügen für Entwicklung
error_reporting(E_ALL);
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
ini_set('log_errors', '1');
ini_set('error_log', XOOPS_VAR_PATH . '/logs/php_errors.log');
```

### Produktionseinstellungen

```php
// Sichere Einstellungen für Produktion
error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED);
ini_set('display_errors', '0');
ini_set('log_errors', '1');
ini_set('error_log', XOOPS_VAR_PATH . '/logs/php_errors.log');
```

---

## SQL-Abfrage-Debugging

### Abfragen im Debug-Modus anzeigen

Wenn `XOOPS_DEBUG_LEVEL` auf 2 oder 3 gesetzt ist, werden SQL-Abfragen am unteren Rand der Seiten angezeigt.

### Manuelles Abfrageprotokollierung

```php
// Spezifische Abfrage protokollieren
$sql = "SELECT * FROM " . $GLOBALS['xoopsDB']->prefix('mymodule_items');

// Vor Ausführung
error_log("SQL Query: " . $sql);

$result = $GLOBALS['xoopsDB']->query($sql);

// Abfragezeit protokollieren
$start = microtime(true);
$result = $GLOBALS['xoopsDB']->query($sql);
$time = microtime(true) - $start;
error_log("Abfrage dauerte: " . number_format($time * 1000, 2) . "ms");
```

### XoopsLogger verwenden

```php
// Logger-Zugriff
$logger = $GLOBALS['xoopsLogger'];

// Alle Abfragen abrufen
$queries = $logger->queries;
foreach ($queries as $query) {
    echo "SQL: " . $query['sql'] . "\n";
    echo "Zeit: " . $query['time'] . "s\n";
    echo "---\n";
}

// Benutzerdefinierte Meldung protokollieren
$logger->addExtra('Mein Debug', 'Benutzerdefinierte Debug-Meldung');
```

---

## Smarty-Template-Debugging

### Smarty Debug-Konsole aktivieren

```php
// In Ihrem Modul oder Template
{debug}

// Oder in PHP
$GLOBALS['xoopsTpl']->debugging = true;
$GLOBALS['xoopsTpl']->debugging_ctrl = 'URL';  // SMARTY_DEBUG zur URL hinzufügen
```

### Zugewiesene Variablen anzeigen

```smarty
{* Alle zugewiesenen Variablen anzeigen *}
<pre>
{$smarty.template_object->tpl_vars|print_r}
</pre>

{* Spezifische Variable anzeigen *}
{$myvar|@debug_print_var}
```

### In PHP debuggen

```php
// Vor dem Anzeigen des Templates
echo "<pre>";
print_r($GLOBALS['xoopsTpl']->getTemplateVars());
echo "</pre>";
```

---

## Ray Debugger Integration

### Installation

```bash
composer require spatie/ray --dev
```

### Configuration

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

### Usage Examples

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

### Debug Database Queries

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

### Installation

```bash
composer require maximebf/debugbar
```

### Integration

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

## Custom Debug Helper

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

## Debug Output Flow

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

## Verwandte Dokumentation

- Weißer Bildschirm des Todes
- Ray Debugger verwenden
- Best Practices für Sicherheit

---

#xoops #debugging #troubleshooting #development #logging
