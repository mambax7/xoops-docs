---
title: "이슈 보고 지침"
description: "버그, 기능 요청 및 기타 문제를 효과적으로 보고하는 방법"
---

> 효과적인 버그 보고서와 기능 요청은 XOOPS 개발에 매우 중요합니다. 이 가이드는 고품질 이슈를 생성하는 데 도움이 됩니다.

---

## 신고하기 전에

### 기존 문제 확인

**항상 먼저 검색하세요.**

1. [GitHub 문제](https://github.com/XOOPS/XoopsCore27/issues)로 이동합니다.
2. 문제와 관련된 키워드를 검색하세요.
3. 종료된 문제를 확인하세요. 이미 해결되었을 수도 있습니다.
4. 풀 리퀘스트를 살펴보세요. 진행 중일 수 있습니다.

검색 필터 사용:
- `is:issue is:open label:bug` - 버그 열기
- `is:issue is:open label:feature` - 기능 요청 열기
- `is:issue sort:updated` - 최근 업데이트된 이슈

### 정말 문제가 되나요?

먼저 고려하십시오:

- **구성 문제가 있습니까?** - 설명서를 확인하세요.
- **사용 관련 질문이 있습니까?** - 포럼이나 Discord 커뮤니티에 질문하세요.
- **보안 문제?** - 아래 #보안 문제 섹션을 참조하세요.
- **모듈별?** - 모듈 유지관리자에게 보고
- **테마별?** - 테마 작성자에게 보고

---

## 문제 유형

### 버그 신고

버그는 예상치 못한 동작이나 결함입니다.

**예:**
- 로그인이 되지 않습니다
- 데이터베이스 오류
- 양식 유효성 검사 누락
- 보안 취약점

### 기능 요청

기능 요청은 새로운 기능에 대한 제안입니다.

**예:**
- 새로운 기능에 대한 지원 추가
- 기존 기능 개선
- 누락된 문서 추가
- 성능 개선

### 개선

향상된 기능은 기존 기능을 향상시킵니다.

**예:**
- 더 나은 오류 메시지
- 성능 향상
- 더 나은 API 디자인
- 더 나은 사용자 경험

### 문서

문서 문제에는 누락되거나 잘못된 문서가 포함됩니다.

**예:**
- 불완전한 API 문서
- 오래된 가이드
- 누락된 코드 예시
- 문서의 오타

---

## 버그 신고

### 버그 보고서 템플릿

```markdown
## Description
Brief, clear description of the bug.

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Expected Behavior
What should happen.

## Actual Behavior
What actually happens.

## Environment
- XOOPS Version: X.Y.Z
- PHP Version: 8.2/8.3/8.4
- Database: MySQL/MariaDB version
- Operating System: Windows/macOS/Linux
- Browser: Chrome/Firefox/Safari

## Screenshots
If applicable, add screenshots showing the issue.

## Additional Context
Any other relevant information.

## Possible Fix
If you have suggestions for fixing the issue (optional).
```

### 좋은 버그 신고 예시

```markdown
## Description
Login page shows blank page when database connection fails.

## Steps to Reproduce
1. Stop the MySQL service
2. Navigate to the login page
3. Observe the behavior

## Expected Behavior
Show a user-friendly error message explaining the database connection issue.

## Actual Behavior
The page is completely blank - no error message, no interface visible.

## Environment
- XOOPS Version: 2.7.0
- PHP Version: 8.0.28
- Database: MySQL 5.7
- Operating System: Ubuntu 20.04
- Browser: Chrome 120

## Additional Context
This likely affects other pages too. The error should be displayed to admins or logged appropriately.

## Possible Fix
Check database connection in header.php before rendering the template.
```

### 잘못된 버그 신고 예시

```markdown
## Description
Login doesn't work

## Steps to Reproduce
It doesn't work

## Expected Behavior
It should work

## Actual Behavior
It doesn't

## Environment
Latest version
```

---

## 기능 요청 보고

### 기능 요청 템플릿

```markdown
## Description
Clear, concise description of the feature.

## Problem Statement
Why is this feature needed? What problem does it solve?

## Proposed Solution
Describe your ideal implementation or UX.

## Alternatives Considered
Are there other ways to achieve this goal?

## Additional Context
Any mockups, examples, or references.

## Expected Impact
How would this benefit users? Would it be breaking?
```

### 좋은 기능 요청 예시

```markdown
## Description
Add two-factor authentication (2FA) for user accounts.

## Problem Statement
With increasing security breaches, many CMS platforms now offer 2FA. XOOPS users want stronger account security beyond passwords.

## Proposed Solution
Implement TOTP-based 2FA (compatible with Google Authenticator, Authy, etc.).
- Users can enable 2FA in their profile
- Display QR code for setup
- Generate backup codes for recovery
- Require 2FA code at login

## Alternatives Considered
- SMS-based 2FA (requires carrier integration, less secure)
- Hardware keys (too complex for average users)

## Additional Context
Similar to GitHub, GitLab, and WordPress implementations.
Reference: [TOTP Standard RFC 6238](https://tools.ietf.org/html/rfc6238)

## Expected Impact
Increases account security. Could be optional initially, mandatory in future versions.
```

---

## 보안 문제

### 공개적으로 보고하지 마세요

**보안 취약점에 대해 공개 문제를 생성하지 마세요.**

### 비공개 신고

1. **보안팀에 이메일을 보내주세요:** security@xoops.org
2. **포함:**
   - 취약점에 대한 설명
   - 재현 단계
   - 잠재적 영향
   - 귀하의 연락처 정보

### 책임 있는 공개

- 48시간 이내에 접수 확인을 해드립니다.
- 7일마다 업데이트를 제공해드립니다.
- 우리는 수정 일정에 맞춰 작업할 것입니다.
- 발견에 대한 크레딧을 요청할 수 있습니다.
- 공시 시기 조율

### 보안 문제 예

```
Subject: [SECURITY] XSS Vulnerability in Comment Form

Description:
The comment form in Publisher module does not properly escape user input,
allowing stored XSS attacks.

Steps to Reproduce:
1. Create a comment with: <img src=x onerror="alert('xss')">
2. Submit the form
3. The JavaScript executes when viewing the comment

Impact:
Attackers can steal user session tokens, perform actions as users,
or deface the website.

Environment:
- XOOPS 2.7.0
- Publisher Module 1.x
```

---

## 문제 제목 모범 사례

### 좋은 제목

```
✅ Login page shows blank error when database connection fails
✅ Add two-factor authentication support
✅ Form validation not preventing SQL injection in name field
✅ Improve performance of user list query
✅ Update installation documentation for PHP 8.2
```

### 불쌍한 제목

```
❌ Bug in system
❌ Help me!!
❌ It doesn't work
❌ Question about XOOPS
❌ Error
```

### 제목 지침

- **구체적으로** - 무엇을, 어디서 언급하는지 언급하세요.
- **간결하게 작성하세요** - 75자 미만
- **현재 시제를 사용하세요** - '빈 페이지 표시'가 아니라 '빈 페이지 표시'입니다.
- **컨텍스트 포함** - "관리자 패널에서", "설치 중"
- **일반적인 단어는 피하세요** - '수정', '도움말', '문제'가 아님

---

## 문제 설명 모범 사례

### 필수 정보 포함

1. **내용** - 문제에 대한 명확한 설명
2. **어디** - 페이지, 모듈 또는 기능
3. **시기** - 재현 단계
4. **환경** - 버전, OS, 브라우저, PHP
5. **이유** - 이것이 중요한 이유

### 코드 형식 사용

```markdown
Error message: `Error: Cannot find user`

Code snippet:
```php
$user = $this->getUser($id);
만약 (!$user) {
    echo "오류: 사용자를 찾을 수 없습니다";
}
```
```

### 스크린샷 포함

UI 문제의 경우 다음을 포함합니다.
- 문제의 스크린샷
- 예상되는 동작의 스크린샷
- 잘못된 부분에 주석을 답니다(화살표, 원)

### 라벨 사용

분류할 라벨 추가:
- `bug` - 버그 신고
- `enhancement` - 개선 요청
- `documentation` - 문서 문제
- `help wanted` - 도움을 구합니다
- `good first issue` - 새로운 기여자에게 좋습니다.

---

## 신고 후

### 신속하게 대응하세요

- 이슈 댓글에서 질문을 확인하세요.
- 요청 시 추가 정보 제공
- 제안된 수정 사항 테스트
- 새 버전에도 버그가 여전히 존재하는지 확인하세요.

### 에티켓을 따르세요

- 존중하고 전문적이어야 합니다.
- 좋은 의도를 갖는다
- 수정을 요구하지 마세요. 개발자는 자원봉사자입니다.
- 가능하다면 도움을 주겠다고 제안하세요.
- 기여자들의 노고에 감사드립니다.

### 문제에 집중하세요

- 주제에 충실하세요
- 관련 없는 문제에 대해 논의하지 마세요.
- 대신 관련 이슈에 대한 링크
- 기능 투표에 이슈를 사용하지 마세요.

---

## 문제는 어떻게 되나요?

### 분류 프로세스

1. **새 문제 생성됨** - GitHub가 관리자에게 알립니다.
2. **초기 검토** - 명확성과 중복 여부를 확인했습니다.
3. **라벨 할당** - 분류 및 우선순위 지정
4. **할당** - 적절한 경우 다른 사람에게 할당됨
5. **토론** - 필요한 경우 추가 정보 수집

### 우선순위 수준

- **중요** - 데이터 손실, 보안, 완전한 파손
- **높음** - 주요 기능이 손상되어 많은 사용자에게 영향을 미침
- **중간** - 일부 기능이 손상되었으며 해결 방법이 제공됩니다.
- **낮음** - 사소한 문제, 외관 또는 틈새 사용 사례

### 해결 결과

- **수정됨** - PR에서 문제가 해결되었습니다.
- **수정되지 않음** - 기술적 또는 전략적 이유로 거부됨
- **중복** - 다른 문제와 동일
- **잘못됨** - 실제로는 문제가 되지 않음
- **추가 정보 필요** - 추가 세부정보를 기다리는 중

---

## 문제 예시

### 예: 좋은 버그 신고

```markdown
## Description
Admin users cannot delete items when using MySQL with strict mode enabled.

## Steps to Reproduce
1. Enable `sql_mode='STRICT_TRANS_TABLES'` in MySQL
2. Navigate to Publisher admin panel
3. Click delete button on any article
4. Error is shown

## Expected Behavior
Article should be deleted or show meaningful error.

## Actual Behavior
Error: "SQL Error - Unknown column 'deleted_at' in ON clause"

## Environment
- XOOPS Version: 2.7.0
- PHP Version: 8.2.0
- Database: MySQL 8.0.32 with STRICT_TRANS_TABLES
- Operating System: Ubuntu 22.04
- Browser: Firefox 120

## Screenshots
[Screenshot of error message]

## Additional Context
This only happens with strict SQL mode. Works fine with default settings.
The query is in class/PublisherItem.php:248

## Possible Fix
Use single quotes around 'deleted_at' or use backticks for all column names.
```

### 예: 좋은 기능 요청

```markdown
## Description
Add REST API endpoints for read-only access to public content.

## Problem Statement
Developers want to build mobile apps and external services using XOOPS data.
Currently limited to SOAP API which is outdated and poorly documented.

## Proposed Solution
Implement RESTful API with:
- Endpoints for articles, users, comments (read-only)
- Token-based authentication
- Standard HTTP status codes and errors
- OpenAPI/Swagger documentation
- Pagination support

## Alternatives Considered
- Enhanced SOAP API (legacy, not standards-compliant)
- GraphQL (more complex, maybe future)

## Additional Context
See Publisher module API refactoring for similar patterns.
Would align with modern web development practices.

## Expected Impact
Enable ecosystem of third-party tools and mobile apps.
Would improve XOOPS adoption and ecosystem.
```

---

## 관련 문서

- 행동강령
- 기여 워크플로우
- 풀 리퀘스트 지침
- 기여 개요

---

#xoops #문제 #버그 보고 #기능 요청 #github
