---
title: "모듈 개발"
description: "최신 PHP 방식을 사용하여 XOOPS 모듈을 개발하기 위한 종합 가이드"
---

이 섹션에서는 최신 PHP 방식, 디자인 패턴 및 모범 사례를 사용하여 XOOPS 모듈을 개발하기 위한 포괄적인 문서를 제공합니다.

## 개요

XOOPS 모듈 개발은 수년에 걸쳐 크게 발전했습니다. 최신 모듈은 다음을 활용합니다.

- **MVC 아키텍처** - 문제의 명확한 분리
- **PHP 8.x 기능** - 유형 선언, 속성, 명명된 인수
- **디자인 패턴** - 리포지토리, DTO, 서비스 레이어 패턴
- **테스트** - 최신 테스트 방식을 갖춘 PHPUnit
- **XMF 프레임워크** - XOOPS 모듈 프레임워크 유틸리티

## 문서 구조

### 튜토리얼

XOOPS 모듈을 처음부터 구축하기 위한 단계별 가이드입니다.

- 튜토리얼/Hello-World-Module - 첫 번째 XOOPS 모듈
- 튜토리얼/CRUD 모듈 구축 - 완전한 생성, 읽기, 업데이트, 삭제 기능

### 디자인 패턴

최신 XOOPS 모듈 개발에 사용되는 아키텍처 패턴입니다.

- 패턴/MVC-패턴 - 모델-뷰-컨트롤러 아키텍처
- 패턴/저장소 패턴 - 데이터 액세스 추상화
- 패턴/DTO-패턴 - 깔끔한 데이터 흐름을 위한 데이터 전송 개체

### 모범 사례

유지 관리가 가능한 고품질 코드 작성을 위한 지침입니다.

- 모범 사례/클린 코드 - XOOPS의 클린 코드 원칙
- 모범 사례/코드 냄새 - 일반적인 안티 패턴 및 수정 방법
- 모범 사례/테스트 - PHPUnit 테스트 전략

### 예

실제 모듈 분석 및 구현 사례.

- 게시자-모듈-분석 - 게시자 모듈 심층 분석

## 모듈 디렉토리 구조

잘 구성된 XOOPS 모듈은 다음 디렉터리 구조를 따릅니다.

```
/modules/mymodule/
    /admin/
        admin_header.php
        admin_footer.php
        index.php
        menu.php
    /assets/
        /css/
        /js/
        /images/
    /blocks/
        myblock.php
    /class/
        /Controller/
        /Entity/
        /Repository/
        /Service/
    /include/
        common.php
        install.php
        uninstall.php
        update.php
    /language/
        /english/
            admin.php
            main.php
            modinfo.php
    /preloads/
        core.php
    /sql/
        mysql.sql
    /templates/
        /admin/
        /blocks/
        main_index.tpl
    /test/
        bootstrap.php
        /Unit/
        /Integration/
    index.php
    xoops_version.php
```

## 주요 파일 설명

### xoops_version.php

XOOPS에 모듈에 대해 알려주는 모듈 정의 파일:

```php
<?php
$modversion = [];

// Basic Information
$modversion['name']        = 'My Module';
$modversion['version']     = 1.00;
$modversion['description'] = 'A sample XOOPS module';
$modversion['author']      = 'Your Name';
$modversion['credits']     = 'Your Team';
$modversion['license']     = 'GPL 2.0 or later';
$modversion['dirname']     = 'mymodule';
$modversion['image']       = 'assets/images/logo.png';

// Module Flags
$modversion['hasMain']     = 1;  // Has frontend pages
$modversion['hasAdmin']    = 1;  // Has admin section
$modversion['system_menu'] = 1;  // Show in admin menu

// Admin Configuration
$modversion['adminindex']  = 'admin/index.php';
$modversion['adminmenu']   = 'admin/menu.php';

// Database
$modversion['sqlfile']['mysql'] = 'sql/mysql.sql';
$modversion['tables'] = [
    'mymodule_items',
    'mymodule_categories',
];

// Templates
$modversion['templates'][] = [
    'file'        => 'mymodule_index.tpl',
    'description' => 'Index page template',
];

// Blocks
$modversion['blocks'][] = [
    'file'        => 'myblock.php',
    'name'        => 'My Block',
    'description' => 'Displays recent items',
    'show_func'   => 'mymodule_block_show',
    'edit_func'   => 'mymodule_block_edit',
    'template'    => 'mymodule_block.tpl',
];

// Module Preferences
$modversion['config'][] = [
    'name'        => 'items_per_page',
    'title'       => '_MI_MYMODULE_ITEMS_PER_PAGE',
    'description' => '_MI_MYMODULE_ITEMS_PER_PAGE_DESC',
    'formtype'    => 'textbox',
    'valuetype'   => 'int',
    'default'     => 10,
];
```

### 공통 포함 파일

모듈에 대한 공통 부트스트랩 파일을 만듭니다.

```php
<?php
// include/common.php

if (!defined('XOOPS_ROOT_PATH')) {
    die('XOOPS root path not defined');
}

// Module constants
define('MYMODULE_DIRNAME', 'mymodule');
define('MYMODULE_PATH', XOOPS_ROOT_PATH . '/modules/' . MYMODULE_DIRNAME);
define('MYMODULE_URL', XOOPS_URL . '/modules/' . MYMODULE_DIRNAME);

// Autoload classes
require_once MYMODULE_PATH . '/class/autoload.php';
```

## PHP 버전 요구사항

최신 XOOPS 모듈은 다음을 활용하기 위해 PHP 8.0 이상을 대상으로 해야 합니다.

- **건축가 부동산 프로모션**
- **명명된 인수**
- **조합 유형**
- **일치 표현식**
- **속성**
- **Nullsafe 연산자**

## 시작하기

1. Tutorials/Hello-World-Module 튜토리얼로 시작하세요.
2. 튜토리얼 진행/CRUD 모듈 구축
3. 아키텍처 지침을 위한 패턴/MVC 패턴 연구
4. 전체에 걸쳐 모범 사례/클린 코드 관행을 적용합니다.
5. 처음부터 모범 사례/테스트 구현

## 관련 리소스

-../05-XMF-Framework/XMF-Framework - XOOPS 모듈 프레임워크 유틸리티
- 데이터베이스 작업 - XOOPS 데이터베이스 작업
-../04-API-Reference/Template/Template-System - XOOPS의 Smarty 템플릿 작성
-../02-Core-Concepts/Security/Security-Best-Practices - 모듈 보안

## 버전 기록

| 버전 | 날짜 | 변경사항 |
|---------|------|---------|
| 1.0 | 2025-01-28 | 초기 문서 |
