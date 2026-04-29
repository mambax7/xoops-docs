---
title: "Smjernice za doprinos"
description: "Kako doprinijeti XOOPS razvoju CMS-a, standardima kodiranja i smjernicama zajednice"
---
# 🤝 Doprinos XOOPS

> Pridružite se zajednici XOOPS i pomozite da postane najbolji CMS na svijetu.

---

## 📋 Pregled

XOOPS je projekt otvorenog koda koji napreduje zahvaljujući doprinosima zajednice. Bilo da ispravljate greške, dodajete značajke, poboljšavate dokumentaciju ili pomažete drugima, vaši su doprinosi dragocjeni.

---

## 🗂️ Sadržaj odjeljka

### Smjernice
- Kodeks ponašanja
- Tijek rada doprinosa
- Smjernice zahtjeva za povlačenje
- Prijava problema

### Stil koda
- PHP Standardi kodiranja
- JavaScript Standardi
- Smjernice CSS
- Smarty predložak standarda

### Arhitektonske odluke
- Indeks ADR
- ADR obrazac
- ADR-001: Modularna arhitektura
- ADR-002: Apstrakcija baze podataka

---

## 🚀 Početak

### 1. Postavite razvojno okruženje

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

### 2. Stvorite granu značajki

```bash
# Sync with upstream
git fetch upstream
git checkout -b feature/my-feature upstream/main
```

### 3. Napravite promjene

Slijedite standarde kodiranja i pišite testove za nove značajke.

### 4. Pošaljite zahtjev za povlačenje

```bash
# Commit changes
git add .
git commit -m "Add: Brief description of changes"

# Push to your fork
git push origin feature/my-feature
```

Zatim izradite Pull Request na GitHubu.

---

## 📝 Standardi kodiranja

### PHP Standardi

XOOPS slijedi standarde kodiranja PSR-1, PSR-4 i PSR-12.

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

### Ključne konvencije

| Pravilo | Primjer |
|------|---------|
| Nazivi klasa | `PascalCase` |
| Nazivi metoda | `camelCase` |
| Konstante | `UPPER_SNAKE_CASE` |
| Varijable | `$camelCase` |
| Datoteke | `ClassName.php` |
| Uvlačenje | 4 mjesta |
| Duljina linije | Maksimalno 120 znakova |

### Smarty predlošci

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

## 🔀 Tijek rada Gita

### Imenovanje grana

| Upišite | Uzorak | Primjer |
|------|---------|---------|
| Značajka | `feature/description` | `feature/add-user-export` |
| Ispravak | `fix/description` | `fix/login-validation` |
| Hitni popravak | `hotfix/description` | `hotfix/security-patch` |
| Otpuštanje | `release/version` | `release/2.7.0` |

### Obavijesti poruke

Slijedite konvencionalne obveze:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Vrste:**
- `feat`: Nova značajka
- `fix`: Ispravak programske pogreške
- `docs`: Dokumentacija
- `style`: Stil koda (oblikovanje)
- `refactor`: Prerađivanje koda
- `test`: Dodavanje testova
- `chore`: Održavanje

**Primjeri:**
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

## 🧪 Testiranje

### Izvođenje testova

```bash
# Run all tests
./vendor/bin/phpunit

# Run specific test suite
./vendor/bin/phpunit --testsuite unit

# Run with coverage
./vendor/bin/phpunit --coverage-html coverage/
```

### Pisanje testova

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

## 📋 Kontrolni popis zahtjeva za povlačenje

Prije podnošenja PR-a, osigurajte:

- [ ] Kod slijedi XOOPS standarde kodiranja
- [ ] Svi testovi prolaze
- [ ] Nove značajke imaju testove
- [ ] Dokumentacija ažurirana ako je potrebno
- [ ] Nema sukoba spajanja s glavnom granom
- [ ] Poruke predaje su opisne
- [ ] PR opis objašnjava promjene
- [ ] Srodni problemi su povezani

---

## 🏗️ Architecture Decision Records

ADR-ovi dokumentiraju značajne arhitektonske odluke.

### ADR predložak

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

### Trenutačne nuspojave

| ADR | Naslov | Status |
|-----|-------|--------|
| ADR-001 | Modularna arhitektura | Prihvaćeno |
| ADR-002 | Objektno orijentirani pristup bazi podataka | Prihvaćeno |
| ADR-003 | Smarty predložak | Prihvaćeno |
| ADR-004 | Dizajn sigurnosnog sustava | Prihvaćeno |
| ADR-005 | PSR-15 Middleware (4.0.x) | Predloženi |

---

## 🎖️ Priznanje

Suradnici su prepoznati kroz:- **Popis suradnika** - Navedeno u repozitoriju
- **Napomene o izdanju** - Navedeno u izdanjima
- **Kuća slavnih** - Izvanredni suradnici
- **Certifikacija modula** - Značka kvalitete za modules

---

## 🔗 Povezana dokumentacija

- XOOPS 4.0 Plan puta
- Temeljni koncepti
- Razvoj modula

---

## 📚 Resursi

- [GitHub spremište](https://github.com/XOOPS/XoopsCore27)
- [Praćenje problema](https://github.com/XOOPS/XoopsCore27/issues)
- [XOOPS Forumi](https://xoops.org/modules/newbb/)
- [Discord zajednica](https://discord.gg/xoops)

---

#xoops #doprinos #open-source #zajednica #razvoj #standardi kodiranja
