---
title: "ข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล"
description: "คู่มือการแก้ไขปัญหาสำหรับปัญหาการเชื่อมต่อฐานข้อมูล XOOPS"
---
ข้อผิดพลาดในการเชื่อมต่อฐานข้อมูลเป็นหนึ่งในปัญหาที่พบบ่อยที่สุดในการติดตั้ง XOOPS คู่มือนี้ประกอบด้วยขั้นตอนการแก้ไขปัญหาอย่างเป็นระบบเพื่อระบุและแก้ไขปัญหาการเชื่อมต่อ

## ข้อความแสดงข้อผิดพลาดทั่วไป

### "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ MySQL"
```
Error: Can't connect to MySQL server on 'localhost' (111)
```
โดยทั่วไปข้อผิดพลาดนี้บ่งชี้ว่าเซิร์ฟเวอร์ MySQL ไม่ทำงานหรือไม่สามารถเข้าถึงได้

### "การเข้าถึงถูกปฏิเสธสำหรับผู้ใช้"
```
Error: Access denied for user 'xoops_user'@'localhost' (using password: YES)
```
สิ่งนี้บ่งชี้ว่าข้อมูลรับรองฐานข้อมูลไม่ถูกต้องในการกำหนดค่าของคุณ

### "ฐานข้อมูลที่ไม่รู้จัก"
```
Error: Unknown database 'xoops_db'
```
ไม่มีฐานข้อมูลที่ระบุบนเซิร์ฟเวอร์ MySQL

## ไฟล์การกำหนดค่า

### XOOPS ตำแหน่งการกำหนดค่า

ไฟล์การกำหนดค่าหลักอยู่ที่:
```
/mainfile.php
```
การตั้งค่าฐานข้อมูลที่สำคัญ:
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
## ขั้นตอนการแก้ไขปัญหา

### ขั้นตอนที่ 1: ตรวจสอบว่าบริการ MySQL กำลังทำงานอยู่

#### บน Linux/Unix
```bash
# Check if MySQL is running
sudo systemctl status mysql

# Start MySQL if not running
sudo systemctl start mysql

# Restart MySQL
sudo systemctl restart mysql
```
### ขั้นตอนที่ 2: ทดสอบการเชื่อมต่อ MySQL

#### การใช้บรรทัดคำสั่ง
```bash
# Test connection with credentials
mysql -h localhost -u xoops_user -p xoops_db

# If prompted for password, enter it
# Success shows: mysql>

# Exit MySQL
mysql> EXIT;
```
### ขั้นตอนที่ 3: ตรวจสอบข้อมูลรับรองฐานข้อมูล

#### ตรวจสอบการกำหนดค่า XOOPS
```php
// In mainfile.php, verify these constants:
echo "Host: " . XOOPS_DB_HOST . "\n";
echo "User: " . XOOPS_DB_USER . "\n";
echo "Port: " . XOOPS_DB_PORT . "\n";
echo "Database: " . XOOPS_DB_NAME . "\n";
```
### ขั้นตอนที่ 4: ตรวจสอบว่ามีฐานข้อมูลอยู่
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
### ขั้นตอนที่ 5: ตรวจสอบสิทธิ์ของผู้ใช้
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
## ปัญหาทั่วไปและแนวทางแก้ไข

### ปัญหาที่ 1: MySQL ไม่ทำงาน

**อาการ:**
- การเชื่อมต่อถูกปฏิเสธข้อผิดพลาด
- ไม่สามารถเชื่อมต่อกับ localhost ได้

**แนวทางแก้ไข:**
```bash
# Linux: Check and start MySQL
sudo systemctl status mysql
sudo systemctl start mysql
```
### ฉบับที่ 2: ข้อมูลรับรองไม่ถูกต้อง

**อาการ:**
- ข้อผิดพลาด "การเข้าถึงถูกปฏิเสธ"
- "การใช้รหัสผ่าน: YES" หรือ "การใช้รหัสผ่าน: NO"

**แนวทางแก้ไข:**
```bash
# Reset password (as root)
mysql -u root -p

# Change user password
ALTER USER 'xoops_user'@'localhost' IDENTIFIED BY 'new_password';

# Update mainfile.php
define('XOOPS_DB_PASS', 'new_password');
```
### ฉบับที่ 3: ไม่ได้สร้างฐานข้อมูล

**อาการ:**
- ข้อผิดพลาด "ฐานข้อมูลที่ไม่รู้จัก"
- การติดตั้งล้มเหลวในการสร้างฐานข้อมูล

**แนวทางแก้ไข:**
```bash
# Check if database exists
mysql -u root -p -e "SHOW DATABASES;"

# Create database if missing
mysql -u root -p -e "CREATE DATABASE xoops_db CHARACTER SET utf8mb4;"
```
## สคริปต์การวินิจฉัย

สร้างสคริปต์การวินิจฉัยที่ครอบคลุม:
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
## เอกสารที่เกี่ยวข้อง

- หน้าจอสีขาวแห่งความตาย - การแก้ไขปัญหาทั่วไป WSOD
- ../../01-การเริ่มต้น/การกำหนดค่า/ประสิทธิภาพ-การเพิ่มประสิทธิภาพ - การปรับแต่งประสิทธิภาพของฐานข้อมูล
- ../../06-Publisher-Module/User-Guide/Basic-Configuration - การตั้งค่าเริ่มต้น XOOPS
- ../../04-API-อ้างอิง/ฐานข้อมูล/XoopsDatabase - ฐานข้อมูล API อ้างอิง

---

**อัปเดตล่าสุด:** 31-01-2026
**ใช้กับ:** XOOPS 2.5.7+
**PHP เวอร์ชัน:** 7.4+