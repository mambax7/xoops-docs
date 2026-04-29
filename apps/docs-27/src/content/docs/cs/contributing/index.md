---
title: "Přispívající směrnice"
description: "Jak přispět k vývoji XOOPS CMS, standardům kódování a pokynům komunity"
---

# 🤝 Přispíváme do XOOPS

> Připojte se ke komunitě XOOPS a pomozte z ní udělat nejlepší CMS na světě.

---

## 📋 Přehled

XOOPS je projekt s otevřeným zdrojovým kódem, kterému se daří díky příspěvkům komunity. Ať už opravujete chyby, přidáváte funkce, vylepšujete dokumentaci nebo pomáháte ostatním, vaše příspěvky jsou cenné.

---

## 🗂️ Obsah sekce

### Pokyny
- Kodex chování
- Příspěvkový pracovní postup
- Vytáhněte pokyny k žádosti
- Hlášení problémů

### Styl kódu
- Standardy kódování PHP
- Normy JavaScript
- Pokyny CSS
- Standardy šablony Smarty

### Rozhodnutí o architektuře
- Index ADR
- Šablona ADR
- ADR-001: Modulární architektura
- ADR-002: Abstrakce databáze

---

## 🚀 Začínáme

### 1. Nastavení vývojového prostředí

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/XOOPSCore27.git
cd XOOPSCore27

# Add upstream remote
git remote add upstream https://github.com/XOOPS/XOOPSCore27.git

# Install dependencies
composer install
```

### 2. Vytvořte větev funkcí

```bash
# Sync with upstream
git fetch upstream
git checkout -b feature/my-feature upstream/main
```

### 3. Proveďte změny

Dodržujte standardy kódování a pište testy pro nové funkce.

### 4. Odeslat žádost o stažení

```bash
# Commit changes
git add .
git commit -m "Add: Brief description of changes"

# Push to your fork
git push origin feature/my-feature
```

Poté vytvořte žádost o stažení na GitHub.

---

## 📝 Standardy kódování

### Normy PHP

XOOPS se řídí standardy kódování PSR-1, PSR-4 a PSR-12.

```php
<?php

declare(strict_types=1);

namespace XOOPSModules\MyModule;

use XMF\Request;
use XOOPSObject;

/**
 * Class Item
 *
 * Represents an item in the module
 */
class Item extends XOOPSObject
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

### Klíčové konvence

| Pravidlo | Příklad |
|------|---------|
| Názvy tříd | `PascalCase` |
| Názvy metod | `camelCase` |
| Konstanty | `UPPER_SNAKE_CASE` |
| Proměnné | `$camelCase` |
| Soubory | `ClassName.php` |
| Odsazení | 4 mezery |
| Délka čáry | Max. 120 znaků |

### Šablony Smarty

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

## 🔀 Pracovní postup Git

### Pojmenování poboček

| Typ | Vzor | Příklad |
|------|---------|---------|
| Funkce | `feature/description` | `feature/add-user-export` |
| Oprava chyb | `fix/description` | `fix/login-validation` |
| Hotfix | `hotfix/description` | `hotfix/security-patch` |
| Vydání | `release/version` | `release/2.7.0` |

### Zadávat zprávy

Postupujte podle konvenčních závazků:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Typy:**
- `feat`: Nová funkce
- `fix`: Oprava chyby
- `docs`: Dokumentace
- `style`: Styl kódu (formátování)
- `refactor`: Refaktoring kódu
- `test`: Přidávání testů
- `chore`: Údržba

**Příklady:**
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

Properly escape user input in XOOPSFormText render method.

Security: CVE-2024-XXXX
```

---

## 🧪 Testování

### Probíhající testy

```bash
# Run all tests
./vendor/bin/phpunit

# Run specific test suite
./vendor/bin/phpunit --testsuite unit

# Run with coverage
./vendor/bin/phpunit --coverage-html coverage/
```

### Psaní testů

```php
<?php

namespace XOOPSModulesTest\MyModule;

use PHPUnit\Framework\TestCase;
use XOOPSModules\MyModule\Item;

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

## 📋 Vytáhněte kontrolní seznam žádosti

Před odesláním PR se ujistěte:

- [ ] Kód se řídí standardy kódování XOOPS
- [ ] Všechny testy prošly
- [ ] Nové funkce mají testy
- [ ] V případě potřeby byla dokumentace aktualizována
- [ ] Žádné konflikty sloučení s hlavní větví
- [ ] Zprávy Commit jsou popisné
- [ ] PR popis vysvětluje změny
- [ ] Související problémy jsou propojeny

---

## 🏗️ Záznamy rozhodnutí o architektuře

ADR dokumentují významná architektonická rozhodnutí.

### Šablona ADR

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

### Aktuální ADR

| ADR | Název | Stav |
|-----|-------|--------|
| ADR-001 | Modulární architektura | Přijato |
| ADR-002 | Objektově orientovaný přístup k databázi | Přijato |
| ADR-003 | Motor šablony Smarty | Přijato |
| ADR-004 | Návrh bezpečnostního systému | Přijato |
| ADR-005 | PSR-15 Middleware (4.0.x) | Navrhovaný |

---

## 🎖️ Uznání

Přispěvatelé jsou uznáváni prostřednictvím:

- **Seznam přispěvatelů** - Uvedeno v úložišti
- **Poznámky k vydání** - Připsáno ve verzích
- **Síň slávy** - Vynikající přispěvatelé
- **Certifikace modulu** - Odznak kvality pro moduly

---

## 🔗 Související dokumentace

- Plán XOOPS 4.0
- Základní koncepty
- Vývoj modulu

---

## 📚 Zdroje

- [Úložiště GitHub](https://github.com/XOOPS/XOOPSCore27)
- [Sledování problémů](https://github.com/XOOPS/XOOPSCore27/issues)
– [Fóra XOOPS](https://xoops.org/modules/newbb/)
- [Discord Community](https://discord.gg/xoops)

---

#xoops #přispívání #open-source #komunita #vývoj #standardy kódování