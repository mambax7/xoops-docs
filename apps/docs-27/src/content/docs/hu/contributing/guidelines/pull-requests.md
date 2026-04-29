---
title: "Lehívási kérés irányelvei"
description: "Irányelvek a lehívási kérelmek XOOPS projektekhez való benyújtásához"
---
Ez a dokumentum átfogó iránymutatást ad a lehívási kérelmek XOOPS projektekhez történő benyújtásához. Ezen irányelvek követése zökkenőmentes kódellenőrzést és gyorsabb egyesítési időt biztosít.

## Lehívási kérelem létrehozása előtt

### 1. lépés: Ellenőrizze a meglévő problémákat

```
1. Visit the GitHub repository
2. Go to Issues tab
3. Search for existing issues related to your change
4. Check both open and closed issues
```

### 2. lépés: Fork és klónozd a tárat

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

### 3. lépés: Hozzon létre egy szolgáltatási ágat

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

### 4. lépés: Végezze el a változtatásokat

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

## Kövesse az üzenetszabványokat

### Good Commit Messages

Use clear, descriptive messages following these patterns:

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

### Commit Type Categories

| Típus | Leírás | Példa |
|------|-------------|---------|
| `feat` | New feature | `feat: add user dashboard widget` |
| `fix` | Bug fix | `fix: resolve cache invalidation bug` |
| `docs` | Dokumentáció | `docs: update API reference` |
| `style` | Kódstílus (nincs logikai változás) | `style: format imports` |
| `refactor` | Code refactoring | `refactor: simplify service layer` |
| `perf` | Teljesítményjavítás | `perf: optimize database queries` |
| `test` | Test changes | `test: add integration tests` |
| `chore` | Build/tooling változások | `chore: update dependencies` |

## Leírás kérése

### PR Template

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

## Kódminőségi követelmények

### Code Style

Kövesse a kódstílusra vonatkozó irányelveket:

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

## Testing Requirements

### Unit Tests

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

### Running Tests

```bash
# Run all tests
vendor/bin/phpunit

# Run specific test file
vendor/bin/phpunit tests/Feature/DatabaseConnectionTest.php

# Run with coverage
vendor/bin/phpunit --coverage-html coverage/
```

## Working with Branches

### Keep Branch Updated

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

## Lehúzási kérelem létrehozása

### PR Title Format

```
[Type] Short description (fix/feature/docs)

Examples:
- [FIX] Resolve database connection timeout issue (#123)
- [FEATURE] Implement PSR-7 HTTP message interfaces
- [DOCS] Update API reference for Criteria class
```

## Code Review Process

### Amit a bírálók keresnek

1. **Correctness**
   - Megoldja a kód a feltett problémát?
   - Az éles ügyeket kezelik?
   - Is error handling appropriate?

2. **Quality**
   - Követi a kódolási szabványokat?
   - Is it maintainable?
   - Is it well-tested?

3. **Performance**
   - Valami visszaesés a teljesítményben?
   - Are queries optimized?
   - Ésszerű a memóriahasználat?

4. **Security**
   - Input validation?
   - SQL injekció megelőzés?
   - Authentication/authorization?

### Válasz a visszajelzésre

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

## Gyakori PR-problémák és megoldások

### 1. probléma: A PR túl nagy

**Probléma:** A bírálók nem tudják hatékonyan felülvizsgálni a hatalmas PR-eket

**Megoldás:** Szakadjon kisebb PR-kra
- First PR: Core changes
- Second PR: Tests
- Harmadik PR: Dokumentáció

### 2. probléma: Nincsenek tesztek

**Probléma:** Az ellenőrök nem tudják ellenőrizni a működőképességet

**Megoldás:** A beküldés előtt adjon hozzá átfogó teszteket

### 3. probléma: Ütközés a fővel

**Problem:** Your branch is out of sync with main

**Megoldás:** Rebase a legújabb fő

```bash
git fetch upstream
git rebase upstream/main
git push -f origin your-branch
```

## After Merge

### Cleanup

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

## A legjobb gyakorlatok összefoglalása

### Do's

- Leíró véglegesítési üzenetek létrehozása
- Fókuszált, egycélú PR-ok készítése
- Tartalmazzon teszteket az új funkciókhoz
- Update documentation
- Referenciával kapcsolatos kérdések
- Tartsa világosan a PR-leírásokat
- Gyorsan válaszoljon a véleményekre

### Don'ts

- Tartalmazzon nem kapcsolódó változtatásokat
- A fő egyesítése a fiókteleppel (rebase használata)
- Kényszernyomás a felülvizsgálat megkezdése után
- Skip tests
- A folyamatban lévő munkák benyújtása
- A kódellenőrzési visszajelzés figyelmen kívül hagyása

## Kapcsolódó dokumentáció

- ../Contributing - Áttekintés
- Kódstílus - Kódstílus irányelvek
- ../../03-module-Development/Best-Practices/Testing - A legjobb gyakorlatok tesztelése
- ../Architecture-Decisions/ADR-Index - Építészeti irányelvek

## Resources

- [Git-dokumentáció](https://git-scm.com/doc)
- [GitHub Pull Request Help](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests)
- [Hagyományos kötelezettségvállalások](https://www.conventionalcommits.org/)
- [XOOPS GitHub szervezet](https://github.com/XOOPS)

---

**Utolsó frissítés:** 2026.01.31
**Érvényes:** Minden XOOPS projekt
**Leraktár:** https://github.com/XOOPS/XOOPS
