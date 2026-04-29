---
title: "Pokyny pro hlášení problémů"
description: "Jak efektivně hlásit chyby, požadavky na funkce a další problémy"
---

> Efektivní hlášení chyb a požadavky na funkce jsou pro vývoj XOOPS zásadní. Tato příručka vám pomůže vytvořit vysoce kvalitní problémy.

---

## Před nahlášením

### Zkontrolujte existující problémy

**Vždy nejprve hledejte:**

1. Přejděte na [GitHub Issues](https://github.com/XOOPS/XOOPSCore27/issues)
2. Vyhledejte klíčová slova související s vaším problémem
3. Zkontrolujte uzavřené problémy – mohou být již vyřešeny
4. Podívejte se na žádosti o stažení – možná probíhá

Použijte vyhledávací filtry:
- `is:issue is:open label:bug` - Otevřené chyby
- `is:issue is:open label:feature` - Otevřete požadavky na funkce
- `is:issue sort:updated` - Nedávno aktualizované problémy

### Je to opravdu problém?

Nejprve zvažte:

- **Problém s konfigurací?** - Zkontrolujte dokumentaci
- **Dotaz k použití?** - Zeptejte se na fórech nebo komunitě Discord
- **Bezpečnostní problém?** - Viz část #security-issues níže
- **Specifické pro modul?** - Zpráva správci modulu
- **Specifické pro téma?** - Zpráva autorovi tématu

---

## Typy problémů

### Hlášení chyby

Chyba je neočekávané chování nebo závada.

**Příklady:**
- Přihlášení nefunguje
- Chyby databáze
- Chybí ověření formuláře
- Bezpečnostní zranitelnost

### Žádost o funkci

Požadavek na funkci je návrh na novou funkci.

**Příklady:**
- Přidejte podporu pro novou funkci
- Vylepšete stávající funkce
- Přidejte chybějící dokumentaci
- Zlepšení výkonu

### Vylepšení

Vylepšení vylepšuje stávající funkce.

**Příklady:**
- Lepší chybové zprávy
- Vylepšený výkon
- Lepší design API
- Lepší uživatelský zážitek

### Dokumentace

Problémy s dokumentací zahrnují chybějící nebo nesprávnou dokumentaci.

**Příklady:**
- Neúplná dokumentace API
- Zastaralé průvodce
- Chybějící příklady kódu
- Překlepy v dokumentaci

---

## Nahlášení chyby

### Šablona hlášení chyby

```markdown
## Description
Brief, clear description of the bug.

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Expected Behavior
What should happen.

## Actual Behavior
What actually happens.

## Environment
- XOOPS Version: X.Y.Z
- PHP Version: 8.2/8.3/8.4
- Database: MySQL/MariaDB version
- Operating System: Windows/macOS/Linux
- Browser: Chrome/Firefox/Safari

## Screenshots
If applicable, add screenshots showing the issue.

## Additional Context
Any other relevant information.

## Possible Fix
If you have suggestions for fixing the issue (optional).
```

### Příklad hlášení dobré chyby

```markdown
## Description
Login page shows blank page when database connection fails.

## Steps to Reproduce
1. Stop the MySQL service
2. Navigate to the login page
3. Observe the behavior

## Expected Behavior
Show a user-friendly error message explaining the database connection issue.

## Actual Behavior
The page is completely blank - no error message, no interface visible.

## Environment
- XOOPS Version: 2.7.0
- PHP Version: 8.0.28
- Database: MySQL 5.7
- Operating System: Ubuntu 20.04
- Browser: Chrome 120

## Additional Context
This likely affects other pages too. The error should be displayed to admins or logged appropriately.

## Possible Fix
Check database connection in header.php before rendering the template.
```

### Příklad špatného hlášení chyby

```markdown
## Description
Login doesn't work

## Steps to Reproduce
It doesn't work

## Expected Behavior
It should work

## Actual Behavior
It doesn't

## Environment
Latest version
```

---

## Nahlášení požadavku na funkci

### Šablona požadavku na funkci

```markdown
## Description
Clear, concise description of the feature.

## Problem Statement
Why is this feature needed? What problem does it solve?

## Proposed Solution
Describe your ideal implementation or UX.

## Alternatives Considered
Are there other ways to achieve this goal?

## Additional Context
Any mockups, examples, or references.

## Expected Impact
How would this benefit users? Would it be breaking?
```

### Příklad žádosti o dobrou funkci

```markdown
## Description
Add two-factor authentication (2FA) for user accounts.

## Problem Statement
With increasing security breaches, many CMS platforms now offer 2FA. XOOPS users want stronger account security beyond passwords.

## Proposed Solution
Implement TOTP-based 2FA (compatible with Google Authenticator, Authy, etc.).
- Users can enable 2FA in their profile
- Display QR code for setup
- Generate backup codes for recovery
- Require 2FA code at login

## Alternatives Considered
- SMS-based 2FA (requires carrier integration, less secure)
- Hardware keys (too complex for average users)

## Additional Context
Similar to GitHub, GitLab, and WordPress implementations.
Reference: [TOTP Standard RFC 6238](https://tools.ietf.org/html/rfc6238)

## Expected Impact
Increases account security. Could be optional initially, mandatory in future versions.
```

---

## Bezpečnostní problémy

### Nahlaste NOT veřejně

**Nikdy nevytvářejte veřejný problém s chybami zabezpečení.**

### Nahlásit soukromě

1. **Zašlete e-mail bezpečnostnímu týmu:** security@xoops.org
2. **Zahrnout:**
   - Popis zranitelnosti
   - Kroky k reprodukci
   - Potenciální dopad
   - Vaše kontaktní údaje

### Odpovědné zveřejnění

- Přijetí potvrdíme do 48 hodin
- Budeme poskytovat aktualizace každých 7 dní
- Budeme pracovat na pevné časové ose
- Můžete požádat o uznání za objev
- Koordinujte načasování zveřejnění

### Příklad bezpečnostního problému

```
Subject: [SECURITY] XSS Vulnerability in Comment Form

Description:
The comment form in Publisher module does not properly escape user input,
allowing stored XSS attacks.

Steps to Reproduce:
1. Create a comment with: <img src=x onerror="alert('xss')">
2. Submit the form
3. The JavaScript executes when viewing the comment

Impact:
Attackers can steal user session tokens, perform actions as users,
or deface the website.

Environment:
- XOOPS 2.7.0
- Publisher Module 1.x
```

---

## Doporučené postupy pro název vydání

### Dobré tituly

```
✅ Login page shows blank error when database connection fails
✅ Add two-factor authentication support
✅ Form validation not preventing SQL injection in name field
✅ Improve performance of user list query
✅ Update installation documentation for PHP 8.2
```

### Špatné tituly

```
❌ Bug in system
❌ Help me!!
❌ It doesn't work
❌ Question about XOOPS
❌ Error
```

### Pokyny k názvu

- **Buďte konkrétní** - Uveďte co a kde
- **Buďte struční** - Méně než 75 znaků
- **Použít přítomný čas** - "zobrazuje prázdnou stránku", nikoli "zobrazuje prázdnou"
- **Zahrnout kontext** - "v administračním panelu", "během instalace"
- **Vyhýbejte se obecným slovům** - Ne "opravit", "pomoc", "problém"

---

## Popis problému Nejlepší postupy

### Zahrňte základní informace

1. **Co** – Jasný popis problému
2. **Kde** – Která stránka, modul nebo funkce
3. **Kdy** – Kroky k reprodukci
4. **Prostředí** – Verze, OS, prohlížeč, PHP
5. **Proč** – Proč je to důležité

### Použijte formátování kódu

```markdown
Error message: `Error: Cannot find user`

Code snippet:
```
php
$user = $this->getUser($id);
if (!$user) {
    echo "Chyba: Nelze najít uživatele";
}
```
```

### Zahrnout snímky obrazovky

V případě problémů s uživatelským rozhraním zahrnují:
- Snímek obrazovky problému
- Snímek obrazovky očekávaného chování
- Popište, co je špatně (šipky, kolečka)

### Používejte štítky

Přidejte štítky ke kategorizaci:
- `bug` - Zpráva o chybě
- `enhancement` - Požadavek na vylepšení
- `documentation` - Problém s dokumentací
- `help wanted` - Hledám pomoc
- `good first issue` - Dobré pro nové přispěvatele

---

## Po nahlášení

### Buďte vstřícní

- Zkontrolujte otázky v komentářích k problému
- Na požádání uveďte další informace
- Otestujte navrhované opravy
- Ověřte, že chyba stále existuje s novými verzemi

### Dodržujte etiketu

- Buďte ohleduplní a profesionální
- Předpokládejte dobré úmysly
- Nevyžadujte opravy - vývojáři jsou dobrovolníci
- Nabídněte pomoc, pokud je to možné
- Děkuji přispěvatelům za jejich práci

### Zaměřte se na problém- Držte se tématu
- Nemluvte o nesouvisejících problémech
- Místo toho odkaz na související problémy
- Nepoužívejte problémy pro hlasování o funkcích

---

## Co se stane s problémy

### Proces třídění

1. **Vytvořeno nové číslo** - GitHub informuje správce
2. **Počáteční kontrola** – Zkontrolována srozumitelnost a duplikáty
3. **Přiřazení štítků** – Zařazeno do kategorií a priorit
4. **Úkol** – V případě potřeby přidělen někomu
5. **Diskuse** – V případě potřeby se shromáždí další informace

### Úrovně priority

- **Kritické** - Ztráta dat, zabezpečení, úplné rozbití
- **Vysoká** - Hlavní funkce nefunkční, postihuje mnoho uživatelů
- **Střední** - Část funkce je nefunkční, dostupné řešení
- **Nízká** - Menší problém, kosmetický nebo úzce specializovaný případ použití

### Výsledky řešení

- **Opraveno** - Problém vyřešen v PR
- **Neopravím** - Zamítnuto z technických nebo strategických důvodů
- **Duplicitní** - Stejné jako u jiného problému
- **Neplatné** - Ve skutečnosti to není problém
- **Potřebuje více informací** - Čekání na další podrobnosti

---

## Příklady problémů

### Příklad: Dobrá zpráva o chybě

```markdown
## Description
Admin users cannot delete items when using MySQL with strict mode enabled.

## Steps to Reproduce
1. Enable `sql_mode='STRICT_TRANS_TABLES'` in MySQL
2. Navigate to Publisher admin panel
3. Click delete button on any article
4. Error is shown

## Expected Behavior
Article should be deleted or show meaningful error.

## Actual Behavior
Error: "SQL Error - Unknown column 'deleted_at' in ON clause"

## Environment
- XOOPS Version: 2.7.0
- PHP Version: 8.2.0
- Database: MySQL 8.0.32 with STRICT_TRANS_TABLES
- Operating System: Ubuntu 22.04
- Browser: Firefox 120

## Screenshots
[Screenshot of error message]

## Additional Context
This only happens with strict SQL mode. Works fine with default settings.
The query is in class/PublisherItem.php:248

## Possible Fix
Use single quotes around 'deleted_at' or use backticks for all column names.
```

### Příklad: Žádost o dobrou funkci

```markdown
## Description
Add REST API endpoints for read-only access to public content.

## Problem Statement
Developers want to build mobile apps and external services using XOOPS data.
Currently limited to SOAP API which is outdated and poorly documented.

## Proposed Solution
Implement RESTful API with:
- Endpoints for articles, users, comments (read-only)
- Token-based authentication
- Standard HTTP status codes and errors
- OpenAPI/Swagger documentation
- Pagination support

## Alternatives Considered
- Enhanced SOAP API (legacy, not standards-compliant)
- GraphQL (more complex, maybe future)

## Additional Context
See Publisher module API refactoring for similar patterns.
Would align with modern web development practices.

## Expected Impact
Enable ecosystem of third-party tools and mobile apps.
Would improve XOOPS adoption and ecosystem.
```

---

## Související dokumentace

- Kodex chování
- Příspěvkový pracovní postup
- Vytáhněte pokyny k žádosti
- Přispívající přehled

---

#xoops #problémy #hlášení chyb #požadavky na funkce #github