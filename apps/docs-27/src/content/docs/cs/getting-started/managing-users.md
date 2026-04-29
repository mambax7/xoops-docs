---
title: "Správa uživatelů"
description: "Komplexní průvodce správou uživatelů v XOOPS včetně vytváření uživatelů, skupin uživatelů, oprávnění a uživatelských rolí"
---

# Správa uživatelů v XOOPS

Naučte se vytvářet uživatelské účty, organizovat uživatele do skupin a spravovat oprávnění v XOOPS.

## Přehled správy uživatelů

XOOPS poskytuje komplexní správu uživatelů s:

```
Users > Accounts
├── Individual users
├── User profiles
├── Registration requests
└── Online users

Users > Groups
├── User groups/roles
├── Group permissions
└── Group membership

System > Permissions
├── Module access
├── Content access
├── Function permissions
└── Group capabilities
```

## Přístup ke správě uživatelů

### Navigace v panelu administrátora

1. Přihlaste se do admin: `http://your-domain.com/xoops/admin/`
2. Klikněte na **Uživatelé** v levém postranním panelu
3. Vyberte z možností:
   - **Uživatelé:** Správa jednotlivých účtů
   - **Skupiny:** Správa uživatelských skupin
   - **Online uživatelé:** Zobrazit aktuálně aktivní uživatele
   - **Požadavky uživatelů:** Zpracovat žádosti o registraci

## Pochopení rolí uživatelů

XOOPS přichází s předdefinovanými uživatelskými rolemi:

| Skupina | Role | Schopnosti | Případ použití |
|---|---|---|---|
| **Webmasteři** | Správce | Plná kontrola webu | Hlavní administrátoři |
| **Správci** | Správce | Omezený přístup správce | Důvěryhodní uživatelé |
| **Moderátoři** | Kontrola obsahu | Schválit obsah | Komunitní manažeři |
| **Editoři** | Tvorba obsahu | Obsah Create/edit | Obsah zaměstnanců |
| **Registrováno** | Člen | Příspěvek, komentář, profil | Pravidelní uživatelé |
| **Anonymní** | Návštěvník | Pouze pro čtení | Nepřihlášení uživatelé |

## Vytváření uživatelských účtů

### Metoda 1: Správce vytvoří uživatele

**Krok 1: Přístup k vytváření uživatelů**

1. Přejděte na **Uživatelé > Uživatelé**
2. Klikněte na **„Přidat nového uživatele“** nebo **„Vytvořit uživatele“**

**Krok 2: Zadejte informace o uživateli**

Vyplňte údaje o uživateli:

```
Username: [4+ characters, letters/numbers/underscore only]
Example: john_smith

Email Address: [Valid email address]
Example: john@example.com

Password: [Strong password]
Example: MyStr0ng!Pass2025

Confirm Password: [Repeat password]
Example: MyStr0ng!Pass2025

Real Name: [User's full name]
Example: John Smith

URL: [Optional user website]
Example: https://johnsmith.com

Signature: [Optional forum signature]
Example: "Happy XOOPS user!"
```

**Krok 3: Nakonfigurujte uživatelská nastavení**

```
User Status: ☑ Active
             ☐ Inactive
             ☐ Pending Approval

User Groups:
☑ Registered Users
☐ Webmasters
☐ Admins
☐ Moderators
```

**Krok 4: Další možnosti**

```
Notify User: ☑ Send welcome email
Allow Avatar: ☑ Yes
User Theme: [Default theme]
Show Email: ☐ Public / ☑ Private
```

**Krok 5: Vytvořte účet**

Klikněte na **„Přidat uživatele“** nebo **„Vytvořit“**

Potvrzení: 
```
User created successfully!
Username: john_smith
Email: john@example.com
Groups: Registered Users
```

### Metoda 2: Samoregistrace uživatele

Povolit uživatelům, aby se sami registrovali:

**Panel správce > Systém > Předvolby > Uživatelská nastavení**

