---
title: "이 가이드에 대한 XOOPS 2.7.0 호환성 검토"
---

이 문서에는 설치 가이드가 XOOPS 2.7.0과 일치하도록 이 저장소에 필요한 변경 사항이 나열되어 있습니다.

검토 기준:

- 현재 가이드 저장소: `L:\GitHub\XoopsDocs\xoops-installation-guide`
- XOOPS 2.7.0 코어 검토 위치: `L:\GitHub\MAMBAX7\CORE\XoopsCore27`
- 기본 2.7.0 소스 확인:
  - `README.md`
  - `release_notes.txt`
  - `htdocs/install/language/english/welcome.php`
  - `htdocs/install/include/config.php`
  - `htdocs/install/include/page.php`
  - `htdocs/install/class/pathcontroller.php`
  - `htdocs/install/page_dbsettings.php`
  - `htdocs/install/page_configsave.php`
  - `htdocs/install/page_siteinit.php`
  - `htdocs/install/page_end.php`
  - `htdocs/mainfile.dist.php`
  - `upgrade/preflight.php`
  - `upgrade/README.md`
  - `upgrade/upd_2.5.11-to-2.7.0/index.php`

## 범위

이 저장소에는 현재 다음이 포함되어 있습니다.

- 기본 가이드로 사용되는 루트 수준 영어 마크다운 파일입니다.
- `en/` 부분 사본.
- 자체 자산이 포함된 전체 `de/` 및 `fr/` 북 트리.

루트 수준 파일에는 첫 번째 패스가 필요합니다. 그 후에는 동등한 변경 사항을 `de/book/` 및 `fr/book/`에 미러링해야 합니다. `en/` 트리도 부분적으로만 유지 관리되는 것으로 나타나므로 정리가 필요합니다.

## 1. 글로벌 저장소 변경

### 1.1 버전 관리 및 메타데이터

XOOPS 2.5.x에서 XOOPS 2.7.0으로 모든 가이드 수준 참조를 업데이트합니다.

영향을 받는 파일:

- `README.md`
- `SUMMARY.md` — 루트 가이드에 대한 기본 실시간 TOC입니다. 탐색 레이블 및 섹션 제목은 새 장 제목 및 이름이 변경된 Historical Upgrade Notes 섹션과 일치해야 합니다.
- `en/README.md`
- `en/SUMMARY.md`
- `de/README.md`
- `de/SUMMARY.md`
- `fr/README.md`
- `fr/SUMMARY.md`
- `chapter-2-introduction.md`
- `about-xoops-cms.md`
- `appendix-1-working-with-the-new-admin-gui-our-dashboard.md`
- `appendix-5-increase-security-of-your-xoops-installation.md`
- `de/book/*.md` 및 `fr/book/*.md` 현지화됨

필수 변경 사항:

- `for XOOPS 2.5.7.x`을 `for XOOPS 2.7.0`로 변경합니다.
- 저작권 연도를 `2018`에서 `2026`으로 업데이트합니다.
- 현재 릴리스를 설명하는 이전 XOOPS 2.5.x 및 2.6.0 참조를 대체합니다.
- SourceForge 시대의 다운로드 지침을 GitHub 릴리스로 대체:
  - `https://github.com/XOOPS/XoopsCore27/releases`

### 1.2 링크 새로고침

`about-xoops-cms.md` 및 현지화된 `10aboutxoops.md` 파일은 여전히 이전 2.5.x 및 2.6.0 GitHub 위치를 가리킵니다. 해당 링크를 현재 2.7.x 프로젝트 위치로 업데이트해야 합니다.

### 1.3 스크린샷 새로고침

설치 프로그램, 업그레이드 UI, 관리 대시보드, 테마 선택기, 모듈 선택기 및 설치 후 화면을 보여주는 모든 스크린샷은 오래되었습니다.

영향을 받는 자산 트리:

- `.gitbook/assets/`
- `en/assets/`
- `de/assets/`
- `fr/assets/`

부분 새로고침이 아닌 전체 새로고침입니다. 2.7.0 설치 프로그램은 다른 Bootstrap 기반 레이아웃과 다른 시각적 구조를 사용합니다.

## 2. 2장: 소개

파일:

- `chapter-2-introduction.md`

### 2.1 시스템 요구사항을 다시 작성해야 합니다.

현재 장에서는 Apache, MySQL 및 PHP만 설명합니다. XOOPS 2.7.0에는 명시적인 최소값이 있습니다.

