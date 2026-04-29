---
title: "무역 도구"
---

XOOPS 외부에서 발생해야 하거나 XOOPS에서 더 쉽게 수행할 수 있는 XOOPS 웹 사이트를 사용자 정의하고 유지 관리하는 데 필요한 많은 것들이 있습니다.

다음은 XOOPS 웹마스터가 유용하다고 판단한 특정 도구에 대한 몇 가지 제안과 함께 사용하고 싶은 도구 유형 목록입니다.

## 편집자

편집자는 매우 개인적인 선택이며 사람들은 자신이 좋아하는 것에 대해 상당히 열정을 가질 수 있습니다. 우리는 많은 가능성 중 몇 가지만 제시하겠습니다.

XOOPS를 사용하려면 일부 구성 옵션을 조정하고 사이트 테마를 사용자 정의하려면 편집기가 필요합니다. 이러한 용도의 경우, 여러 파일을 동시에 작업할 수 있고, 여러 파일을 검색하고 바꿀 수 있으며, 구문 강조를 제공할 수 있는 편집기가 있으면 매우 유용할 수 있습니다. 매우 간단하고 장식이 없는 편집기를 사용할 수 있지만 일부 작업을 수행하려면 훨씬 더 열심히 노력해야 합니다.

_JetBrains_의 **PhpStorm**은 PHP 웹 개발을 위해 특별히 제작된 IDE(통합 개발 환경)입니다. _JetBrains_는 XOOPS를 후원하는 데 큰 도움이 되었으며, 그 제품은 많은 개발자들이 선호하는 제품입니다. 상업용 제품이므로 일부 새로운 웹마스터에게는 비용이 많이 들 수 있지만 시간을 절약할 수 있다는 점은 숙련된 개발자에게 매력적입니다.

**Visual Studio Code**는 Microsoft의 무료 다중 플랫폼 소스 코드 편집기입니다. HTML, JavaScript, PHP와 같은 핵심 웹 기술을 내장하거나 확장을 통해 지원하므로 XOOPS 사용에 적합합니다.

**Notepad++**는 충성도 높은 사용자를 보유한 이 Windows용 카테고리의 무료 경쟁자입니다.

**Meld**는 편집기는 아니지만 차이점을 보여주는 텍스트 파일을 비교하고 선택적으로 변경 사항을 병합하고 작은 편집을 할 수 있습니다. 구성 파일, 테마 템플릿, 물론 PHP 코드를 비교할 때 매우 유용합니다.