```
Allow User Registration: ☑ Yes

Registration Type:
☐ Instant (Approve automatically)
☑ Email Verification (Email confirmation)
☐ Admin Approval (You approve each)

Send Verification Email: ☑ Yes
```

pak:
1. Uživatelé navštíví registrační stránku
2. Vyplňte základní údaje
3. Ověřte e-mail nebo počkejte na schválení
4. Účet aktivován

## Správa uživatelských účtů

### Zobrazit všechny uživatele

**Umístění:** Uživatelé > Uživatelé

Zobrazí seznam uživatelů s:
- Uživatelské jméno
- E-mailová adresa
- Datum registrace
- Poslední přihlášení
- Stav uživatele (Active/Inactive)
- Členství ve skupině

### Upravit uživatelský účet

1. V seznamu uživatelů klikněte na uživatelské jméno
2. Upravte libovolné pole:
   - E-mailová adresa
   - Heslo
   - Skutečné jméno
   - Skupiny uživatelů
   - Stav

3. Klikněte na **„Uložit“** nebo **„Aktualizovat“**

### Změňte uživatelské heslo

1. Klepněte na uživatele v seznamu
2. Přejděte na část „Změnit heslo“.
3. Zadejte nové heslo
4. Potvrďte heslo
5. Klikněte na **"Změnit heslo"**

Uživatel použije nové heslo při příštím přihlášení.

### Uživatel Deactivate/Suspend

Dočasně zakázat účet bez smazání:

1. Klepněte na uživatele v seznamu
2. Nastavte **Stav uživatele** na „Neaktivní“
3. Klikněte na **Uložit**

Uživatel se nemůže přihlásit, když není aktivní.

### Znovu aktivujte uživatele

1. Klepněte na uživatele v seznamu
2. Nastavte **Stav uživatele** na „Aktivní“
3. Klikněte na **Uložit**

Uživatel se může znovu přihlásit.

### Smazat uživatelský účet

Trvale odebrat uživatele:

1. Klepněte na uživatele v seznamu
2. Přejděte dolů
3. Klikněte na **"Smazat uživatele"**
4. Potvrďte: "Smazat uživatele a všechna data?"
5. Klikněte na **"Ano"**

**Upozornění:** Smazání je trvalé!

### Zobrazit uživatelský profil

Zobrazit podrobnosti uživatelského profilu:

1. Klikněte na uživatelské jméno v seznamu uživatelů
2. Zkontrolujte informace o profilu:
   - Skutečné jméno
   - E-mail
   - Webové stránky
   - Datum připojení
   - Poslední přihlášení
   - Životopis uživatele
   - Avatar
   - Posts/contributions

## Porozumění skupinám uživatelů

### Výchozí skupiny uživatelů

XOOPS obsahuje výchozí skupiny:

| Skupina | Účel | Speciální | Upravit |
|---|---|---|---|
| **Anonymní** | Nepřihlášení uživatelé | Opraveno | Ne |
| **Registrovaní uživatelé** | Řádní členové | Výchozí | Ano |
| **Webmasteři** | Správci stránek | Admin | Ano |
| **Správci** | Omezení správci | Admin | Ano |
| **Moderátoři** | Moderátoři obsahu | Vlastní | Ano |

### Vytvořit vlastní skupinu

Vytvořit skupinu pro konkrétní roli:

**Umístění:** Uživatelé > Skupiny

1. Klikněte na **"Přidat novou skupinu"**
2. Zadejte podrobnosti o skupině:

```
Group Name: Content Editors
Group Description: Users who can create and edit content

Display Group: ☑ Yes (Show in member profiles)
Group Type: ☑ Regular / ☐ Admin
```

3. Klikněte na **"Vytvořit skupinu"**

### Správa členství ve skupině

Přiřadit uživatele do skupin:

**Možnost A: Ze seznamu uživatelů**

1. Přejděte na **Uživatelé > Uživatelé**
2. Klikněte na uživatel
3. Skupiny Check/uncheck v části "Skupiny uživatelů".
4. Klikněte na **Uložit**

