---
title: "การอนุญาตถูกปฏิเสธข้อผิดพลาด"
description: "การแก้ไขปัญหาการอนุญาตไฟล์และไดเรกทอรีใน XOOPS"
---
ปัญหาการอนุญาตไฟล์และไดเรกทอรีเป็นเรื่องปกติในการติดตั้ง XOOPS โดยเฉพาะหลังจากการอัปโหลดหรือการย้ายเซิร์ฟเวอร์ คู่มือนี้จะช่วยวินิจฉัยและแก้ไขปัญหาสิทธิ์

## ทำความเข้าใจสิทธิ์ของไฟล์

### พื้นฐานการอนุญาต Linux/Unix

การอนุญาตไฟล์จะแสดงเป็นรหัสสามหลัก:
```
rwxrwxrwx
||| ||| |||
||| ||| +-- Others (world)
||| +------ Group
+--------- Owner

r = read (4)
w = write (2)
x = execute (1)

755 = rwxr-xr-x (owner full, group read/execute, others read/execute)
644 = rw-r--r-- (owner read/write, group read, others read)
777 = rwxrwxrwx (everyone full access - NOT RECOMMENDED)
```
## ข้อผิดพลาดทั่วไปในการอนุญาต

### "การอนุญาตถูกปฏิเสธ" ในการอัปโหลด
```
Warning: fopen(/var/www/html/xoops/uploads/file.jpg): failed to open stream:
Permission denied in /var/www/html/xoops/class/file.php on line 42
```
### "ไม่สามารถเขียนไฟล์ได้"
```
Error: Unable to write file to /var/www/html/xoops/cache/
```
### "ไม่สามารถสร้างไดเร็กทอรี"
```
Error: mkdir(/var/www/html/xoops/uploads/temp/): Permission denied
```
## ไดเรกทอรี XOOPS ที่สำคัญ

### ไดเรกทอรีที่ต้องการสิทธิ์ในการเขียน

| ไดเรกทอรี | ขั้นต่ำ | วัตถุประสงค์ |
|----------|---------|---------|
| `/uploads` | 755 | การอัพโหลดของผู้ใช้ |
| `/cache` | 755 | ไฟล์แคช |
| `/templates_c` | 755 | เทมเพลตที่เรียบเรียง |
| `/var` | 755 | ข้อมูลตัวแปร |
| `mainfile.php` | 644 | การกำหนดค่า (อ่านได้) |

## การแก้ไขปัญหา Linux/Unix

### ขั้นตอนที่ 1: ตรวจสอบสิทธิ์ปัจจุบัน
```bash
# Check file permissions
ls -l /var/www/html/xoops/

# Check specific file
ls -l /var/www/html/xoops/mainfile.php

# Check directory permissions
ls -ld /var/www/html/xoops/uploads/
```
### ขั้นตอนที่ 2: ระบุผู้ใช้เว็บเซิร์ฟเวอร์
```bash
# Check Apache user
ps aux | grep -E '[a]pache|[h]ttpd'
# Usually: www-data (Debian/Ubuntu) or apache (RedHat/CentOS)

# Check Nginx user
ps aux | grep -E '[n]ginx'
# Usually: www-data or nginx
```
### ขั้นตอนที่ 3: แก้ไขความเป็นเจ้าของ
```bash
# Set correct ownership (assuming www-data user)
sudo chown -R www-data:www-data /var/www/html/xoops/

# Fix only web-writable directories
sudo chown www-data:www-data /var/www/html/xoops/uploads/
sudo chown www-data:www-data /var/www/html/xoops/cache/
sudo chown www-data:www-data /var/www/html/xoops/templates_c/
sudo chown www-data:www-data /var/www/html/xoops/var/
```
### ขั้นตอนที่ 4: แก้ไขสิทธิ์

#### ตัวเลือก A: สิทธิ์ที่จำกัด (แนะนำ)
```bash
# All directories: 755 (rwxr-xr-x)
find /var/www/html/xoops -type d -exec chmod 755 {} \;

# All files: 644 (rw-r--r--)
find /var/www/html/xoops -type f -exec chmod 644 {} \;

# Except writable directories
chmod 755 /var/www/html/xoops/uploads/
chmod 755 /var/www/html/xoops/cache/
chmod 755 /var/www/html/xoops/templates_c/
chmod 755 /var/www/html/xoops/var/
```
#### ตัวเลือก B: สคริปต์ทั้งหมดพร้อมกัน
```bash
#!/bin/bash
# fix-permissions.sh

XOOPS_PATH="/var/www/html/xoops"
WEB_USER="www-data"

echo "Fixing XOOPS permissions..."

# Set ownership
sudo chown -R $WEB_USER:$WEB_USER $XOOPS_PATH

# Set directory permissions
find $XOOPS_PATH -type d -exec chmod 755 {} \;

# Set file permissions
find $XOOPS_PATH -type f -exec chmod 644 {} \;

# Ensure writable directories
chmod 755 $XOOPS_PATH/uploads/
chmod 755 $XOOPS_PATH/cache/
chmod 755 $XOOPS_PATH/templates_c/
chmod 755 $XOOPS_PATH/var/

echo "Done! Permissions fixed."
```
## ปัญหาการอนุญาตตามไดเรกทอรี