| 이름 | 링크 | 라이센스 | 플랫폼 |
| :--- | :--- | :--- | :--- |
| PhpStorm | [https://www.jetbrains.com/phpstorm/](https://www.jetbrains.com/phpstorm/) | 상업용 | 모두 |
| 비주얼 스튜디오 코드 | [https://code.visualstudio.com/](https://code.visualstudio.com/) | MIT | 모두 |
| 메모장++ | [https://notepad-plus-plus.org/](https://notepad-plus-plus.org/) | GPL | 승리 |
| 융합 | [https://meldmerge.org/](https://meldmerge.org/) | GPL | 모두 |

## FTP 클라이언트

파일 전송 프로토콜(FTP) 또는 그 변형은 한 컴퓨터에서 다른 컴퓨터로 파일을 이동하는 데 사용됩니다. 대부분의 XOOPS 설치에는 XOOPS 배포판에서 가져온 파일을 사이트가 배포될 호스트 시스템으로 이동하기 위해 FTP 클라이언트가 필요합니다.

**FileZilla**는 대부분의 플랫폼에서 사용할 수 있는 강력한 무료 FTP 클라이언트입니다. 플랫폼 간 일관성으로 인해 이 책의 FTP 예제가 선택되었습니다.

**PuTTY**는 무료 SSH 클라이언트로, 서버에 대한 Shell 액세스에 유용할 뿐만 아니라 SCP를 통한 파일 전송 기능도 제공합니다.

**WinSCP**는 Windows 시스템용 FTP/SFTP/SCP 클라이언트입니다.

| 이름 | 링크 | 라이센스 | 플랫폼 |
| :--- | :--- | :--- | :--- |
| 파일질라 | [https://filezilla-project.org/](https://filezilla-project.org/) | GPL | 모두 |
| 퍼티 | [https://www.chiark.greenend.org.uk/~sgtatham/putty/](https://www.chiark.greenend.org.uk/~sgtatham/putty/) | BSD | 승리/*nix |
| WinSCP | [https://winscp.net/eng/index.php](https://winscp.net/eng/index.php) | GPL | 윈도우 |

## MySQL/MariaDB

데이터베이스에는 사이트의 모든 콘텐츠, 사이트를 사용자 정의하는 구성, 사이트 사용자에 대한 정보 등이 포함되어 있습니다. 특히 데이터베이스를 다루는 몇 가지 추가 도구를 사용하면 해당 정보를 보호하고 유지하는 것이 더 쉬울 수 있습니다.

**phpMyAdmin**은 일회성 백업 생성을 포함하여 MySQL 데이터베이스 작업에 가장 널리 사용되는 웹 기반 도구입니다.

**BigDump**는 제한된 호스팅 계정을 위한 신의 선물로, 시간 초과 및 크기 제한을 피하면서 대규모 데이터베이스 백업 덤프를 복원하는 데 도움이 됩니다.

**srdb**, XOOPS용 검색 대체 DB는 Interconnect/it의 [DB 검색 및 대체](https://github.com/interconnectit/Search-Replace-DB)를 XOOPS로 적용한 것입니다. 사이트를 이동할 때 MySQL 데이터의 URL과 파일 시스템 참조를 변경하는 것이 특히 유용합니다.

| 이름 | 링크 | 라이센스 | 플랫폼 |
| :--- | :--- | :--- | :--- |
| phpMy관리자 | [https://www.phpmyadmin.net/](https://www.phpmyadmin.net/) | GPL | 모두 |
| 빅덤프 | [http://www.ozerov.de/bigdump/](http://www.ozerov.de/bigdump/) | GPL | 모두 |
| srdb | [https://github.com/geekwright/srdb](https://github.com/geekwright/srdb) | GPL3 | 모두 |

## 개발자 스택

Ubuntu와 같은 일부 플랫폼에는 XOOPS를 실행하는 데 필요한 전체 스택이 내장되어 있지만 다른 플랫폼에는 몇 가지 추가 기능이 필요합니다.

**WAMP** 및 **Uniform Server Zero**는 Windows용 올인원 스택입니다.

Apache Friends의 올인원 스택인 **XAMPP**는 여러 플랫폼에서 사용할 수 있습니다.

**bitnami**는 가상 머신 및 컨테이너 이미지를 포함하여 사전 구축된 광범위한 애플리케이션 스택을 제공합니다. 이들 제품은 애플리케이션(XOOPS 포함)이나 다양한 웹 기술을 신속하게 시험해 볼 수 있는 귀중한 리소스가 될 수 있습니다. 프로덕션 및 개발 용도 모두에 적합할 수 있습니다.

**Docker**는 맞춤형 환경을 구현하기 위해 컨테이너를 생성하고 실행하는 데 사용되는 애플리케이션 컨테이너 플랫폼입니다. 

**Devilbox**는 쉽게 구성할 수 있는 Docker 기반 개발 스택입니다. 모든 스택 구성 요소에 대해 다양한 버전을 제공하며 개발자가 재현 가능하고 공유 가능한 환경에서 테스트할 수 있습니다. 

| 이름 | 링크 | 라이센스 | 플랫폼 |
| :--- | :--- | :--- | :--- |
| 왐프 | [http://www.wampserver.com/](http://www.wampserver.com/) | 다중 | 승리 |
| 유니폼 서버 제로 | [http://www.uniformserver.com/](http://www.uniformserver.com/) | 다중 | 승리 |
| XAMPP | [https://www.apachefriends.org/index.html](https://www.apachefriends.org/index.html) | 다중 | 모두 |
| 빛나미 | [https://bitnami.com/](https://bitnami.com/) | 다중 | 모두 |
| 도커 | [https://www.docker.com/](https://www.docker.com/) | 다중 | 모두 |
| 데빌박스 | [http://devilbox.org/](http://devilbox.org/) | MIT | 모두 |
