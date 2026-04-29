---
title: "부록 2: FTP를 통해 XOOPS 업로드"
---

이 부록에서는 FTP 또는 SFTP를 사용하여 XOOPS 2.7.0을 원격 호스트에 배포하는 과정을 안내합니다. 모든 제어판(cPanel, Plesk, DirectAdmin 등)은 동일한 기본 단계를 표시합니다.

## 1. 데이터베이스 준비

호스트 제어판을 통해:

1. XOOPS용 새 MySQL 데이터베이스를 생성합니다.
2. 강력한 비밀번호를 사용하여 데이터베이스 사용자를 생성합니다.
3. 새로 생성된 데이터베이스에 대한 모든 권한을 사용자에게 부여합니다.
4. 데이터베이스 이름, 사용자 이름, 비밀번호 및 호스트를 기록합니다. 이를 XOOPS 설치 프로그램에 입력합니다.

> **팁**
>
> 최신 제어판은 강력한 비밀번호를 생성합니다. 애플리케이션은 `xoops_data/data/secure.php`에 비밀번호를 저장하므로 비밀번호를 자주 입력할 필요가 없습니다. 길고 무작위로 생성된 값을 선호합니다.

## 2. 관리자 메일함 생성

사이트 관리 알림을 받을 이메일 사서함을 만듭니다. XOOPS 설치 프로그램은 웹마스터 계정 설정 중에 이 주소를 요청하고 `FILTER_VALIDATE_EMAIL`으로 확인합니다.

## 3. 파일 업로드

XOOPS 2.7.0은 `xoops_lib/vendor/`(Composer 패키지, Smarty 4, HTMLPurifier, PHPMailer, Monolog, TCPDF 등)에 사전 설치된 타사 종속성과 함께 제공됩니다. 이로 인해 `xoops_lib/`이 2.5.x보다 훨씬 커졌습니다. 수십 메가바이트가 예상됩니다.

**`xoops_lib/vendor/` 내의 파일을 선택적으로 건너뛰지 마십시오.** Composer 공급업체 트리에서 파일을 건너뛰면 자동 로드가 중단되고 설치가 실패합니다.

업로드 구조(`public_html`이 문서 루트라고 가정):

1. `xoops_data/` 및 `xoops_lib/` **`public_html` 내부가 아닌 **옆**에 업로드하세요. 2.7.0에서는 웹 루트 외부에 배치하는 것이 권장되는 보안 상태입니다.

   ```
   /home/your-user/
   ├── public_html/
   ├── xoops_data/     ← upload here
   └── xoops_lib/      ← upload here
   ```

   ![](/xoops-docs/2.7/img/installation/img_66.jpg)
   ![](/xoops-docs/2.7/img/installation/img_67.jpg)

2. 배포 `htdocs/` 디렉터리의 나머지 콘텐츠를 `public_html/`에 업로드합니다.

   ![](/xoops-docs/2.7/img/installation/img_68.jpg)

> **호스트가 문서 루트 외부의 디렉터리를 허용하지 않는 경우**
>
> `xoops_data/` 및 `xoops_lib/` **내부** `public_html/`을 업로드하고 **명확하지 않은 이름으로 이름을 바꿉니다**(예: `xdata_8f3k2/` 및 `xlib_7h2m1/`). XOOPS 데이터 경로 및 XOOPS 라이브러리 경로를 묻는 경우 설치 프로그램에 이름이 바뀐 경로를 입력하게 됩니다.

## 4. 쓰기 가능한 디렉토리를 쓰기 가능하게 만들기

FTP 클라이언트의 CHMOD 대화 상자(또는 SSH)를 통해 2장에 나열된 디렉터리를 웹 서버에서 쓸 수 있도록 만듭니다. 대부분의 공유 호스트에서는 디렉터리에 `0775`, `mainfile.php`에 `0664`이면 충분합니다. 호스트가 FTP 사용자가 아닌 다른 사용자로 PHP를 실행하는 경우 설치 중에 `0777`을 사용할 수 있지만 설치가 완료된 후에는 권한을 강화하세요.

## 5. 설치 프로그램 실행

브라우저에서 사이트의 공개 URL을 가리키십시오. 모든 파일이 제자리에 있으면 XOOPS 설치 마법사가 시작되고 [2장](chapter-2-introduction.md)부터 이 가이드의 나머지 부분을 따라갈 수 있습니다.
