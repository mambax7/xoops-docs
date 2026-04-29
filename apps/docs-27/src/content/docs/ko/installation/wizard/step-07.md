---
title: "구성 저장"
---

이 페이지에는 지금까지 입력한 구성 정보를 저장한 결과가 표시됩니다.

문제를 검토하고 수정한 후 "계속" 버튼을 선택하여 계속 진행하세요.

## 성공 시

_시스템 구성 저장_ 섹션에는 저장된 정보가 표시됩니다. 설정은 두 파일 중 하나에 저장됩니다. 하나의 파일은 웹 루트에 있는 _mainfile.php_입니다. 다른 하나는 _xoops_data_ 디렉토리에 있는 _data/secure.php_입니다.

![XOOPS Installer Save Configuration](/xoops-docs/2.7/img/installation/installer-07.png)

두 파일 모두 XOOPS 2.7.0과 함께 제공되는 템플릿 파일에서 생성됩니다.

* `mainfile.php`은 웹 루트의 `mainfile.dist.php`에서 생성됩니다.
* `xoops_data/data/secure.php`은 `xoops_data/data/secure.dist.php`에서 생성됩니다.

입력한 경로 및 URL 외에도 `mainfile.php`에는 이제 XOOPS 2.7.0에 새로 추가된 몇 가지 상수가 포함되어 있습니다.

* `XOOPS_TRUST_PATH` — `XOOPS_PATH`의 이전 버전과 호환되는 별칭으로 유지됩니다. 별도로 구성할 필요가 없습니다.
* `XOOPS_COOKIE_DOMAIN_USE_PSL` — 기본값은 `true`입니다. 공개 접미사 목록을 사용하여 올바른 쿠키 도메인을 파생시킵니다.
* `XOOPS_DB_LEGACY_LOG` — 기본값은 `false`입니다. 레거시 데이터베이스 API 사용을 기록하기 위해 개발 중인 `true`으로 설정합니다.
* `XOOPS_DEBUG` — 기본값은 `false`입니다. 추가 오류 보고를 활성화하려면 개발 중인 `true`으로 설정하세요.

설치 중에 이를 직접 편집할 필요가 없습니다. 기본값은 프로덕션 사이트에 적합합니다. 여기에 언급되어 있으므로 나중에 `mainfile.php`을 열 때 무엇을 찾아야 할지 알 수 있습니다.

## 오류

XOOPS가 구성 파일 작성 중 오류를 감지하면 무엇이 잘못되었는지 자세히 설명하는 메시지가 표시됩니다.

![XOOPS Installer Save Configuration Errors](/xoops-docs/2.7/img/installation/installer-07-errors.png)

많은 경우, Apache에서 mod_php를 사용하는 Debian 파생 시스템의 기본 설치가 오류의 원인입니다. 대부분의 호스팅 제공업체에는 이러한 문제가 없는 구성이 있습니다.

### 그룹 권한 문제

PHP 프로세스는 일부 사용자의 권한을 사용하여 실행됩니다. 파일도 일부 사용자의 소유입니다. 이 두 사람이 동일한 사용자가 아닌 경우 그룹 권한을 사용하여 PHP 프로세스가 사용자 계정과 파일을 공유하도록 허용할 수 있습니다. 이는 일반적으로 XOOPS가 작성해야 하는 파일 및 디렉터리 그룹을 변경해야 함을 의미합니다.

위에서 언급한 기본 구성의 경우 이는 _www-data_ 그룹을 파일 및 디렉터리에 대한 그룹으로 지정해야 하며 해당 파일 및 디렉터리를 그룹별로 쓸 수 있어야 함을 의미합니다.

구성을 주의 깊게 검토하고 오픈 인터넷에서 사용 가능한 상자에 대한 이러한 문제를 해결하는 방법을 신중하게 선택해야 합니다.

예제 명령은 다음과 같습니다.

```text
chgrp -R www-data xoops_data
chmod -R g+w xoops_data
chgrp -R www-data uploads
chmod -R g+w uploads
```

### mainfile.php를 생성할 수 없습니다.

Unix 계열 시스템에서 새 파일을 생성할 수 있는 권한은 상위 폴더에 부여된 권한에 따라 달라집니다. 어떤 경우에는 해당 권한을 사용할 수 없으며 이를 부여하는 것이 보안 문제가 될 수 있습니다.

구성에 문제가 있는 경우 XOOPS 배포판의 _extras_ 디렉터리에서 더미 _mainfile.php_를 찾을 수 있습니다. 해당 파일을 웹 루트에 복사하고 파일에 대한 권한을 설정합니다.

```text
chgrp www-data mainfile.php
chmod g+w mainfile.php
```

### SELinux 환경

SELinux 보안 컨텍스트가 문제의 원인이 될 수 있습니다. 이에 해당된다면 [특별주제](../specialtopics.md)에서 자세한 내용을 확인하시기 바랍니다.