**Možnost B: Ze skupin**

1. Přejděte na **Uživatelé > Skupiny**
2. Klepněte na název skupiny
3. Seznam členů View/edit
4. Přidejte nebo odeberte uživatele
5. Klikněte na **Uložit**

### Upravit vlastnosti skupiny

Přizpůsobit nastavení skupiny:1. Přejděte na **Uživatelé > Skupiny**
2. Klepněte na název skupiny
3. Upravit:
   - Název skupiny
   - Popis skupiny
   - Skupina zobrazení (show/hide)
   - Typ skupiny
4. Klikněte na **Uložit**

## Uživatelská oprávnění

### Vysvětlení oprávnění

Tři úrovně oprávnění:

| Úroveň | Rozsah | Příklad |
|---|---|---|
| **Přístup k modulu** | Může modul see/use | Má přístup k modulu Fórum |
| **Oprávnění k obsahu** | Může zobrazit konkrétní obsah | Umí číst publikované zprávy |
| **Funkční oprávnění** | Může provádět akce | Může přidávat komentáře |

### Konfigurace přístupu k modulu

**Umístění:** Systém > Oprávnění

Omezte, které skupiny mají přístup ke každému modulu:

```
Module: News

Admin Access:
☑ Webmasters
☑ Admins
☐ Moderators
☐ Registered Users
☐ Anonymous

User Access:
☐ Webmasters
☐ Admins
☑ Moderators
☑ Registered Users
☑ Anonymous
```

Klikněte na **Uložit** pro použití.

### Nastavte oprávnění k obsahu

Řízení přístupu ke konkrétnímu obsahu:

Příklad – Zpravodajský článek:
```
View Permission:
☑ All groups can read

Post Permission:
☑ Registered Users
☑ Content Editors
☐ Anonymous

Moderate Comments:
☑ Moderators required
```

### Doporučené postupy pro povolení

```
Public Content (News, Pages):
├── View: All groups
├── Post: Registered Users + Editors
└── Moderate: Admins + Moderators

Community (Forum, Comments):
├── View: All groups
├── Post: Registered Users
└── Moderate: Moderators + Admins

Admin Tools:
├── View: Webmasters + Admins only
├── Configure: Webmasters only
└── Delete: Webmasters only
```

## Správa registrace uživatelů

### Vyřizování registračních požadavků

Pokud je povoleno „Schválení správce“:

1. Přejděte na **Uživatelé > Požadavky uživatelů**
2. Zobrazení nevyřízených registrací:
   - Uživatelské jméno
   - E-mail
   - Datum registrace
   - Stav žádosti

3. Pro každý požadavek:
   - Klikněte pro kontrolu
   - Pro aktivaci klikněte na **"Schválit"**
   - Kliknutím na **"Odmítnout"** odmítnete

### Odeslat registrační e-mail

Znovu odeslat e-mail welcome/verification:

1. Přejděte na **Uživatelé > Uživatelé**
2. Klikněte na uživatel
3. Klikněte na **„Odeslat e-mail“** nebo **„Znovu odeslat ověření“**
4. E-mail odeslaný uživateli

## Online sledování uživatelů

### Zobrazit aktuálně online uživatele

Sledujte aktivní návštěvníky webu:

**Umístění:** Uživatelé > Online uživatelé

pořady:
- Aktuální online uživatelé
- Počítají se návštěvníci
- Čas poslední aktivity
- IP adresa
- Místo procházení

### Sledování aktivity uživatele

Pochopte chování uživatele:

```
Active Users: 12
Registered: 8
Anonymous: 4

Recent Activity:
- User1 - Forum post (2 min ago)
- User2 - Comment (5 min ago)
- User3 - Page view (8 min ago)
```

## Přizpůsobení uživatelského profilu

### Povolit uživatelské profily

Konfigurace možností uživatelského profilu:

**Správce > Systém > Předvolby > Uživatelská nastavení**

