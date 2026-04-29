---
title: "Administrer brugere"
description: "Omfattende vejledning til brugeradministration i XOOPS inklusive oprettelse af brugere, brugergrupper, tilladelser og brugerroller"
---

# Håndtering af brugere i XOOPS

Lær, hvordan du opretter brugerkonti, organiserer brugere i grupper og administrerer tilladelser i XOOPS.

## Oversigt over brugerstyring

XOOPS giver omfattende brugerstyring med:

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

## Adgang til brugeradministration

### Admin Panel Navigation

1. Log ind på admin: `http://your-domain.com/xoops/admin/`
2. Klik på **Brugere** i venstre sidebjælke
3. Vælg mellem muligheder:
   - **Brugere:** Administrer individuelle konti
   - **Grupper:** Administrer brugergrupper
   - **Onlinebrugere:** Se aktive brugere
   - **Brugeranmodninger:** Behandle registreringsanmodninger

## Forstå brugerroller

XOOPS leveres med foruddefinerede brugerroller:

| Gruppe | Rolle | Evner | Use Case |
|---|---|---|---|
| **Webmastere** | Administrator | Fuld kontrol af webstedet | Hovedadministratorer |
| **Admins** | Administrator | Begrænset admin adgang | Betroede brugere |
| **Moderatorer** | Indholdskontrol | Godkend indhold | Fællesskabsforvaltere |
| **Redaktører** | Oprettelse af indhold | Opret/rediger indhold | Indholdspersonale |
| **Registreret** | Medlem | Indlæg, kommentar, profil | Faste brugere |
| **Anonym** | Besøgende | Læsebeskyttet | Ikke-loggede brugere |

## Oprettelse af brugerkonti

### Metode 1: Admin opretter bruger

**Trin 1: Få adgang til brugeroprettelse**

1. Gå til **Brugere > Brugere**
2. Klik på **"Tilføj ny bruger"** eller **"Opret bruger"**

**Trin 2: Indtast brugeroplysninger**

Udfyld brugeroplysninger:

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

**Trin 3: Konfigurer brugerindstillinger**

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

**Trin 4: Yderligere muligheder**

```
Notify User: ☑ Send welcome email
Allow Avatar: ☑ Yes
User Theme: [Default theme]
Show Email: ☐ Public / ☑ Private
```

**Trin 5: Opret konto**

Klik på **"Tilføj bruger"** eller **"Opret"**

Bekræftelse:
```
User created successfully!
Username: john_smith
Email: john@example.com
Groups: Registered Users
```

### Metode 2: Brugerselvregistrering

Tillad brugere at registrere sig selv:

**Administrationspanel > System > Præferencer > Brugerindstillinger**

```
Allow User Registration: ☑ Yes

Registration Type:
☐ Instant (Approve automatically)
☑ Email Verification (Email confirmation)
☐ Admin Approval (You approve each)

Send Verification Email: ☑ Yes
```

Derefter:
1. Brugere besøger registreringssiden
2. Udfyld grundlæggende oplysninger
3. Bekræft e-mail eller vent på godkendelse
4. Konto aktiveret

## Håndtering af brugerkonti

### Se alle brugere

**Placering:** Brugere > Brugere

Viser brugerliste med:
- Brugernavn
- E-mailadresse
- Registreringsdato
- Sidste login
- Brugerstatus (aktiv/inaktiv)
- Gruppemedlemskab

### Rediger brugerkonto

1. Klik på brugernavn på brugerlisten
2. Rediger ethvert felt:
   - E-mailadresse
   - Adgangskode
   - Rigtige navn
   - Brugergrupper
   - Status

3. Klik på **"Gem"** eller **"Opdater"**

### Skift brugeradgangskode

1. Klik på bruger på listen
2. Rul til afsnittet "Skift adgangskode".
3. Indtast ny adgangskode
4. Bekræft adgangskoden
5. Klik på **"Skift adgangskode"**

Brugeren vil bruge ny adgangskode ved næste login.

### Deaktiver/suspender bruger

Deaktiver kontoen midlertidigt uden sletning:

1. Klik på bruger på listen
2. Indstil **Brugerstatus** til "Inaktiv"
3. Klik på **"Gem"**

