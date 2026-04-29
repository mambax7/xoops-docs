---
title: "기본 구성"
description: "mainfile.php 설정, 사이트 이름, 이메일 및 시간대 구성을 포함한 초기 XOOPS 설정"
---

# 기본 XOOPS 구성

이 가이드에서는 설치 후 XOOPS 사이트를 제대로 실행하기 위한 필수 구성 설정을 다룹니다.

## mainfile.php 구성

`mainfile.php` 파일에는 XOOPS 설치에 대한 중요한 구성이 포함되어 있습니다. 설치 중에 생성되지만 수동으로 편집해야 할 수도 있습니다.

### 위치

```
/var/www/html/xoops/mainfile.php
```

### 파일 구조

```php
<?php
// Database Configuration
define('XOOPS_DB_TYPE', 'mysqli');  // Database type
define('XOOPS_DB_HOST', 'localhost');  // Database host
define('XOOPS_DB_USER', 'xoops_user');  // Database user
define('XOOPS_DB_PASS', 'password');  // Database password
define('XOOPS_DB_NAME', 'xoops_db');  // Database name
define('XOOPS_DB_PREFIX', 'xoops_');  // Table prefix

// Site Configuration
define('XOOPS_ROOT_PATH', '/var/www/html/xoops');  // File system path
define('XOOPS_URL', 'http://your-domain.com/xoops');  // Web URL
define('XOOPS_TRUST_PATH', '/var/www/html/xoops/var');  // Trusted path

// Character Set
define('XOOPS_DB_CHARSET', 'utf8mb4');  // Database charset
define('_CHARSET', 'UTF-8');  // Page charset

// Debug Mode (set to 0 in production)
define('XOOPS_DEBUG', 0);  // Set to 1 for debugging
?>
```

### 중요한 설정 설명

| 설정 | 목적 | 예 |
|---|---|---|
| `XOOPS_DB_TYPE` | 데이터베이스 시스템 | `mysqli`, `mysql`, `pdo` |
| `XOOPS_DB_HOST` | 데이터베이스 서버 위치 | `localhost`, `192.168.1.1` |
| `XOOPS_DB_USER` | 데이터베이스 사용자 이름 | `xoops_user` |
| `XOOPS_DB_PASS` | 데이터베이스 비밀번호 | [보안_비밀번호] |
| `XOOPS_DB_NAME` | 데이터베이스 이름 | `xoops_db` |
| `XOOPS_DB_PREFIX` | 테이블 이름 접두사 | `xoops_`(하나의 DB에 여러 XOOPS 허용) |
| `XOOPS_ROOT_PATH` | 실제 파일 시스템 경로 | `/var/www/html/xoops` |
| `XOOPS_URL` | 웹 접근 가능 URL | `http://your-domain.com` |
| `XOOPS_TRUST_PATH` | 신뢰할 수 있는 경로(웹 루트 외부) | `/var/www/xoops_var` |

### mainfile.php 편집하기

텍스트 편집기에서 mainfile.php를 엽니다.

```bash
# Using nano
nano /var/www/html/xoops/mainfile.php

# Using vi
vi /var/www/html/xoops/mainfile.php

# Using sed (find and replace)
sed -i "s|define('XOOPS_URL'.*|define('XOOPS_URL', 'http://new-domain.com');|" /var/www/html/xoops/mainfile.php
```

### 일반적인 mainfile.php 변경 사항

**사이트 URL 변경:**
```php
define('XOOPS_URL', 'https://yourdomain.com');
```

**디버그 모드 활성화(개발 전용):**
```php
define('XOOPS_DEBUG', 1);
```

**테이블 접두사 변경(필요한 경우):**
```php
define('XOOPS_DB_PREFIX', 'myxoops_');
```

**웹 루트 외부로 신뢰 경로 이동(고급):**
```php
define('XOOPS_TRUST_PATH', '/var/www/xoops_var');
```

## 관리자 패널 구성

XOOPS 관리자 패널을 통해 기본 설정을 구성합니다.

### 시스템 설정에 액세스하기

1. 관리자 패널에 로그인하세요: `http://your-domain.com/xoops/admin/`
2. **시스템 > 기본 설정 > 일반 설정**으로 이동합니다.
3. 설정 수정(아래 참조)
4. 하단의 '저장'을 클릭하세요.

### 사이트 이름 및 설명

사이트가 표시되는 방식을 구성합니다.

```
Site Name: My XOOPS Site
Site Description: A dynamic content management system
Site Slogan: Built with XOOPS
```

### 연락처 정보

사이트 연락처 세부정보 설정:

```
Site Admin Email: admin@your-domain.com
Site Admin Name: Site Administrator
Contact Form Email: support@your-domain.com
Support Email: help@your-domain.com
```

### 언어 및 지역

기본 언어 및 지역 설정:

```
Default Language: English
Default Timezone: America/New_York  (or your timezone)
Date Format: %Y-%m-%d
Time Format: %H:%M:%S
```

## 이메일 구성

알림 및 사용자 통신을 위한 이메일 설정을 구성합니다.

### 이메일 설정 위치

