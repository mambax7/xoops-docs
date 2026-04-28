---
title: "Pull Request Richtlinien"
description: "Richtlinien für das Einreichen von Pull Requests in XOOPS-Projekten"
---

Dieses Dokument bietet umfassende Richtlinien für das Einreichen von Pull Requests in XOOPS-Projekten. Die Befolgung dieser Richtlinien gewährleistet reibungslose Code-Reviews und schnellere Merge-Zeiten.

## Vor dem Erstellen eines Pull Request

### Schritt 1: Bestehende Probleme überprüfen

```
1. Besuche das GitHub Repository
2. Gehe zum Issues Tab
3. Suche nach bestehenden Problemen im Zusammenhang mit deiner Änderung
4. Überprüfe sowohl offene als auch geschlossene Probleme
```

### Schritt 2: Repository forken und klonen

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

### Schritt 3: Feature Branch erstellen

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

### Schritt 4: Deine Änderungen vornehmen

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

### Gute Commit Messages

Verwende klare, aussagekräftige Messages nach diesen Mustern:

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

### Commit Type Kategorien

| Type | Beschreibung | Beispiel |
|------|-------------|---------|
| `feat` | Neue Funktion | `feat: add user dashboard widget` |
| `fix` | Fehlerbehebung | `fix: resolve cache invalidation bug` |
| `docs` | Dokumentation | `docs: update API reference` |
| `style` | Code Style (keine Logik-Änderung) | `style: format imports` |
| `refactor` | Code Umstrukturierung | `refactor: simplify service layer` |
| `perf` | Leistungsverbesserung | `perf: optimize database queries` |
| `test` | Test Änderungen | `test: add integration tests` |
| `chore` | Build/Tooling Änderungen | `chore: update dependencies` |

## Pull Request Beschreibung

### PR Vorlage

```markdown
## Beschreibung
Klare Beschreibung der vorgenommenen Änderungen und warum.

## Änderungstyp
- [ ] Fehlerbehebung
- [ ] Neue Funktion
- [ ] Breaking Change
- [ ] Dokumentation Update

## Verwandte Probleme
Closes #123
Related to #456

## Vorgenommene Änderungen
- Änderung 1
- Änderung 2
- Änderung 3

## Testen
- [ ] Lokal getestet
- [ ] Alle Tests bestanden
- [ ] Neue Tests hinzugefügt
- [ ] Manuelle Test-Schritte eingefügt

## Checkliste
- [ ] Code folgt Style-Richtlinien
- [ ] Selbst-Review abgeschlossen
- [ ] Kommentare für komplexe Logik hinzugefügt
- [ ] Dokumentation aktualisiert
- [ ] Keine neuen Warnings generiert
- [ ] Tests für neue Funktionalität hinzugefügt
- [ ] Alle Tests laufen
```

## Code-Qualitäts-Anforderungen

### Code Style

Befolge Code-Style Richtlinien:

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

## Test-Anforderungen

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

### Tests ausführen

```bash
# Run all tests
vendor/bin/phpunit

# Run specific test file
vendor/bin/phpunit tests/Feature/DatabaseConnectionTest.php

# Run with coverage
vendor/bin/phpunit --coverage-html coverage/
```

## Mit Branches arbeiten

### Branch aktualisiert halten

```bash
# Fetch latest from upstream
git fetch upstream

# Option A: Rebase (preferred for clean history)
git rebase upstream/main

# Option B: Merge (simpler but adds merge commits)
git merge upstream/main

# If conflicts occur, resolve them then:
git add .
git rebase --continue  # or git merge --continue
```

## Pull Request erstellen

### PR Titel Format

```
[Type] Short description (fix/feature/docs)

Examples:
- [FIX] Resolve database connection timeout issue (#123)
- [FEATURE] Implement PSR-7 HTTP message interfaces
- [DOCS] Update API reference for Criteria class
```

## Code Review Prozess

### Worauf Reviewer achten

1. **Korrektheit**
   - Löst der Code das genannte Problem?
   - Werden Edge Cases behandelt?
   - Ist die Fehlerbehandlung angemessen?

2. **Qualität**
   - Folgt es Codierungsstandards?
   - Ist es wartbar?
   - Ist es gut getestet?

3. **Leistung**
   - Irgendwelche Leistungs-Rückgänge?
   - Sind Abfragen optimiert?
   - Ist Speicher-Verwendung angemessen?

4. **Sicherheit**
   - Input Validierung?
   - SQL Injection Prävention?
   - Authentifizierung/Autorisierung?

### Auf Feedback reagieren

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

## Häufige PR Probleme und Lösungen

### Problem 1: PR ist zu groß

**Problem:** Reviewer können massive PRs nicht effektiv überprüfen

**Lösung:** Teile in kleinere PRs auf
- Erster PR: Kern-Änderungen
- Zweiter PR: Tests
- Dritter PR: Dokumentation

### Problem 2: Keine Tests enthalten

**Problem:** Reviewer können Funktionalität nicht verifizieren

**Lösung:** Füge umfassende Tests hinzu, bevor eingereicht wird

### Problem 3: Konflikte mit Main

**Problem:** Dein Branch ist nicht in Sync mit Main

**Lösung:** Rebase auf neueste Main

```bash
git fetch upstream
git rebase upstream/main
git push -f origin your-branch
```

## Nach dem Merge

### Aufräumen

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

## Best Practices Zusammenfassung

### Zu tun

- Aussagekräftige Commit Messages erstellen
- Fokussierte, Single-Purpose PRs machen
- Tests für neue Funktionalität einschließen
- Dokumentation aktualisieren
- Verwandte Probleme referenzieren
- PR Beschreibungen klar halten
- Schnell auf Reviews reagieren

### Nicht tun

- Unverwandte Änderungen einschließen
- Main in deinen Branch mergen (Rebase verwenden)
- Nach Review-Start Force Push
- Tests überspringen
- Work in Progress einreichen
- Code Review Feedback ignorieren

## Verwandte Dokumentation

- ../Contributing - Contributing overview
- Code-Style - Code style guidelines
- ../../03-Module-Development/Best-Practices/Testing - Testing best practices
- ../Architecture-Decisions/ADR-Index - Architectural guidelines

## Ressourcen

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Pull Request Help](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [XOOPS GitHub Organization](https://github.com/XOOPS)

---

**Last Updated:** 2026-01-31
**Applies To:** All XOOPS projects
**Repository:** https://github.com/XOOPS/XOOPS
