---
title: "Smernice za zahtevo za vlečenje"
description: "Smernice za oddajo zahtevkov za vlečenje za XOOPS projektov"
---
Ta dokument vsebuje izčrpne smernice za oddajo zahtevkov za vlečenje za XOOPS projektov. Upoštevanje teh smernic zagotavlja gladke preglede kode in hitrejše spajanje.

## Pred ustvarjanjem zahteve za vlečenje

### 1. korak: Preverite obstoječe težave
```
1. Visit the GitHub repository
2. Go to Issues tab
3. Search for existing issues related to your change
4. Check both open and closed issues
```
### 2. korak: Razcepite in klonirajte repozitorij
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
### 3. korak: Ustvarite vejo funkcij
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
### 4. korak: Izvedite svoje spremembe
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
## Standardi sporočila potrditve

### Dobra sporočila o potrditvi

Uporabite jasna, opisna sporočila po teh vzorcih:
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
### Kategorije vrste potrditve

| Vrsta | Opis | Primer |
|------|-------------|---------|
| `feat` | Nova funkcija | `feat: add user dashboard widget` |
| `fix` | Popravek napak | `fix: resolve cache invalidation bug` |
| `docs` | Dokumentacija | `docs: update API reference` |
| `style` | Slog kode (brez logične spremembe) | `style: format imports` |
| `refactor` | Preoblikovanje kode | `refactor: simplify service layer` |
| `perf` | Izboljšanje zmogljivosti | `perf: optimize database queries` |
| `test` | Testne spremembe | `test: add integration tests` |
| `chore` | Build/tooling spremembe | `chore: update dependencies` |

## Opis zahteve za vleko

### PR predloga
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
## Zahteve glede kakovosti kode

### Slog kode

Sledite smernicam Code-Style:
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
## Zahteve za testiranje

### Preizkusi enot
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
### Izvajanje testov
```bash
# Run all tests
vendor/bin/phpunit

# Run specific test file
vendor/bin/phpunit tests/Feature/DatabaseConnectionTest.php

# Run with coverage
vendor/bin/phpunit --coverage-html coverage/
```
## Delo s podružnicami

### Naj bo veja posodobljena
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
## Ustvarjanje zahteve za vlečenje

### PR oblika naslova
```
[Type] Short description (fix/feature/docs)

Examples:
- [FIX] Resolve database connection timeout issue (#123)
- [FEATURE] Implement PSR-7 HTTP message interfaces
- [DOCS] Update API reference for Criteria class
```
## Postopek pregleda kode

### Kaj pregledovalci iščejo

1. **Korektnost**
   - Ali koda rešuje navedeni problem?
   - Ali se obravnavajo robni primeri?
   - Ali je obravnava napak primerna?

2. **Kakovost**
   - Ali sledi standardom kodiranja?
   - Ali ga je mogoče vzdrževati?
   - Ali je dobro preizkušen?

3. **Zmogljivost**
   - Kakšna regresija uspešnosti?
   – Ali so poizvedbe optimizirane?
   - Ali je uporaba pomnilnika razumna?

4. **Varnost**
   - Preverjanje vnosa?
   - SQL preprečevanje vbrizgavanja?
   - Authentication/authorization?

### Odgovarjanje na povratne informacije
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
## Pogoste težave z odnosi z javnostmi in rešitve

### 1. težava: PR je prevelik

**Težava:** Pregledovalci ne morejo učinkovito pregledati množičnih PR-jev

**Rešitev:** Razdelite se na manjše PR-je
- Prvi PR: Temeljne spremembe
- Drugi PR: Testi
- Tretji PR: Dokumentacija

### 2. težava: testi niso vključeni

**Težava:** Pregledovalci ne morejo preveriti funkcionalnosti

**Rešitev:** Pred oddajo dodajte obsežne teste

### Težava 3: Konflikti z glavnim

**Težava:** Vaša veja ni sinhronizirana z glavno

**Rešitev:** Ponovno nastavite na najnovejšo glavno
```bash
git fetch upstream
git rebase upstream/main
git push -f origin your-branch
```
## Po spajanju

### Čiščenje
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
## Povzetek najboljših praks

### Naredi

- Ustvarite opisna sporočila o objavi
- Ustvarite osredotočene, enonamenske PR-je
- Vključite teste za novo funkcionalnost
- Posodobite dokumentacijo
- Težave, povezane z referencami
- Opisi PR naj bodo jasni
- Hitro se odzovite na ocene

### Ne

- Vključite nepovezane spremembe
- Spojite main v svojo vejo (uporabite rebase)
- Prisilni pritisk po začetku pregleda
- Preskoči teste
- Predloži delo v teku
- Ignorirajte povratne informacije o pregledu kode

## Povezana dokumentacija

- ../Contributing - Pregled prispevanja
- Code-Style - Smernice za slog kode
- ../../03-Module-Development/Best-Practices/Testing - Testiranje najboljših praks
- ../Architecture-Decisions/ADR-Index - Arhitekturne smernice

## Viri

- [Dokumentacija Git](https://git-scm.com/doc)
- [Pomoč za zahtevo po vleki GitHub](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests)
- [Konvencionalne objave](https://www.conventionalcommits.org/)
- [XOOPS Organizacija GitHub](https://github.com/XOOPS)

---

**Nazadnje posodobljeno:** 2026-01-31
**Velja za:** Vse XOOPS projekte
**Repozitorij:** https://github.com/XOOPS/XOOPS