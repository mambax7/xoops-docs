---
title: "문제 해결"
---

## Smarty 4 템플릿 오류

XOOPS 2.5.x에서 2.7.0으로 업그레이드할 때 가장 일반적인 문제 유형은 Smarty 4 템플릿 비호환성입니다. [실행 전 확인](preflight.md)을 건너뛰거나 완료하지 않은 경우 업그레이드 후 프런트 엔드 또는 관리 영역에 템플릿 오류가 표시될 수 있습니다.

복구하려면:

1. **`/upgrade/preflight.php`에서 비행 전 스캐너를 다시 실행**하세요. 제공되는 자동 복구를 적용하거나 플래그가 지정된 템플릿을 수동으로 수정하세요.
2. **컴파일된 템플릿 캐시를 지웁니다.** `xoops_data/caches/smarty_compile/`에서 `index.html`을 제외한 모든 항목을 제거합니다. Smarty 3개의 컴파일된 템플릿은 Smarty 4와 호환되지 않으며 오래된 파일은 혼란스러운 오류를 일으킬 수 있습니다.
3. **제공된 테마로 일시적으로 전환합니다.** 관리 영역에서 `xbootstrap5` 또는 `default`을 활성 테마로 선택합니다. 그러면 문제가 사용자 정의 테마로 제한되는지 아니면 사이트 전체에 발생하는지 확인됩니다.
4. 프로덕션 트래픽을 다시 켜기 전에 **맞춤형 테마 및 모듈 템플릿이 있는지 확인**하세요. `{php}` 블록, 더 이상 사용되지 않는 수정자 또는 비표준 구분 기호 구문을 사용하는 템플릿에 특히 주의하세요. 이는 가장 일반적인 Smarty 4 손상입니다.

[특별 주제](../../installation/specialtopics.md)의 Smarty 4 섹션도 참조하세요.

## 권한 문제

XOOPS 업그레이드는 이전에 읽기 전용으로 설정된 파일에 써야 할 수도 있습니다. 이 경우 다음과 같은 메시지가 표시됩니다.

![XOOPS Upgrade Make Writable Error](/xoops-docs/2.7/img/installation/upgrade-03-make-writable.png)

해결책은 권한을 변경하는 것입니다. 더 직접적인 액세스 권한이 없으면 FTP를 사용하여 권한을 변경할 수 있습니다. 다음은 FileZilla를 사용한 예입니다.

![FileZilla Change Permission](/xoops-docs/2.7/img/installation/upgrade-04-change-permissions.png)

## 디버깅 출력

업그레이드를 실행하는 데 사용되는 URL에 디버그 매개변수를 추가하여 로거에서 추가 디버깅 출력을 활성화할 수 있습니다.

```text
http://example.com/upgrade/?debug=1
```

