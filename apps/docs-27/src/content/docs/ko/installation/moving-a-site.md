---
title: "사이트 이동"
---

로컬 시스템이나 개발 서버에서 새로운 XOOPS 사이트의 프로토타입을 만드는 것은 매우 유용한 기술이 될 수 있습니다. 또한 문제가 발생할 경우를 대비해 먼저 프로덕션 사이트 복사본에서 XOOPS 업그레이드를 테스트하는 것이 매우 신중할 수 있습니다. 이를 달성하려면 XOOPS 사이트를 한 사이트에서 다른 사이트로 이동할 수 있어야 합니다. XOOPS 사이트를 성공적으로 이전하기 위해 알아야 할 사항은 다음과 같습니다.

첫 번째 단계는 새로운 사이트 환경을 구축하는 것입니다. [사전 준비](../installation/preparations/) 섹션에서 다루는 것과 동일한 항목이 여기에도 적용됩니다.

검토해 보면 해당 단계는 다음과 같습니다.

* 도메인 이름 또는 이메일 요구 사항을 포함하여 호스팅을 얻습니다.
* MySQL 사용자 계정과 비밀번호 얻기
* 위의 사용자가 모든 권한을 갖고 있는 MySQL 데이터베이스를 얻습니다.

나머지 프로세스는 일반 설치와 매우 유사하지만 다음과 같습니다.

* XOOPS 배포판에서 파일을 복사하는 대신 기존 사이트에서 파일을 복사합니다.
* 설치 프로그램을 실행하는 대신 이미 채워진 데이터베이스를 가져옵니다.
* 설치 프로그램에 답변을 입력하는 대신 파일 및 데이터베이스에서 이전 답변을 변경합니다.

## 기존 사이트 파일 복사

기존 사이트 파일의 전체 복사본을 편집할 수 있는 로컬 컴퓨터에 만듭니다. 원격 호스트로 작업하는 경우 FTP를 사용하여 파일을 복사할 수 있습니다. 사이트가 로컬 컴퓨터에서 실행 중이더라도 작업하려면 복사본이 필요합니다. 이 경우 사이트 디렉터리의 또 다른 복사본을 만드십시오.

_xoops_data_ 및 _xoops_lib_ 디렉터리의 이름이 변경되거나 재배치된 경우에도 해당 디렉터리를 포함하는 것을 기억하는 것이 중요합니다.

작업을 원활하게 하려면 복사본에서 캐시 및 Smarty 컴파일된 템플릿 파일을 제거해야 합니다. 이러한 파일은 새 환경에서 다시 생성되며, 삭제하지 않으면 이전의 잘못된 정보가 유지되는 문제가 발생할 수 있습니다. 이렇게 하려면 다음 세 디렉터리 모두에서 _index.html_을 제외한 모든 파일을 삭제하세요.

* _xoops_data_/caches/smarty_cache
* _xoops_data_/caches/smarty_compile
* _xoops_data_/caches/xoops_cache

> **참고:** `smarty_compile`을 지우는 것은 XOOPS 2.7.0에서 사이트를 이동할 때 특히 중요합니다. XOOPS 2.7.0은 Smarty 4개를 사용하며, Smarty 4개의 컴파일된 템플릿은 Smarty 3개의 컴파일된 템플릿과 호환되지 않습니다. 오래된 컴파일된 파일을 그대로 두면 새 사이트의 첫 번째 페이지 로드 시 템플릿 오류가 발생합니다.

### `xoops_lib` 및 Composer 종속성

XOOPS 2.7.0은 `xoops_lib/` 내부의 Composer를 통해 PHP 종속성을 관리합니다. `xoops_lib/vendor/` 디렉토리에는 XOOPS가 런타임에 필요로 하는 타사 라이브러리(Smarty 4, PHPMailer, HTMLPurifier 등)가 포함되어 있습니다. 사이트를 이동할 때 `vendor/`을 포함한 전체 `xoops_lib/` 트리를 새 호스트에 복사해야 합니다. `composer.json`을 사용자 정의하고 대상에서 Composer를 사용할 수 있는 개발자가 아닌 이상 대상 호스트에서 `vendor/`을 다시 생성하려고 시도하지 마십시오.

## 새 환경 설정

[사전 준비](../installation/preparations/) 섹션에서 다루는 것과 동일한 항목이 여기에도 적용됩니다. 여기서는 이동하려는 사이트에 필요한 모든 호스팅이 있다고 가정합니다.