Brugeren kan ikke logge ind, mens han er inaktiv.

### Genaktiver bruger

1. Klik på bruger på listen
2. Indstil **Brugerstatus** til "Aktiv"
3. Klik på **"Gem"**

Brugeren kan logge ind igen.

### Slet brugerkonto

Fjern bruger permanent:

1. Klik på bruger på listen
2. Rul til bunden
3. Klik på **"Slet bruger"**
4. Bekræft: "Slet bruger og alle data?"
5. Klik på **"Ja"**

**Advarsel:** Sletningen er permanent!

### Se brugerprofil

Se brugerprofildetaljer:

1. Klik på brugernavn i brugerlisten
2. Gennemgå profiloplysninger:
   - Rigtige navn
   - E-mail
   - Hjemmeside
   - Tilmeldingsdato
   - Sidste login
   - Brugerbiografi
   - Avatar
   - Indlæg/bidrag

## Forstå brugergrupper

### Standardbrugergrupper

XOOPS inkluderer standardgrupper:

| Gruppe | Formål | Speciel | Rediger |
|---|---|---|---|
| **Anonym** | Ikke-loggede brugere | Fast | Nej |
| **Registrerede brugere** | Faste medlemmer | Standard | Ja |
| **Webmastere** | Webstedsadministratorer | Admin | Ja |
| **Admins** | Begrænsede administratorer | Admin | Ja |
| **Moderatorer** | Indholdsmoderatorer | Brugerdefineret | Ja |

### Opret brugerdefineret gruppe

Opret gruppe til specifik rolle:

**Placering:** Brugere > Grupper

1. Klik på **"Tilføj ny gruppe"**
2. Indtast gruppeoplysninger:

```
Group Name: Content Editors
Group Description: Users who can create and edit content

Display Group: ☑ Yes (Show in member profiles)
Group Type: ☑ Regular / ☐ Admin
```

3. Klik på **"Opret gruppe"**

### Administrer gruppemedlemskab

Tildel brugere til grupper:

**Mulighed A: Fra brugerliste**1. Gå til **Brugere > Brugere**
2. Klik på bruger
3. Marker/fjern markeringen af grupper i afsnittet "Brugergrupper".
4. Klik på **"Gem"**

**Mulighed B: Fra grupper**

1. Gå til **Brugere > Grupper**
2. Klik på gruppenavn
3. Se/rediger medlemslisten
4. Tilføj eller fjern brugere
5. Klik på **"Gem"**

### Rediger gruppeegenskaber

Tilpas gruppeindstillinger:

1. Gå til **Brugere > Grupper**
2. Klik på gruppenavn
3. Rediger:
   - Gruppenavn
   - Gruppebeskrivelse
   - Vis gruppe (vis/skjul)
   - Gruppetype
4. Klik på **"Gem"**

## Brugertilladelser

### Forstå tilladelser

Tre tilladelsesniveauer:

| Niveau | Omfang | Eksempel |
|---|---|---|
| **Moduladgang** | Kan se/bruge modul | Kan få adgang til Forum modul |
| **Indholdstilladelser** | Kan se specifikt indhold | Kan læse offentliggjorte nyheder |
| **Funktionstilladelser** | Kan udføre handlinger | Kan skrive kommentarer |

### Konfigurer moduladgang

**Placering:** System > Tilladelser

Begræns, hvilke grupper der kan få adgang til hvert modul:

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

Klik på **"Gem"** for at ansøge.

### Indstil indholdstilladelser

Styr adgangen til specifikt indhold:

Eksempel - Nyhedsartikel:
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

### Gode fremgangsmåder for tilladelse

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

## Brugerregistreringsstyring

### Håndter registreringsanmodninger

Hvis "Administratorgodkendelse" er aktiveret:

1. Gå til **Brugere > Brugeranmodninger**
2. Se afventende registreringer:
   - Brugernavn
   - E-mail
   - Registreringsdato
   - Anmodningsstatus

3. For hver anmodning:
   - Klik for at gennemgå
   - Klik på **"Godkend"** for at aktivere
   - Klik på **"Afvis"** for at afvise

### Send registrerings-e-mail

