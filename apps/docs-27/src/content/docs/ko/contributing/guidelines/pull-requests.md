---
title: "풀 요청 지침"
description: "XOOPS 프로젝트에 풀 요청을 제출하기 위한 지침"
---

이 문서는 XOOPS 프로젝트에 끌어오기 요청을 제출하기 위한 포괄적인 지침을 제공합니다. 이러한 지침을 따르면 원활한 코드 검토와 더 빠른 병합 시간이 보장됩니다.

## Pull Request를 생성하기 전

### 1단계: 기존 문제 확인

```
1. Visit the GitHub repository
2. Go to Issues tab
3. Search for existing issues related to your change
4. Check both open and closed issues
```

### 2단계: 저장소 포크 및 복제

```bash
# Fork the repository on GitHub
# Click "Fork" button on the repository page

# Clone your fork
git clone https://github.com/YOUR_USERNAME/XOOPS.git
cd XOOPS

# Add upstream remote
git remote add upstream https://github.com/XOOPS/XOOPS.git

# Verify remotes
git remote -v
# Should show: origin (your fork) and upstream (official)
```

### 3단계: 기능 분기 생성

```bash
# Update main branch
git fetch upstream
git checkout main
git merge upstream/main

# Create feature branch
# Use descriptive names: bugfix/issue-number or feature/description
git checkout -b bugfix/123-fix-database-connection
git checkout -b feature/add-psr-7-support
```

### 4단계: 변경하기

```bash
# Make changes to your files
# Follow code style guidelines

# Stage changes
git add .

# Commit with clear message
git commit -m "Fix database connection timeout issue"

# Create multiple commits for logical changes
git commit -m "Add connection retry logic"
git commit -m "Improve error messages for debugging"
```

## 커밋 메시지 표준

### 좋은 커밋 메시지

다음 패턴에 따라 명확하고 설명적인 메시지를 사용하세요.

```
# Format
<type>: <subject>

<body>

<footer>

# Example 1: Bug fix
fix: resolve database connection timeout

Add exponential backoff retry mechanism to database connection.
Connections now retry up to 3 times with increasing delays.

Fixes #123
```

```
# Example 2: Feature
feat: implement PSR-7 HTTP message interfaces

Implement Psr\Http\Message interfaces for request/response handling.
Provides type-safe HTTP message handling across the framework.

BREAKING CHANGE: Updated RequestHandler signature
```

### 커밋 유형 카테고리

| 유형 | 설명 | 예 |
|------|-------------|---------|
| `feat` | 새로운 기능 | `feat: add user dashboard widget` |
| `fix` | 버그 수정 | `fix: resolve cache invalidation bug` |
| `docs` | 문서 | `docs: update API reference` |
| `style` | 코드 스타일(로직 변경 없음) | `style: format imports` |
| `refactor` | 코드 리팩토링 | `refactor: simplify service layer` |
| `perf` | 성능향상 | `perf: optimize database queries` |
| `test` | 변경사항 테스트 | `test: add integration tests` |
| `chore` | 빌드/도구 변경 | `chore: update dependencies` |

## 풀 리퀘스트 설명

### 홍보 템플릿

```markdown
## Description
Clear description of changes made and why.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #123
Related to #456

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
- [ ] Tested locally
- [ ] All tests pass
- [ ] Added new tests
- [ ] Manual testing steps included

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Added tests for new functionality
- [ ] All tests passing
```

## 코드 품질 요구 사항

### 코드 스타일

코드 스타일 지침을 따르십시오.

```php
<?php
// Good: PSR-12 style
namespace MyModule\Controller;

use MyModule\Model\Item;
use MyModule\Repository\ItemRepository;

class ItemController
{
    private ItemRepository $repository;

    public function __construct(ItemRepository $repository)
    {
        $this->repository = $repository;
    }

    public function indexAction()
    {
        $items = $this->repository->findAll();
        return $this->render('items', ['items' => $items]);
    }
}
```

## 테스트 요구 사항

### 단위 테스트

```php
// tests/Feature/DatabaseConnectionTest.php
namespace Tests\Feature;

use PHPUnit\Framework\TestCase;
use Xoops\Database\XoopsDatabase;

class DatabaseConnectionTest extends TestCase
{
    private XoopsDatabase $database;

    protected function setUp(): void
    {
        $this->database = new XoopsDatabase();
    }

    public function testConnectionWithValidCredentials()
    {
        $result = $this->database->connect();
        $this->assertTrue($result);
    }

    public function testConnectionWithInvalidCredentials()
    {
        $this->database->setCredentials('invalid', 'invalid');
        $result = $this->database->connect();
        $this->assertFalse($result);
    }
}
```

