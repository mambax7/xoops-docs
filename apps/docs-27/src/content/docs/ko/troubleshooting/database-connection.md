---
title: "데이터베이스 연결 오류"
description: "XOOPS 데이터베이스 연결 문제에 대한 문제 해결 가이드"
---

데이터베이스 연결 오류는 XOOPS 설치에서 가장 일반적인 문제 중 하나입니다. 이 가이드는 연결 문제를 식별하고 해결하기 위한 체계적인 문제 해결 단계를 제공합니다.

## 일반적인 오류 메시지

### "MySQL 서버에 연결할 수 없습니다"

```
Error: Can't connect to MySQL server on 'localhost' (111)
```

이 오류는 일반적으로 MySQL 서버가 실행되고 있지 않거나 액세스할 수 없음을 나타냅니다.

### "사용자의 액세스가 거부되었습니다."

```
Error: Access denied for user 'xoops_user'@'localhost' (using password: YES)
```

이는 구성에 잘못된 데이터베이스 자격 증명이 있음을 나타냅니다.

### "알 수 없는 데이터베이스"

```
Error: Unknown database 'xoops_db'
```

지정된 데이터베이스가 MySQL 서버에 존재하지 않습니다.

## 구성 파일

### XOOPS 구성 위치

기본 구성 파일은 다음 위치에 있습니다.

```
/mainfile.php
```

주요 데이터베이스 설정:

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

## 문제 해결 단계

### 1단계: MySQL 서비스가 실행 중인지 확인

#### Linux/Unix의 경우

```bash
# Check if MySQL is running
sudo systemctl status mysql

# Start MySQL if not running
sudo systemctl start mysql

# Restart MySQL
sudo systemctl restart mysql
```

### 2단계: MySQL 연결 테스트

#### 명령줄 사용

```bash
# Test connection with credentials
mysql -h localhost -u xoops_user -p xoops_db

# If prompted for password, enter it
# Success shows: mysql>

# Exit MySQL
mysql> EXIT;
```

### 3단계: 데이터베이스 자격 증명 확인

#### XOOPS 구성 확인

```php
// In mainfile.php, verify these constants:
echo "Host: " . XOOPS_DB_HOST . "\n";
echo "User: " . XOOPS_DB_USER . "\n";
echo "Port: " . XOOPS_DB_PORT . "\n";
echo "Database: " . XOOPS_DB_NAME . "\n";
```

### 4단계: 데이터베이스가 있는지 확인

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

### 5단계: 사용자 권한 확인

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

## 일반적인 문제 및 해결 방법

### 문제 1: MySQL이 실행되지 않음

**증상:**
- 연결 거부 오류
- 로컬호스트에 연결할 수 없습니다.

**해결책:**

```bash
# Linux: Check and start MySQL
sudo systemctl status mysql
sudo systemctl start mysql
```

### 문제 2: 잘못된 자격 증명

**증상:**
- "액세스가 거부되었습니다" 오류
- "비밀번호 사용: YES" 또는 "비밀번호 사용: NO"

**해결책:**

```bash
# Reset password (as root)
mysql -u root -p

# Change user password
ALTER USER 'xoops_user'@'localhost' IDENTIFIED BY 'new_password';

# Update mainfile.php
define('XOOPS_DB_PASS', 'new_password');
```

### 문제 3: 데이터베이스가 생성되지 않음

**증상:**
- "알 수 없는 데이터베이스" 오류
- 데이터베이스 생성시 설치 실패

**해결책:**

```bash
# Check if database exists
mysql -u root -p -e "SHOW DATABASES;"

# Create database if missing
mysql -u root -p -e "CREATE DATABASE xoops_db CHARACTER SET utf8mb4;"
```

## 진단 스크립트

포괄적인 진단 스크립트를 만듭니다.

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

## 관련 문서

- White-Screen-of-Death - 일반적인 WSOD 문제 해결
-../../01-시작하기/구성/성능-최적화 - 데이터베이스 성능 튜닝
-../../06-Publisher-Module/User-Guide/Basic-Configuration - 초기 XOOPS 설정
-../../04-API-Reference/Database/XoopsDatabase - 데이터베이스 API 참조

---

**최종 업데이트:** 2026-01-31
**적용 대상:** XOOPS 2.5.7+
**PHP 버전:** 7.4+