| 구성요소 | 최소 2.7.0 | 2.7.0 추천 |
| --- | --- | --- |
| PHP | 8.2.0 | 8.4+ |
| MySQL | 5.7.8 | 8.4+ |
| 웹 서버 | 필수 PHP를 지원하는 모든 서버 | Apache 또는 Nginx 권장 |

추가할 참고 사항:

- IIS는 가능한 설치 프로그램에 나열되지만 Apache 및 Nginx가 권장되는 예입니다.
- 릴리스 노트에서는 MySQL 9.0 호환성도 명시되어 있습니다.

### 2.2 필수 및 권장 PHP 확장 체크리스트 추가

2.7.0 설치 프로그램은 이제 권장 확장과 엄격한 요구 사항을 분리합니다.

설치 프로그램이 표시하는 필수 확인 사항:

- MySQLi
- 세션
- PCRE
- 필터
- `file_uploads`
- 파일 정보

권장 확장:

-mbstring
- 국제
- iconv
- xml
- zlib
- gd
- 엑시프
- 컬

### 2.3 체크섬 제거 지침

현재 5단계에서는 `checksum.php` 및 `checksum.mdi`에 대해 설명합니다. 해당 파일은 XOOPS 2.7.0의 일부가 아닙니다.

조치:

- 체크섬 확인 섹션을 완전히 제거합니다.

### 2.4 패키지 업데이트 및 업로드 지침

`docs/`, `extras/`, `htdocs/`, `upgrade/` 패키지 레이아웃 설명을 유지하지만 현재 쓰기 가능한 경로 기대치를 반영하도록 업로드 및 준비 텍스트를 업데이트합니다.

- `mainfile.php`
- `uploads/`
- `uploads/avatars/`
- `uploads/files/`
- `uploads/images/`
- `uploads/ranks/`
- `uploads/smilies/`
- `xoops_data/caches/`
- `xoops_data/caches/xoops_cache/`
- `xoops_data/caches/smarty_cache/`
- `xoops_data/caches/smarty_compile/`
- `xoops_data/configs/`
- `xoops_data/configs/captcha/`
- `xoops_data/configs/textsanitizer/`
- `xoops_data/data/`
- `xoops_data/protector/`

가이드는 현재 이것을 과소평가하고 있습니다.

### 2.5 SourceForge 번역/다운로드 언어 교체

현재 텍스트에는 여전히 다른 언어 패키지를 보려면 SourceForge의 XOOPS를 방문하라는 내용이 나와 있습니다. 이는 현재 프로젝트/커뮤니티 다운로드 지침으로 대체되어야 합니다.

## 3. 3장: 서버 구성 확인

파일:

- `chapter-3-server-configuration-check.md`

필수 변경 사항:

- 현재 2블록 레이아웃에 대한 페이지 설명을 다시 작성합니다.
  - 요구사항
  - 추천 확장
- 기존 스크린샷을 교체하세요.
- 위에 나열된 요구 사항 확인 사항을 명시적으로 문서화합니다.

## 4. 4장: 올바른 길을 택하세요

파일:

- `chapter-4-take-the-right-path.md`

필수 변경 사항:

- 새 `Cookie Domain` 필드를 추가합니다.
- 2.7.0과 일치하도록 경로 필드의 이름과 설명을 업데이트합니다.
  - XOOPS 루트 경로
  - XOOPS 데이터 경로
  - XOOPS 라이브러리 경로
  - XOOPS URL
  - 쿠키 도메인
- 이제 라이브러리 경로를 변경하려면 `vendor/autoload.php`에 유효한 Composer 오토로더가 필요하다는 메모를 추가하세요.

이는 2.7.0의 실제 호환성 검사이므로 명확하게 문서화해야 합니다. 현재 가이드에서는 Composer에 대해 전혀 언급하지 않습니다.

## 5. 5장: 데이터베이스 연결

파일:

- `chapter-5-database-connections.md`

필수 변경 사항:

- MySQL만 지원된다는 설명을 유지하세요.
- 다음을 반영하도록 데이터베이스 구성 섹션을 업데이트합니다.
  - 기본 문자 세트는 이제 `utf8mb4`입니다.
  - 문자 집합이 변경되면 데이터 정렬 선택이 동적으로 업데이트됩니다.
- 데이터베이스 연결 및 구성 페이지 모두의 스크린샷을 교체합니다.

