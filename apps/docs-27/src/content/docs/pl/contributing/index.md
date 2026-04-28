---
title: "Wytyczne dotyczące wkładu"
description: "Jak przyczynić się do развoju XOOPS CMS, standardy kodowania i wytyczne społeczności"
---

# 🤝 Wkład w XOOPS

> Dołącz do społeczności XOOPS i pomóż uczynić to najlepszym CMS na świecie.

---

## 📋 Przegląd

XOOPS jest projektem Open Source, który kwitnie dzięki wkładom społeczności. Niezależnie od tego, czy naprawiasz błędy, dodajesz funkcje, ulepszasz dokumentację czy pomagasz innym, twój wkład jest cenny.

---

## 🗂️ Zawartość sekcji

### Wytyczne
- Kodeks postępowania
- Przepływ pracy wkładu
- Wytyczne pull request
- Raportowanie zgłoszeń

### Styl kodu
- Standardy kodowania PHP
- Standardy JavaScript
- Wytyczne CSS
- Standardy szablonów Smarty

### Decyzje architektoniczne
- Indeks ADR
- Szablon ADR
- ADR-001: Architektura modularna
- ADR-002: Abstrakcja bazy danych

---

## 🚀 Pierwsze kroki

### 1. Skonfiguruj środowisko programistyczne

```bash
# Fork repozytorium na GitHub
# Następnie sklonuj swój fork
git clone https://github.com/YOUR_USERNAME/XoopsCore27.git
cd XoopsCore27

# Dodaj upstream remote
git remote add upstream https://github.com/XOOPS/XoopsCore27.git

# Zainstaluj zależności
composer install
```

### 2. Utwórz gałąź funkcji

```bash
# Synchronizuj z upstream
git fetch upstream
git checkout -b feature/my-feature upstream/main
```

### 3. Dokonaj zmian

Postępuj zgodnie ze standardami kodowania i napisz testy dla nowych funkcji.

### 4. Prześlij pull request

```bash
# Commit zmian
git add .
git commit -m "Add: Brief description of changes"

# Wypchnij do swojego fork'a
git push origin feature/my-feature
```

Następnie utwórz pull request na GitHub.

---

## 📝 Standardy kodowania

### Standardy PHP

XOOPS postępuje zgodnie ze standardami kodowania PSR-1, PSR-4 i PSR-12.

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

### Kluczowe konwencje

| Reguła | Przykład |
|------|---------|
| Nazwy klas | `PascalCase` |
| Nazwy metod | `camelCase` |
| Stałe | `UPPER_SNAKE_CASE` |
| Zmienne | `$camelCase` |
| Pliki | `ClassName.php` |
| Wcięcie | 4 spacje |
| Długość linii | Maksymalnie 120 znaków |

### Szablony Smarty

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

## 🔀 Przepływ pracy Git

### Nazewnictwo gałęzi

| Typ | Wzorzec | Przykład |
|------|---------|---------|
| Funkcja | `feature/description` | `feature/add-user-export` |
| Poprawka błędu | `fix/description` | `fix/login-validation` |
| Hotfix | `hotfix/description` | `hotfix/security-patch` |
| Wersja | `release/version` | `release/2.7.0` |

### Wiadomości commit

Postępuj zgodnie z konwencjonalnymi commit'ami:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Typy:**
- `feat`: Nowa funkcja
- `fix`: Poprawka błędu
- `docs`: Dokumentacja
- `style`: Styl kodu (formatowanie)
- `refactor`: Refaktoryzacja kodu
- `test`: Dodawanie testów
- `chore`: Konserwacja

**Przykłady:**
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

## 🧪 Testowanie

### Uruchamianie testów

```bash
# Uruchom wszystkie testy
./vendor/bin/phpunit

# Uruchom konkretny zestaw testów
./vendor/bin/phpunit --testsuite unit

# Uruchom z pokryciem
./vendor/bin/phpunit --coverage-html coverage/
```

### Pisanie testów

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

## 📋 Lista kontrolna pull request

Przed wysłaniem PR upewnij się, że:

- [ ] Kod postępuje zgodnie ze standardami kodowania XOOPS
- [ ] Wszystkie testy przechodzą
- [ ] Nowe funkcje mają testy
- [ ] Dokumentacja zaktualizowana w razie potrzeby
- [ ] Brak konfliktów scalenia z gałęzią main
- [ ] Wiadomości commit są opisowe
- [ ] Opis PR wyjaśnia zmiany
- [ ] Powiązane zgłoszenia są połączone

---

## 🏗️ Rekordy decyzji architektonicznych

ADR dokumentują znaczące decyzje architektoniczne.

### Szablon ADR

```markdown
# ADR-XXX: Tytuł

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

### Aktualne ADR

| ADR | Tytuł | Status |
|-----|-------|--------|
| ADR-001 | Architektura modularna | Accepted |
| ADR-002 | Obiektowy dostęp do bazy danych | Accepted |
| ADR-003 | Silnik szablonów Smarty | Accepted |
| ADR-004 | Projekt systemu bezpieczeństwa | Accepted |
| ADR-005 | PSR-15 Middleware (4.0.x) | Proposed |

---

## 🎖️ Uznanie

Współtwórcy są uznawani poprzez:

- **Listy współtwórców** - Wymieniani w repozytorium
- **Notatki wydania** - Przyznani w wydaniach
- **Galeria sławy** - Wybitni współtwórcy
- **Certyfikacja modułu** - Odznaka jakości dla modułów

---

## 🔗 Dokumentacja pokrewna

- Mapa drogi XOOPS 4.0
- Koncepcje rdzenia
- Tworzenie modułów

---

## 📚 Zasoby

- [GitHub Repository](https://github.com/XOOPS/XoopsCore27)
- [Issue Tracker](https://github.com/XOOPS/XoopsCore27/issues)
- [XOOPS Forums](https://xoops.org/modules/newbb/)
- [Discord Community](https://discord.gg/xoops)

---

#xoops #wkład #open-source #społeczność #tworzenie #standardy-kodowania
