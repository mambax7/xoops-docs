---
title: "Richtlijnen voor pull-aanvragen"
description: "Richtlijnen voor het indienen van pull-aanvragen bij XOOPS-projecten"
---
Dit document biedt uitgebreide richtlijnen voor het indienen van pull-aanvragen bij XOOPS-projecten. Het volgen van deze richtlijnen zorgt voor soepele codebeoordelingen en snellere samenvoegtijden.

## Voordat u een pull-verzoek aanmaakt

### Stap 1: Controleer op bestaande problemen

```
1. Visit the GitHub repository
2. Go to Issues tab
3. Search for existing issues related to your change
4. Check both open and closed issues
```

### Stap 2: Fork en kloon de repository

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

### Stap 3: Maak een functievertakking

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

### Stap 4: breng uw wijzigingen aan

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

## Commit-berichtstandaarden

### Goede commit-berichten

Gebruik duidelijke, beschrijvende berichten volgens deze patronen:

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

### Categorieën van committypes

| Typ | Beschrijving | Voorbeeld |
|-----|-------------|---------|
| `feat` | Nieuwe functie | `feat: add user dashboard widget` |
| `fix` | Bugfix | `fix: resolve cache invalidation bug` |
| `docs` | Documentatie | `docs: update API reference` |
| `style` | Codestijl (geen logische verandering) | `style: format imports` |
| `refactor` | Herstructurering van code | `refactor: simplify service layer` |
| `perf` | Prestatieverbetering | `perf: optimize database queries` |
| `test` | Wijzigingen testen | `test: add integration tests` |
| `chore` | Wijzigingen in constructie/tooling | `chore: update dependencies` |

## Beschrijving van pull-verzoek

### PR-sjabloon

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

## Codekwaliteitsvereisten

### Codestijl

Volg de Code-Style-richtlijnen:

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

## Testvereisten

### Eenheidstests

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

### Tests uitvoeren

```bash
# Run all tests
vendor/bin/phpunit

# Run specific test file
vendor/bin/phpunit tests/Feature/DatabaseConnectionTest.php

# Run with coverage
vendor/bin/phpunit --coverage-html coverage/
```

## Werken met filialen

### Branch up-to-date houden

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

## Het pull-verzoek maken

### PR-titelformaat

```
[Type] Short description (fix/feature/docs)

Examples:
- [FIX] Resolve database connection timeout issue (#123)
- [FEATURE] Implement PSR-7 HTTP message interfaces
- [DOCS] Update API reference for Criteria class
```

## Codebeoordelingsproces

### Waar recensenten naar op zoek zijn

1. **Juistheid**
   - Lost de code het gestelde probleem op?
   - Worden randgevallen afgehandeld?
   - Is foutafhandeling adequaat?

2. **Kwaliteit**
   - Volgt het de coderingsnormen?
   - Is het onderhoudbaar?
   - Is het goed getest?

3. **Prestaties**
   - Zijn er prestatieregressies?
   - Zijn zoekopdrachten geoptimaliseerd?
   - Is geheugengebruik redelijk?

4. **Beveiliging**
   - Invoervalidatie?
   - SQL injectiepreventie?
   - Authenticatie/autorisatie?

### Reageren op feedback

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

## Veelvoorkomende PR-problemen en oplossingen

### Probleem 1: PR is te groot

**Probleem:** Reviewers kunnen enorme PR's niet effectief beoordelen

**Oplossing:** Verdeel kleinere PR's
- Eerste PR: Kernveranderingen
- Tweede PR: Proeven
- Derde PR: Documentatie

### Probleem 2: Geen tests inbegrepen

**Probleem:** Reviewers kunnen de functionaliteit niet verifiëren

**Oplossing:** Voeg uitgebreide tests toe voordat u deze indient

### Probleem 3: Conflicten met Main

**Probleem:** Uw vertakking is niet gesynchroniseerd met de hoofdtak

**Oplossing:** Rebase op de nieuwste main

```bash
git fetch upstream
git rebase upstream/main
git push -f origin your-branch
```

## Na samenvoegen

### Opruimen

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

## Samenvatting van beste praktijken

### Doen

- Maak beschrijvende commit-berichten
- Maak gerichte PR's voor één doel
- Inclusief tests voor nieuwe functionaliteit
- Documentatie bijwerken
- Referentiegerelateerde problemen
- Houd PR-beschrijvingen duidelijk
- Reageer snel op beoordelingen

### Niet doen

- Voeg niet-gerelateerde wijzigingen toe
- Main samenvoegen met uw branch (gebruik rebase)
- Forceer push nadat de beoordeling is gestart
- Sla tests over
- Werk in uitvoering indienen
- Negeer feedback over codebeoordelingen

## Gerelateerde documentatie

- ../Bijdragen - Bijdragenoverzicht
- Codestijl - Richtlijnen voor codestijl
- ../../03-Module-Development/Best-Practices/Testing - Best practices testen
- ../Architecture-Decisions/ADR-Index - Architectuurrichtlijnen

## Bronnen

- [Git-documentatie](https://git-scm.com/doc)
- [Hulp bij het ophalen van GitHub](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests)
- [Conventionele commits](https://www.conventionalcommits.org/)
- [XOOPS GitHub-organisatie](https://github.com/XOOPS)

---

**Laatst bijgewerkt:** 31-01-2026
**Van toepassing op:** Alle XOOPS-projecten
**Repository:** https://github.com/XOOPS/XOOPS