문자 집합과 데이터 정렬에 주의가 필요하지 않다는 현재 텍스트는 2.7.0에 비해 너무 약합니다. 최소한 새로운 `utf8mb4` 기본값과 동적 데이터 정렬 선택기를 언급해야 합니다.

## 6. 6장: 최종 시스템 구성

파일:

- `chapter-6-final-system-configuration.md`

### 6.1 생성된 구성 파일이 변경되었습니다.

가이드에는 현재 설치 프로그램이 `mainfile.php` 및 `secure.php`을 쓴다고 나와 있습니다.

2.7.0에서는 다음을 포함하여 `xoops_data/configs/`에 구성 파일도 설치합니다.

- `xoopsconfig.php`
- 보안 문자 구성 파일
- textsanitizer 구성 파일

### 6.2 `xoops_data/configs/`의 기존 구성 파일은 덮어쓰지 않습니다.

덮어쓰지 않는 동작은 전역이 아닌 **범위**입니다. `page_configsave.php` 쓰기 구성 파일의 두 가지 고유 코드 경로:

- `writeConfigurationFile()`(59행과 66행에서 호출) **항상** 마법사 입력에서 `xoops_data/data/secure.php` 및 `mainfile.php`을 다시 생성합니다. 존재 여부 확인이 없습니다. 기존 복사본이 대체됩니다.
- `copyConfigDistFiles()`(라인 62에서 호출되고 라인 317에서 정의됨)은 **대상이 아직 존재하지 않는 경우** `xoops_data/configs/` 파일(`xoopsconfig.php`, captcha 구성, textsanitizer 구성)만 복사합니다.

장 재작성은 두 가지 동작을 모두 명확하게 반영해야 합니다.

- `mainfile.php` 및 `secure.php`의 경우: 설치 프로그램을 다시 실행하면 이러한 파일을 직접 편집한 내용을 덮어쓰게 된다는 점을 경고합니다.
- `xoops_data/configs/` 파일의 경우: 재실행 및 업그레이드 후에도 로컬 사용자 정의가 유지되며 제공된 기본값을 복원하려면 파일을 삭제하고 다시 실행(또는 해당 `.dist.php`을 직접 복사)해야 한다는 점을 설명합니다.

설치 프로그램에서 작성한 모든 구성 파일에 대해 "기존 파일은 보존됩니다"라고 일반화하지 마십시오. 이는 잘못된 것이며 `mainfile.php` 또는 `secure.php`을 편집하는 관리자에게 오해를 줄 수 있습니다.

### 6.3 HTTPS 및 역방향 프록시 처리 변경

생성된 `mainfile.php`은 이제 역방향 프록시 헤더를 포함하여 더 광범위한 프로토콜 감지를 지원합니다. 가이드에서는 직접적인 `http` 또는 `https` 감지만을 암시하는 대신 이를 언급해야 합니다.

### 6.4 테이블 개수가 잘못되었습니다.

현재 장에서는 새 사이트가 `32` 테이블을 생성한다고 나와 있습니다.

XOOPS 2.7.0은 `33` 테이블을 생성합니다. 누락된 테이블은 다음과 같습니다.

- `tokens`

조치:

- 개수를 32에서 33으로 업데이트합니다.
- 테이블 목록에 `tokens`을 추가합니다.

## 7. 7장: 관리 설정

파일:

- `chapter-7-administration-settings.md`

### 7.1 비밀번호 UI 설명이 오래되었습니다.

설치 프로그램에는 여전히 비밀번호 생성이 포함되어 있지만 이제 다음도 포함됩니다.

- zxcvbn 기반 비밀번호 강도 측정기
- 시각적 강도 라벨
- 16자 생성기 및 복사 흐름

현재 비밀번호 패널을 설명하기 위해 텍스트와 스크린샷을 업데이트하세요.

### 7.2 이제 이메일 검증이 시행됩니다.

관리자 이메일은 `FILTER_VALIDATE_EMAIL`으로 확인됩니다. 이 장에서는 유효하지 않은 이메일 값이 거부된다는 점을 언급해야 합니다.

### 7.3 라이센스 키 부분이 잘못되었습니다

이는 가장 중요한 사실 수정 중 하나입니다.

현재 가이드는 다음과 같이 말합니다.

- `License System Key`이 있습니다.
- `/include/license.php`에 저장됩니다.
- `/include/license.php`은 설치 중에 쓰기 가능해야 합니다.

더 이상 정확하지 않습니다.

2.7.0이 실제로 하는 일:

