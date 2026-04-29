---
title: "기여 지침"
description: "XOOPS CMS 개발, 코딩 표준 및 커뮤니티 지침에 기여하는 방법"
---

# 🤝 XOOPS에 기여하기

> XOOPS 커뮤니티에 참여하여 세계 최고의 CMS가 되도록 도와주세요.

---

## 📋 개요

XOOPS는 커뮤니티 기여를 바탕으로 성장하는 오픈 소스 프로젝트입니다. 버그 수정, 기능 추가, 문서 개선, 다른 사람 돕기 등 무엇을 하든 여러분의 기여는 소중합니다.

---

## 🗂️ 섹션 내용

### 지침
- 행동강령
- 기여 워크플로우
- 풀 리퀘스트 지침
- 이슈 보고

### 코드 스타일
- PHP 코딩 표준
- JavaScript 표준
- CSS 지침
- Smarty 템플릿 표준

### 아키텍처 결정
- ADR 지수
- ADR 템플릿
- ADR-001: 모듈형 아키텍처
- ADR-002: 데이터베이스 추상화

---

## 🚀 시작하기

### 1. 개발 환경 설정

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/XoopsCore27.git
cd XoopsCore27

# Add upstream remote
git remote add upstream https://github.com/XOOPS/XoopsCore27.git

# Install dependencies
composer install
```

### 2. 기능 분기 생성

```bash
# Sync with upstream
git fetch upstream
git checkout -b feature/my-feature upstream/main
```

### 3. 변경하기

코딩 표준을 따르고 새로운 기능에 대한 테스트를 작성하세요.

### 4. 풀 요청 제출

```bash
# Commit changes
git add .
git commit -m "Add: Brief description of changes"

# Push to your fork
git push origin feature/my-feature
```

그런 다음 GitHub에서 끌어오기 요청을 생성하세요.

---

## 📝 코딩 표준

### PHP 표준

XOOPS는 PSR-1, PSR-4 및 PSR-12 코딩 표준을 따릅니다.

```php
<?php

declare(strict_types=1);

namespace XoopsModules\MyModule;

use Xmf\Request;
use XoopsObject;

/**
 * Class Item
 *
 * Represents an item in the module
 */
class Item extends XoopsObject
{
    /**
     * Constructor
     */
    public function __construct()
    {
        $this->initVar('id', \XOBJ_DTYPE_INT, null, false);
        $this->initVar('title', \XOBJ_DTYPE_TXTBOX, '', true, 255);
        $this->initVar('content', \XOBJ_DTYPE_TXTAREA, '', false);
        $this->initVar('created', \XOBJ_DTYPE_INT, time(), false);
    }

    /**
     * Get formatted title
     *
     * @return string
     */
    public function getTitle(): string
    {
        return $this->getVar('title', 'e');
    }
}
```

### 주요 규칙

| 규칙 | 예 |
|------|---------|
| 클래스 이름 | `PascalCase` |
| 메소드 이름 | `camelCase` |
| 상수 | `UPPER_SNAKE_CASE` |
| 변수 | `$camelCase` |
| 파일 | `ClassName.php` |
| 들여쓰기 | 4칸 |
| 줄 길이 | 최대 120자 |

### Smarty 템플릿

```smarty
{* File: templates/mymodule_index.tpl *}
{* Description: Index page template *}

<{include file="db:mymodule_header.tpl"}>

<div class="mymodule-container">
    <h1><{$page_title}></h1>

    <{if $items|@count > 0}>
        <ul class="item-list">
            <{foreach item=item from=$items}>
                <li class="item">
                    <a href="<{$item.url}>"><{$item.title}></a>
                </li>
            <{/foreach}>
        </ul>
    <{else}>
        <p class="no-items"><{$smarty.const._MD_MYMODULE_NO_ITEMS}></p>
    <{/if}>
</div>

<{include file="db:mymodule_footer.tpl"}>
```

---

## 🔀 Git 워크플로

### 지점 이름 지정

| 유형 | 패턴 | 예 |
|------|---------|---------|
| 기능 | `feature/description` | `feature/add-user-export` |
| 버그수정 | `fix/description` | `fix/login-validation` |
| 핫픽스 | `hotfix/description` | `hotfix/security-patch` |
| 출시 | `release/version` | `release/2.7.0` |

### 커밋 메시지

기존 커밋을 따르세요.

```
<type>(<scope>): <subject>