### ไดเรกทอรีอัปโหลด

**ปัญหา:** ไม่สามารถอัปโหลดไฟล์ได้
```bash
# Solution
sudo chown www-data:www-data /var/www/html/xoops/uploads/
chmod 755 /var/www/html/xoops/uploads/
find /var/www/html/xoops/uploads -type f -exec chmod 644 {} \;
find /var/www/html/xoops/uploads -type d -exec chmod 755 {} \;
```
### ไดเรกทอรีแคช

**ปัญหา:** ไฟล์แคชไม่ได้ถูกเขียน
```bash
# Solution
sudo chown www-data:www-data /var/www/html/xoops/cache/
chmod 755 /var/www/html/xoops/cache/
```
### แคชเทมเพลต

**ปัญหา:** เทมเพลตไม่ได้รวบรวม
```bash
# Solution
sudo chown www-data:www-data /var/www/html/xoops/templates_c/
chmod 755 /var/www/html/xoops/templates_c/
```
## การแก้ไขปัญหา Windows

### ขั้นตอนที่ 1: ตรวจสอบคุณสมบัติไฟล์

1. คลิกขวาที่ไฟล์ → คุณสมบัติ
2. คลิกแท็บ "ความปลอดภัย"
3. คลิกปุ่ม "แก้ไข"
4. เลือกผู้ใช้และตรวจสอบสิทธิ์

### ขั้นตอนที่ 2: ให้สิทธิ์ในการเขียน

#### ผ่าน GUI:
```
1. Right-click folder → Properties
2. Select "Security" tab
3. Click "Edit"
4. Select "IIS_IUSRS" or "NETWORK SERVICE"
5. Check "Modify" and "Write"
6. Click "Apply" and "OK"
```
#### ผ่านทางบรรทัดคำสั่ง (PowerShell):
```
powershell
# Run PowerShell as Administrator

# Grant IIS app pool permissions
$path = "C:\inetpub\wwwroot\xoops\uploads"
$acl = Get-Acl $path
$rule = New-Object System.Security.AccessControl.FileSystemAccessRule(
    "IIS_IUSRS",
    "Modify",
    "ContainerInherit,ObjectInherit",
    "None",
    "Allow"
)
$acl.SetAccessRule($rule)
Set-Acl -Path $path -AclObject $acl
```
## PHP สคริปต์เพื่อตรวจสอบสิทธิ์
```php
<?php
// check-xoops-permissions.php

$paths = [
    XOOPS_ROOT_PATH . '/uploads' => 'uploads',
    XOOPS_ROOT_PATH . '/cache' => 'cache',
    XOOPS_ROOT_PATH . '/templates_c' => 'templates_c',
    XOOPS_ROOT_PATH . '/var' => 'var',
    XOOPS_ROOT_PATH . '/mainfile.php' => 'mainfile.php'
];

echo "<h2>XOOPS Permission Check</h2>";
echo "<table border='1'>";
echo "<tr><th>Path</th><th>Readable</th><th>Writable</th></tr>";

foreach ($paths as $path => $name) {
    $readable = is_readable($path) ? 'YES' : 'NO';
    $writable = is_writable($path) ? 'YES' : 'NO';

    echo "<tr>";
    echo "<td>$name</td>";
    echo "<td style='background: " . ($readable === 'YES' ? 'green' : 'red') . "'>$readable</td>";
    echo "<td style='background: " . ($writable === 'YES' ? 'green' : 'red') . "'>$writable</td>";
    echo "</tr>";
}

echo "</table>";
?>
```
## แนวทางปฏิบัติที่ดีที่สุด

### 1. หลักการสิทธิพิเศษน้อยที่สุด
```bash
# Only grant necessary permissions
# Don't use 777 or 666

# Bad
chmod 777 /var/www/html/xoops/uploads/  # Dangerous!

# Good
chmod 755 /var/www/html/xoops/uploads/  # Secure
```
### 2. สำรองข้อมูลก่อนการเปลี่ยนแปลง
```bash
# Backup current state
getfacl -R /var/www/html/xoops > /tmp/xoops-acl-backup.txt
```
## อ้างอิงด่วน
```bash
# Quick fix (Linux)
sudo chown -R www-data:www-data /var/www/html/xoops/
find /var/www/html/xoops -type d -exec chmod 755 {} \;
find /var/www/html/xoops -type f -exec chmod 644 {} \;
```
## เอกสารที่เกี่ยวข้อง

- หน้าจอสีขาวแห่งความตาย - ข้อผิดพลาดทั่วไปอื่นๆ
- ฐานข้อมูล-การเชื่อมต่อ-ข้อผิดพลาด - ปัญหาฐานข้อมูล
- ../../01-การเริ่มต้น/การกำหนดค่า/การตั้งค่าระบบ - การกำหนดค่า XOOPS

---

**อัปเดตล่าสุด:** 31-01-2026
**ใช้กับ:** XOOPS 2.5.7+
**OS:** Linux, Windows, macOS