- 설치 시 라이센스 데이터가 `xoops_data/data/license.php`에 기록됩니다.
- `htdocs/include/license.php`은 이제 `XOOPS_VAR_PATH`에서 파일을 로드하는 더 이상 사용되지 않는 래퍼입니다.
- `/include/license.php`을 쓰기 가능하게 만드는 것에 대한 이전 문구는 제거되어야 합니다.

조치:

- 이 섹션을 삭제하는 대신 다시 작성하세요.
- `/include/license.php`에서 `xoops_data/data/license.php`으로 경로를 업데이트합니다.

### 7.4 테마 목록이 오래되었습니다.

현재 가이드는 여전히 Zetagegenesis 및 이전 2.5 시대 테마 세트를 참조합니다.

XOOPS 2.7.0에 있는 테마:

- `default`
- `xbootstrap`
- `xbootstrap5`
- `xswatch4`
- `xswatch5`
- `xtailwind`
- `xtailwind2`

또한 참고하세요:

- `xswatch4`은 현재 설치 프로그램 데이터에 의해 삽입된 기본 테마입니다.
- Zetagegenesis는 더 이상 패키지 테마 목록에 포함되지 않습니다.

### 7.5 모듈 목록이 오래되었습니다.

2.7.0 패키지에 있는 모듈:

- `system` — 테이블 채우기/데이터 삽입 단계 중에 자동으로 설치됩니다. 항상 존재하며 선택기에 표시되지 않습니다.
- `debugbar` — 설치 프로그램 단계에서 선택할 수 있습니다.
- `pm` — 설치 프로그램 단계에서 선택할 수 있습니다.
- `profile` — 설치 프로그램 단계에서 선택할 수 있습니다.
- `protector` — 설치 프로그램 단계에서 선택할 수 있습니다.

중요: 모듈 설치 프로그램 페이지(`htdocs/install/page_moduleinstaller.php`)는 `XoopsLists::getModulesList()`을 반복하고 **모듈 테이블에 이미 있는 모든 항목을 필터링**하여 후보 목록을 작성합니다(95-102행은 `$listed_mods`을 수집하고 116행은 해당 목록에 있는 모든 디렉토리를 건너뜁니다). 이 단계가 실행되기 전에 `system`이 설치되므로 확인란으로 표시되지 않습니다.

가이드 변경이 필요함:

- 번들 모듈이 3개만 있다고 말하지 마세요.
- 5개가 아닌 **4개의 선택 가능한 모듈**(`debugbar`, `pm`, `profile`, `protector`)을 표시하는 것으로 설치 프로그램 단계를 설명합니다.
- 피커에 나타나지 않는 항상 설치되는 핵심 모듈로 `system`을 별도로 문서화합니다.
- 2.7.0의 새로운 기능으로 번들 모듈 설명에 `debugbar`을 추가합니다.
- 설치 프로그램의 기본 모듈 사전 선택이 이제 비어 있습니다. 모듈을 선택할 수 있지만 설치 프로그램 구성에 의해 사전 확인되지는 않습니다.

## 8. 8장: 준비 완료

파일:

- `chapter-8-ready-to-go.md`

### 8.1 설치 정리 프로세스를 다시 작성해야 합니다.

현재 가이드에서는 설치 프로그램이 설치 폴더의 이름을 고유한 이름으로 바꾼다고 나와 있습니다.

이는 여전히 사실이지만 메커니즘이 변경되었습니다.

- 웹 루트에 외부 정리 스크립트가 생성됩니다.
- 마지막 페이지는 AJAX를 통해 정리를 트리거합니다.
- 설치 폴더 이름이 `install_remove_<unique suffix>`으로 변경되었습니다.
- `cleanup.php`에 대한 대체가 여전히 존재합니다.

조치:

- 설명을 업데이트하세요.
- 사용자에게 표시되는 지침을 단순하게 유지하세요. 설치 후 이름이 바뀐 설치 디렉터리를 삭제하세요.

### 8.2 관리 대시보드 부록 참조는 더 이상 사용되지 않습니다.

8장에서는 여전히 독자에게 이전 Oxygen 시대의 관리 경험을 소개합니다. 이는 현재 관리 테마와 일치해야 합니다.

- `default`
- `dark`
- `modern`
- `transition`

### 8.3 설치 후 경로 편집 지침 수정 필요

