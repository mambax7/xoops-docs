---
title: "부록 5: XOOPS 설치 보안 강화"
---

XOOPS 2.7.0을 설치한 후 다음 단계에 따라 사이트를 강화하세요. 각 단계는 개별적으로 선택 사항이지만 함께 사용하면 설치의 기본 보안이 크게 향상됩니다.

## 1. 보호 모듈 설치 및 구성

번들 `protector` 모듈은 XOOPS 방화벽입니다. 초기 마법사에서 설치하지 않았다면 지금 관리 → 모듈 화면에서 설치하세요.

![](/xoops-docs/2.7/img/installation/img_73.jpg)

Protector의 관리 패널을 열고 표시되는 경고를 검토하십시오. `register_globals`과 같은 기존 PHP 지시문은 더 이상 존재하지 않으므로(PHP 8.2+에서는 제거됨) 해당 경고가 더 이상 표시되지 않습니다. 현재 경고는 일반적으로 디렉터리 권한, 세션 설정 및 신뢰 경로 구성과 관련이 있습니다.

## 2. `mainfile.php` 및 `secure.php`을 잠급니다.

설치 프로그램이 완료되면 두 파일을 모두 읽기 전용으로 표시하려고 시도하지만 일부 호스트는 권한을 되돌립니다. 필요한 경우 확인하고 다시 적용하세요.

- `mainfile.php` → `0444` (소유자, 그룹, 기타 읽기 전용)
- `xoops_data/data/secure.php` → `0444`

`mainfile.php`은 경로 상수(`XOOPS_ROOT_PATH`, `XOOPS_PATH`, `XOOPS_VAR_PATH`, `XOOPS_URL`, `XOOPS_COOKIE_DOMAIN`, `XOOPS_COOKIE_DOMAIN_USE_PSL`) 및 프로덕션 플래그를 정의합니다. `secure.php`은 데이터베이스 자격 증명을 보유합니다.

- 2.5.x에서는 `mainfile.php`에 거주하는 데 사용되는 데이터베이스 자격 증명입니다. 이제 런타임 시 `mainfile.php`에 의해 로드되는 `xoops_data/data/secure.php`에 저장됩니다. `secure.php`을 `xoops_data/`(문서 루트 외부로 재배치하는 것이 권장되는 디렉터리) 내부에 유지하면 공격자가 HTTP를 통해 자격 증명에 접근하기가 훨씬 더 어려워집니다.

## 3. `xoops_lib/` 및 `xoops_data/`을 문서 루트 외부로 이동합니다.

아직 수행하지 않은 경우 이 두 디렉터리를 웹 루트 위로 한 수준 이동하고 이름을 바꿉니다. 그런 다음 `mainfile.php`에서 해당 상수를 업데이트합니다.

```php
define('XOOPS_ROOT_PATH', '/home/you/www');
define('XOOPS_PATH',      '/home/you/zubra_mylib');
define('XOOPS_VAR_PATH',  '/home/you/zubra_mydata');
define('XOOPS_TRUST_PATH', XOOPS_PATH);
```

이러한 디렉터리를 문서 루트 외부에 배치하면 Composer의 `vendor/` 트리, 캐시된 템플릿, 세션 파일, 업로드된 데이터 및 `secure.php`의 데이터베이스 자격 증명에 직접 액세스할 수 없습니다.

## 4. 쿠키 도메인 구성

XOOPS 2.7.0에는 `mainfile.php`에 두 개의 쿠키 도메인 상수가 도입되었습니다.

```php
// Use the Public Suffix List (PSL) to derive the registrable domain.
define('XOOPS_COOKIE_DOMAIN_USE_PSL', true);

// Explicit cookie domain; may be blank, the full host, or the registrable domain.
define('XOOPS_COOKIE_DOMAIN', '');
```

지침:

- 단일 호스트 이름이나 IP에서 XOOPS를 제공하는 경우 `XOOPS_COOKIE_DOMAIN`을 비워 두세요.
- 전체 호스트(예: `www.example.com`)를 사용하여 해당 호스트 이름으로만 쿠키 범위를 지정합니다.
- `www.example.com`, `blog.example.com` 등에서 쿠키를 공유하려는 경우 등록 가능한 도메인(예: `example.com`)을 사용합니다.
- `XOOPS_COOKIE_DOMAIN_USE_PSL = true`을 사용하면 실수로 유효 TLD에 쿠키를 설정하는 대신 XOOPS가 복합 TLD(`co.uk`, `com.au`, …)를 올바르게 분할할 수 있습니다.

## 5. `mainfile.php`의 프로덕션 플래그

`mainfile.dist.php`은 프로덕션을 위해 `false`으로 설정된 다음 두 플래그와 함께 제공됩니다.

```php
define('XOOPS_DB_LEGACY_LOG', false); // disable legacy SQL usage logging
define('XOOPS_DEBUG',         false); // disable debug notices
```

생산 중에는 그대로 두십시오. 다음과 같은 경우 개발 또는 준비 환경에서 일시적으로 활성화합니다.

- 오래 지속되는 레거시 데이터베이스 호출(`XOOPS_DB_LEGACY_LOG = true`)을 찾아냅니다.
- 표면 `E_USER_DEPRECATED` 알림 및 기타 디버그 출력(`XOOPS_DEBUG = true`).

## 6. 설치 프로그램 삭제

설치가 완료된 후:

1. 웹 루트에서 이름이 변경된 `install_remove_*` 디렉터리를 삭제합니다.
2. 정리 중에 마법사가 생성한 `install_cleanup_*.php` 스크립트를 삭제합니다.
3. `install/` 디렉터리에 더 이상 HTTP를 통해 연결할 수 없는지 확인합니다.

비활성화되어 있지만 현재 설치 프로그램 디렉터리를 유지하는 것은 심각도는 낮지만 피할 수 있는 위험입니다.

## 7. XOOPS와 모듈을 최신 상태로 유지하세요

XOOPS는 정기적인 패치 흐름을 따릅니다. 릴리스 알림을 받으려면 XoopsCore27 GitHub 저장소를 구독하고 새 릴리스가 출시될 때마다 사이트와 타사 모듈을 업데이트하세요. 2.7.x의 보안 업데이트는 저장소의 릴리스 페이지를 통해 게시됩니다.
