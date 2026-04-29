---
title: "Smjernice za prijavu problema"
description: "Kako učinkovito prijaviti greške, zahtjeve za značajkama i druge probleme"
---
> Učinkovita izvješća o greškama i zahtjevi za značajkama ključni su za razvoj XOOPS. Ovaj vam vodič pomaže u stvaranju izdanja visoke kvalitete.

---

## Prije prijave

### Provjerite postojeće probleme

**Uvijek prvo traži:**

1. Idite na [GitHub problemi](https://github.com/XOOPS/XoopsCore27/issues)
2. Potražite ključne riječi koje se odnose na vaš problem
3. Provjerite zatvorene probleme - možda su već riješeni
4. Pogledajte zahtjeve za povlačenjem - možda su u tijeku

Koristite filtre za pretraživanje:
- `is:issue is:open label:bug` - Otvorene greške
- `is:issue is:open label:feature` - Otvoreni zahtjevi za značajke
- `is:issue sort:updated` - Nedavno ažurirani problemi

### Je li to doista problem?

Prvo razmotrite:

- **Problem s konfiguracijom?** - Provjerite dokumentaciju
- **Pitanje o korištenju?** - Pitajte na forumima ili Discord zajednici
- **Sigurnosni problem?** - Pogledajte odjeljak #security-issues u nastavku
- **Specifično za modul?** - Prijavite održavatelju modula
- **Određeno za temu?** - Prijavite autoru teme

---

## Vrste problema

### Izvješće o pogrešci

Bug je neočekivano ponašanje ili nedostatak.

**Primjeri:**
- Prijava ne radi
- Greške u bazi podataka
- Nedostaje provjera valjanosti obrasca
- Sigurnosna ranjivost

### Zahtjev za značajku

Zahtjev za značajkom je prijedlog za novu funkcionalnost.

**Primjeri:**
- Dodajte podršku za novu značajku
- Poboljšati postojeću funkcionalnost
- Dodajte dokumentaciju koja nedostaje
- Poboljšanja performansi

### Poboljšanje

Poboljšanje poboljšava postojeću funkcionalnost.

**Primjeri:**
- Bolje poruke o pogreškama
- Poboljšana izvedba
- Bolji dizajn API
- Bolje korisničko iskustvo

### Dokumentacija

Problemi s dokumentacijom include nedostaje ili je netočna dokumentacija.

**Primjeri:**
- Nepotpuna dokumentacija API
- Zastarjeli vodiči
- Nedostaju primjeri koda
- Greške pri upisu u dokumentaciji

---

## Prijava greške

### predložak izvješća o pogrešci

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

### Dobar primjer izvješća o pogrešci

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

### Primjer lošeg izvješća o pogrešci

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

## Prijavljivanje zahtjeva za značajkom

### predložak zahtjeva za značajku

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

### Primjer dobrog zahtjeva za značajku

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

## Sigurnosni problemi

### NEMOJTE javno prijavljivati

**Nikada ne stvarajte javni problem za sigurnosne propuste.**

### Prijavi privatno

1. **Pošaljite e-poruku sigurnosnom timu:** security@xoops.org
2. **Uključi:**
   - Opis ranjivosti
   - Koraci za reprodukciju
   - Potencijalni utjecaj
   - Vaši podaci za kontakt

### Odgovorno otkrivanje

- Potvrdit ćemo primitak u roku od 48 sati
- Omogućit ćemo ažuriranja svakih 7 dana
- Radit ćemo na vremenskom planu popravka
- Možete zatražiti priznanje za otkriće
- Koordinirajte vrijeme javnog objavljivanja

### Primjer sigurnosnog problema

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

## Naslov problema Najbolji postupci

### Dobri naslovi

```
✅ Login page shows blank error when database connection fails
✅ Add two-factor authentication support
✅ Form validation not preventing SQL injection in name field
✅ Improve performance of user list query
✅ Update installation documentation for PHP 8.2
```

### Loši naslovi

```
❌ Bug in system
❌ Help me!!
❌ It doesn't work
❌ Question about XOOPS
❌ Error
```

### Smjernice za naslov

- **Budite konkretni** - Navedite što i gdje
- **Budite sažeti** - Ispod 75 znakova
- **Koristite sadašnje vrijeme** - "pokazuje praznu stranicu" ne "prikazuje praznu"
- **Uključi kontekst** - "u ploči admin", "tijekom instalacije"
- **Izbjegavajte generičke riječi** - Ne "popraviti", "pomoć", "problem"

---

## Opis problema Najbolje prakse

### Uključite bitne informacije

1. **Što** - Jasan opis problema
2. **Gdje** - Koja stranica, modul ili značajka
3. **Kada** - Koraci za reprodukciju
4. **Okruženje** - verzija, OS, preglednik, PHP
5. **Zašto** - Zašto je ovo važno

### Koristite formatiranje koda

```markdown
Error message: `Error: Cannot find user`

Code snippet:
```php
php
$user = $this->getUser($id);
if (!$user) {
    echo "Error: Cannot find user";
}
```
```

### Include Screenshots

For UI issues, include:
- Screenshot of the problem
- Screenshot of expected behavior
- Annotate what's wrong (arrows, circles)

### Use Labels

Add labels to categorize:
- `bug` - Bug report
- `enhancement` - Enhancement request
- `documentation` - Documentation issue
- `help wanted` - Looking for help
- `good first issue` - Good for new contributors

---

## After Reporting

### Be Responsive

- Check for questions in the issue comments
- Provide additional information if requested
- Test suggested fixes
- Verify bug still exists with new versions

### Follow Etiquette

- Be respectful and professional
- Assume good intentions
- Don't demand fixes - developers are volunteers
- Offer to help if possible
- Thank contributors for their work

### Keep Issue Focused

- Stay on topic
- Don't discuss unrelated issues
- Link to related issues instead
- Don't use issues for feature voting

---

## What Happens to Issues

### Triage Process

1. **New issue created** - GitHub notifies maintainers
2. **Initial review** - Checked for clarity and duplicates
3. **Label assignment** - Categorized and prioritized
4. **Assignment** - Assigned to someone if appropriate
5. **Discussion** - Additional info gathered if needed

### Priority Levels

- **Critical** - Data loss, security, complete breakage
- **High** - Major feature broken, affects many users
- **Medium** - Part of feature broken, workaround available
- **Low** - Minor issue, cosmetic, or niche use case

### Resolution Outcomes

- **Fixed** - Issue resolved in a PR
- **Won't fix** - Rejected for technical or strategic reasons
- **Duplicate** - Same as another issue
- **Invalid** - Not actually an issue
- **Needs more info** - Waiting for additional details

---

## Issue Examples

### Example: Good Bug Report

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
### Primjer: Zahtjev za dobru značajku

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

## Povezana dokumentacija

- Kodeks ponašanja
- Tijek rada doprinosa
- Smjernice zahtjeva za povlačenje
- Pregled doprinosa

---

#xoops #issues #bug-reporting #feature-requests #github
