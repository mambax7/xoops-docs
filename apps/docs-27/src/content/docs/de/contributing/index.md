---
title: "Contributing Guidelines"
description: "Wie man zu XOOPS CMS Entwicklung beiträgt, Codierungsstandards und Community-Richtlinien"
---

# Beitragen zu XOOPS

> Tritt der XOOPS-Gemeinschaft bei und hilf, sie zum besten CMS der Welt zu machen.

---

## Übersicht

XOOPS ist ein Open-Source-Projekt, das von Gemeinschaftsbeiträgen lebt. Ob du Fehler behebst, Funktionen hinzufügst, Dokumentation verbesserst oder anderen hilfst, deine Beiträge sind wertvoll.

---

## Inhaltsübersicht

### Richtlinien
- Code of Conduct
- Contribution Workflow
- Pull Request Guidelines
- Issue Reporting

### Code Style
- PHP Coding Standards
- JavaScript Standards
- CSS Guidelines
- Smarty Template Standards

### Architektur Entscheidungen
- ADR Index
- ADR Template
- ADR-001: Modular Architecture
- ADR-002: Database Abstraction

---

## Erste Schritte

### 1. Entwicklungsumgebung einrichten

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

### 2. Feature Branch erstellen

```bash
# Sync with upstream
git fetch upstream
git checkout -b feature/my-feature upstream/main
```

### 3. Änderungen vornehmen

Folge den Codierungsstandards und schreibe Tests für neue Funktionen.

### 4. Pull Request einreichen

```bash
# Commit changes
git add .
git commit -m "Add: Brief description of changes"

# Push to your fork
git push origin feature/my-feature
```

Erstelle dann einen Pull Request auf GitHub.

---

## Codierungsstandards

### PHP Standards

XOOPS folgt PSR-1, PSR-4 und PSR-12 Codierungsstandards.

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

### Wichtige Konventionen

| Regel | Beispiel |
|------|---------|
| Klassennamen | `PascalCase` |
| Methodennamen | `camelCase` |
| Konstanten | `UPPER_SNAKE_CASE` |
| Variablen | `$camelCase` |
| Dateien | `ClassName.php` |
| Einrückung | 4 Leerzeichen |
| Zeilenlänge | Max 120 Zeichen |

### Smarty Templates

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

## Git Workflow

### Branch Benennung

| Type | Muster | Beispiel |
|------|---------|---------|
| Feature | `feature/description` | `feature/add-user-export` |
| Bugfix | `fix/description` | `fix/login-validation` |
| Hotfix | `hotfix/description` | `hotfix/security-patch` |
| Release | `release/version` | `release/2.7.0` |

### Commit Messages

Folge Conventional Commits:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: Neue Funktion
- `fix`: Fehlerbehebung
- `docs`: Dokumentation
- `style`: Code Style (Formatierung)
- `refactor`: Code Umstrukturierung
- `test`: Tests hinzufügen
- `chore`: Wartung

**Beispiele:**
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

## Testen

### Tests ausführen

```bash
# Run all tests
./vendor/bin/phpunit

# Run specific test suite
./vendor/bin/phpunit --testsuite unit

# Run with coverage
./vendor/bin/phpunit --coverage-html coverage/
```

### Tests schreiben

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

## Pull Request Checkliste

Vor dem Einreichen eines PR, stelle sicher:

- [ ] Code folgt XOOPS Codierungsstandards
- [ ] Alle Tests bestehen
- [ ] Neue Funktionen haben Tests
- [ ] Dokumentation aktualisiert falls nötig
- [ ] Keine Merge Konflikte mit Main Branch
- [ ] Commit Messages sind aussagekräftig
- [ ] PR Beschreibung erklärt Änderungen
- [ ] Verwandte Probleme sind verlinkt

---

## Architektur Decision Records

ADRs dokumentieren signifikante Architektur-Entscheidungen.

### ADR Vorlage

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

### Aktuelle ADRs

| ADR | Titel | Status |
|-----|-------|--------|
| ADR-001 | Modular Architecture | Accepted |
| ADR-002 | Object-Oriented Database Access | Accepted |
| ADR-003 | Smarty Template Engine | Accepted |
| ADR-004 | Security System Design | Accepted |
| ADR-005 | PSR-15 Middleware (4.0.x) | Proposed |

---

## Anerkennung

Beiträger werden anerkannt durch:

- **Contributors List** - Aufgelistet im Repository
- **Release Notes** - Gutgeschrieben in Releases
- **Hall of Fame** - Außergewöhnliche Beiträger
- **Module Certification** - Qualitäts-Badge für Module

---

## Verwandte Dokumentation

- XOOPS 4.0 Roadmap
- Core Concepts
- Module Development

---

## Ressourcen

- [GitHub Repository](https://github.com/XOOPS/XoopsCore27)
- [Issue Tracker](https://github.com/XOOPS/XoopsCore27/issues)
- [XOOPS Forums](https://xoops.org/modules/newbb/)
- [Discord Community](https://discord.gg/xoops)

---

#xoops #contributing #open-source #community #development #coding-standards