현재 텍스트는 독자에게 경로 정의로 `secure.php`을 업데이트하도록 지시합니다. 2.7.0에서는 해당 경로 상수가 `mainfile.php`에 정의되고 `secure.php`은 보안 데이터를 보유합니다. 이 장의 예제 블록은 이에 따라 수정되어야 합니다.

### 8.4 제작 설정을 추가해야 합니다.

가이드에서는 현재 `mainfile.dist.php`에 있는 프로덕션 기본값을 명시적으로 언급해야 합니다.

- `XOOPS_DB_LEGACY_LOG`은 `false`으로 유지되어야 합니다.
- `XOOPS_DEBUG`은 `false`으로 유지되어야 합니다.

## 9. 9장: 기존 XOOPS 설치 업그레이드

파일:

- `chapter-9-upgrade-existing-xoops-installation.md`

이 장에는 가장 큰 재작성이 필요합니다.

### 9.1 필수 Smarty 4 프리플라이트 단계 추가

XOOPS 2.7.0 업그레이드 흐름은 이제 업그레이드가 완료되기 전에 실행 전 프로세스를 강제 실행합니다.

새로운 필수 흐름:

1. `upgrade/` 디렉터리를 사이트 루트에 복사합니다.
2. `/upgrade/preflight.php`을 실행합니다.
3. 이전 Smarty 구문에 대해 `/themes/` 및 `/modules/`을 검색합니다.
4. 적절한 경우 선택적 복구 모드를 사용하십시오.
5. 깨끗해질 때까지 다시 실행합니다.
6. `/upgrade/`으로 계속 진행하세요.

현재 장에서는 이에 대해 전혀 언급하지 않으므로 2.7.0 지침과 호환되지 않습니다.

### 9.2 2.5.2시대의 병합 서술 수동 교체

현재 장에서는 프레임워크 병합, AltSys 메모 및 수동 관리 파일 재구성을 통한 수동 2.5.2 스타일 업그레이드에 대해 계속 설명합니다. 이는 `release_notes.txt` 및 `upgrade/README.md`의 실제 2.7.x 업그레이드 순서로 대체되어야 합니다.

권장 장 개요:

1. 파일과 데이터베이스를 백업합니다.
2. 사이트를 끄세요.
3. 라이브 루트에 `htdocs/`을 복사합니다.
4. `htdocs/xoops_lib`을 활성 라이브러리 경로에 복사합니다.
5. `htdocs/xoops_data`을 활성 데이터 경로에 복사합니다.
6. `upgrade/`을 웹 루트에 복사합니다.
7. `preflight.php`을 실행합니다.
8. `/upgrade/`을 실행합니다.
9. 업데이터 프롬프트를 완료합니다.
10. `system` 모듈을 업데이트합니다.
11. 설치된 경우 `pm`, `profile` 및 `protector`을 업데이트합니다.
12. `upgrade/`을 삭제합니다.
13. 사이트를 다시 켜세요.

### 9.3 실제 2.7.0 업그레이드 변경 사항 문서화

2.7.0용 업데이트에는 최소한 다음과 같은 구체적인 변경 사항이 포함되어 있습니다.

- `tokens` 테이블 생성
- 최신 비밀번호 해시를 위해 `bannerclient.passwd` 확대
- 세션 쿠키 기본 설정 추가
- 더 이상 사용되지 않는 번들 디렉토리 제거

가이드는 모든 구현 세부 사항을 공개할 필요는 없지만 업그레이드가 파일 복사와 모듈 업데이트일 뿐이라는 암시를 멈춰야 합니다.

## 10. 업그레이드 기록 페이지

파일:

- `upgrading-from-xoops-2.4.5-easy-way.md`
- `upgrading-from-xoops-2.0.-above-2.0.14-and-2.2..md`
- `upgrading-from-any-xoops-2.0.7-to-2.0.13.2.md`
- `upgrading-a-non-utf-8-site.md`
- `upgrading-xoopseditor-package.md`

**상태:** 구조적 결정이 이미 해결되었습니다. 루트 `SUMMARY.md`은 이를 전용 **역사적 업그레이드 노트** 섹션으로 이동하고 각 파일에는 독자에게 2.7.0 업그레이드에 대한 9장을 가리키는 "역사적 참조" 콜아웃이 포함되어 있습니다. 이는 더 이상 일류 업그레이드 지침이 아닙니다.

**남은 작업(일관성만 해당):**

