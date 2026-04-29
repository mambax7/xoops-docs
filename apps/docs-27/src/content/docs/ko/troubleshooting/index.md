---
title: "문제 해결"
description: "일반적인 XOOPS 문제, 디버깅 기술 및 FAQ에 대한 솔루션"
---

> XOOPS CMS의 일반적인 문제 및 디버깅 기술에 대한 솔루션입니다.

---

## 📋 빠른 진단

특정 문제를 자세히 알아보기 전에 다음과 같은 일반적인 원인을 확인하세요.

1. **파일 권한** - 디렉터리에는 755가 필요하고 파일에는 644가 필요합니다.
2. **PHP 버전** - PHP 7.4+(8.x 권장)인지 확인하세요.
3. **오류 로그** - `xoops_data/logs/` 및 PHP 오류 로그를 확인하세요.
4. **캐시** - 관리자 → 시스템 → 유지관리에서 캐시 지우기

---

## 🗂️ 섹션 내용

### 일반적인 문제
- 화이트 스크린 오브 데스(WSOD)
- 데이터베이스 연결 오류
- 권한 거부 오류
- 모듈 설치 실패
- 템플릿 컴파일 오류

### FAQ
- 설치 FAQ
- 모듈 FAQ
- 테마 FAQ
- 성능 FAQ

### 디버깅 중
- 디버그 모드 활성화
- 레이 디버거 사용
- 데이터베이스 쿼리 디버깅
- Smarty 템플릿 디버깅

---

## 🚨 일반적인 문제 및 솔루션

### 죽음의 백색 화면(WSOD)

**증상:** 빈 흰색 페이지, 오류 메시지 없음

**해결책:**

1. **PHP 오류 표시를 일시적으로 활성화합니다:**
   ```php
   // Add to mainfile.php temporarily
   error_reporting(E_ALL);
   ini_set('display_errors', 1);
   ```

2. **PHP 오류 로그 확인:**
   ```bash
   tail -f /var/log/php/error.log
   ```

3. **일반적인 원인:**
   - 메모리 한도를 초과했습니다.
   - 치명적인 PHP 구문 오류
   - 필수 확장 프로그램 누락

4. **메모리 문제 해결:**
   ```php
   // In mainfile.php or php.ini
   ini_set('memory_limit', '256M');
   ```

---

### 데이터베이스 연결 오류

**증상:** "데이터베이스에 연결할 수 없습니다" 또는 이와 유사한 현상

**해결책:**

1. **mainfile.php에서 자격 증명을 확인하세요:**
   ```php
   define('XOOPS_DB_HOST', 'localhost');
   define('XOOPS_DB_USER', 'your_username');
   define('XOOPS_DB_PASS', 'your_password');
   define('XOOPS_DB_NAME', 'your_database');
   ```

2. **수동으로 연결 테스트:**
   ```php
   <?php
   $conn = new mysqli('localhost', 'user', 'pass', 'database');
   if ($conn->connect_error) {
       die("Connection failed: " . $conn->connect_error);
   }
   echo "Connected successfully";
   ```

3. **MySQL 서비스 확인:**
   ```bash
   sudo systemctl status mysql
   sudo systemctl restart mysql
   ```

4. **사용자 권한 확인:**
   ```sql
   GRANT ALL PRIVILEGES ON xoops.* TO 'user'@'localhost';
   FLUSH PRIVILEGES;
   ```

---

### 권한 거부 오류

**증상:** 파일을 업로드할 수 없고 설정을 저장할 수 없습니다.

**해결책:**

1. **올바른 권한 설정:**
   ```bash
   # Directories
   find /path/to/xoops -type d -exec chmod 755 {} \;

   # Files
   find /path/to/xoops -type f -exec chmod 644 {} \;

   # Writable directories
   chmod -R 777 xoops_data/
   chmod -R 777 uploads/
   ```

2. **올바른 소유권 설정:**
   ```bash
   chown -R www-data:www-data /path/to/xoops
   ```

3. **SELinux(CentOS/RHEL) 확인:**
   ```bash
   # Check status
   sestatus

   # Allow httpd to write
   setsebool -P httpd_unified 1
   ```

---

### 모듈 설치 실패

**증상:** 모듈이 설치되지 않고 SQL 오류가 발생합니다.

**해결책:**

1. **모듈 요구 사항 확인:**
   - PHP 버전 호환성
   - 필수 PHP 확장
   - XOOPS 버전 호환성

2. **수동 SQL 설치:**
   ```bash
   mysql -u user -p database < modules/mymodule/sql/mysql.sql
   ```

3. **모듈 캐시 지우기:**
   ```php
   // In xoops_data/caches/
   rm -rf xoops_cache/*
   rm -rf smarty_cache/*
   rm -rf smarty_compile/*
   ```

4. **xoops_version.php 구문을 확인하세요:**
   ```bash
   php -l modules/mymodule/xoops_version.php
   ```

---

### 템플릿 컴파일 오류

**증상:** Smarty 오류, 템플릿을 찾을 수 없음

**해결책:**

