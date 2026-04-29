---
title: "모듈 설치 실패"
description: "XOOPS의 모듈 설치 문제 진단 및 수정"
---

> XOOPS의 모듈 설치 문제를 해결하기 위한 일반적인 문제 및 솔루션입니다.

---

## 진단 흐름도

```mermaid
flowchart TD
    A[Module Installation Fails] --> B{Upload Successful?}
    B -->|No| C[Check File Upload Permissions]
    B -->|Yes| D{Module Directory Created?}

    C --> C1[Fix uploads/permissions]
    C1 --> A

    D -->|No| E[Check Directory Permissions]
    D -->|Yes| F{xoopsversion.php Found?}

    E --> E1[Fix folder permissions to 755]
    E1 --> A

    F -->|No| G[Check Module Package]
    F -->|Yes| H{Database Tables Created?}

    G --> G1[Verify xoopsversion.php exists]
    G1 --> A

    H -->|Error| I[Check SQL Errors]
    H -->|Success| J[Check Admin Page]

    I --> I1[Review xoops_log table]
    I1 --> A

    J -->|Missing| K[Check install.php]
    J -->|Working| L[Installation Successful]

    K --> K1[Run install.php manually]
    K1 --> A
```

---

## 일반적인 원인 및 해결 방법

```mermaid
pie title Module Installation Failure Causes
    "Permission Issues" : 30
    "Missing xoopsversion.php" : 20
    "Database SQL Errors" : 20
    "Corrupted Upload" : 15
    "PHP Version Incompatibility" : 10
    "Directory Already Exists" : 5
```

---

## 1. 파일 업로드 권한이 거부되었습니다.

**증상:**
- "권한이 거부되었습니다"로 인해 업로드가 실패합니다.
- 모듈 폴더가 생성되지 않았습니다.
- 모듈 디렉터리에 쓸 수 없습니다.

**오류 메시지:**
```
Warning: move_uploaded_file(): Unable to move file
Permission denied (13)
```

**해결책:**

```bash
# Check current permissions
ls -ld /path/to/xoops/modules
ls -ld /path/to/xoops/uploads

# Fix module directory permissions
chmod 755 /path/to/xoops/modules

# Fix temporary upload directory
chmod 777 /path/to/xoops/uploads
chmod 777 /tmp  # if needed

# Fix ownership (if running as different user)
chown -R www-data:www-data /path/to/xoops/modules
chown -R www-data:www-data /path/to/xoops/uploads
```

---

## 2. xoopsversion.php 누락

**증상:**
- 모듈이 목록에 표시되지만 활성화되지 않습니다.
- 설치가 시작된 후 중지됩니다.
- 관리자 페이지가 생성되지 않았습니다.

**xoops_log 오류:**
```
Module xoopsversion.php not found
```

**해결책:**

모듈 패키지 구조를 확인합니다.

```bash
# Extract and check module contents
unzip module.zip
ls -la mymodule/

# Must contain:
# - xoopsversion.php
# - language/
# - sql/
# - admin/ (optional but recommended)
```

**유효한 xoopsversion.php 구조:**

```php
<?php
$modversion['name'] = 'My Module';
$modversion['version'] = '1.0.0';
$modversion['description'] = 'Module description';
$modversion['author'] = 'Author Name';
$modversion['author_mail'] = 'author@example.com';
$modversion['author_website_url'] = 'https://example.com';
$modversion['credits'] = 'Credits';
$modversion['license'] = 'GPL 2.0 or later';
$modversion['official'] = 0;
$modversion['image'] = 'images/icon.png';
$modversion['dirname'] = basename(__DIR__);
$modversion['modpath'] = __DIR__;

// Core module info
$modversion['hasMain'] = 1;
$modversion['hasAdmin'] = 1;
$modversion['hasSearch'] = 0;
$modversion['hasNotification'] = 0;

// Database tables
$modversion['sqlfile']['mysql'] = 'sql/mysql.sql';
$modversion['tables'] = ['table_name'];
```

---

## 3. 데이터베이스 SQL 실행 오류

**증상:**
- 업로드가 성공했지만 데이터베이스 테이블이 생성되지 않았습니다.
- 관리자 페이지가 로드되지 않습니다.
- "테이블이 존재하지 않습니다" 오류

**오류 메시지:**
```
SQL Error: Table 'xoops_module_table' already exists
Syntax error in SQL statement
```

**해결책:**

### SQL 파일 구문 확인

```bash
# View the SQL file
cat modules/mymodule/sql/mysql.sql

# Check for syntax issues
# Verify:
# - All CREATE TABLE statements end with ;
# - Proper backticks for identifiers
# - Valid field types (INT, VARCHAR, TEXT, etc.)
```

**올바른 SQL 형식:**

```sql
CREATE TABLE `xoops_module_table` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `created` INT(11) NOT NULL,
  `updated` INT(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 수동으로 SQL 실행

```php
<?php
// Create file: modules/mymodule/test_sql.php
require_once '../../mainfile.php';

