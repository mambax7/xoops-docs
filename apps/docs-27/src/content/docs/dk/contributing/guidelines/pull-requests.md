---
title: "Pull Request Guidelines"
description: "Retningslinjer for indsendelse af pull-anmodninger til XOOPS-projekter"
---

Dette dokument giver omfattende retningslinjer for indsendelse af pull-anmodninger til XOOPS-projekter. At følge disse retningslinjer sikrer jævne kodegennemgange og hurtigere flettetider.

## Før du opretter en pull-anmodning

### Trin 1: Tjek for eksisterende problemer

```
1. Visit the GitHub repository
2. Go to Issues tab
3. Search for existing issues related to your change
4. Check both open and closed issues
```

### Trin 2: Fordel og klon depotet

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

### Trin 3: Opret en funktionsgren

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

### Trin 4: Foretag dine ændringer

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

## Commit Message Standards

### Gode forpligtelsesbeskeder

Brug klare, beskrivende budskaber efter disse mønstre:

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

### Commit Type Kategorier

| Skriv | Beskrivelse | Eksempel |
|------|-------------|--------|
| `feat` | Ny funktion | `feat: add user dashboard widget` |
| `fix` | Fejlrettelse | `fix: resolve cache invalidation bug` |
| `docs` | Dokumentation | `docs: update API reference` |
| `style` | Kodestil (ingen logisk ændring) | `style: format imports` |
| `refactor` | Kode refactoring | `refactor: simplify service layer` |
| `perf` | Ydeevneforbedring | `perf: optimize database queries` |
| `test` | Test ændringer | `test: add integration tests` |
| `chore` | Byg/værktøjsændringer | `chore: update dependencies` |

## Pull Request Description

### PR skabelon

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

## Kodekvalitetskrav

### Kodestil

Følg retningslinjerne for kodestil:

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

## Testkrav

### Enhedstest

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

### Løbende tests

```bash
# Run all tests
vendor/bin/phpunit

# Run specific test file
vendor/bin/phpunit tests/Feature/DatabaseConnectionTest.php

# Run with coverage
vendor/bin/phpunit --coverage-html coverage/
```

## Arbejde med filialer

### Hold filial opdateret

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

## Oprettelse af Pull-anmodningen

### PR-titelformat

```
[Type] Short description (fix/feature/docs)

Examples:
- [FIX] Resolve database connection timeout issue (#123)
- [FEATURE] Implement PSR-7 HTTP message interfaces
- [DOCS] Update API reference for Criteria class
```

## Kodegennemgangsproces

### Hvad anmeldere leder efter

1. **Korrekthed**
   - Løser koden det angivne problem?
   - Behandles kantsager?
   - Er fejlhåndtering hensigtsmæssig?

2. **Kvalitet**
   - Følger den kodningsstandarder?
   - Kan det vedligeholdes?
   - Er det gennemtestet?

3. **Ydeevne**
   - Nogen præstationsregressioner?
   - Er forespørgsler optimeret?
   - Er hukommelsesforbruget rimeligt?

4. **Sikkerhed**
   - Input validering?
   - SQL injektionsforebyggelse?
   - Godkendelse/autorisation?

### Svar på feedback

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

## Almindelige PR-problemer og løsninger

### Problem 1: PR er for stor

**Problem:** Anmeldere kan ikke gennemgå massive PR'er effektivt

**Løsning:** Bryd op i mindre PR'er
- Første PR: Kerneændringer
- Anden PR: Tests
- Tredje PR: Dokumentation

### Udgave 2: Ingen test inkluderet

**Problem:** Anmeldere kan ikke bekræfte funktionaliteten

**Løsning:** Tilføj omfattende test, før du indsender

### Problem 3: Konflikter med Main

**Problem:** Din filial er ude af synkronisering med main

**Løsning:** Rebase på seneste main

```bash
git fetch upstream
git rebase upstream/main
git push -f origin your-branch
```

## Efter fletning

### Oprydning

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

## Oversigt over bedste praksis

### Gøre

- Opret beskrivende forpligtelsesbeskeder
- Lav fokuserede PR'er til en enkelt formål
- Inkluder test for ny funktionalitet
- Opdater dokumentation
- Referencerelaterede spørgsmål
- Hold PR-beskrivelser klare
- Svar omgående på anmeldelser

### Lad være

- Inkluder ikke-relaterede ændringer
- Flet main ind i din filial (brug rebase)
- Force push efter gennemgang starter
- Spring prøver over
- Indsend igangværende arbejde
- Ignorer feedback om kodegennemgang

## Relateret dokumentation

- ../Contributing - Bidragende overblik
- Code-Style - Code stil retningslinjer
- ../../03-Module-Development/Best-Practices/Testing - Test af bedste praksis
- ../Architecture-Decisions/ADR-Index - Arkitektoniske retningslinjer

## Ressourcer

- [Git-dokumentation](https://git-scm.com/doc)
- [GitHub Pull Request Help](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [XOOPS GitHub organisation](https://github.com/XOOPS)

---

**Sidst opdateret:** 31-01-2026
**Gælder:** Alle XOOPS-projekter
**Repository:** https://github.com/XOOPS/XOOPS
