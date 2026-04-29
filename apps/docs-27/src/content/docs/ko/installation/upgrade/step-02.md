---
title: "업그레이드 실행 중"
---

메인 업그레이드 프로그램을 실행하기 전에 [실행 전 확인](preflight.md)을 완료했는지 확인하세요. 업그레이드 UI를 사용하려면 프리플라이트를 한 번 이상 실행해야 하며, 그렇지 않은 경우 해당 단계로 안내됩니다.

브라우저를 사이트의 _upgrade_ 디렉터리로 지정하여 업그레이드를 시작하세요.

```text
http://example.com/upgrade/
```

다음과 같은 페이지가 표시됩니다.

![XOOPS Upgrade Startup](/xoops-docs/2.7/img/installation/upgrade-01.png)

계속하려면 "계속" 버튼을 선택하세요.

각 "Continue"는 다른 패치를 통해 진행됩니다. 모든 패치가 적용될 때까지 계속 진행하고 시스템 모듈 업데이트 페이지가 표시됩니다.

![XOOPS Upgrade Applied Patch](/xoops-docs/2.7/img/installation/upgrade-05-applied.png)

## 2.5.11 → 2.7.0 업그레이드 적용 내용

XOOPS 2.5.11에서 2.7.0으로 업그레이드할 때 업그레이드 프로그램은 다음 패치를 적용합니다. 각 단계는 마법사에서 별도의 단계로 표시되므로 변경 사항을 확인할 수 있습니다.

1. **사용되지 않는 번들 PHPMailer를 제거합니다.** Protector 모듈 내부의 PHPMailer 번들 복사본이 삭제됩니다. PHPMailer는 이제 `xoops_lib/vendor/`의 Composer를 통해 제공됩니다.
2. **사용되지 않는 HTMLPurifier 폴더를 제거합니다.** 마찬가지로 Protector 모듈 내부의 이전 HTMLPurifier 폴더가 삭제됩니다. HTMLPurifier는 이제 Composer를 통해 제공됩니다.
3. **`tokens` 테이블을 생성합니다.** 일반 범위 토큰 스토리지를 위해 새 `tokens` 테이블이 추가됩니다. 테이블에는 토큰 ID, 사용자 ID, 범위, 해시 및 발행/만료/사용 타임스탬프에 대한 열이 있으며 XOOPS 2.7.0의 토큰 기반 기능에서 사용됩니다.
4. **`bannerclient.passwd` 확대.** `bannerclient.passwd` 열은 `VARCHAR(255)`으로 확대되어 레거시 좁은 열 대신 최신 암호 해시(bcrypt, argon2)를 저장할 수 있습니다.
5. **세션 쿠키 기본 설정을 추가합니다.** `session_cookie_samesite`(SameSite 쿠키 속성용) 및 `session_cookie_secure`(HTTPS 전용 쿠키 강제 적용)의 두 가지 새로운 기본 설정이 삽입됩니다. 업그레이드가 완료된 후 이를 검토하는 방법은 [업그레이드 후](ustep-04.md)를 참조하세요.

이 단계 중 어느 것도 귀하의 콘텐츠 데이터에 영향을 미치지 않습니다. 사용자, 게시물, 이미지 및 모듈 데이터는 그대로 유지됩니다.

## 언어 선택

주요 XOOPS 배포판은 영어를 지원합니다. 추가 로케일에 대한 지원은 [XOOPS 로컬 지원 사이트](https://xoops.org/modules/xoopspartners/)에서 제공됩니다. 이 지원은 사용자 정의된 배포 또는 기본 배포에 추가할 추가 파일의 형태로 제공될 수 있습니다.

XOOPS 번역은 [transifex](https://www.transifex.com/xoops/public/)에서 유지됩니다.

XOOPS 업그레이드 프로그램에 추가 언어 지원이 있는 경우 상단 메뉴에서 언어 아이콘을 선택하고 다른 언어를 선택하여 언어를 변경할 수 있습니다.

![XOOPS Upgrade Language](/xoops-docs/2.7/img/installation/upgrade-02-change-language.png)