### 주요 정보(mainfile.php 및 secure.php)

사이트를 성공적으로 이동하려면 절대 파일 및 경로 이름, URL, 데이터베이스 매개변수 및 액세스 자격 증명에 대한 참조를 변경해야 합니다.

사이트의 웹 루트에 있는 `mainfile.php` 및 사이트의(이름 변경 및/또는 재배치된) _xoops_data_ 디렉토리에 있는 `data/secure.php`의 두 파일은 URL, 호스트 파일 시스템의 위치 및 데이터베이스에 연결하는 방법과 같은 사이트의 기본 매개변수를 정의합니다.

이전 시스템의 값과 새 시스템의 값을 모두 알아야 합니다.

#### 메인파일.php

| 이름 | mainfile.php의 이전 값 | mainfile.php의 새로운 값 |
| :--- | :--- | :--- |
| XOOPS_ROOT_PATH |  |  |
| XOOPS_PATH |  |  |
| XOOPS_VAR_PATH |  |  |
| XOOPS_URL |  |  |
| XOOPS_COOKIE_DOMAIN |  |  |

편집기에서 _mainfile.php_를 엽니다. 위 차트에 표시된 정의 값을 이전 값에서 새 사이트에 적합한 값으로 변경합니다.

이후 단계에서 다른 위치에서도 유사한 변경을 수행해야 하므로 이전 값과 새 값을 기록해 두십시오.

예를 들어 로컬 PC에서 상업용 호스팅 서비스로 사이트를 이동하는 경우 값은 다음과 같습니다.

| 이름 | mainfile.php의 이전 값 | mainfile.php의 새로운 값 |
| :--- | :--- | :--- |
| XOOPS_ROOT_PATH | c:/wamp/xoopscore27/htdocs | /home8/example/public_html |
| XOOPS_PATH | c:/wamp/xoopscore27/htdocs/xoops_lib | /home8/예제/private/xoops_lib |
| XOOPS_VAR_PATH | c:/wamp/xoopscore27/htdocs/xoops_data | /home8/예/비공개/xoops_data |
| XOOPS_URL | http://localhost/xoops | https://example.com |
| XOOPS_COOKIE_DOMAIN | 로컬호스트 | example.com |

_mainfile.php_를 변경한 후 저장하세요.

일부 다른 파일에는 URL이나 경로에 대한 하드코딩된 참조가 포함될 수 있습니다. 이는 맞춤형 테마와 메뉴에서 발생할 가능성이 더 높지만, 확실히 하기 위해 편집기를 사용하면 모든 파일을 검색할 수 있습니다.

편집기에서 복사본의 파일을 검색하여 이전 XOOPS_URL 값을 검색하고 새 값으로 바꿉니다.

이전 XOOPS_ROOT_PATH 값에 대해 동일한 작업을 수행하여 모든 항목을 새 값으로 바꿉니다.

나중에 데이터베이스를 이동할 때 다시 사용해야 하므로 메모를 보관하십시오.

#### 데이터/secure.php

| 이름 | data/secure.php의 이전 값 | data/secure.php의 새로운 가치 |
| :--- | :--- | :--- |
| XOOPS_DB_HOST |  |  |
| XOOPS_DB_USER |  |  |
| XOOPS_DB_PASS |  |  |
| XOOPS_DB_NAME |  |  |

편집기에서 이름이 변경되거나 재배치된 _xoops_data_ 디렉토리에 있는 _data/secure.php_를 엽니다. 위 차트에 표시된 정의 값을 이전 값에서 새 사이트에 적합한 값으로 변경합니다.

#### 기타 파일

사이트 이동 시 주의가 필요한 다른 파일이 있을 수 있습니다. 몇 가지 일반적인 예는 다음과 같이 도메인에 연결될 수 있는 다양한 서비스에 대한 API 키입니다.

* 구글 지도
* 다시 캡쳐2
* 좋아요 버튼
* Shareaholic 또는 AddThis와 같은 링크 공유 및/또는 광고

이전 도메인에 대한 연결은 일반적으로 서비스 측 등록의 일부이므로 이러한 유형의 연결 변경은 쉽게 자동화할 수 없습니다. 어떤 경우에는 단순히 서비스와 관련된 도메인을 추가하거나 변경할 수도 있습니다.

### 새 사이트에 파일 복사

