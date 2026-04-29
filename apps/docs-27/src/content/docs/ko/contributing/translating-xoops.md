---
title: "부록 3: XOOPS를 현지 언어로 번역"
---

XOOPS 2.7.0에는 영어 파일만 제공됩니다. 다른 언어로의 번역은 커뮤니티에서 유지 관리되며 GitHub 및 다양한 로컬 XOOPS 지원 사이트를 통해 배포됩니다.

## 기존 번역을 찾을 수 있는 곳

- **GitHub** — 커뮤니티 번역은 [XOOPS 조직](https://github.com/XOOPS) 및 개별 기여자의 계정에 따라 별도의 저장소로 게시되는 경우가 점점 더 늘어나고 있습니다. GitHub에서 `xoops-language-<your-language>`을 검색하거나 XOOPS 조직에서 현재 패키지를 찾아보세요.
- **로컬 XOOPS 지원 사이트** — 많은 지역 XOOPS 커뮤니티가 자체 사이트에 번역을 게시합니다. [https://xoops.org](https://xoops.org)을 방문하고 지역 커뮤니티 링크를 따라가세요.
- **모듈 번역** — 개별 커뮤니티 모듈에 대한 번역은 일반적으로 `XoopsModules25x` GitHub 조직의 모듈 자체 옆에 있습니다(이름의 `25x`은 역사적이며 모듈은 XOOPS 2.5.x 및 2.7.x 모두에 대해 유지 관리됩니다).

해당 언어에 대한 번역이 이미 존재하는 경우 언어 디렉토리를 XOOPS 설치에 놓습니다(아래 "번역 설치 방법" 참조).

## 번역해야 할 것

XOOPS 2.7.0은 언어 파일을 사용하는 코드 옆에 언어 파일을 보관합니다. 완전한 번역에는 다음 위치가 모두 포함됩니다.

- **핵심** — `htdocs/language/english/` — 모든 페이지에서 사용되는 사이트 전체 상수(로그인, 일반적인 오류, 날짜, 메일 템플릿 등).
- **설치 프로그램** — `htdocs/install/language/english/` — 설치 마법사에 표시되는 문자열입니다. 현지화된 설치 환경을 원할 경우 설치 프로그램을 실행하기 *전에* 번역하세요.
- **시스템 모듈** — `htdocs/modules/system/language/english/` — 단연 가장 큰 세트입니다. 전체 관리자 제어판을 다룹니다.
- **번들 모듈** — `htdocs/modules/pm/language/english/`, `htdocs/modules/profile/language/english/`, `htdocs/modules/protector/language/english/` 및 `htdocs/modules/debugbar/language/english/` 각각.
- **테마** — 소수의 테마가 자체 언어 파일을 제공합니다. `htdocs/themes/<theme>/language/`이 있는지 확인하세요.

"핵심 전용" 번역은 최소 유용 단위이며 위의 처음 두 글머리 기호에 해당합니다.

## 번역 방법

1. 옆에 있는 `english/` 디렉터리를 복사하고 복사본의 이름을 해당 언어로 바꿉니다. 디렉터리 이름은 해당 언어의 영문 소문자 이름(`spanish`, `german`, `french`, `japanese`, `arabic` 등)이어야 합니다.

   ```
   htdocs/language/english/    →    htdocs/language/spanish/
   ```

2. 새 디렉터리에서 각 `.php` 파일을 열고 `define()` 호출 내의 **문자열 값**을 변환합니다. 상수 이름을 변경하지 **마세요** — 이는 코어 전체에서 PHP 코드에서 참조됩니다.

   ```php
   // Before:
   define('_CM_COMDELETED',  'Comment(s) deleted.');
   define('_CM_COMDELETENG', 'Could not delete comment.');
   define('_CM_DELETESELECT', 'Delete all its child comments?');

   // After (Spanish):
   define('_CM_COMDELETED',  'Comentario(s) eliminado(s).');
   define('_CM_COMDELETENG', 'No se pudo eliminar el comentario.');
   define('_CM_DELETESELECT', '¿Eliminar también todos sus comentarios secundarios?');
   ```

3. **BOM 없이 *모든 파일을 UTF-8로 저장합니다.** XOOPS 2.7.0은 `utf8mb4` 종단 간(데이터베이스, 세션, 출력)을 사용하고 바이트 순서 표시가 있는 파일을 거부합니다. Notepad++에서는 "UTF-8-BOM"이 *아님* **"UTF-8"** 옵션입니다. VS Code에서는 이것이 기본값입니다. 상태 표시줄에서 인코딩을 확인하세요.

4. 언어와 일치하도록 각 파일 상단의 언어 및 문자 집합 메타데이터를 업데이트합니다.

   ```php
   // _LANGCODE: es
   // _CHARSET : UTF-8
   // Translator: Your Name
   ```

   `_LANGCODE`은 해당 언어의 [ISO 639-1](https://www.loc.gov/standards/iso639-2/php/code_list.php) 코드여야 합니다. `_CHARSET`는 XOOPS 2.7.0에서 항상 `UTF-8`입니다. 더 이상 ISO-8859-1 변형이 없습니다.

5. 설치 프로그램, 시스템 모듈 및 필요한 번들 모듈에 대해 반복합니다.

## 번역 설치 방법

완성된 번역을 디렉토리 트리로 얻은 경우:

1. 각 `<language>/` 디렉토리를 XOOPS 설치의 일치하는 `language/english/` 상위 디렉토리에 복사합니다. 예를 들어 `language/spanish/`을 `htdocs/language/`에 복사하고, `install/language/spanish/`을 `htdocs/install/language/`에 복사합니다.
2. 웹 서버에서 파일 소유권과 권한을 읽을 수 있는지 확인하십시오.
3. 설치 시 새 언어를 선택하거나(마법사는 사용 가능한 언어에 대해 `htdocs/language/`을 검색합니다) 기존 사이트에서는 **관리 → 시스템 → 기본 설정 → 일반 설정**에서 언어를 변경합니다.

## 번역을 다시 공유

번역을 커뮤니티에 다시 기여해 주세요.

1. GitHub 리포지토리를 생성합니다(또는 해당 언어에 대한 기존 언어 리포지토리가 있는 경우 포크).
2. `xoops-language-<language-code>`(예: `xoops-language-es`, `xoops-language-pt-br`)과 같이 명확한 이름을 사용합니다.
3. 저장소 내부의 XOOPS 디렉터리 구조를 미러링하여 파일이 복사된 위치와 정렬되도록 합니다.

   ```
   xoops-language-es/
   ├── language/spanish/(files).php
   ├── install/language/spanish/(files).php
   └── modules/system/language/spanish/(files).php
   ```

4. `README.md` 문서를 포함하세요.
   - 언어 이름 및 ISO 코드
   - XOOPS 버전 호환성(예: `XOOPS 2.7.0+`)
   - 번역가 및 크레딧
   - 번역이 핵심 전용인지 또는 번들 모듈을 포함하는지 여부
5. 커뮤니티에서 찾을 수 있도록 GitHub의 관련 모듈/핵심 저장소에 대한 풀 요청을 열거나 [https://xoops.org](https://xoops.org)에 공지사항을 게시하세요.

> **참고**
>
> 귀하의 언어에서 날짜 또는 달력 형식의 핵심을 변경해야 하는 경우 해당 변경 사항도 패키지에 포함하십시오. 오른쪽에서 왼쪽으로 쓰는 스크립트 언어(아랍어, 히브리어, 페르시아어, 우르두어)는 XOOPS 2.7.0에서 기본적으로 작동합니다. 이 릴리스에는 RTL 지원이 추가되었으며 개별 테마가 자동으로 이를 선택합니다.