Send velkomst-/bekræftelsesmail igen:

1. Gå til **Brugere > Brugere**
2. Klik på bruger
3. Klik på **"Send e-mail"** eller **"Send bekræftelse igen"**
4. E-mail sendt til bruger

## Online brugerovervågning

### Se brugere, der er online i øjeblikket

Spor aktive besøgende på webstedet:

**Placering:** Brugere > Onlinebrugere

Viser:
- Nuværende onlinebrugere
- Gæstebesøgende tæller
- Sidste aktivitetstidspunkt
- IP-adresse
- Gennemse placering

### Overvåg brugeraktivitet

Forstå brugeradfærd:

```
Active Users: 12
Registered: 8
Anonymous: 4

Recent Activity:
- User1 - Forum post (2 min ago)
- User2 - Comment (5 min ago)
- User3 - Page view (8 min ago)
```

## Brugerprofiltilpasning

### Aktiver brugerprofiler

Konfigurer brugerprofilindstillinger:

**Admin > System > Præferencer > Brugerindstillinger**

```
Allow User Profiles: ☑ Yes
Show Member List: ☑ Yes
Users Can Edit Profile: ☑ Yes
Show User Avatar: ☑ Yes
Show Last Online: ☑ Yes
Show Email Address: ☐ Yes / ☑ No
```

### Profilfelter

Konfigurer, hvad brugere kan føje til profiler:

Eksempel på profilfelter:
- Rigtige navn
- Hjemmeside URL
- Biografi
- Beliggenhed
- Avatar (billede)
- Underskrift
- Interesser
- Links til sociale medier

Tilpas i modulindstillinger.

## Brugergodkendelse

### Aktiver to-faktor-godkendelse

Mulighed for forbedret sikkerhed (hvis tilgængelig):

**Admin > Brugere > Indstillinger**

```
Two-Factor Authentication: ☑ Enabled

Methods:
☑ Email
☑ SMS
☑ Authenticator App
```

Brugere skal bekræfte med anden metode.

### Adgangskodepolitik

Gennemtving stærke adgangskoder:

**Admin > System > Præferencer > Brugerindstillinger**

```
Minimum Password Length: 8 characters
Require Uppercase: ☑ Yes
Require Numbers: ☑ Yes
Require Special Chars: ☑ Yes

Password Expiration: 90 days
Force Change on First Login: ☑ Yes
```

### Loginforsøg

Undgå brute force angreb:

```
Lock After Failed Attempts: 5
Lock Duration: 15 minutes
Log All Attempts: ☑ Yes
Notify Admin: ☑ Yes
```

## Administration af brugere-e-mail

### Send massemail til gruppen

Send besked til flere brugere:

1. Gå til **Brugere > Brugere**
2. Vælg flere brugere (afkrydsningsfelter)
3. Klik på **"Send e-mail"**
4. Skriv besked:
   - Emne
   - Meddelelsestekst
   - Inkluder underskrift
5. Klik på **"Send"**

### Indstillinger for e-mailbeskeder

Konfigurer, hvilke e-mails brugere modtager:

**Admin > System > Præferencer > E-mail-indstillinger**

```
New Registration: ☑ Send welcome email
Password Reset: ☑ Send reset link
Comments: ☑ Notify on replies
Messages: ☑ Notify new messages
Notifications: ☑ Site announcements
Frequency: ☐ Immediate / ☑ Daily / ☐ Weekly
```

## Brugerstatistik

### Se brugerrapporter

Overvåg brugermetrics:

**Admin > System > Dashboard**

```
User Statistics:
├── Total Users: 256
├── Active Users: 189
├── New This Month: 24
├── Registration Requests: 3
├── Currently Online: 12
└── Last 24h Posts: 45
```

### Brugervækstsporing

Overvåg registreringstendenser:

```
Registrations Last 7 Days: 12 users
Registrations Last 30 Days: 48 users
Active Users (30 days): 156
Inactive Users (30+ days): 100
```

## Almindelige brugeradministrationsopgaver

### Opret administratorbruger

1. Opret ny bruger (trin ovenfor)
2. Tildel til **Webmasters** eller **Admins** gruppe
3. Giv tilladelser i System > Tilladelser
4. Bekræft at administratoradgang virker