```
Allow User Profiles: ☑ Yes
Show Member List: ☑ Yes
Users Can Edit Profile: ☑ Yes
Show User Avatar: ☑ Yes
Show Last Online: ☑ Yes
Show Email Address: ☐ Yes / ☑ No
```

### Pole profilu

Nakonfigurujte, co mohou uživatelé přidávat do profilů:

Příklad polí profilu:
- Skutečné jméno
- Webové stránky URL
- Životopis
- Umístění
- Avatar (obrázek)
- Podpis
- Zájmy
- Odkazy na sociální sítě

Přizpůsobte v nastavení modulu.

## Ověření uživatele

### Povolit dvoufaktorovou autentizaci

Možnost vylepšeného zabezpečení (pokud je k dispozici):

**Správce > Uživatelé > Nastavení**

```
Two-Factor Authentication: ☑ Enabled

Methods:
☑ Email
☑ SMS
☑ Authenticator App
```

Uživatelé musí ověřit druhou metodou.

### Zásady hesel

Vynutit silná hesla:

**Správce > Systém > Předvolby > Uživatelská nastavení**

```
Minimum Password Length: 8 characters
Require Uppercase: ☑ Yes
Require Numbers: ☑ Yes
Require Special Chars: ☑ Yes

Password Expiration: 90 days
Force Change on First Login: ☑ Yes
```

### Pokusy o přihlášení

Zabraňte útokům hrubou silou:

```
Lock After Failed Attempts: 5
Lock Duration: 15 minutes
Log All Attempts: ☑ Yes
Notify Admin: ☑ Yes
```

## Správa e-mailů uživatelů

### Odeslat hromadný e-mail skupině

Poslat zprávu více uživatelům:

1. Přejděte na **Uživatelé > Uživatelé**
2. Vyberte více uživatelů (zaškrtávací políčka)
3. Klikněte na **Odeslat e-mail**
4. Napište zprávu:
   - Předmět
   - Tělo zprávy
   - Zahrnout podpis
5. Klikněte na **Odeslat**

### Nastavení upozornění e-mailem

Nakonfigurujte, jaké e-maily uživatelé obdrží:

**Správce > Systém > Předvolby > Nastavení e-mailu**

```
New Registration: ☑ Send welcome email
Password Reset: ☑ Send reset link
Comments: ☑ Notify on replies
Messages: ☑ Notify new messages
Notifications: ☑ Site announcements
Frequency: ☐ Immediate / ☑ Daily / ☐ Weekly
```

## Uživatelské statistiky

### Zobrazit hlášení uživatelů

Sledujte uživatelské metriky:

**Správce > Systém > Hlavní panel**

```
User Statistics:
├── Total Users: 256
├── Active Users: 189
├── New This Month: 24
├── Registration Requests: 3
├── Currently Online: 12
└── Last 24h Posts: 45
```

### Sledování růstu uživatelů

Sledujte trendy registrace:

```
Registrations Last 7 Days: 12 users
Registrations Last 30 Days: 48 users
Active Users (30 days): 156
Inactive Users (30+ days): 100
```

## Běžné úlohy správy uživatelů

### Vytvořit administrátora

1. Vytvořte nového uživatele (krok výše)
2. Přiřaďte do skupiny **Webmasteři** nebo **Správci**
3. Udělte oprávnění v části Systém > Oprávnění
4. Ověřte, že přístup správce funguje

### Vytvořit moderátora

1. Vytvořte nového uživatele
2. Přiřaďte do skupiny **Moderátoři**
3. Nakonfigurujte oprávnění k moderování konkrétních modulů
4. Uživatel může schvalovat obsah, spravovat komentáře

### Nastavení editorů obsahu

1. Vytvořte skupinu **Editoři obsahu**
2. Vytvořte uživatele, přiřaďte do skupiny
3. Udělte oprávnění:
   - Stránky Create/edit
   - Příspěvky Create/edit
   - Mírné komentáře
4. Omezte přístup k panelu administrátora

### Resetovat zapomenuté heslo