1. **Smarty 캐시 지우기:**
   ```bash
   rm -rf xoops_data/caches/smarty_cache/*
   rm -rf xoops_data/caches/smarty_compile/*
   ```

2. **템플릿 구문 확인:**
   ```smarty
   {* Correct *}
   {$variable}

   {* Incorrect - missing $ *}
   {variable}
   ```

3. **템플릿이 존재하는지 확인:**
   ```bash
   ls modules/mymodule/templates/
   ```

4. **템플릿 재생성:**
   - 관리 → 시스템 → 유지관리 → 템플릿 → 재생성

---

## 🐛 디버깅 기술

### XOOPS 디버그 모드 활성화

```php
// In mainfile.php
define('XOOPS_DEBUG_LEVEL', 2);

// Levels:
// 0 = Off
// 1 = PHP debug
// 2 = PHP + SQL debug
// 3 = PHP + SQL + Smarty templates
```

### 레이 디버거 사용

Ray는 PHP를 위한 훌륭한 디버깅 도구입니다.

```php
// Install via Composer
composer require spatie/ray --dev

// Usage in your code
ray($variable);
ray($object)->expand();
ray()->measure();

// Database queries
ray($sql)->label('Query');
```

### Smarty 디버그 콘솔

```smarty
{* Enable in template *}
{debug}

{* Or in PHP *}
$xoopsTpl->debugging = true;
```

### 데이터베이스 쿼리 로깅

```php
// Enable query logging
$GLOBALS['xoopsDB']->setLogger(new XoopsLogger());

// Get all queries
$queries = $GLOBALS['xoopsLogger']->queries;
foreach ($queries as $query) {
    echo $query['sql'] . " - " . $query['time'] . "s\n";
}
```

---

## ❓ 자주 묻는 질문

### 설치

**질문: 설치 마법사에 빈 페이지가 표시됩니다**
A: PHP 오류 로그를 확인하고, PHP에 충분한 메모리가 있는지 확인하고, 파일 권한을 확인하세요.

**Q: 설치 중에 mainfile.php에 쓸 수 없습니다**
A: 권한을 설정합니다: 설치 중에 `chmod 666 mainfile.php`, 설치 후에는 `chmod 444`.

**Q: 데이터베이스 테이블이 생성되지 않았습니다**
A: MySQL 사용자에게 CREATE TABLE 권한이 있는지 확인하고 데이터베이스가 존재하는지 확인하세요.

### 모듈

**Q: 모듈 관리 페이지가 비어 있습니다**
A: 캐시를 지우고 모듈의 admin/menu.php에서 구문 오류를 확인하세요.

**질문: 모듈 블록이 표시되지 않습니다**
A: 관리 → 차단에서 차단 권한을 확인하고, 페이지에 차단이 할당되어 있는지 확인하세요.

**Q: 모듈 업데이트 실패**
A: 데이터베이스를 백업하고, 수동 SQL 업데이트를 시도하고, 버전 요구 사항을 확인하세요.

### 테마

**질문: 테마가 제대로 적용되지 않습니다**
A: Smarty 캐시를 지우고, theme.html이 있는지 확인하고, 테마 권한을 확인하세요.

**질문: 맞춤 CSS가 로드되지 않습니다**
A: 파일 경로를 확인하고, 브라우저 캐시를 지우고, CSS 구문을 확인하세요.

**Q: 이미지가 표시되지 않습니다**
A: 이미지 경로를 확인하고 업로드 폴더 권한을 확인하세요.

### 성능

**질문: 사이트가 매우 느립니다**
A: 캐싱 활성화, 데이터베이스 최적화, 느린 쿼리 확인, OpCache 활성화.

**질문: 높은 메모리 사용량**
A: 메모리 제한을 늘리고, 대규모 쿼리를 최적화하고, 페이지 매김을 구현하세요.

---

## 🔧 유지 관리 명령

### 모든 캐시 지우기

```bash
#!/bin/bash
# clear_cache.sh
rm -rf xoops_data/caches/xoops_cache/*
rm -rf xoops_data/caches/smarty_cache/*
rm -rf xoops_data/caches/smarty_compile/*
echo "Cache cleared!"
```

### 데이터베이스 최적화

```sql
-- Optimize all tables
OPTIMIZE TABLE xoops_config;
OPTIMIZE TABLE xoops_users;
OPTIMIZE TABLE xoops_session;
-- Repeat for other tables

-- Or optimize all at once
mysqlcheck -o -u user -p database
```

### 파일 무결성 확인

```bash
# Compare against fresh install
diff -r /path/to/xoops /path/to/fresh-xoops
```

---

## 🔗 관련 문서

- 시작하기
- 보안 모범 사례
- XOOPS 4.0 로드맵

---

## 📚 외부 리소스

- [XOOPS 포럼](https://xoops.org/modules/newbb/)
- [GitHub 문제](https://github.com/XOOPS/XoopsCore27/issues)
- [PHP 오류 참고](https://www.php.net/manual/en/errorfunc.constants.php)

---

#xoops #문제 해결 #디버깅 #faq #오류 #솔루션
