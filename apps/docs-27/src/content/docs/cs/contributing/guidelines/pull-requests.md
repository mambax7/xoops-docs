---
title: "Vytáhněte pokyny k žádosti"
description: "Pokyny pro odesílání žádostí o stažení do projektů XOOPS"
---

Tento dokument poskytuje komplexní pokyny pro odesílání žádostí o stažení do projektů XOOPS. Dodržování těchto pokynů zajišťuje hladké kontroly kódu a rychlejší slučování.

## Před vytvořením požadavku na stažení

### Krok 1: Zkontrolujte existující problémy

```
1. Visit the GitHub repository
2. Go to Issues tab
3. Search for existing issues related to your change
4. Check both open and closed issues
```

### Krok 2: Rozvětvete a klonujte úložiště

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

### Krok 3: Vytvořte větev funkcí

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

### Krok 4: Proveďte změny

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

## Standardy pro zprávy

### Dobré zprávy o závazcích

Používejte jasné a popisné zprávy podle těchto vzorů:

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

### Kategorie typu závazku

| Typ | Popis | Příklad |
|------|-------------|---------|
| `feat` | Nová funkce | `feat: add user dashboard widget` |
| `fix` | Oprava chyby | `fix: resolve cache invalidation bug` |
| `docs` | Dokumentace | `docs: update API reference` |
| `style` | Styl kódu (bez změny logiky) | `style: format imports` |
| `refactor` | Refaktoring kódu | `refactor: simplify service layer` |
| `perf` | Zlepšení výkonu | `perf: optimize database queries` |
| `test` | Testovací změny | `test: add integration tests` |
| `chore` | Build/tooling změny | `chore: update dependencies` |

## Vytáhněte popis požadavku

### Šablona PR

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

## Požadavky na kvalitu kódu

### Styl kódu

Postupujte podle pokynů pro styl kódu:

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

## Požadavky na testování

### Unit Tests

```php
// tests/Feature/DatabaseConnectionTest.php
namespace Tests\Feature;

use PHPUnit\Framework\TestCase;
use XOOPS\Database\XOOPSDatabase;

class DatabaseConnectionTest extends TestCase
{
    private XOOPSDatabase $database;

    protected function setUp(): void
    {
        $this->database = new XOOPSDatabase();
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

### Probíhající testy

```bash
# Run all tests
vendor/bin/phpunit

# Run specific test file
vendor/bin/phpunit tests/Feature/DatabaseConnectionTest.php

# Run with coverage
vendor/bin/phpunit --coverage-html coverage/
```

## Práce s pobočkami

### Udržujte větev aktualizovanou

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

## Vytvoření požadavku na stažení

### Formát názvu PR

```
[Type] Short description (fix/feature/docs)

Examples:
- [FIX] Resolve database connection timeout issue (#123)
- [FEATURE] Implement PSR-7 HTTP message interfaces
- [DOCS] Update API reference for Criteria class
```

## Proces kontroly kódu

### Co recenzenti hledají

1. **Správnost**
   - Řeší kód uvedený problém?
   - Jsou řešeny okrajové případy?
   - Je správné řešení chyb?

2. **Kvalita**
   - Dodržuje kódovací standardy?
   - Dá se to udržovat?
   - Je to dobře otestované?

3. **Výkon**
   - Nějaké regrese výkonu?
   - Jsou dotazy optimalizovány?
   - Je využití paměti rozumné?

4. **Zabezpečení**
   - Ověření vstupu?
   - Prevence vstřikování SQL?
   - Authentication/authorization?

### Reakce na zpětnou vazbu

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

## Běžné PR problémy a řešení

### Problém 1: PR je příliš velký

**Problém:** Recenzenti nemohou efektivně revidovat masivní PR

**Řešení:** Rozdělte se na menší PR
- První PR: Základní změny
- Druhý PR: Testy
- Třetí PR: Dokumentace

### Problém 2: Nejsou zahrnuty žádné testy

**Problém:** Recenzenti nemohou ověřit funkčnost

**Řešení:** Před odesláním přidejte komplexní testy

### Problém 3: Konflikty s Main

**Problém:** Vaše větev není synchronizovaná s main

**Řešení:** Rebase na nejnovější hlavní

```bash
git fetch upstream
git rebase upstream/main
git push -f origin your-branch
```

## Po sloučení

### Úklid

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

## Shrnutí osvědčených postupů

### Dělejte

- Vytvářejte popisné zprávy o odevzdání
- Vytvářejte cílená, jednoúčelová PR
- Zahrnout testy pro nové funkce
- Aktualizace dokumentace
- Reference související problémy
- Udržujte jasné popisy PR
- Okamžitě reagujte na recenze

### Ne

- Zahrnout nesouvisející změny
- Sloučit hlavní do své pobočky (použít rebase)
- Vynutit zatlačení po zahájení kontroly
- Přeskočit testy
- Odešlete nedokončenou práci
- Ignorujte zpětnou vazbu při kontrole kódu

## Související dokumentace

- ../Contributing - Přehled přispívajících
- Styl kódu - Pokyny pro styl kódu
- ../../03-Module-Development/Best-Practices/Testing - Testování osvědčených postupů
- ../Architecture-Decisions/ADR-Index - Architektonické směrnice

## Zdroje

- [Dokumentace Git](https://git-scm.com/doc)
- [GitHub Nápověda k žádosti o stažení](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests)
- [Konvenční závazky](https://www.conventionalcommits.org/)
- [XOOPS GitHub Organizace](https://github.com/XOOPS)

---

**Poslední aktualizace:** 2026-01-31
**Platí pro:** Všechny projekty XOOPS
**Úložiště:** https://github.com/XOOPS/XOOPS