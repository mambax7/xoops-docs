---
title: "요구사항"
---

## 소프트웨어 환경(스택)

대부분의 XOOPS 프로덕션 사이트는 _LAMP_ 스택(**A**pache, **M**ySQL 및 **P**HP를 실행하는 **L**inux 시스템)에서 실행되지만 가능한 스택은 매우 다양합니다.

로컬 컴퓨터에서 새 사이트의 프로토타입을 만드는 것이 가장 쉬운 경우가 많습니다. 이 경우 많은 XOOPS 사용자는 _WAMP_ 스택(**W**indows를 OS로 사용)을 선택하고 다른 사용자는 _LAMP_ 또는 _MAMP_(**M**AC) 스택을 실행합니다.

### PHP

모든 PHP 버전 >= 8.2.0(PHP 8.4 이상 권장)

> **중요:** XOOPS 2.7.0에는 **PHP 8.2 이상**이 필요합니다. PHP 7.x 이하 버전은 더 이상 지원되지 않습니다. 이전 사이트를 업그레이드하는 경우 시작하기 전에 호스트가 PHP 8.2+를 제공하는지 확인하세요.

### MySQL

MySQL 서버 5.7 이상(MySQL Server 8.4 이상 권장) MySQL 9.0도 지원됩니다. MariaDB는 이전 버전과 호환되는 MySQL의 바이너리 드롭인 대체품이며 XOOPS에서도 잘 작동합니다.

### 웹 서버

Apache, NGINX, LiteSpeed 등과 같은 PHP 스크립트 실행을 지원하는 웹 서버

### 필수 PHP 확장

XOOPS 설치 프로그램은 설치를 진행하기 전에 다음 확장이 로드되었는지 확인합니다.

* `mysqli` — MySQL 데이터베이스 드라이버
* `session` — 세션 처리
* `pcre` — Perl 호환 정규 표현식
* `filter` — 입력 필터링 및 검증
* `fileinfo` — 업로드에 대한 MIME 유형 감지

### 필수 PHP 설정

위의 확장 외에도 설치 프로그램은 다음 `php.ini` 설정을 확인합니다.

* `file_uploads`은 **켜짐**이어야 합니다. 그렇지 않으면 XOOPS는 업로드된 파일을 허용할 수 없습니다.

### 권장 PHP 확장

설치 프로그램은 이러한 확장도 확인합니다. 엄격하게 요구되는 것은 아니지만 XOOPS와 대부분의 모듈은 전체 기능을 위해 이를 사용합니다. 호스트가 허용하는 만큼 활성화합니다.

* `mbstring` — 멀티바이트 문자열 처리
* `intl` — 국제화
* `iconv` — 문자 집합 변환
* `xml` — XML 구문 분석
* `zlib` — 압축
* `gd` — 이미지 처리
* `exif` — 이미지 메타데이터
* `curl` — 피드 및 API 호출을 위한 HTTP 클라이언트

## 서비스

### 파일 시스템 액세스(웹마스터 액세스용)

XOOPS 배포 파일을 웹 서버로 전송하려면 몇 가지 방법(FTP, SFTP 등)이 필요합니다.

### 파일 시스템 액세스(웹 서버 프로세스용)

XOOPS를 실행하려면 파일과 디렉터리를 생성하고 읽고 삭제하는 기능이 필요합니다. 일반 설치 및 일상적인 작업을 위해 웹 서버 프로세스에서 다음 경로에 쓸 수 있어야 합니다.

* `uploads/`
* `uploads/avatars/`
* `uploads/files/`
* `uploads/images/`
* `uploads/ranks/`
* `uploads/smilies/`
* `mainfile.php`(설치 및 업그레이드 중에 쓰기 가능)
* `xoops_data/`
* `xoops_data/caches/`
* `xoops_data/caches/xoops_cache/`
* `xoops_data/caches/smarty_cache/`
* `xoops_data/caches/smarty_compile/`
* `xoops_data/configs/`
* `xoops_data/configs/captcha/`
* `xoops_data/configs/textsanitizer/`
* `xoops_data/data/`
* `xoops_data/protector/`

### 데이터베이스

XOOPS는 MySQL에서 테이블을 생성, 수정 및 쿼리해야 합니다. 이를 위해서는 다음이 필요합니다.

* MySQL 사용자 계정 및 비밀번호
* 사용자가 모든 권한을 갖고 있는 MySQL 데이터베이스(또는 사용자가 그러한 데이터베이스를 생성할 수 있는 권한을 가질 수 있음)

### 이메일

라이브 사이트의 경우 XOOPS가 계정 활성화 및 비밀번호 재설정과 같은 사용자 통신에 사용할 수 있는 실제 이메일 주소가 필요합니다. 엄격하게 필수는 아니지만 가능하면 XOOPS가 실행되는 도메인과 일치하는 이메일 주소를 사용하는 것이 좋습니다. 이는 귀하의 커뮤니케이션이 거부되거나 스팸으로 표시되는 것을 방지하는 데 도움이 됩니다.

## 도구

XOOPS 설치를 설정하고 사용자 정의하려면 몇 가지 추가 도구가 필요할 수 있습니다. 여기에는 다음이 포함될 수 있습니다.

* FTP 클라이언트 소프트웨어
* 텍스트 편집기
* XOOPS 릴리스(_.zip_ 또는 _.tar.gz_) 파일과 함께 작동하는 아카이브 소프트웨어입니다.

필요한 경우 적합한 도구 및 웹 서버 스택에 대한 몇 가지 제안을 보려면 [업무용 도구](../tools/tools.md) 섹션을 참조하세요.

## 특별 주제

일부 특정 시스템 소프트웨어 조합에는 XOOPS와 작동하기 위해 몇 가지 추가 구성이 필요할 수 있습니다. SELinux 환경을 사용 중이거나 사용자 정의 테마로 이전 사이트를 업그레이드하는 경우 자세한 내용은 [특별 주제](specialtopics.md)를 참조하세요.