### 테스트 실행

```bash
# Run all tests
vendor/bin/phpunit

# Run specific test file
vendor/bin/phpunit tests/Feature/DatabaseConnectionTest.php

# Run with coverage
vendor/bin/phpunit --coverage-html coverage/
```

## 지점 작업

### Branch를 최신 상태로 유지하세요

```bash
# Fetch latest from upstream
git fetch upstream

# Rebase on latest main
git rebase upstream/main

# Or merge if you prefer
git merge upstream/main

# Force push if rebased (warning: only on your branch!)
git push -f origin bugfix/123-fix-database-connection
```

## 풀 리퀘스트 생성

### 홍보 제목 형식

```
[Type] Short description (fix/feature/docs)

Examples:
- [FIX] Resolve database connection timeout issue (#123)
- [FEATURE] Implement PSR-7 HTTP message interfaces
- [DOCS] Update API reference for Criteria class
```

## 코드 검토 프로세스

### 리뷰어가 찾는 사항

1. **정확성**
   - 코드가 명시된 문제를 해결합니까?
   - 극단적인 경우는 처리되나요?
   - 오류 처리가 적절한가?

2. **품질**
   - 코딩 표준을 따르는가?
   - 유지보수가 가능한가?
   - 잘 테스트됐나요?

3. **성능**
   - 성능 저하가 있나요?
   - 쿼리가 최적화되어 있나요?
   - 메모리 사용량이 합리적인가?

4. **보안**
   - 입력 유효성 검사?
   - SQL 주입 방지?
   - 인증/승인?

### 피드백에 응답하기

```bash
# Address feedback
# Edit files based on review comments

# Commit changes
git commit -m "Address code review feedback

- Add additional error handling
- Improve test coverage for edge cases
- Update documentation"

# Push changes
git push origin bugfix/123-fix-database-connection
```

## 일반적인 PR 문제 및 솔루션

### 문제 1: PR이 너무 큼

**문제:** 리뷰어가 대규모 PR을 효과적으로 리뷰할 수 없습니다.

**해결책:** 소규모 PR로 세분화
- 첫 번째 PR: 핵심 변경 사항
- 두 번째 PR: 테스트
- 세 번째 PR: 문서

### 문제 2: 테스트가 포함되지 않음

**문제:** 검토자가 기능을 확인할 수 없습니다.

**해결책:** 제출하기 전에 포괄적인 테스트를 추가하세요.

### 문제 3: Main과의 충돌

**문제:** 귀하의 브랜치가 메인과 동기화되지 않았습니다

**해결책:** 최신 메인을 기반으로 리베이스

```bash
git fetch upstream
git rebase upstream/main
git push -f origin your-branch
```

## 병합 후

### 정리

```bash
# Switch to main
git checkout main

# Update main
git pull upstream main

# Delete local branch
git branch -d bugfix/123-fix-database-connection

# Delete remote branch
git push origin --delete bugfix/123-fix-database-connection
```

## 모범 사례 요약

### 해야 할 일

- 설명이 포함된 커밋 메시지 만들기
- 집중적이고 단일 목적의 PR을 작성하세요.
- 새로운 기능에 대한 테스트 포함
- 문서 업데이트
- 참고자료 관련 문제
- PR 설명을 명확하게 유지하세요.
- 리뷰에 신속하게 응답

### 하지 말아야 할 것

- 관련 없는 변경사항 포함
- 메인을 브랜치에 병합하세요(리베이스 사용)
- 검토 시작 후 강제 푸시
- 테스트 건너뛰기
- 진행 중인 작품 제출
- 코드 리뷰 피드백을 무시하세요

## 관련 문서

-../기여 - 기여 개요
- 코드 스타일 - 코드 스타일 지침
-../../03-모듈 개발/모범 사례/테스트 - 모범 사례 테스트
-../Architecture-Decisions/ADR-Index - 아키텍처 지침

## 리소스

- [Git 문서](https://git-scm.com/doc)
- [GitHub 풀 요청 도움말](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests)
- [기존 커밋](https://www.conventionalcommits.org/)
- [XOOPS GitHub 조직](https://github.com/XOOPS)

---

**최종 업데이트:** 2026-01-31
**적용 대상:** 모든 XOOPS 프로젝트
**저장소:** https://github.com/XOOPS/XOOPS
