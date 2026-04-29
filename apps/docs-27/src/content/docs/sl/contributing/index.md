---
title: "Smernice za prispevanje"
description: "Kako prispevati k XOOPS CMS razvoju, standardom kodiranja in smernicam skupnosti"
---
# 🤝 Prispevek k XOOPS

> Pridružite se skupnosti XOOPS in jo pomagajte narediti najboljšo CMS na svetu.

---

## 📋 Pregled

XOOPS je odprtokodni projekt, ki uspeva s prispevki skupnosti. Ne glede na to, ali odpravljate napake, dodajate funkcije, izboljšujete dokumentacijo ali pomagate drugim, so vaši prispevki dragoceni.

---

## 🗂️ Vsebina razdelka

### Smernice
- Kodeks ravnanja
- Potek dela prispevka
- Smernice za zahtevo po vleku
- Poročanje o težavah

### Slog kode
- PHP Standardi kodiranja
- Standardi JavaScript
- CSS Smernice
- Standardi predlog Smarty

### Arhitekturne odločitve
- ADR Kazalo
- ADR Predloga
- ADR-001: Modularna arhitektura
- ADR-002: Abstrakcija baze podatkov

---

## 🚀 Kako začeti

### 1. Nastavite razvojno okolje
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
### 2. Ustvari vejo funkcij
```bash
# Sync with upstream
git fetch upstream
git checkout -b feature/my-feature upstream/main
```
### 3. Naredite spremembe

Sledite standardom kodiranja in pišite teste za nove funkcije.

### 4. Oddajte zahtevo za vlečenje
```bash
# Commit changes
git add .
git commit -m "Add: Brief description of changes"

# Push to your fork
git push origin feature/my-feature
```
Nato ustvarite Pull Request na GitHubu.

---

## 📝 Standardi kodiranja

### PHP Standardi

XOOPS sledi standardom kodiranja PSR-1, PSR-4 in PSR-12.
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

| Pravilo | Primer |
|------|---------|
| Imena razredov | `PascalCase` |
| Imena metod | `camelCase` |
| Konstante | `UPPER_SNAKE_CASE` |
| Spremenljivke | `$camelCase` |
| Datoteke | `ClassName.php` |
| Zamik | 4 presledki |
| Dolžina vrstice | Največ 120 znakov |

### Predloge Smarty
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

## 🔀 Potek dela Git

### Poimenovanje vej

| Vrsta | Vzorec | Primer |
|------|---------|---------|
| Funkcija | `feature/description` | `feature/add-user-export` |
| Popravek | `fix/description` | `fix/login-validation` |
| Hitri popravek | `hotfix/description` | `hotfix/security-patch` |
| Sprostitev | `release/version` | `release/2.7.0` |

### Objavi sporočila

Sledite običajnim zavezam:
```
<type>(<scope>): <subject>

<body>

<footer>
```
**Vrste:**
- `feat`: Nova funkcija
- `fix`: Popravek napake
- `docs`: Dokumentacija
- `style`: slog kode (oblikovanje)
- `refactor`: Preoblikovanje kode
- `test`: Dodajanje testov
- `chore`: Vzdrževanje

**Primeri:**
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

### Izvajanje testov
```bash
# Run all tests
./vendor/bin/phpunit

# Run specific test suite
./vendor/bin/phpunit --testsuite unit

# Run with coverage
./vendor/bin/phpunit --coverage-html coverage/
```
### Pisanje testov
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

## 📋 Kontrolni seznam zahtev za poteg

Preden oddate PR, zagotovite:

- [ ] Koda sledi XOOPS standardom kodiranja
- [ ] Vsi testi uspešni
- [ ] Nove funkcije so testirane
- [ ] Po potrebi posodobljena dokumentacija
- [ ] Ni sporov spajanja z glavno vejo
- [ ] Sporočila o potrditvi so opisna
- [ ] PR opis pojasnjuje spremembe
- [ ] Sorodne težave so povezane

---

## 🏗️ Architecture Decision Records

ADR dokumentirajo pomembne arhitekturne odločitve.

### ADR Predloga
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
### Trenutni neželeni učinki

| ADR | Naslov | Stanje |
|-----|-------|--------|
| ADR-001 | Modularna arhitektura | Sprejeto |
| ADR-002 | Objektno usmerjen dostop do baze podatkov | Sprejeto |
| ADR-003 | Smarty Template Engine | Sprejeto |
| ADR-004 | Oblikovanje varnostnega sistema | Sprejeto |
| ADR-005 | PSR-15 Vmesna programska oprema (4.0.x) | Predlagano |

---

## 🎖️ Priznanje

Sodelavci so prepoznani po:

- **Seznam avtorjev** - Navedeno v skladišču
- **Opombe ob izdaji** - Navedeno v izdajah
- **Hall of Fame** - Izjemni sodelavci
- **Certifikacija modulov** - Značka kakovosti za module

---

## 🔗 Povezana dokumentacija

- XOOPS 4.0 Načrt
- Temeljni koncepti
- Razvoj modula

---

## 📚 Viri

- [Repozitorij GitHub](https://github.com/XOOPS/XoopsCore27)
- [Issue Tracker](https://github.com/XOOPS/XoopsCore27/issues)
- [XOOPS Forumi](https://XOOPS.org/modules/newbb/)
- [Skupnost Discord](https://discord.gg/XOOPS)

---

#XOOPS #contributing #open-source #community #development #coding-standards