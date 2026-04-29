---
title: "Smjernice za zahtjev za povlačenje"
description: "Smjernice za podnošenje zahtjeva za povlačenje projektima XOOPS"
---
Ovaj dokument pruža sveobuhvatne smjernice za podnošenje zahtjeva za povlačenje projektima XOOPS. Slijeđenje ovih smjernica osigurava glatke preglede koda i brže spajanje.

## Prije stvaranja zahtjeva za povlačenje

### Korak 1: Provjerite postoje li problemi

```
1. Visit the GitHub repository
2. Go to Issues tab
3. Search for existing issues related to your change
4. Check both open and closed issues
```

### Korak 2: račvajte i klonirajte spremište

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

### Korak 3: Stvorite granu značajki

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

### Korak 4: Unesite svoje promjene

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

## Standardi poruka o uvrštavanju

### Dobre poruke predaje

Koristite jasne, opisne poruke slijedeći ove obrasce:

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

### Kategorije tipa uvrštavanja

| Upišite | Opis | Primjer |
|------|-------------|---------|
| `feat` | Nova značajka | `feat: add user dashboard widget` |
| `fix` | Ispravak pogreške | `fix: resolve cache invalidation bug` |
| `docs` | Dokumentacija | `docs: update API reference` |
| `style` | Stil koda (bez promjene logike) | `style: format imports` |
| `refactor` | Prerađivanje koda | `refactor: simplify service layer` |
| `perf` | Poboljšanje performansi | `perf: optimize database queries` |
| `test` | Promjene testa | `test: add integration tests` |
| `chore` | Izrada/promjene alata | `chore: update dependencies` |

## Opis zahtjeva za povlačenjem

### PR predložak

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

## Zahtjevi kvalitete koda

### Stil koda

Slijedite smjernice Code-Stylea:

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

## Zahtjevi za testiranje

### Jedinični testovi

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

### Izvođenje testova

```bash
# Run all tests
vendor/bin/phpunit

# Run specific test file
vendor/bin/phpunit tests/Feature/DatabaseConnectionTest.php

# Run with coverage
vendor/bin/phpunit --coverage-html coverage/
```

## Rad s podružnicama

### Držite podružnicu ažuriranom

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

## Stvaranje zahtjeva za povlačenjem

### PR Format naslova

```
[Type] Short description (fix/feature/docs)

Examples:
- [FIX] Resolve database connection timeout issue (#123)
- [FEATURE] Implement PSR-7 HTTP message interfaces
- [DOCS] Update API reference for Criteria class
```

## Proces pregleda koda

### Što recenzenti traže

1. **Ispravnost**
   - Rješava li kod navedeni problem?
   - Obrađuju li se rubni slučajevi?
   - Je li rukovanje pogreškama primjereno?

2. **Kvaliteta**
   - Prati li standarde kodiranja?
   - Može li se održavati?
   - Je li dobro ispitan?

3. **Performanse**
   - Ima li regresija performansi?
   - Jesu li upiti optimizirani?
   - Je li korištenje memorije razumno?

4. **Sigurnost**
   - Validacija unosa?
   - SQL sprječavanje ubrizgavanja?
   - Autentifikacija/autorizacija?

### Odgovaranje na povratne informacije

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

## Uobičajeni PR problemi i rješenja

### Problem 1: PR je prevelik

**Problem:** Recenzenti ne mogu učinkovito pregledati masovne PR-ove

**Rješenje:** Podijelite se na manje PR-ove
- Prvi PR: Temeljne promjene
- Drugi PR: Testovi
- Treći PR: Dokumentacija

### Problem 2: Testovi nisu uključeni

**Problem:** recenzenti ne mogu provjeriti funkcionalnost

**Rješenje:** dodajte opsežne testove prije slanja

### Problem 3: Sukobi s glavnim

**Problem:** Vaša grana nije sinkronizirana s glavnom

**Rješenje:** Rebase na najnoviji glavni

```bash
git fetch upstream
git rebase upstream/main
git push -f origin your-branch
```

## Nakon spajanja

### Čišćenje

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

## Sažetak najboljih praksi

### Što učiniti

- Stvorite opisne poruke predaje
- Napravite fokusirane PR-ove s jednom svrhom
- Uključite testove za novu funkcionalnost
- Ažuriranje dokumentacije
- Pitanja povezana s referencama
- PR opisi neka budu jasni
- Brzo odgovarajte na recenzije

### Nemojte

- Uključi nepovezane promjene
- Spojite main u svoju granu (koristite rebase)
- Prisilni pritisak nakon početka pregleda
- Preskoči testove
- Pošaljite radove u tijeku
- Zanemarite povratne informacije o pregledu koda

## Povezana dokumentacija- ../Doprinos - Pregled doprinosa
- Code-Style - Smjernice za stil koda
- ../../03-Module-Development/Best-Practices/Testing - Najbolje prakse testiranja
- ../Architecture-Decisions/ADR-Index - Arhitektonske smjernice

## Resursi

- [Git dokumentacija](https://git-scm.com/doc)
- [Pomoć za GitHub zahtjev za povlačenjem](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests)
- [Konvencionalna predaja](https://www.conventionalcommits.org/)
- [XOOPS GitHub organizacija](https://github.com/XOOPS)

---

**Zadnje ažuriranje:** 2026-01-31
**Odnosi se na:** Sve XOOPS projekte
**Repozitorij:** https://github.com/XOOPS/XOOPS