### Opret moderator

1. Opret ny bruger
2. Tildel til gruppen **Moderatorer**
3. Konfigurer tilladelser til at moderere specifikke moduler
4. Brugeren kan godkende indhold, administrere kommentarer

### Opsæt indholdseditorer

1. Opret **Indholdsredaktører** gruppe
2. Opret brugere, tildel til gruppe
3. Giv tilladelser til:
   - Opret/rediger sider
   - Opret/rediger indlæg
   - Moderate kommentarer
4. Begræns admin paneladgang

### Nulstil glemt adgangskode

Brugeren har glemt sin adgangskode:

1. Gå til **Brugere > Brugere**
2. Find bruger
3. Klik på brugernavn
4. Klik på **"Nulstil adgangskode"** eller rediger adgangskodefeltet
5. Indstil midlertidig adgangskode
6. Giv brugeren besked (send e-mail)
7. Bruger logger på, ændrer adgangskode

### MasseimportbrugereImporter brugerliste (avanceret):

Mange hostingpaneler giver værktøjer til at:
1. Forbered CSV-fil med brugerdata
2. Upload via admin panel
3. Masse oprette konti

Eller brug brugerdefineret script/plugin til import.

## Brugerbeskyttelse

### Respekter brugernes privatliv

Bedste praksis for privatliv:

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

### GDPR Overholdelse

Hvis du betjener EU-brugere:

1. Få samtykke til dataindsamling
2. Tillad brugere at downloade deres data
3. Giv mulighed for sletning af konto
4. Vedligehold privatlivspolitik
5. Log databehandlingsaktiviteter

## Fejlfinding af brugerproblemer

### Brugeren kan ikke logge ind

**Problem:** Brugeren har glemt adgangskoden eller kan ikke få adgang til kontoen

**Løsning:**
1. Bekræft, at brugerkontoen er "Aktiv"
2. Nulstil adgangskode:
   - Admin > Brugere > Find bruger
   - Indstil ny midlertidig adgangskode
   - Send til bruger via e-mail
3. Ryd brugercookies/cache
4. Tjek, om kontoen ikke er låst

### Brugerregistrering sidder fast

**Problem:** Brugeren kan ikke fuldføre registreringen

**Løsning:**
1. Tjekregistrering er tilladt:
   - Admin > System > Præferencer > Brugerindstillinger
   - Aktiver registrering
2. Tjek, at e-mail-indstillinger fungerer
3. Hvis e-mailbekræftelse kræves:
   - Send bekræftelses-e-mail igen
   - Tjek spam-mappen
4. Lavere adgangskodekrav, hvis det er for strengt

### Dublerede konti

**Problem:** Brugeren har flere konti

**Løsning:**
1. Identificer dubletkonti i brugerlisten
2. Behold primær konto
3. Flet data, hvis det er muligt
4. Slet dubletkonti
5. Aktiver "Forhindr duplikat-e-mail" i indstillingerne

## Tjekliste for brugeradministration

Til indledende opsætning:

- [ ] Indstil brugerregistreringstype (instant/email/admin)
- [ ] Opret nødvendige brugergrupper
- [ ] Konfigurer gruppetilladelser
- [ ] Indstil adgangskodepolitik
- [ ] Aktiver brugerprofiler
- [ ] Konfigurer e-mail-meddelelser
- [ ] Indstil brugeravatarindstillinger
- [ ] Testregistreringsproces
- [ ] Opret testkonti
- [ ] Bekræft, at tilladelserne fungerer
- [ ] Dokumentgruppestruktur
- [ ] Planlæg brugeronboarding

## Næste trin

Efter opsætning af brugere:

1. Installer moduler, som brugerne har brug for
2. Opret indhold til brugerne
3. Sikre brugerkonti
4. Udforsk flere admin-funktioner
5. Konfigurer indstillinger for hele systemet

---

**Tags:** #brugere #grupper #tilladelser #administration #adgangskontrol

**Relaterede artikler:**
- Admin-Panel-Oversigt
- Installation af moduler
- ../Configuration/Security-Configuration
- ../Configuration/System-Settings
