---
title: "개발자를 위한 참고 사항"
---

개발용 XOOPS의 실제 설치는 이미 설명한 일반 설치와 유사하지만 개발자 지원 시스템을 구축할 때 중요한 차이점이 있습니다.

개발자 설치의 한 가지 큰 차이점은 _htdocs_ 디렉토리의 내용에만 초점을 맞추는 대신 개발자 설치는 모든 파일을 유지하고 git을 사용하여 소스 코드 제어하에 유지한다는 것입니다.

또 다른 차이점은 개발 시스템이 공개 인터넷(예: 라우터 뒤와 같은 개인 네트워크)에서 직접 액세스할 수 없는 한 _xoops_data_ 및 _xoops_lib_ 디렉터리는 일반적으로 이름을 바꾸지 않고도 그대로 유지될 수 있다는 것입니다.

대부분의 개발자는 소스 코드, 웹 서버 스택, 코드 및 데이터베이스 작업에 필요한 도구가 있는 _localhost_ 시스템에서 작업합니다.

자세한 내용은 [업무용 도구](../tools/tools.md) 장에서 확인할 수 있습니다.

## Git 및 가상 호스트

대부분의 개발자는 현재 소스를 최신 상태로 유지하고 업스트림 [GitHub의 XOOPS/XoopsCore27 저장소](https://github.com/XOOPS/XoopsCore27)에 변경 사항을 다시 제공할 수 있기를 원합니다. 즉, 릴리스 아카이브를 다운로드하는 대신 XOOPS 복사본을 [포크](https://help.github.com/articles/fork-a-repo/)하고 **git**을 사용하여 해당 저장소를 개발 상자에 [복제](https://help.github.com/categories/bootcamp/)할 수 있습니다.

저장소에는 특정 구조가 있으므로 _htdocs_ 디렉터리에서 웹 서버로 파일을 _복사_하는 대신 웹 서버가 로컬로 복제된 저장소 내의 htdocs 폴더를 가리키도록 하는 것이 좋습니다. 이를 달성하기 위해 일반적으로 git 제어 소스 코드를 가리키는 새로운 _Virtual Host_ 또는 _vhost_를 만듭니다.

[WAMP](http://www.wampserver.com/) 환경에서 기본 [localhost](http://localhost/) 페이지에는 _Tools_ 섹션에 다음으로 연결되는 _가상 호스트 추가_에 대한 링크가 있습니다.

![WAMP Add Virtual Host](/xoops-docs/2.7/img/installation/wamp-vhost-03.png)

이를 사용하면 (여전히) Git 제어 저장소에 바로 들어갈 VirtualHost 항목을 설정할 수 있습니다.

다음은 `wamp64/bin/apache/apache2.x.xx/conf/extra/httpd-vhosts.conf`의 예시 항목입니다.

```text
<VirtualHost *:80>
    ServerName xoops.localhost
    DocumentRoot "c:/users/username/documents/github/xoopscore27/htdocs"
    <Directory  "c:/users/username/documents/github/xoopscore27/htdocs/">
        Options +Indexes +Includes +FollowSymLinks +MultiViews
        AllowOverride All
        Require local
    </Directory>
</VirtualHost>
```

`Windows/System32/drivers/etc/hosts`에 항목을 추가해야 할 수도 있습니다.

```text
127.0.0.1    xoops.localhost
```

이제 저장소를 그대로 유지하고 간단한 URL을 사용하여 htdocs 디렉터리 내부에 웹 서버를 유지하면서 테스트를 위해 `http://xoops.localhost/`에 설치할 수 있습니다. 또한 파일을 다시 설치하거나 복사할 필요 없이 언제든지 XOOPS의 로컬 복사본을 최신 마스터로 업데이트할 수 있습니다. 또한 코드를 개선하고 수정하여 GitHub를 통해 XOOPS에 다시 기여할 수 있습니다.

## 작성기 종속성

XOOPS 2.7.0은 [Composer](https://getcomposer.org/)를 사용하여 PHP 종속성을 관리합니다. 종속성 트리는 소스 저장소 내부의 `htdocs/xoops_lib/`에 있습니다.

* `composer.dist.json`은 릴리스와 함께 제공되는 종속성의 마스터 목록입니다.
* `composer.json`은 로컬 복사본이며 필요한 경우 개발 환경에 맞게 사용자 정의할 수 있습니다.
* `composer.lock` 정확한 버전을 고정하여 설치를 재현할 수 있습니다.
* `vendor/`에는 설치된 라이브러리(Smarty 4, PHPMailer, HTMLPurifier, firebase/php-jwt, monolog, Symfony/var-dumper, xoops/xmf, xoops/regdom 등)가 포함되어 있습니다.

XOOPS 2.7.0의 새로운 git 클론을 생성하려면 저장소 루트에서 시작하여 다음을 실행하세요.

```text
cd htdocs/xoops_lib
composer install
```

저장소 루트에는 `composer.json`이 없습니다. 프로젝트는 `htdocs/xoops_lib/` 아래에 있으므로 Composer를 실행하기 전에 해당 디렉터리에 `cd`을 입력해야 합니다.

릴리스 타르볼은 `vendor/`이 미리 채워진 상태로 제공되지만 git 클론은 그렇지 않을 수도 있습니다. 개발 설치 시 `vendor/`을 그대로 유지합니다. XOOPS는 런타임 시 거기에서 종속성을 로드합니다.

[XMF(XOOPS 모듈 프레임워크)](https://github.com/XOOPS/xmf) 라이브러리는 2.7.0에서 Composer 종속 항목으로 제공되므로 추가 설치 없이 모듈 코드에서 `Xmf\Request`, `Xmf\Database\TableLoad` 및 관련 클래스를 사용할 수 있습니다.

## DebugBar 모듈

XOOPS 2.7.0은 Symfony VarDumper를 기반으로 하는 **DebugBar** 모듈을 제공합니다. 요청, 데이터베이스 및 템플릿 정보를 노출하는 렌더링된 페이지에 디버그 도구 모음을 추가합니다. 개발 및 준비 사이트의 모듈 관리 영역에서 설치하세요. 원하지 않는 한 공개 프로덕션 사이트에 설치된 상태로 두지 마십시오.


