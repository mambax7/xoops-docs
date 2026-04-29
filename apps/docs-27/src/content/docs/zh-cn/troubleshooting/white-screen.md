---
title：“白屏死机（WSOD）”
description：“诊断并修复XOOPS中的白屏死机”
---

> 如何诊断和修复空白页，参见XOOPS。

---

## 诊断流程图

```mermaid
flowchart TD
    A[White Screen] --> B{PHP Errors Visible?}
    B -->|No| C[Enable Error Display]
    B -->|Yes| D[Read Error Message]

    C --> E{Errors Now Visible?}
    E -->|Yes| D
    E -->|No| F[Check PHP Error Log]

    D --> G{Error Type?}
    G -->|Memory| H[Increase memory_limit]
    G -->|Syntax| I[Fix PHP Syntax]
    G -->|Missing File| J[Restore File]
    G -->|Permission| K[Fix Permissions]
    G -->|Database| L[Check DB Connection]

    F --> M{Log Has Errors?}
    M -->|Yes| D
    M -->|No| N[Check Web Server Logs]

    N --> O{Found Issue?}
    O -->|Yes| D
    O -->|No| P[Enable XOOPS Debug]
```

---

## 快速诊断

### 第 1 步：启用 PHP 错误显示

暂时添加到`mainfile.php`：

```php
<?php
// Add at the very top, after <?php
error_reporting(E_ALL);
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
```

### 步骤 2：检查PHP错误日志

```bash
# Common log locations
tail -100 /var/log/php/error.log
tail -100 /var/log/apache2/error.log
tail -100 /var/log/nginx/error.log

# Or check PHP info for log location
php -i | grep error_log
```

### 步骤 3：启用 XOOPS 调试

```php
// In mainfile.php
define('XOOPS_DEBUG_LEVEL', 2);
```

---

## 常见原因及解决方案

```mermaid
pie title WSOD Common Causes
    "Memory Limit" : 25
    "PHP Syntax Error" : 20
    "Missing Files" : 15
    "Database Issues" : 15
    "Permissions" : 10
    "Template Errors" : 10
    "Timeout" : 5
```

### 1.超出内存限制

**症状：**
- 大型操作的空白页
- 适用于小数据，不适用于大数据

**错误：**
```
Fatal error: Allowed memory size of 134217728 bytes exhausted
```

**解决方案：**

```php
// In mainfile.php
ini_set('memory_limit', '256M');

// Or in .htaccess
php_value memory_limit 256M

// Or in php.ini
memory_limit = 256M
```

### 2.PHP语法错误

**症状：**
- 编辑 PHP 文件后的WSOD
- 特定页面失败，其他页面正常

**错误：**
```
Parse error: syntax error, unexpected '}' in /path/file.php on line 123
```

**解决方案：**

```bash
# Check file for syntax errors
php -l /path/to/file.php

# Check all PHP files in module
find modules/mymodule -name "*.php" -exec php -l {} \;
```

### 3. 缺少所需文件

**症状：**
- upload/migration之后的WSOD
- 随机页面失败

**错误：**
```
Fatal error: require_once(): Failed opening required 'class/Helper.php'
```

**解决方案：**

```bash
# Re-upload missing files
# Compare against fresh installation
diff -r /path/to/xoops /path/to/fresh-xoops

# Check file permissions
ls -la class/
```

### 4.数据库连接失败

**症状：**
- 所有页面均显示WSOD
- 静态文件（图像，CSS）工作

**错误：**
```
Warning: mysqli_connect(): Access denied for user
```

**解决方案：**

```php
// Verify credentials in mainfile.php
define('XOOPS_DB_HOST', 'localhost');
define('XOOPS_DB_USER', 'your_user');
define('XOOPS_DB_PASS', 'your_password');
define('XOOPS_DB_NAME', 'your_database');

// Test connection manually
<?php
$conn = new mysqli('localhost', 'user', 'pass', 'database');
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
echo "Connected successfully";
```