**관리자 패널:** 시스템 > 환경설정 > 이메일 설정

### SMTP 구성

안정적인 이메일 전달을 위해 PHP mail() 대신 SMTP를 사용하세요.

```
Use SMTP: Yes
SMTP Host: smtp.gmail.com  (or your SMTP provider)
SMTP Port: 587  (TLS) or 465 (SSL)
SMTP Username: your-email@gmail.com
SMTP Password: [app_password]
SMTP Security: TLS or SSL
```

### Gmail 구성 예

Gmail을 통해 이메일을 보내려면 XOOPS를 설정하세요.

```
SMTP Host: smtp.gmail.com
SMTP Port: 587
SMTP Security: TLS
SMTP Username: your-email@gmail.com
SMTP Password: [Google App Password - NOT regular password]
From Address: your-email@gmail.com
From Name: Your Site Name
```

**참고:** Gmail에는 Gmail 비밀번호가 아닌 앱 비밀번호가 필요합니다.
1. https://myaccount.google.com/apppasswords로 이동
2. "메일" 및 "Windows 컴퓨터"에 대한 앱 비밀번호 생성
3. XOOPS에서 생성된 비밀번호를 사용하세요.

### PHP mail() 구성(간단하지만 안정성이 떨어짐)

SMTP를 사용할 수 없는 경우 PHP mail()을 사용하십시오.

```
Use SMTP: No
From Address: noreply@your-domain.com
From Name: Your Site Name
```

서버에 sendmail 또는 postfix가 구성되어 있는지 확인하십시오.

```bash
# Check if sendmail is available
which sendmail

# Or check postfix
systemctl status postfix
```

### 이메일 기능 설정

이메일을 트리거하는 요소를 구성합니다.

```
Send Notifications: Yes
Notify Admin on User Registration: Yes
Send Welcome Email to New Users: Yes
Send Password Reset Link: Yes
Enable User Email: Yes
Enable Private Messages: Yes
Notify on Admin Actions: Yes
```

## 시간대 구성

올바른 타임스탬프와 예약을 위해 적절한 시간대를 설정하세요.

### 관리자 패널에서 시간대 설정하기

**경로:** 시스템 > 환경설정 > 일반 설정

```
Default Timezone: [Select your timezone]
```

**공통 시간대:**
- 미국/뉴욕(EST/EDT)
- 미국/시카고(CST/CDT)
- 미국/덴버(MST/MDT)
- 아메리카/로스엔젤레스(PST/PDT)
- 유럽/런던(GMT/BST)
- 유럽/파리(CET/CEST)
- 아시아/도쿄(JST)
- 아시아/상하이(CST)
- 호주/시드니(AEDT/AEST)

### 시간대 확인

현재 서버 시간대를 확인하세요.

```bash
# Show current timezone
timedatectl

# Or check date
date +%Z

# List available timezones
timedatectl list-timezones
```

### 시스템 시간대 설정(Linux)

```bash
# Set timezone
timedatectl set-timezone America/New_York

# Or use symlink method
ln -sf /usr/share/zoneinfo/America/New_York /etc/localtime

# Verify
date
```

## URL 구성

### 깨끗한 URL(친숙한 URL) 활성화

`/index.php?page=about` 대신 `/page/about`과 같은 URL의 경우

**요구사항:**
- mod_rewrite가 활성화된 Apache
- XOOPS 루트의 `.htaccess` 파일

**관리자 패널에서 활성화:**

1. **시스템 > 기본 설정 > URL 설정**으로 이동합니다.
2. 확인: "친숙한 URL 활성화"
3. 선택: "URL 유형"(경로 정보 또는 쿼리)
4. 저장

**.htaccess가 있는지 확인:**

```bash
cat /var/www/html/xoops/.htaccess
```

샘플.htaccess 콘텐츠:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /xoops/
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ index.php?$1 [L,QSA]
</IfModule>
```

**깨끗한 URL 문제 해결:**

```bash
# Verify mod_rewrite enabled
apache2ctl -M | grep rewrite

# Enable if needed
a2enmod rewrite

# Restart Apache
systemctl restart apache2

# Test rewrite rule
curl -I http://your-domain.com/xoops/index.php
```

### 사이트 URL 구성

**관리자 패널:** 시스템 > 기본 설정 > 일반 설정

도메인에 대한 올바른 URL을 설정하세요:

```
Site URL: http://your-domain.com/xoops/
```

또는 XOOPS가 루트에 있는 경우:

```
Site URL: http://your-domain.com/
```

## 검색 엔진 최적화(SEO)

더 나은 검색 엔진 가시성을 위해 SEO 설정을 구성합니다.

### 메타 태그

전역 메타 태그를 설정합니다.

**관리자 패널:** 시스템 > 기본 설정 > SEO 설정

```
Meta Keywords: xoops, cms, content management
Meta Description: A dynamic content management system
```

`<head>` 페이지에 표시됩니다.

```html
<meta name="keywords" content="xoops, cms, content management">
<meta name="description" content="A dynamic content management system">
```

### 사이트맵

검색 엔진에 대해 XML 사이트맵을 활성화합니다.

1. **시스템 > 모듈**로 이동합니다.
2. "사이트맵" 모듈 찾기
3. 클릭하여 설치 및 활성화
4. `/xoops/sitemap.xml`에서 사이트맵에 액세스하세요.

### 로봇.txt

검색 엔진 크롤링 제어:

`/var/www/html/xoops/robots.txt` 생성:

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /templates_c/
Disallow: /install/
Disallow: /upgrade/

Sitemap: https://your-domain.com/xoops/sitemap.xml
```

