---
title: XOOPS 2.5에서 2.7로 업그레이드
description: XOOPS 설치를 2.5.x에서 2.7.x로 안전하게 업그레이드하기 위한 단계별 가이드입니다.
---

:::주의사항[먼저 백업하세요]
업그레이드하기 전에 항상 데이터베이스와 파일을 백업하십시오. 예외는 없습니다.
:::

## 2.7에서 변경된 사항

- **PHP 8.2+ 필요** — PHP 7.x는 더 이상 지원되지 않습니다.
- **Composer 관리 종속성** — `composer.json`을 통해 관리되는 핵심 라이브러리
- **PSR-4 자동 로딩** — 모듈 클래스는 네임스페이스를 사용할 수 있습니다.
- **개선된 XoopsObject** — 새로운 `getVar()` 유형 안전성, 더 이상 사용되지 않음 `obj2Array()`
- **Bootstrap 5 admin** — Bootstrap 5로 재구축된 관리자 패널

## 업그레이드 전 체크리스트

- [ ] 서버에서 PHP 8.2+ 사용 가능
- [ ] 전체 데이터베이스 백업(`mysqldump -u user -p xoops_db > backup.sql`)
- [ ] 설치의 전체 파일 백업
- [ ] 설치된 모듈 및 해당 버전 목록
- [ ] 사용자 정의 테마가 별도로 백업됨

## 업그레이드 단계

### 1. 사이트를 유지 관리 모드로 전환합니다.

```php
// mainfile.php — add temporarily
define('XOOPS_MAINTENANCE', true);
```

### 2. XOOPS 2.7 다운로드

```bash
wget https://github.com/XOOPS/XoopsCore27/releases/latest/download/xoops-2.7.x.zip
unzip xoops-2.7.x.zip
```

### 3. 코어 파일 교체

다음을 **제외**한 새 파일을 업로드하세요.
- `uploads/` — 업로드한 파일
- `xoops_data/` — 구성
- `modules/` — 설치된 모듈
- `themes/` — 테마
- `mainfile.php` — 사이트 구성

```bash
rsync -av --exclude='uploads/' --exclude='xoops_data/' \
  --exclude='modules/' --exclude='themes/' --exclude='mainfile.php' \
  xoops-2.7/ /var/www/html/
```

### 4. 업그레이드 스크립트 실행

브라우저에서 `https://yourdomain.com/upgrade/`으로 이동합니다.
업그레이드 마법사는 데이터베이스 마이그레이션을 적용합니다.

### 5. 모듈 업데이트

XOOPS 2.7 모듈은 PHP 8.2와 호환되어야 합니다.
업데이트된 버전은 [모듈 에코시스템](/xoops-docs/2.7/module-guide/introduction/)에서 확인하세요.

관리 → 모듈에서 설치된 각 모듈에 대해 **업데이트**를 클릭합니다.

### 6. 유지 관리 모드를 제거하고 테스트합니다.

`mainfile.php`에서 `XOOPS_MAINTENANCE` 줄을 제거하고
모든 페이지가 올바르게 로드되는지 확인하세요.

## 일반적인 문제

**업그레이드 후 "클래스를 찾을 수 없음" 오류**
- XOOPS 루트에서 `composer dump-autoload`을 실행합니다.
- `xoops_data/caches/` 디렉터리 지우기

**업데이트 후 모듈이 손상됨**
- 모듈의 GitHub 릴리스에서 2.7 호환 버전을 확인하세요.
- 모듈은 PHP 8.2에 대한 코드 변경이 필요할 수 있습니다(더 이상 사용되지 않는 함수, 유형화된 속성).

**관리자 패널 CSS가 손상됨**
- 브라우저 캐시 지우기
- 파일 업로드 중에 `xoops_lib/`이 완전히 바뀌었는지 확인하세요.