### 5.权限问题

**症状：**
- 写入文件时WSOD
- Cache/compile错误

**解决方案：**

```bash
# Fix directory permissions
chmod -R 755 htdocs/
chmod -R 777 xoops_data/
chmod -R 777 uploads/

# Fix ownership
chown -R www-data:www-data /path/to/xoops
```

### 6.Smarty模板错误

**症状：**
- 特定页面上的WSOD
- 清除缓存后有效

**解决方案：**

```bash
# Clear Smarty cache
rm -rf xoops_data/caches/smarty_cache/*
rm -rf xoops_data/caches/smarty_compile/*

# Check template syntax
```

### 7. 最大执行时间

**症状：**
-约 30 秒后WSOD
- 长时间操作失败

**错误：**
```
Fatal error: Maximum execution time of 30 seconds exceeded
```

**解决方案：**

```php
// In mainfile.php
set_time_limit(300);

// Or in .htaccess
php_value max_execution_time 300
```

---

## 调试脚本

在 XOOPS 根目录中创建 `debug.php`：

```php
<?php
/**
 * XOOPS Debug Script
 * Delete after troubleshooting!
 */

error_reporting(E_ALL);
ini_set('display_errors', '1');

echo "<h1>XOOPS Debug</h1>";

// Check PHP version
echo "<h2>PHP Version</h2>";
echo "PHP " . PHP_VERSION . "<br>";

// Check required extensions
echo "<h2>Required Extensions</h2>";
$required = ['mysqli', 'gd', 'curl', 'json', 'mbstring'];
foreach ($required as $ext) {
    $status = extension_loaded($ext) ? '✓' : '✗';
    echo "$status $ext<br>";
}

// Check file permissions
echo "<h2>Directory Permissions</h2>";
$dirs = [
    'xoops_data' => 'xoops_data',
    'uploads' => 'uploads',
    'cache' => 'xoops_data/caches'
];
foreach ($dirs as $name => $path) {
    $writable = is_writable($path) ? '✓ Writable' : '✗ Not writable';
    echo "$name: $writable<br>";
}

// Test database connection
echo "<h2>Database Connection</h2>";
if (file_exists('mainfile.php')) {
    // Extract credentials (simple regex, not production safe)
    $mainfile = file_get_contents('mainfile.php');
    preg_match("/XOOPS_DB_HOST.*'(.+?)'/", $mainfile, $host);
    preg_match("/XOOPS_DB_USER.*'(.+?)'/", $mainfile, $user);
    preg_match("/XOOPS_DB_PASS.*'(.+?)'/", $mainfile, $pass);
    preg_match("/XOOPS_DB_NAME.*'(.+?)'/", $mainfile, $name);

    if (!empty($host[1])) {
        $conn = @new mysqli($host[1], $user[1], $pass[1], $name[1]);
        if ($conn->connect_error) {
            echo "✗ Connection failed: " . $conn->connect_error;
        } else {
            echo "✓ Connected to database";
            $conn->close();
        }
    }
} else {
    echo "mainfile.php not found";
}

// Memory info
echo "<h2>Memory</h2>";
echo "Memory Limit: " . ini_get('memory_limit') . "<br>";
echo "Current Usage: " . round(memory_get_usage() / 1024 / 1024, 2) . " MB<br>";

// Check error log location
echo "<h2>Error Log</h2>";
echo "Location: " . ini_get('error_log');
```

---

## 预防

```mermaid
graph LR
    A[Backup Before Changes] --> E[Stable Site]
    B[Test in Development] --> E
    C[Monitor Error Logs] --> E
    D[Use Version Control] --> E
```

1. **在进行更改之前始终进行备份**
2. **部署前在本地测试**
3. **定期监控错误日志**
4. **使用git**来跟踪更改
5. **在支持的版本内保持PHP更新**

---

## 相关文档

- 数据库连接错误
- 权限被拒绝错误
- 启用调试模式

---

#XOOPS #故障排除#wsod #debugging #errors