$sql_file = __DIR__ . '/sql/mysql.sql';
$sql_content = file_get_contents($sql_file);

// Split statements
$statements = array_filter(array_map('trim', explode(';', $sql_content)));

foreach ($statements as $statement) {
    if (empty($statement)) continue;

    try {
        $GLOBALS['xoopsDB']->query($statement);
        echo "✓ Executed: " . substr($statement, 0, 50) . "...<br>";
    } catch (Exception $e) {
        echo "✗ Error: " . $e->getMessage() . "<br>";
        echo "Statement: " . substr($statement, 0, 100) . "...<br>";
    }
}
?>
```

---

## 4. 손상된 모듈 업로드

**증상:**
- 부분적으로 업로드된 파일
- 임의의.php 파일이 누락되었습니다.
- 설치 후 모듈이 불안정해짐

**해결책:**

```bash
# Re-upload fresh copy
rm -rf /path/to/xoops/modules/mymodule

# Verify checksum if provided
md5sum -c mymodule.md5

# Verify archive integrity before extract
unzip -t mymodule.zip

# Extract to temp, verify, then move
unzip -d /tmp mymodule.zip
find /tmp/mymodule -name "*.php" | wc -l
# Should show expected number of files
```

---

## 5. PHP 버전 비호환성

**증상:**
- 설치가 즉시 실패합니다.
- xoopsversion.php의 구문 분석 오류
- "예기치 않은 토큰" 오류

**오류 메시지:**
```
Parse error: syntax error, unexpected 'fn' (T_FN)
```

**해결책:**

```bash
# Check XOOPS supported PHP version
grep -r "php_require" /path/to/xoops/

# Check module requirements
grep -i "php\|version" modules/mymodule/xoopsversion.php

# Check PHP version on server
php --version
```

**테스트 모듈 호환성:**

```php
<?php
// Create modules/mymodule/check_compat.php
$required_php = '7.4.0';
$current_php = PHP_VERSION;

echo "Required PHP: $required_php<br>";
echo "Current PHP: $current_php<br>";

if (version_compare(PHP_VERSION, $required_php, '<')) {
    echo "✗ PHP version too old<br>";
} else {
    echo "✓ PHP version compatible<br>";
}

// Check required extensions
$required_ext = ['mysqli', 'json', 'mb_string'];
foreach ($required_ext as $ext) {
    echo extension_loaded($ext) ? "✓" : "✗";
    echo " $ext<br>";
}
?>
```

---

## 6. 모듈 디렉터리가 이미 존재합니다.

**증상:**
- 모듈 디렉토리가 존재하면 설치가 실패합니다.
- 모듈을 다시 설치하거나 업데이트할 수 없습니다.
- "디렉토리가 존재합니다" 오류

**오류 메시지:**
```
The specified directory already exists
```

**해결책:**

```bash
# Backup existing module
cp -r modules/mymodule modules/mymodule.backup

# Remove old installation completely
rm -rf modules/mymodule

# Clear any cache related to module
rm -rf xoops_data/caches/*

# Now retry installation through admin panel
```

---

## 7. 관리자 페이지 생성 실패

**증상:**
- 모듈이 설치되었지만 관리 페이지가 누락되었습니다.
- 관리자 패널에 모듈이 표시되지 않습니다.
- 모듈 설정에 접근할 수 없습니다.

**해결책:**

```php
<?php
// Create modules/mymodule/admin/index.php
<?php
/**
 * Module Administration Index
 */

include_once XOOPS_ROOT_PATH . '/kernel/module.php';

if (!is_object($xoopsModule) || !is_object($xoopsUser) || !$xoopsUser->isAdmin($xoopsModule->mid())) {
    exit("Access Denied");
}

// Include admin header
xoops_cp_header();

// Add admin content
echo "<h1>Module Administration</h1>";
echo "<p>Welcome to module administration</p>";

// Include admin footer
xoops_cp_footer();
?>
```

---

## 8. 언어 파일 누락

**증상:**
- 모듈은 텍스트 대신 변수 이름으로 표시됩니다.
- 관리 페이지에 "[LANG_CONSTANT]" 스타일 텍스트가 표시됩니다.
- 설치가 완료되었지만 인터페이스가 손상되었습니다.

**해결책:**

```bash
# Verify language file structure
ls -la modules/mymodule/language/