## 사용자 설정

기본 사용자 관련 설정을 구성합니다.

### 사용자 등록

**관리자 패널:** 시스템 > 기본 설정 > 사용자 설정

```
Allow User Registration: Yes/No
User Registration Type:
  - Instant (Automatic approval)
  - Approval Required (Admin approval needed)
  - Email Verification (Email confirmation required)

Email Confirmation Required: Yes/No
Account Activation Method: Automatic/Manual
```

### 사용자 프로필

```
Enable User Profiles: Yes
Show User Avatar: Yes
Maximum Avatar Size: 100KB
Avatar Dimensions: 100x100 pixels
```

### 사용자 이메일 표시

```
Show User Email: No (for privacy)
Users Can Hide Email: Yes
Users Can Change Avatar: Yes
Users Can Upload Files: Yes
```

## 캐시 구성

적절한 캐싱으로 성능을 향상합니다.

### 캐시 설정

**관리자 패널:** 시스템 > 환경설정 > 캐시 설정

```
Enable Caching: Yes
Cache Method: File (or APCu/Memcache if available)
Cache Lifetime: 3600 seconds (1 hour)
```

### 캐시 지우기

오래된 캐시 파일 지우기:

```bash
# Manual cache clear
rm -rf /var/www/html/xoops/cache/*
rm -rf /var/www/html/xoops/templates_c/*

# From admin panel:
# System > Dashboard > Tools > Clear Cache
```

## 초기 설정 체크리스트

설치 후 다음을 구성합니다.

- [ ] 사이트 이름과 설명이 올바르게 설정됨
- [ ] 관리자 이메일이 구성됨
- [ ] SMTP 이메일 설정 구성 및 테스트
- [ ] 시간대가 해당 지역으로 설정됨
- [ ] URL이 올바르게 구성되었습니다.
- [ ] 원하는 경우 깨끗한 URL(친숙한 URL) 활성화
- [ ] 사용자 등록 설정이 구성됨
- [ ] SEO용 메타 태그 구성
- [ ] 기본 언어가 선택됨
- [ ] 캐시 설정 활성화됨
- [ ] 관리자 비밀번호는 강력합니다(16자 이상).
- [ ] 테스트 사용자 등록
- [ ] 이메일 기능 테스트
- [ ] 테스트 파일 업로드
- [ ] 홈페이지 방문 및 외관 확인

## 테스트 구성

### 테스트 이메일

테스트 이메일 보내기:

**관리자 패널:** 시스템 > 이메일 테스트

또는 수동으로:

```php
<?php
// Create test file: /var/www/html/xoops/test-email.php
require_once __DIR__ . '/mainfile.php';
require_once XOOPS_ROOT_PATH . '/class/mail/phpmailer/class.phpmailer.php';

$mailer = xoops_getMailer();
$mailer->addRecipient('admin@your-domain.com');
$mailer->setSubject('XOOPS Email Test');
$mailer->setBody('This is a test email from XOOPS');

if ($mailer->send()) {
    echo "Email sent successfully!";
} else {
    echo "Failed to send email: " . $mailer->getError();
}
?>
```

### 데이터베이스 연결 테스트

```php
<?php
// Create test file: /var/www/html/xoops/test-db.php
require_once __DIR__ . '/mainfile.php';

$connection = XoopsDatabaseFactory::getDatabaseConnection();
if ($connection) {
    echo "Database connected successfully!";
    $result = $connection->query("SELECT COUNT(*) FROM " . $connection->prefix("users"));
    if ($result) {
        echo "Query successful!";
    }
} else {
    echo "Database connection failed!";
}
?>
```

**중요:** 테스트 후에는 테스트 파일을 삭제하세요!

```bash
rm /var/www/html/xoops/test-*.php
```

## 구성 파일 요약

| 파일 | 목적 | 편집 방법 |
|---|---|---|
| 메인파일.php | 데이터베이스 및 코어 설정 | 텍스트 편집기 |
| 관리자 패널 | 대부분의 설정 | 웹 인터페이스 |
|.htaccess | URL 재작성 | 텍스트 편집기 |
| robots.txt | 검색 엔진 크롤링 | 텍스트 편집기 |

## 다음 단계

기본 구성 후:

1. 시스템 설정을 세부적으로 구성합니다.
2. 보안 강화
3. 관리자 패널 탐색
4. 첫 번째 콘텐츠 만들기
5. 사용자 계정 설정

---

**태그:** #구성 #설정 #이메일 #시간대 #seo

**관련 기사:**
-../설치/설치
- 시스템 설정
- 보안 구성
- 성능 최적화