<body>

<footer>
```

**유형:**
- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서
- `style`: 코드 스타일(서식)
- `refactor`: 코드 리팩토링
- `test`: 테스트 추가
- `chore` : 유지보수

**예:**
```
feat(auth): add two-factor authentication

Implement TOTP-based 2FA for user accounts.
- Add QR code generation for authenticator apps
- Store encrypted secrets in user profile
- Add backup codes feature

Closes #123
```

```
fix(forms): resolve XSS vulnerability in text input

Properly escape user input in XoopsFormText render method.

Security: CVE-2024-XXXX
```

---

## 🧪 테스트 중

### 테스트 실행

```bash
# Run all tests
./vendor/bin/phpunit

# Run specific test suite
./vendor/bin/phpunit --testsuite unit

# Run with coverage
./vendor/bin/phpunit --coverage-html coverage/
```

### 테스트 작성

```php
<?php

namespace XoopsModulesTest\MyModule;

use PHPUnit\Framework\TestCase;
use XoopsModules\MyModule\Item;

class ItemTest extends TestCase
{
    private Item $item;

    protected function setUp(): void
    {
        $this->item = new Item();
    }

    public function testInitialValues(): void
    {
        $this->assertNull($this->item->getVar('id'));
        $this->assertEquals('', $this->item->getVar('title'));
    }

    public function testSetTitle(): void
    {
        $this->item->setVar('title', 'Test Title');
        $this->assertEquals('Test Title', $this->item->getVar('title'));
    }

    public function testTitleEscaping(): void
    {
        $this->item->setVar('title', '<script>alert("xss")</script>');
        $escaped = $this->item->getTitle();
        $this->assertStringNotContainsString('<script>', $escaped);
    }
}
```

---

## 📋 풀 리퀘스트 체크리스트

PR을 제출하기 전에 다음을 확인하세요.

- [ ] 코드는 XOOPS 코딩 표준을 따릅니다.
- [ ] 모든 테스트 통과
- [ ] 새로운 기능에 대한 테스트가 진행 중입니다.
- [ ] 필요한 경우 문서가 업데이트되었습니다.
- [ ] 메인 브랜치와 병합 충돌 없음
- [ ] 커밋 메시지는 설명적입니다.
- [ ] PR 설명에서 변경 사항을 설명합니다.
- [ ] 관련 이슈가 링크되어 있습니다.

---

## 🏗️ 아키텍처 결정 기록

ADR은 중요한 아키텍처 결정을 문서화합니다.

### ADR 템플릿

```markdown
# ADR-XXX: Title

## Status
Proposed | Accepted | Deprecated | Superseded

## Context
What is the issue we're addressing?

## Decision
What is the change being proposed?

## Consequences
What are the positive and negative effects?

## Alternatives Considered
What other options were evaluated?
```

### 현재 ADR

| ADR | 제목 | 상태 |
|-----|-------|--------|
| ADR-001 | 모듈형 아키텍처 | 수락됨 |
| ADR-002 | 객체 지향 데이터베이스 액세스 | 수락됨 |
| ADR-003 | Smarty 템플릿 엔진 | 수락됨 |
| ADR-004 | 보안 시스템 설계 | 수락됨 |
| ADR-005 | PSR-15 미들웨어(4.0.x) | 제안 |

---

## 🎖️인정

기여자는 다음을 통해 인정됩니다.

- **기여자 목록** - 저장소에 나열됨
- **릴리스 노트** - 릴리스에 포함됨
- **명예의 전당** - 뛰어난 기여자
- **모듈 인증** - 모듈 품질 배지

---

## 🔗 관련 문서

- XOOPS 4.0 로드맵
- 핵심 개념
- 모듈 개발

---

## 📚 리소스

- [GitHub 저장소](https://github.com/XOOPS/XoopsCore27)
- [이슈 트래커](https://github.com/XOOPS/XoopsCore27/issues)
- [XOOPS 포럼](https://xoops.org/modules/newbb/)
- [디스코드 커뮤니티](https://discord.gg/xoops)

---

#xoops #기여 #오픈 소스 #커뮤니티 #개발 #코딩 표준