# Should contain:
# english/ (at minimum)
#   admin.php
#   index.php
#   modinfo.php
```

**언어 파일 생성:**

```php
<?php
// modules/mymodule/language/english/index.php
<?php
define('_AM_MYMODULE_INSTALLED', 'Module installed successfully');
define('_AM_MYMODULE_UPDATED', 'Module updated successfully');
define('_AM_MYMODULE_ERROR', 'An error occurred');
?>
```

---

## 설치 체크리스트

```mermaid
graph TD
    A[Installation Checklist] --> B["1. Verify Module Structure"]
    A --> C["2. Check Permissions"]
    A --> D["3. Test SQL File"]
    A --> E["4. Verify xoopsversion.php"]
    A --> F["5. Check Language Files"]
    A --> G["6. Test Installation"]
    A --> H["7. Verify in Admin"]

    B --> B1["✓ Contains xoopsversion.php"]
    B --> B2["✓ SQL files present"]
    B --> B3["✓ Language files present"]

    C --> C1["✓ modules/ is 755"]
    C --> C2["✓ uploads/ is 777"]
    C --> C3["✓ Web server can write"]

    D --> D1["✓ SQL syntax valid"]
    D --> D2["✓ No duplicate tables"]

    E --> E1["✓ Valid PHP syntax"]
    E --> E2["✓ Required fields present"]

    F --> F1["✓ english/ folder exists"]
    F --> F2["✓ .php files present"]

    G --> G1["✓ Uploads successfully"]
    G --> G2["✓ Database creates"]

    H --> H1["✓ Visible in module list"]
    H --> H2["✓ Admin page accessible"]
```

---

## 디버그 스크립트

`modules/mymodule/debug_install.php` 생성:

```php
<?php
/**
 * Module Installation Debugger
 * Delete after troubleshooting!
 */

require_once '../../mainfile.php';

echo "<h1>Module Installation Debug</h1>";

// 1. Check file structure
echo "<h2>1. File Structure</h2>";
$required_files = [
    'xoopsversion.php',
    'language/english/modinfo.php',
    'language/english/index.php',
    'language/english/admin.php'
];

foreach ($required_files as $file) {
    $path = __DIR__ . '/' . $file;
    echo file_exists($path) ? "✓" : "✗";
    echo " $file<br>";
}

// 2. Check xoopsversion.php
echo "<h2>2. xoopsversion.php Content</h2>";
$version_file = __DIR__ . '/xoopsversion.php';
if (file_exists($version_file)) {
    $modversion = [];
    include $version_file;
    echo "<pre>";
    echo "Name: " . ($modversion['name'] ?? 'NOT SET') . "\n";
    echo "Version: " . ($modversion['version'] ?? 'NOT SET') . "\n";
    echo "Dirname: " . ($modversion['dirname'] ?? 'NOT SET') . "\n";
    echo "Has SQL: " . (isset($modversion['sqlfile']) ? "YES" : "NO") . "\n";
    echo "Has Tables: " . (isset($modversion['tables']) ? count($modversion['tables']) : 0) . "\n";
    echo "</pre>";
}

// 3. Check SQL file
echo "<h2>3. SQL File</h2>";
$sql_file = __DIR__ . '/sql/mysql.sql';
if (file_exists($sql_file)) {
    $content = file_get_contents($sql_file);
    $tables = substr_count($content, 'CREATE TABLE');
    echo "✓ SQL file exists<br>";
    echo "✓ Contains $tables CREATE TABLE statements<br>";
    echo "<pre>" . htmlspecialchars(substr($content, 0, 300)) . "...</pre>";
} else {
    echo "✗ SQL file not found<br>";
}

// 4. Check language files
echo "<h2>4. Language Files</h2>";
$lang_files = [
    'language/english/modinfo.php',
    'language/english/index.php',
    'language/english/admin.php'
];

foreach ($lang_files as $file) {
    $path = __DIR__ . '/' . $file;
    if (file_exists($path)) {
        $size = filesize($path);
        echo "✓ $file ($size bytes)<br>";
    } else {
        echo "✗ $file MISSING<br>";
    }
}

// 5. Check permissions
echo "<h2>5. Directory Permissions</h2>";
echo "Module dir: " . substr(sprintf('%o', fileperms(__DIR__)), -4) . "<br>";

// 6. Test database connection
echo "<h2>6. Database Connection</h2>";
if (is_object($GLOBALS['xoopsDB'])) {
    echo "✓ Database connected<br>";

    // Try to create test table
    $test_sql = "CREATE TEMPORARY TABLE test_install (id INT PRIMARY KEY)";
    if ($GLOBALS['xoopsDB']->query($test_sql)) {
        echo "✓ Can create tables<br>";
    } else {
        echo "✗ Cannot create tables: " . $GLOBALS['xoopsDB']->error . "<br>";
    }
} else {
    echo "✗ Database not connected<br>";
}

echo "<p><strong>Delete this file after testing!</strong></p>";
?>
```

---

## 예방 및 모범 사례

1. 새 모듈을 설치하기 전에 **항상 백업**
2. 프로덕션에 배포하기 전에 **로컬에서 테스트**
3. 업로드 전 **모듈 구조 확인**
4. 업로드 후 바로 **권한 확인**
5. **xoops_log 테이블을 검토**하여 설치 오류가 있는지 확인하세요.
6. 작동 중인 모듈 버전의 **백업 유지**

---

## 관련 문서

- 디버그 모드 활성화
- 모듈 FAQ
- 모듈 구조
- 데이터베이스 연결 오류

---

#xoops #문제 해결 #모듈 #설치 #디버깅
