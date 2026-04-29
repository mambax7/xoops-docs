---
title: "Richtlijnen voor bijdragen"
description: "Hoe u kunt bijdragen aan de ontwikkeling, codeerstandaarden en communityrichtlijnen van XOOPS CMS"
---
# 🤝 Bijdragen aan XOOPS

> Sluit u aan bij de XOOPS-gemeenschap en help mee om er de beste CMS ter wereld van te maken.

---

## 📋 Overzicht

XOOPS is een open-sourceproject dat gedijt op bijdragen van de gemeenschap. Of u nu bugs oplost, functies toevoegt, documentatie verbetert of anderen helpt, uw bijdragen zijn waardevol.

---

## 🗂️ Sectie-inhoud

### Richtlijnen
- Gedragscode
- Bijdrageworkflow
- Richtlijnen voor pull-aanvragen
- Probleemrapportage

### Codestijl
- PHP Coderingsnormen
- JavaScript-standaarden
- CSS-richtlijnen
- Smarty-sjabloonnormen

### Architectuurbeslissingen
- ADR-index
- ADR-sjabloon
- ADR-001: modulaire architectuur
- ADR-002: Database-abstractie

---

## 🚀 Aan de slag

### 1. Ontwikkelomgeving instellen

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

### 2. Maak een functievertakking

```bash
# Sync with upstream
git fetch upstream
git checkout -b feature/my-feature upstream/main
```

### 3. Breng wijzigingen aan

Volg de codeerstandaarden en schrijf tests voor nieuwe functies.

### 4. Dien een pull-verzoek in

```bash
# Commit changes
git add .
git commit -m "Add: Brief description of changes"

# Push to your fork
git push origin feature/my-feature
```

Maak vervolgens een Pull Request op GitHub.

---

## 📝 Coderingsnormen

### PHP-normen

XOOPS volgt de coderingsstandaarden PSR-1, PSR-4 en PSR-12.

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

### Belangrijke conventies

| Regel | Voorbeeld |
|------|---------|
| Klassenamen | `PascalCase` |
| Methodenamen | `camelCase` |
| Constanten | `UPPER_SNAKE_CASE` |
| Variabelen | `$camelCase` |
| Bestanden | `ClassName.php` |
| Inspringing | 4 spaties |
| Lijnlengte | Maximaal 120 tekens |

### Smarty-sjablonen

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

## 🔀 Git-workflow

### Taknaamgeving

| Typ | Patroon | Voorbeeld |
|------|---------|---------|
| Kenmerk | `feature/description` | `feature/add-user-export` |
| Bugfix | `fix/description` | `fix/login-validation` |
| Hotfix | `hotfix/description` | `hotfix/security-patch` |
| Vrijgeven | `release/version` | `release/2.7.0` |

### Commit-berichten

Volg conventionele commits:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Soorten:**
- `feat`: nieuwe functie
- `fix`: bugfix
- `docs`: Documentatie
- `style`: Codestijl (opmaak)
- `refactor`: Coderefactoring
- `test`: Tests toevoegen
- `chore`: Onderhoud

**Voorbeelden:**
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

## 🧪 Testen

### Tests uitvoeren

```bash
# Run all tests
./vendor/bin/phpunit

# Run specific test suite
./vendor/bin/phpunit --testsuite unit

# Run with coverage
./vendor/bin/phpunit --coverage-html coverage/
```

### Tests schrijven

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

## 📋 Controlelijst voor pull-aanvragen

Voordat u een PR indient, moet u ervoor zorgen dat:

- [ ] Code volgt de coderingsstandaarden XOOPS
- [ ] Alle tests zijn geslaagd
- [ ] Nieuwe functies hebben tests
- [ ] Documentatie bijgewerkt indien nodig
- [ ] Geen samenvoegconflicten met de hoofdtak
- [ ] Commit-berichten zijn beschrijvend
- [ ] PR-beschrijving legt wijzigingen uit
- [ ] Gerelateerde problemen zijn met elkaar verbonden

---

## 🏗️ Architectuurbeslissingsrecords

ADR's documenteren belangrijke architecturale beslissingen.

### ADR-sjabloon

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

### Huidige bijwerkingen

| ADR | Titel | Staat |
|-----|-------|--------|
| ADR-001 | Modulaire architectuur | Geaccepteerd |
| ADR-002 | Objectgeoriënteerde databasetoegang | Geaccepteerd |
| ADR-003 | Smarty-sjabloonengine | Geaccepteerd |
| ADR-004 | Ontwerp van beveiligingssysteem | Geaccepteerd |
| ADR-005 | PSR-15 Middleware (4.0.x) | Voorgesteld |

---

## 🎖️Erkenning

Bijdragers worden erkend door:

- **Bijdragerslijst** - Vermeld in de repository
- **Releaseopmerkingen** - Gecrediteerd in releases
- **Hall of Fame** - Uitstekende bijdragers
- **Modulecertificering** - Kwaliteitsbadge voor modules

---

## 🔗 Gerelateerde documentatie

- XOOPS 4.0-routekaart
- Kernconcepten
- Moduleontwikkeling

---

## 📚 Hulpbronnen

- [GitHub-opslagplaats](https://github.com/XOOPS/XoopsCore27)
- [Probleemtracker](https://github.com/XOOPS/XoopsCore27/issues)
- [XOOPS-forums](https://xoops.org/modules/newbb/)
- [Discord-gemeenschap](https://discord.gg/xoops)

---

#xoops #contributing #open-source #community #development #coding-standards