Uživatel zapomněl své heslo:

1. Přejděte na **Uživatelé > Uživatelé**
2. Najděte uživatele
3. Klikněte na uživatelské jméno
4. Klikněte na **"Resetovat heslo"** nebo upravte pole hesla
5. Nastavte dočasné heslo
6. Upozornit uživatele (poslat e-mail)
7. Uživatel se přihlásí, změní heslo

### Hromadný import uživatelů

Import seznamu uživatelů (pokročilé):

Mnoho hostingových panelů poskytuje nástroje pro:
1. Připravte soubor CSV s uživatelskými daty
2. Nahrajte přes admin panel
3. Hromadné vytváření účtů

Nebo pro import použijte vlastní script/plugin.

## Ochrana osobních údajů uživatele

### Respektujte soukromí uživatelů

Doporučené postupy ochrany soukromí:

```
Do:
✓ Hide emails by default
✓ Let users choose visibility
✓ Protect against spam

Don't:
✗ Share private data
✗ Display without permission
✗ Use for marketing without consent
```

### Soulad se GDPR

Pokud slouží uživatelům z EU:1. Získejte souhlas se sběrem dat
2. Umožněte uživatelům stahovat jejich data
3. Poskytněte možnost odstranění účtu
4. Dodržujte zásady ochrany osobních údajů
5. Činnosti zpracování dat protokolu

## Odstraňování problémů uživatele

### Uživatel se nemůže přihlásit

**Problém:** Uživatel zapomněl heslo nebo se nemůže přihlásit k účtu

**Řešení:**
1. Ověřte, zda je uživatelský účet „aktivní“
2. Obnovení hesla:
   - Správce > Uživatelé > Najít uživatele
   - Nastavte nové dočasné heslo
   - Odeslat uživateli e-mailem
3. Vymažte uživatele cookies/cache
4. Zkontrolujte, zda není účet uzamčen

### Registrace uživatele se zasekla

**Problém:** Uživatel nemůže dokončit registraci

**Řešení:**
1. Zkontrolujte, zda je povolena registrace:
   - Správce > Systém > Předvolby > Uživatelská nastavení
   - Povolit registraci
2. Zkontrolujte funkčnost nastavení e-mailu
3. Pokud je vyžadováno ověření e-mailem:
   - Znovu odeslat ověřovací e-mail
   - Zkontrolujte složku se spamem
4. Pokud jsou příliš přísné, snižte požadavky na heslo

### Duplicitní účty

**Problém:** Uživatel má více účtů

**Řešení:**
1. Identifikujte duplicitní účty v seznamu uživatelů
2. Udržujte primární účet
3. Pokud je to možné, sloučte data
4. Odstraňte duplicitní účty
5. V nastavení povolte „Zabránit duplicitním e-mailům“.

## Kontrolní seznam pro správu uživatelů

Pro počáteční nastavení:

- [ ] Nastavit typ registrace uživatele (instant/email/admin)
- [ ] Vytvořte požadované skupiny uživatelů
- [ ] Konfigurace oprávnění skupiny
- [ ] Nastavit zásady hesel
- [ ] Povolit uživatelské profily
- [ ] Konfigurace e-mailových upozornění
- [ ] Nastavte možnosti uživatelského avatara
- [ ] Zkušební registrační proces
- [ ] Vytvořit testovací účty
- [ ] Ověřte funkční oprávnění
- [ ] Struktura skupiny dokumentů
- [ ] Naplánujte si registraci uživatele

## Další kroky

Po nastavení uživatelů:

1. Nainstalujte moduly, které uživatelé potřebují
2. Vytvořte obsah pro uživatele
3. Zabezpečení uživatelských účtů
4. Prozkoumejte další funkce správce
5. Nakonfigurujte nastavení pro celý systém

---

**Značky:** #users #groups #permissions #administration #access-control

**Související články:**
- Admin-Panel-Přehled
- Instalační moduly
- ../Configuration/Security-Configuration
- ../Configuration/System-Settings