- `README.md`(루트)가 일반 "업그레이드" 헤더가 아닌 동일한 "업그레이드 기록" 제목 아래에 이를 나열하는지 확인하세요.
- `de/README.md`, `de/SUMMARY.md`, `fr/README.md`, `fr/SUMMARY.md` 및 `en/SUMMARY.md`에서 동일한 분리를 미러링합니다.
- 각 업그레이드 기록 페이지(루트 및 현지화된 `de/book/upg*.md` / `fr/book/upg*.md` 복사본)에 9장으로 다시 연결되는 오래된 콘텐츠 콜아웃이 포함되어 있는지 확인하세요.

## 11. 부록 1: 관리 GUI

파일:

- `appendix-1-working-with-the-new-admin-gui-our-dashboard.md`

이 부록은 Oxygen 관리 GUI와 연결되어 있으므로 다시 작성해야 합니다.

필수 변경 사항:

- 모든 산소 참조를 교체
- 기존 아이콘/메뉴 스크린샷 교체
- 현재 관리 테마를 문서화합니다.
  - 기본값
  - 어두움
  - 현대
  - 전환
- 릴리스 노트에 나와 있는 현재 2.7.0 관리 기능을 언급하세요.
  - 시스템 관리 테마의 템플릿 오버로드 기능
  - 업데이트된 관리자 테마 세트

## 12. 부록 2: FTP를 통해 XOOPS 업로드

파일:

- `appendix-2-uploading-xoops-via-ftp.md`

필수 변경 사항:

- HostGator 관련 및 cPanel 관련 가정 제거
- 파일 업로드 문구 현대화
- `xoops_lib`에는 이제 Composer 종속성이 포함되므로 업로드 용량이 더 크므로 선택적으로 잘라서는 안 됩니다.

## 13. 부록 5: 보안

파일:

- `appendix-5-increase-security-of-your-xoops-installation.md`

필수 변경 사항:

- `register_globals` 토론을 완전히 제거합니다.
- 오래된 호스트 티켓 언어 제거
- 읽기 전용이 의도된 경우 `404`에서 `0444`까지 올바른 권한 텍스트
- 2.7.0 레이아웃과 일치하도록 `mainfile.php` 및 `secure.php` 토론을 업데이트합니다.
- 새로운 쿠키 도메인 보안 관련 상수 컨텍스트를 추가합니다.
  - `XOOPS_COOKIE_DOMAIN_USE_PSL`
  - `XOOPS_COOKIE_DOMAIN`
- 다음에 대한 생산 지침을 추가합니다.
  - `XOOPS_DB_LEGACY_LOG`
  - `XOOPS_DEBUG`

## 14. 교차 언어 유지 관리 영향

루트 수준 영어 파일이 수정된 후에는 다음 항목에 동등한 업데이트가 필요합니다.

- `de/book/`
- `fr/book/`
- `de/README.md`
- `fr/README.md`
- `de/SUMMARY.md`
- `fr/SUMMARY.md`

`en/` 트리도 별도의 README와 자산 세트를 포함하고 있지만 부분적인 `book/` 트리만 있는 것으로 나타나므로 검토가 필요합니다.

## 15. 우선순위

### 출시 전 중요

1. 저장소/버전 참조를 2.7.0으로 업데이트합니다.
2. 실제 2.7.0 업그레이드 흐름과 Smarty 4 프리플라이트를 중심으로 9장을 다시 작성하세요.
3. 시스템 요구 사항을 PHP 8.2+ 및 MySQL 5.7.8+로 업데이트합니다.
4. Chapter 7 라이센스 키 파일 경로를 수정하세요.
5. 테마 및 모듈 인벤토리를 수정합니다.
6. 6장의 테이블 수를 32에서 33으로 수정합니다.

### 정확성을 위해 중요

7. 쓰기 가능 경로 지침을 다시 작성합니다.
8. 경로 설정에 Composer 자동 로더 요구 사항을 추가합니다.
9. 데이터베이스 문자 집합 지침을 `utf8mb4`으로 업데이트합니다.
10. 상수가 올바른 파일에 문서화되도록 8장의 경로 편집 지침을 수정합니다.
11. 체크섬 지침을 제거합니다.
12. `register_globals` 및 기타 죽은 PHP 지침을 제거합니다.

### 릴리스 품질 정리

13. 모든 설치 프로그램 및 관리자 스크린샷을 교체합니다.
14. 기본 흐름에서 내역 업그레이드 페이지를 이동합니다.
15. 영어가 수정된 후 독일어 및 프랑스어 사본을 동기화합니다.
16. 오래된 링크와 중복된 README 줄을 정리합니다.