이제 수정된 파일을 새 사이트에 복사하세요. 기술은 [설치](../installation/installation/) 중에 사용된 것과 동일합니다. 즉, FTP를 사용합니다.

## 기존 사이트 데이터베이스 복사

### 이전 서버에서 데이터베이스 백업

이 단계에서는 _phpMyAdmin_을 사용하는 것이 좋습니다. 기존 사이트의 _phpMyAdmin_에 로그인하고 데이터베이스를 선택한 다음 _내보내기_를 선택하세요.

일반적으로 기본 설정이 괜찮으므로 _Quick_의 "내보내기 방법"과 _SQL_의 "형식"을 선택하면 됩니다.

_이동_ 버튼을 사용하여 데이터베이스 백업을 다운로드하세요.

![Exporting a Database with phpMyAdmin](/xoops-docs/2.7/img/installation/phpmyadmin-export-01.png)

데이터베이스에 XOOPS 또는 해당 모듈이 아닌 테이블이 있고 이동해서는 안 되는 테이블이 있는 경우 _Custom_의 "내보내기 방법"을 선택하고 데이터베이스에서 XOOPS 관련 테이블만 선택해야 합니다. (이는 설치 중에 지정한 "접두사"로 시작합니다. `xoops_data/data/secure.php` 파일에서 데이터베이스 접두사를 조회할 수 있습니다.)

### 새 서버에 데이터베이스 복원

새 호스트에서 새 데이터베이스를 사용하여 _phpMyAdmin_(또는 필요한 경우 _bigdump_)의 _Import_ 탭과 같은 [도구](../tools/tools.md)를 사용하여 데이터베이스를 복원하세요.

### 데이터베이스의 URL 및 경로 업데이트

데이터베이스의 사이트 리소스에 대한 http 링크를 업데이트하세요. 이는 엄청난 노력이 될 수 있으며 이를 더 쉽게 만들어 주는 [도구](../tools/tools.md)가 있습니다.

Interconnect/it에는 이를 도와줄 수 있는 Search-Replace-DB라는 제품이 있습니다. Wordpress 및 Drupal 환경에 대한 인식이 내장되어 있습니다. 있는 그대로 이 도구는 매우 유용할 수 있지만 XOOPS를 인식하면 훨씬 더 좋습니다. [https://github.com/geekwright/srdb](https://github.com/geekwright/srdb)에서 XOOPS 인식 버전을 찾을 수 있습니다.

README.md 파일의 지침에 따라 이 유틸리티를 다운로드하고 사이트에 임시로 설치하십시오. 이전에는 XOOPS_URL 정의를 변경했습니다. 이 도구를 실행할 때 원래 XOOPS_URL 정의를 새 정의로 바꾸고 싶습니다. 즉, [http://localhost/xoops](http://localhost/xoops)을 [https://example.com](https://example.com)으로 바꾸십시오.

![Using Seach and Replace DB](/xoops-docs/2.7/img/installation/srdb-01.png)

이전 URL과 새 URL을 입력하고 테스트 실행 옵션을 선택하세요. 변경 사항을 검토하고 모든 것이 좋아 보이면 실시간 실행 옵션을 선택하세요. 이 단계에서는 사이트 URL을 참조하는 콘텐츠 내부의 구성 항목과 링크를 포착합니다.

![Reviewing Changes in SRDB](/xoops-docs/2.7/img/installation/srdb-02.png)

XOOPS_ROOT_PATH에 대한 이전 값과 새 값을 사용하여 프로세스를 반복합니다.

#### SRDB를 사용하지 않는 대체 접근 방식

srdb 도구 없이 이 단계를 수행하는 또 다른 방법은 데이터베이스를 덤프하고 URL과 경로를 변경하여 텍스트 편집기에서 덤프를 편집한 다음 편집된 덤프에서 데이터베이스를 다시 로드하는 것입니다. 예, 그 프로세스는 사람들이 Search-Replace-DB와 같은 전문 도구를 만들도록 동기를 부여할 정도로 충분히 복잡하고 충분한 위험을 안고 있습니다.

## 이전된 사이트를 시험해 보세요

이제 귀하의 사이트는 새로운 환경에서 실행될 준비가 되었습니다!

물론 항상 문제가 있을 수 있습니다. [xoops.org 포럼](https://xoops.org/modules/newbb/index.php)에 질문을 게시하는 것을 두려워하지 마세요.

