---
title：“数据库连接错误”
description：“XOOPS数据库连接问题的故障排除指南”
---

数据库连接错误是 XOOPS 安装中最常见的问题之一。本指南提供了系统的故障排除步骤来识别和解决连接问题。

## 常见错误消息

###“无法连接到MySQL服务器”

```
Error: Can't connect to MySQL server on 'localhost' (111)
```

此错误通常表示 MySQL 服务器未运行或不可访问。

###“用户访问被拒绝”

```
Error: Access denied for user 'xoops_user'@'localhost' (using password: YES)
```

这表明您的配置中的数据库凭据不正确。

###“未知数据库”

```
Error: Unknown database 'xoops_db'
```

MySQL 服务器上不存在指定的数据库。

## 配置文件

### XOOPS 配置位置

主要配置文件位于：

```
/mainfile.php
```

关键数据库设置：

```php
// Database Configuration
define('XOOPS_DB_TYPE', 'mysqli');
define('XOOPS_DB_HOST', 'localhost');
define('XOOPS_DB_PORT', '3306');
define('XOOPS_DB_USER', 'xoops_user');
define('XOOPS_DB_PASS', 'your_password');
define('XOOPS_DB_NAME', 'xoops_db');
define('XOOPS_DB_PREFIX', 'xoops_');
```

## 故障排除步骤

### 第 1 步：验证 MySQL 服务正在运行

#### 关于 Linux/Unix

```bash
# Check if MySQL is running
sudo systemctl status mysql

# Start MySQL if not running
sudo systemctl start mysql

# Restart MySQL
sudo systemctl restart mysql
```

### 第 2 步：测试MySQL 连接性

#### 使用命令行

```bash
# Test connection with credentials
mysql -h localhost -u xoops_user -p xoops_db

# If prompted for password, enter it
# Success shows: mysql>

# Exit MySQL
mysql> EXIT;
```

### 步骤 3：验证数据库凭据

#### 检查XOOPS配置

```php
// In mainfile.php, verify these constants:
echo "Host: " . XOOPS_DB_HOST . "\n";
echo "User: " . XOOPS_DB_USER . "\n";
echo "Port: " . XOOPS_DB_PORT . "\n";
echo "Database: " . XOOPS_DB_NAME . "\n";
```

### 步骤 4：验证数据库是否存在

```bash
# Connect to MySQL
mysql -u root -p

# List all databases
SHOW DATABASES;

# Check for your database
SHOW DATABASES LIKE 'xoops_db';

# If not found, create it
CREATE DATABASE xoops_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Exit
EXIT;
```

### 步骤 5：检查用户权限

```bash
# Connect as root
mysql -u root -p

# Check user privileges
SHOW GRANTS FOR 'xoops_user'@'localhost';

# Grant all privileges if needed
GRANT ALL PRIVILEGES ON xoops_db.* TO 'xoops_user'@'localhost';

# Reload privileges
FLUSH PRIVILEGES;
```

## 常见问题及解决方案

### 问题 1：MySQL 未运行

**症状：**
- 连接被拒绝错误
- 无法连接到本地主机

**解决方案：**

```bash
# Linux: Check and start MySQL
sudo systemctl status mysql
sudo systemctl start mysql
```

### 问题 2：凭据不正确

**症状：**
- “访问被拒绝”错误
- “使用密码：YES”或“使用密码：否”

**解决方案：**

```bash
# Reset password (as root)
mysql -u root -p

# Change user password
ALTER USER 'xoops_user'@'localhost' IDENTIFIED BY 'new_password';

# Update mainfile.php
define('XOOPS_DB_PASS', 'new_password');
```

### 问题 3：数据库未创建

**症状：**
- “未知数据库”错误
- 创建数据库时安装失败

**解决方案：**

```bash
# Check if database exists
mysql -u root -p -e "SHOW DATABASES;"

# Create database if missing
mysql -u root -p -e "CREATE DATABASE xoops_db CHARACTER SET utf8mb4;"
```

## 诊断脚本

创建全面的诊断脚本：

```php
<?php
// diagnose-db.php

echo "=== XOOPS Database Diagnostic ===\n\n";

// Check constants defined
echo "1. Configuration Check:\n";
echo "   Host: " . (defined('XOOPS_DB_HOST') ? XOOPS_DB_HOST : "NOT DEFINED") . "\n";
echo "   User: " . (defined('XOOPS_DB_USER') ? XOOPS_DB_USER : "NOT DEFINED") . "\n";
echo "   Database: " . (defined('XOOPS_DB_NAME') ? XOOPS_DB_NAME : "NOT DEFINED") . "\n\n";

// Check PHP MySQL extension
echo "2. Extension Check:\n";
echo "   MySQLi: " . (extension_loaded('mysqli') ? "YES" : "NO") . "\n\n";

// Test connection
echo "3. Connection Test:\n";
try {
    $conn = new mysqli(
        XOOPS_DB_HOST,
        XOOPS_DB_USER,
        XOOPS_DB_PASS,
        XOOPS_DB_NAME,
        XOOPS_DB_PORT
    );

    if ($conn->connect_error) {
        echo "   FAILED: " . $conn->connect_error . "\n";
    } else {
        echo "   SUCCESS: Connected to MySQL\n";
        echo "   Server Info: " . $conn->get_server_info() . "\n";
        $conn->close();
    }
} catch (Exception $e) {
    echo "   EXCEPTION: " . $e->getMessage() . "\n";
}

echo "\n=== End Diagnostic ===\n";
?>
```

## 相关文档

- 白色-Screen-of-Death - 常见WSOD故障排除
- ../../01-Getting-Started/Configuration/Performance-Optimization - 数据库性能调整
- ../../06-Publisher-Module/User-Guide/Basic-Configuration - 初始XOOPS设置
- ../../04-API-Reference/Database/XOOPSDatabase - 数据库API参考

---

**最后更新：** 2026-01-31
**适用于：** XOOPS 2.5.7+
**PHP 版本：** 7.4+