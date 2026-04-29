---
title: "특별주제"
---

일부 특정 시스템 소프트웨어 조합이 작동하려면 몇 가지 추가 구성이 필요할 수 있습니다.
 XOOPS와 함께. 다음은 알려진 문제에 대한 세부정보와 이를 처리하기 위한 지침입니다.

## SELinux 환경

설치, 업그레이드 및 일반 작업 중에 특정 파일 및 디렉터리에 쓰기가 가능해야 합니다.
XOOPS의. 기존 Linux 환경에서는 다음을 보장하여 이를 수행합니다.
웹 서버가 실행되는 시스템 사용자는 일반적으로 XOOPS 디렉토리에 대한 권한을 갖습니다. 
해당 디렉토리에 대한 적절한 그룹을 설정합니다.

SELinux 지원 시스템(예: CentOS 및 RHEL)에는 추가 보안 컨텍스트가 있습니다.
파일 시스템을 변경하는 프로세스 기능을 제한할 수 있습니다. 이러한 시스템에는 다음이 필요할 수 있습니다. 
XOOPS가 올바르게 작동하도록 보안 컨텍스트를 변경합니다.

XOOPS는 정상 작동 중에 특정 디렉터리에 자유롭게 쓸 수 있을 것으로 예상합니다. 
또한 XOOPS 설치 및 업그레이드 중에 특정 파일도 쓰기 가능해야 합니다.
 
정상적인 작업 중에 XOOPS는 파일을 쓰고 하위 디렉터리를 생성할 수 있을 것으로 예상합니다. 
다음 디렉토리에:

- 기본 XOOPS 웹 루트의 `uploads`
- `xoops_data` 설치 중 재배치되는 위치

설치 또는 업그레이드 프로세스 중에 XOOPS는 다음 파일에 기록해야 합니다.

- 기본 XOOPS 웹 루트의 `mainfile.php`

일반적인 CentOS Apache 기반 시스템의 경우 보안 컨텍스트 변경 사항은 다음과 같습니다. 
다음 명령으로 수행됩니다.

```
chcon -Rv --type=httpd_sys_rw_content_t /path/to/web/root/uploads/
chcon -Rv --type=httpd_sys_rw_content_t /path/to/xoops_data/
```

다음을 사용하여 mainfile.php를 쓰기 가능하게 만들 수 있습니다:

```
chcon -v --type=httpd_sys_rw_content_t /path/to/web/root/mainfile.php
```

참고: 설치 시 *extras* 디렉토리에서 빈 mainfile.php를 복사할 수 있습니다.

또한 httpd가 메일을 보내도록 허용해야 합니다:

```
setsebool -P httpd_can_sendmail=1
```

필요할 수 있는 기타 설정은 다음과 같습니다.

httpd가 네트워크 연결을 할 수 있도록 허용합니다. 즉, RSS 피드를 가져오거나 API 호출을 할 수 있습니다:

```
setsebool -P httpd_can_network_connect 1
```

다음을 사용하여 데이터베이스에 대한 네트워크 연결을 활성화합니다.

```
setsebool -P httpd_can_network_connect_db=1
```

자세한 내용은 시스템 설명서 및/또는 시스템 관리자에게 문의하세요.

## Smarty 4 및 맞춤 테마

XOOPS 2.7.0은 템플릿 엔진을 Smarty 3에서 **Smarty 4**로 업그레이드했습니다. Smarty 4가 더 엄격합니다.
Smarty 3보다 템플릿 구문에 대한 정보와 이전 템플릿에서 허용된 몇 가지 패턴
이제 오류가 발생합니다. 테마만 사용하여 XOOPS 2.7.0의 새 복사본을 설치하는 경우
릴리스와 함께 제공되는 모듈은 걱정할 필요가 없습니다. 배송된 모든 템플릿
Smarty 4 호환성을 위해 업데이트되었습니다.

우려 사항은 다음과 같은 경우에 적용됩니다.

- 사용자 정의 테마가 있는 기존 XOOPS 2.5.x 사이트를 업그레이드하거나
- XOOPS 2.7.0에 사용자 정의 테마 또는 이전 타사 모듈을 설치합니다.

실시간 트래픽을 업그레이드된 사이트로 전환하기 전에 제공되는 프리플라이트 스캐너를 실행하십시오.
`/upgrade/` 디렉터리. `/themes/` 및 `/modules/`를 검색하여 Smarty 4개의 비호환성을 찾습니다.
그 중 많은 부분을 자동으로 복구할 수 있습니다. 참조
자세한 내용은 [플라이트 확인](../upgrading/upgrade/preflight.md) 페이지를 참조하세요.

설치 또는 업그레이드 후 템플릿 오류가 발생하는 경우:

1. `/upgrade/preflight.php`을 다시 실행하고 보고된 문제를 해결합니다.
2. `index.html`을 제외한 모든 항목을 제거하여 컴파일된 템플릿 캐시를 지웁니다.
   `xoops_data/caches/smarty_compile/`.
3. `xbootstrap5` 또는 `default` 등 제공된 테마로 일시적으로 전환하여 문제를 확인합니다.
   사이트 전체가 아닌 테마별로 다릅니다.
4. 사이트를 프로덕션 환경으로 되돌리기 전에 사용자 정의 테마 또는 모듈 템플릿 변경 사항을 확인하십시오.
