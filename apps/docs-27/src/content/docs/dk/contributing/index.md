---
title: "Bidragende retningslinjer"
description: "Sådan bidrager du til XOOPS CMS udvikling, kodningsstandarder og fællesskabsretningslinjer"
---

# 🤝 Bidrager til XOOPS

> Tilmeld dig XOOPS-fællesskabet og vær med til at gøre det til det bedste CMS i verden.

---

## 📋 Oversigt

XOOPS er et open source-projekt, der trives med fællesskabsbidrag. Uanset om du retter fejl, tilføjer funktioner, forbedrer dokumentationen eller hjælper andre, er dine bidrag værdifulde.

---

## 🗂️ Indhold i afsnittet

### Retningslinjer
- Code of Conduct
- Bidrag Workflow
- Pull Request Guidelines
- Problemrapportering

### Kodestil
- PHP kodningsstandarder
- JavaScript standarder
- CSS retningslinjer
- Smarte skabelonstandarder

### Arkitekturbeslutninger
- ADR Indeks
- ADR skabelon
- ADR-001: Modulær arkitektur
- ADR-002: Databaseabstraktion

---

## 🚀 Kom godt i gang

### 1. Opsæt udviklingsmiljø

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

### 2. Opret funktionsgren

```bash
# Sync with upstream
git fetch upstream
git checkout -b feature/my-feature upstream/main
```

### 3. Foretag ændringer

Følg kodningsstandarderne og skriv test for nye funktioner.

### 4. Send Pull-anmodning

```bash
# Commit changes
git add .
git commit -m "Add: Brief description of changes"

# Push to your fork
git push origin feature/my-feature
```

Opret derefter en Pull Request på GitHub.

---

## 📝 Kodningsstandarder

### PHP standarder

XOOPS følger PSR-1, PSR-4 og PSR-12 kodningsstandarder.

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

### Nøglekonventioner

| Regel | Eksempel |
|------|--------|
| Klassenavne | `PascalCase` |
| Metodenavne | `camelCase` |
| Konstanter | `UPPER_SNAKE_CASE` |
| Variabler | `$camelCase` |
| Filer | `ClassName.php` |
| Indrykning | 4 pladser |
| Linjelængde | Max 120 tegn |

### Smarte skabeloner

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

## 🔀 Git Workflow

### Filialnavngivning

| Skriv | Mønster | Eksempel |
|------|--------|--------|
| Funktion | `feature/description` | `feature/add-user-export` |
| Bugfix | `fix/description` | `fix/login-validation` |
| Hotfix | `hotfix/description` | `hotfix/security-patch` |
| Frigiv | `release/version` | `release/2.7.0` |

### Send beskeder

Følg konventionelle tilsagn:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Typer:**
- `feat`: Ny funktion
- `fix`: Fejlrettelse
- `docs`: Dokumentation
- `style`: Kodestil (formatering)
- `refactor`: Kode refactoring
- `test`: Tilføjelse af tests
- `chore`: Vedligeholdelse

**Eksempler:**
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

## 🧪 Test

### Løbende tests

```bash
# Run all tests
./vendor/bin/phpunit

# Run specific test suite
./vendor/bin/phpunit --testsuite unit

# Run with coverage
./vendor/bin/phpunit --coverage-html coverage/
```

### Skrivning af prøver

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

## 📋 Træk anmodningstjekliste

Før du indsender en PR, skal du sikre dig:

- [ ] Koden følger XOOPS kodningsstandarder
- [ ] Alle prøver består
- [ ] Nye funktioner har tests
- [ ] Dokumentation opdateres om nødvendigt
- [ ] Ingen flettekonflikter med hovedgren
- [ ] Commit-beskeder er beskrivende
- [ ] PR-beskrivelse forklarer ændringer
- [ ] Relaterede problemer er forbundet

---

## 🏗️ Architecture Decision Records

ADR dokumenterer væsentlige arkitektoniske beslutninger.

### ADR skabelon

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
| ADR-001 | Modulær arkitektur | Accepteret |
| ADR-002 | Objektorienteret databaseadgang | Accepteret |
| ADR-003 | Smarty skabelonmotor | Accepteret |
| ADR-004 | Design af sikkerhedssystemer | Accepteret |
| ADR-005 | PSR-15 Middleware (4.0.x) | Foreslået |

---

## 🎖️ Anerkendelse

Bidragydere anerkendes gennem:

- **Liste over bidragydere** - Opført i repository
- **Release Notes** - Krediteret i udgivelser
- **Hall of Fame** - Fremragende bidragydere
- **Modulcertificering** - Kvalitetsmærke til moduler

---

## 🔗 Relateret dokumentation

- XOOPS 4.0 køreplan
- Kernekoncepter
- Moduludvikling

---

## 📚 Ressourcer

- [GitHub-lager](https://github.com/XOOPS/XoopsCore27)
- [Issue Tracker](https://github.com/XOOPS/XoopsCore27/issues)
- [XOOPS fora](https://xoops.org/modules/newbb/)
- [Discord-fællesskab](https://discord.gg/xoops)

---

#xoops #bidragende #open source #fællesskab #udvikling #kodningsstandarder
