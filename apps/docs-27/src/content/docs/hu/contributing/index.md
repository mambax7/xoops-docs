---
title: „Hozzájárulási irányelvek”
description: "Hogyan lehet hozzájárulni a XOOPS CMS fejlesztéséhez, a kódolási szabványokhoz és a közösségi irányelvekhez"
---
# 🤝 Hozzájárulás a XOOPS-hoz

> Csatlakozz a XOOPS közösséghez, és segíts, hogy ez a világ legjobb CMS legyen.

---

## 📋 Overview

A XOOPS egy nyílt forráskódú projekt, amely a közösségi hozzájárulásokon nyugszik. Függetlenül attól, hogy hibákat javít, funkciókat ad hozzá, javítja a dokumentációt vagy segít másoknak, az Ön hozzájárulása értékes.

---

## 🗂️ A szakasz tartalma

### Guidelines
- Magatartási kódex
- Hozzájárulás munkafolyamata
- Pull Request Guidelines
- Issue Reporting

### Code Style
- PHP Coding Standards
- JavaScript szabványok
- CSS Irányelvek
- Smarty sablon szabványok

### Építészeti döntések
- ADR Index
- ADR sablon
- ADR-001: moduláris felépítés
- ADR-002: Adatbázis-absztrakció

---

## 🚀 Getting Started

### 1. Fejlesztői környezet beállítása

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

### 2. Feature Branch létrehozása

```bash
# Sync with upstream
git fetch upstream
git checkout -b feature/my-feature upstream/main
```

### 3. Make Changes

Kövesse a kódolási szabványokat, és írjon teszteket az új funkciókhoz.

### 4. Küldje el a lehívási kérelmet

```bash
# Commit changes
git add .
git commit -m "Add: Brief description of changes"

# Push to your fork
git push origin feature/my-feature
```

Ezután hozzon létre egy lehívási kérelmet a GitHubon.

---

## 📝 Coding Standards

### PHP szabványok

A XOOPS a PSR-1, PSR-4 és PSR-12 kódolási szabványokat követi.

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

### Key Conventions

| Rule | Példa |
|------|---------|
| Class names | `PascalCase` |
| Method names | `camelCase` |
| Állandók | `UPPER_SNAKE_CASE` |
| Variables | `$camelCase` |
| Files | `ClassName.php` |
| Indentation | 4 spaces |
| Line length | Max 120 characters |

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

## 🔀 Git Workflow

### Branch Naming

| Típus | Pattern | Példa |
|------|---------|---------|
| Feature | `feature/description` | `feature/add-user-export` |
| Bugfix | `fix/description` | `fix/login-validation` |
| Hotfix | `hotfix/description` | `hotfix/security-patch` |
| Release | `release/version` | `release/2.7.0` |

### Commit Messages

Kövesse a hagyományos commitokat:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: Új funkció
- `fix`: Hibajavítás
- `docs`: Dokumentáció
- `style`: Kódstílus (formázás)
- `refactor`: Kódrefaktorálás
- `test`: Tesztek hozzáadása
- `chore`: Karbantartás

**Példák:**
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

## 🧪 Testing

### Running Tests

```bash
# Run all tests
./vendor/bin/phpunit

# Run specific test suite
./vendor/bin/phpunit --testsuite unit

# Run with coverage
./vendor/bin/phpunit --coverage-html coverage/
```

### Writing Tests

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

## 📋 Húzza le a kérés ellenőrzőlistáját

PR benyújtása előtt győződjön meg:

- [ ] Code follows XOOPS coding standards
- [ ] All tests pass
- [ ] Az új funkciókhoz tesztek tartoznak
- [ ] Szükség esetén frissítjük a dokumentációt
- [ ] Nincs összevonási ütközés a fő ággal
- [ ] A véglegesítési üzenetek leíró jellegűek
- [ ] A PR leírás magyarázatot ad a változásokra
- [ ] A kapcsolódó kérdések linkelve

---

## 🏗️ Architecture Decision Records

Az ADR-ek jelentős építészeti döntéseket dokumentálnak.

### ADR sablon

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

### Current ADRs

| ADR | Cím | Állapot |
|-----|-------|--------|
| ADR-001 | moduláris architektúra | Elfogadva |
| ADR-002 | Objektum-orientált adatbázis-hozzáférés | Elfogadva |
| ADR-003 | Smarty Template Engine | Elfogadva |
| ADR-004 | Biztonsági rendszer tervezése | Elfogadva |
| ADR-005 | PSR-15 Köztes szoftver (4.0.x) | Javasolt |

---

## 🎖️ Recognition

A közreműködők elismerése:

- **Közreműködők listája** - Az adattárban szerepel
- **Kiadási megjegyzések** - Jóváírás a kiadásokban
- **Hall of Fame** - Kiváló közreműködők
- **modul tanúsítvány** - Minőségi jelvény a modulokhoz

---

## 🔗 Kapcsolódó dokumentáció

- XOOPS 4.0 ütemterv
- Alapvető fogalmak
- module Development

---

## 📚 Resources

- [GitHub Repository](https://github.com/XOOPS/XOOPSCore27)
- [Problémakövető](https://github.com/XOOPS/XOOPSCore27/issues)
- [XOOPS fórumok](https://xoops.org/modules/newbb/)
- [Discord Community](https://discord.gg/xoops)

---

#xoops #hozzájárulás #nyílt forráskódú #közösség #fejlesztés #kódolási szabványok
