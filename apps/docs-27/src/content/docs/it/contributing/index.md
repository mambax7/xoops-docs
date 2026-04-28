---
title: "Linee Guida per Contribuire"
description: "Come contribuire allo sviluppo di XOOPS CMS, standard di codifica e linee guida della comunità"
---

# 🤝 Contribuire a XOOPS

> Unisciti alla comunità XOOPS e aiuta a renderlo il miglior CMS al mondo.

---

## 📋 Panoramica

XOOPS è un progetto open-source che prospera sui contributi della comunità. Che tu stia correggendo bug, aggiungendo funzionalità, migliorando la documentazione o aiutando altri, i tuoi contributi sono preziosi.

---

## 🗂️ Contenuti Sezione

### Linee Guida
- Codice di Condotta
- Flusso di Contribuzione
- Linee Guida Pull Request
- Segnalazione Problemi

### Stile Codice
- Standard Codifica PHP
- Standard JavaScript
- Linee Guida CSS
- Standard Template Smarty

### Decisioni Architettura
- Indice ADR
- Modello ADR
- ADR-001: Architettura Modulare
- ADR-002: Astrazione Database

---

## 🚀 Per Iniziare

### 1. Configura Ambiente di Sviluppo

```bash
# Fai un fork del repository su GitHub
# Quindi clona il tuo fork
git clone https://github.com/YOUR_USERNAME/XoopsCore27.git
cd XoopsCore27

# Aggiungi remote upstream
git remote add upstream https://github.com/XOOPS/XoopsCore27.git

# Installa dipendenze
composer install
```

### 2. Crea Ramo Feature

```bash
# Sincronizzati con upstream
git fetch upstream
git checkout -b feature/my-feature upstream/main
```

### 3. Apporta Modifiche

Segui gli standard di codifica e scrivi test per le nuove funzionalità.

### 4. Invia Pull Request

```bash
# Commit modifiche
git add .
git commit -m "Add: Breve descrizione delle modifiche"

# Esegui push al tuo fork
git push origin feature/my-feature
```

Quindi crea una Pull Request su GitHub.

---

## 📝 Standard di Codifica

### Standard PHP

XOOPS segue gli standard di codifica PSR-1, PSR-4 e PSR-12.

```php
<?php

declare(strict_types=1);

namespace XoopsModules\MyModule;

use Xmf\Request;
use XoopsObject;

/**
 * Classe Item
 *
 * Rappresenta un elemento nel modulo
 */
class Item extends XoopsObject
{
    /**
     * Costruttore
     */
    public function __construct()
    {
        $this->initVar('id', \XOBJ_DTYPE_INT, null, false);
        $this->initVar('title', \XOBJ_DTYPE_TXTBOX, '', true, 255);
        $this->initVar('content', \XOBJ_DTYPE_TXTAREA, '', false);
        $this->initVar('created', \XOBJ_DTYPE_INT, time(), false);
    }

    /**
     * Ottieni titolo formattato
     *
     * @return string
     */
    public function getTitle(): string
    {
        return $this->getVar('title', 'e');
    }
}
```

### Convenzioni Chiave

| Regola | Esempio |
|------|---------|
| Nomi classi | `PascalCase` |
| Nomi metodi | `camelCase` |
| Costanti | `UPPER_SNAKE_CASE` |
| Variabili | `$camelCase` |
| File | `ClassName.php` |
| Indentazione | 4 spazi |
| Lunghezza riga | Max 120 caratteri |

### Template Smarty

```smarty
{* File: templates/mymodule_index.tpl *}
{* Descrizione: Template pagina indice *}

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

## 🔀 Flusso di Lavoro Git

### Naming Branch

| Tipo | Pattern | Esempio |
|------|---------|---------|
| Feature | `feature/description` | `feature/add-user-export` |
| Bugfix | `fix/description` | `fix/login-validation` |
| Hotfix | `hotfix/description` | `hotfix/security-patch` |
| Release | `release/version` | `release/2.7.0` |

### Messaggi Commit

Segui conventional commits:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Tipi:**
- `feat`: Nuova funzionalità
- `fix`: Correzione bug
- `docs`: Documentazione
- `style`: Stile codice (formattazione)
- `refactor`: Refactoring codice
- `test`: Aggiunta test
- `chore`: Manutenzione

**Esempi:**
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

### Esegui Test

```bash
# Esegui tutti i test
./vendor/bin/phpunit

# Esegui suite test specifico
./vendor/bin/phpunit --testsuite unit

# Esegui con copertura
./vendor/bin/phpunit --coverage-html coverage/
```

### Scrivi Test

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

## 📋 Checklist Pull Request

Prima di inviare una PR, assicurati che:

- [ ] Il codice segue gli standard di codifica XOOPS
- [ ] Tutti i test passano
- [ ] Le nuove funzionalità hanno test
- [ ] Documentazione aggiornata se necessario
- [ ] Nessun conflitto di merge con ramo main
- [ ] I messaggi di commit sono descrittivi
- [ ] La descrizione PR spiega le modifiche
- [ ] I problemi correlati sono collegati

---

## 🏗️ Record Decisioni Architettura

I record ADR documentano significative decisioni architettoniche.

### Modello ADR

```markdown
# ADR-XXX: Titolo

## Stato
Proposto | Accettato | Deprecato | Sostituito

## Contesto
Quale è il problema che stiamo affrontando?

## Decisione
Quale è il cambiamento proposto?

## Conseguenze
Quali sono gli effetti positivi e negativi?

## Alternative Considerate
Quali altre opzioni sono state valutate?
```

### ADR Attuali

| ADR | Titolo | Stato |
|-----|-------|--------|
| ADR-001 | Architettura Modulare | Accettato |
| ADR-002 | Accesso Database Orientato agli Oggetti | Accettato |
| ADR-003 | Motore Template Smarty | Accettato |
| ADR-004 | Design Sistema Sicurezza | Accettato |
| ADR-005 | Middleware PSR-15 (4.0.x) | Proposto |

---

## 🎖️ Riconoscimento

I contributori sono riconosciuti attraverso:

- **Elenco Contributori** - Elencato nel repository
- **Note Rilascio** - Accreditato nei rilasci
- **Hall of Fame** - Contributori eccezionali
- **Certificazione Modulo** - Badge qualità per i moduli

---

## 🔗 Documentazione Correlata

- Roadmap XOOPS 4.0
- Concetti Core
- Sviluppo Moduli

---

## 📚 Risorse

- [Repository GitHub](https://github.com/XOOPS/XoopsCore27)
- [Tracker Problemi](https://github.com/XOOPS/XoopsCore27/issues)
- [Forum XOOPS](https://xoops.org/modules/newbb/)
- [Comunità Discord](https://discord.gg/xoops)

---

#xoops #contributing #open-source #community #development #coding-standards
