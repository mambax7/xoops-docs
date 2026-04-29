---
title: "권한 거부 오류"
description: "XOOPS의 파일 및 디렉터리 권한 문제 해결"
---

파일 및 디렉터리 권한 문제는 특히 업로드 또는 서버 마이그레이션 후에 XOOPS 설치에서 흔히 발생합니다. 이 가이드는 권한 문제를 진단하고 해결하는 데 도움이 됩니다.

## 파일 권한 이해하기

### Linux/Unix 권한 기본 사항

파일 권한은 세 자리 코드로 표시됩니다.

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

## 일반적인 권한 오류

### 업로드 시 "권한이 거부되었습니다"

```
Warning: fopen(/var/www/html/xoops/uploads/file.jpg): failed to open stream:
Permission denied in /var/www/html/xoops/class/file.php on line 42
```

### "파일을 쓸 수 없습니다"

```
Error: Unable to write file to /var/www/html/xoops/cache/
```

### "디렉토리를 생성할 수 없습니다"

```
Error: mkdir(/var/www/html/xoops/uploads/temp/): Permission denied
```

## 중요한 XOOPS 디렉토리

### 쓰기 권한이 필요한 디렉터리

| 디렉토리 | 최소 | 목적 |
|-----------|---------|---------|
| `/uploads` | 755 | 사용자 업로드 |
| `/cache` | 755 | 캐시 파일 |
| `/templates_c` | 755 | 컴파일된 템플릿 |
| `/var` | 755 | 가변 데이터 |
| `mainfile.php` | 644 | 구성(읽기 가능) |

## Linux/Unix 문제 해결

### 1단계: 현재 권한 확인

```bash
# Check file permissions
ls -l /var/www/html/xoops/

# Check specific file
ls -l /var/www/html/xoops/mainfile.php

# Check directory permissions
ls -ld /var/www/html/xoops/uploads/
```

### 2단계: 웹 서버 사용자 식별

```bash
# Check Apache user
ps aux | grep -E '[a]pache|[h]ttpd'
# Usually: www-data (Debian/Ubuntu) or apache (RedHat/CentOS)

# Check Nginx user
ps aux | grep -E '[n]ginx'
# Usually: www-data or nginx
```

### 3단계: 소유권 수정

```bash
# Set correct ownership (assuming www-data user)
sudo chown -R www-data:www-data /var/www/html/xoops/

# Fix only web-writable directories
sudo chown www-data:www-data /var/www/html/xoops/uploads/
sudo chown www-data:www-data /var/www/html/xoops/cache/
sudo chown www-data:www-data /var/www/html/xoops/templates_c/
sudo chown www-data:www-data /var/www/html/xoops/var/
```

### 4단계: 권한 수정

#### 옵션 A: 제한적인 권한(권장)

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

#### 옵션 B: 한꺼번에 스크립트

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

## 디렉터리별 권한 문제

### 디렉토리 업로드

**문제:** 파일을 업로드할 수 없습니다.

```bash
# Solution
sudo chown www-data:www-data /var/www/html/xoops/uploads/
chmod 755 /var/www/html/xoops/uploads/
find /var/www/html/xoops/uploads -type f -exec chmod 644 {} \;
find /var/www/html/xoops/uploads -type d -exec chmod 755 {} \;
```

### 캐시 디렉토리

**문제:** 캐시 파일이 기록되지 않습니다.

```bash
# Solution
sudo chown www-data:www-data /var/www/html/xoops/cache/
chmod 755 /var/www/html/xoops/cache/
```

### 템플릿 캐시

**문제:** 템플릿이 컴파일되지 않습니다.

```bash
# Solution
sudo chown www-data:www-data /var/www/html/xoops/templates_c/
chmod 755 /var/www/html/xoops/templates_c/
```

## Windows 문제 해결

### 1단계: 파일 속성 확인

1. 파일 우클릭 → 속성
2. '보안' 탭을 클릭하세요.
3. '수정' 버튼을 클릭하세요.
4. 사용자 선택 및 권한 확인

### 2단계: 쓰기 권한 부여

#### GUI를 통해:

```
1. Right-click folder → Properties
2. Select "Security" tab
3. Click "Edit"
4. Select "IIS_IUSRS" or "NETWORK SERVICE"
5. Check "Modify" and "Write"
6. Click "Apply" and "OK"
```

#### 명령줄을 통해(PowerShell):

```powershell
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

## 권한을 확인하는 PHP 스크립트

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

## 모범 사례

### 1. 최소 권한 원칙

```bash
# Only grant necessary permissions
# Don't use 777 or 666

# Bad
chmod 777 /var/www/html/xoops/uploads/  # Dangerous!

# Good
chmod 755 /var/www/html/xoops/uploads/  # Secure
```

### 2. 변경 전 백업

```bash
# Backup current state
getfacl -R /var/www/html/xoops > /tmp/xoops-acl-backup.txt
```

## 빠른 참조

```bash
# Quick fix (Linux)
sudo chown -R www-data:www-data /var/www/html/xoops/
find /var/www/html/xoops -type d -exec chmod 755 {} \;
find /var/www/html/xoops -type f -exec chmod 644 {} \;
```

## 관련 문서

- White-Screen-of-Death - 기타 일반적인 오류
- 데이터베이스 연결 오류 - 데이터베이스 문제
-../../01-시작하기/구성/시스템 설정 - XOOPS 구성

---

**최종 업데이트:** 2026-01-31
**적용 대상:** XOOPS 2.5.7+
**OS:** 리눅스, 윈도우, macOS
