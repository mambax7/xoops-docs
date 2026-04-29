---
title: "Upravljanje uporabnikov"
description: "Obsežen vodnik za upravljanje uporabnikov v XOOPS, vključno z ustvarjanjem uporabnikov, skupin uporabnikov, dovoljenj in uporabniških vlog"
---
# Upravljanje uporabnikov v XOOPS

Naučite se ustvariti uporabniške račune, organizirati uporabnike v skupine in upravljati dovoljenja v XOOPS.

## Pregled upravljanja uporabnikov

XOOPS zagotavlja celovito upravljanje uporabnikov z:
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
## Dostop do upravljanja uporabnikov

### Krmarjenje po skrbniški plošči

1. Prijavite se v admin: `http://your-domain.com/XOOPS/admin/`
2. V levi stranski vrstici kliknite **Uporabniki**
3. Izberite med možnostmi:
   - **Uporabniki:** Upravljajte posamezne račune
   - **Skupine:** Upravljajte uporabniške skupine
   - **Spletni uporabniki:** Oglejte si trenutno aktivne uporabnike
   - **Uporabniške zahteve:** Obdelajte zahteve za registracijo

## Razumevanje uporabniških vlog

XOOPS ima vnaprej določene uporabniške vloge:

| Skupina | Vloga | Zmogljivosti | Primer uporabe |
|---|---|---|---|
| **Spletni mojstri** | Administrator | Popoln nadzor spletnega mesta | Glavni skrbniki |
| **Administratorji** | Administrator | Omejen skrbniški dostop | Zaupanja vredni uporabniki |
| **Moderatorji** | Nadzor vsebine | Odobri vsebino | Vodje skupnosti |
| **Uredniki** | Ustvarjanje vsebin | Create/edit vsebina | Vsebina osebja |
| **Registriran** | Član | Objava, komentar, profil | Redni uporabniki |
| **Anonimno** | Obiskovalec | Samo za branje | Neprijavljeni uporabniki |

## Ustvarjanje uporabniških računov

### 1. način: skrbnik ustvari uporabnika

**1. korak: dostop do ustvarjanja uporabnika**

1. Pojdite na **Uporabniki > Uporabniki**
2. Kliknite **"Dodaj novega uporabnika"** ali **"Ustvari uporabnika"**

**2. korak: Vnesite podatke o uporabniku**

Izpolnite podatke o uporabniku:
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
**3. korak: Konfigurirajte uporabniške nastavitve**
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
**4. korak: Dodatne možnosti**
```
Notify User: ☑ Send welcome email
Allow Avatar: ☑ Yes
User Theme: [Default theme]
Show Email: ☐ Public / ☑ Private
```
**5. korak: Ustvarite račun**

Kliknite **"Dodaj uporabnika"** ali **"Ustvari"**

Potrditev:
```
User created successfully!
Username: john_smith
Email: john@example.com
Groups: Registered Users
```
### 2. način: Samoregistracija uporabnika

Dovoli uporabnikom, da se sami registrirajo:

**Skrbniška plošča > Sistem > Nastavitve > Uporabniške nastavitve**
```
Allow User Registration: ☑ Yes

Registration Type:
☐ Instant (Approve automatically)
☑ Email Verification (Email confirmation)
☐ Admin Approval (You approve each)

Send Verification Email: ☑ Yes
```
Nato:
1. Uporabniki obiščejo stran za registracijo
2. Izpolnite osnovne podatke
3. Preverite e-pošto ali počakajte na odobritev
4. Račun aktiviran

## Upravljanje uporabniških računov

### Prikaži vse uporabnike

**Lokacija:** Uporabniki > Uporabniki

Prikaže seznam uporabnikov z:
- Uporabniško ime
- E-poštni naslov
- Datum registracije
- Zadnja prijava
- Stanje uporabnika (Active/Inactive)
- Članstvo v skupini

### Uredi uporabniški račun

1. Na seznamu uporabnikov kliknite uporabniško ime
2. Spremenite poljubno polje:
   - E-poštni naslov
   - Geslo
   - Pravo ime
   - Skupine uporabnikov
   - Stanje

3. Kliknite **"Shrani"** ali **"Posodobi"**

### Spremeni uporabniško geslo

1. Kliknite uporabnika na seznamu
2. Pomaknite se do razdelka »Spremeni geslo«.
3. Vnesite novo geslo
4. Potrdite geslo
5. Kliknite **»Spremeni geslo«**

Uporabnik bo ob naslednji prijavi uporabil novo geslo.

### Deactivate/Suspend Uporabnik

Začasno onemogoči račun brez izbrisa:

1. Kliknite uporabnika na seznamu
2. Nastavite **Stanje uporabnika** na "Neaktivno"
3. Kliknite **"Shrani"**

Uporabnik se ne more prijaviti, ko je neaktiven.

### Ponovno aktiviraj uporabnika

1. Kliknite uporabnika na seznamu
2. Nastavite **Stanje uporabnika** na "Aktivno"
3. Kliknite **"Shrani"**

Uporabnik se lahko znova prijavi.

### Izbriši uporabniški račun

Trajno odstranite uporabnika:

1. Kliknite uporabnika na seznamu
2. Pomaknite se na dno
3. Kliknite **"Izbriši uporabnika"**
4. Potrdite: "Izbriši uporabnika in vse podatke?"
5. Kliknite **"Da"****Opozorilo:** Izbris je trajen!

### Ogled uporabniškega profila

Oglejte si podrobnosti uporabniškega profila:

1. Kliknite uporabniško ime na seznamu uporabnikov
2. Preglejte informacije o profilu:
   - Pravo ime
   - E-pošta
   - Spletna stran
   - Datum pridružitve
   - Zadnja prijava
   - Biografija uporabnika
   - Avatar
   - Posts/contributions

## Razumevanje uporabniških skupin

### Privzete skupine uporabnikov

XOOPS vključuje privzete skupine:

| Skupina | Namen | Posebno | Uredi |
|---|---|---|---|
| **Anonimno** | Neprijavljeni uporabniki | Popravljen | Ne |
| **Registrirani uporabniki** | Redni člani | Privzeto | Da |
| **Spletni mojstri** | Skrbniki strani | Admin | Da |
| **Administratorji** | Omejeni skrbniki | Admin | Da |
| **Moderatorji** | Moderatorji vsebin | Po meri | Da |

### Ustvari skupino po meri

Ustvari skupino za določeno vlogo:

**Lokacija:** Uporabniki > Skupine

1. Kliknite **"Dodaj novo skupino"**
2. Vnesite podrobnosti skupine:
```
Group Name: Content Editors
Group Description: Users who can create and edit content

Display Group: ☑ Yes (Show in member profiles)
Group Type: ☑ Regular / ☐ Admin
```
3. Kliknite **"Ustvari skupino"**

### Upravljanje članstva v skupini

Dodeli uporabnike v skupine:

**Možnost A: s seznama uporabnikov**

1. Pojdite na **Uporabniki > Uporabniki**
2. Kliknite uporabnik
3. Check/uncheck skupin v razdelku »Uporabniške skupine«.
4. Kliknite **"Shrani"**

**Možnost B: Iz skupin**

1. Pojdite na **Uporabniki > Skupine**
2. Kliknite ime skupine
3. View/edit seznam članov
4. Dodajte ali odstranite uporabnike
5. Kliknite **"Shrani"**

### Uredi lastnosti skupine

Prilagodite nastavitve skupine:

1. Pojdite na **Uporabniki > Skupine**
2. Kliknite ime skupine
3. Spremenite:
   - Ime skupine
   - Opis skupine
   - Prikazna skupina (show/hide)
   - Vrsta skupine
4. Kliknite **"Shrani"**

## Uporabniška dovoljenja

### Razumevanje dovoljenj

Tri ravni dovoljenj:

| Stopnja | Obseg | Primer |
|---|---|---|
| **Dostop do modula** | Can see/use modul | Lahko dostopa do forumskega modula |
| **Dovoljenja za vsebino** | Lahko si ogleda določeno vsebino | Lahko bere objavljene novice |
| **Dovoljenja za funkcije** | Lahko izvaja dejanja | Lahko objavlja komentarje |

### Konfigurirajte dostop do modula

**Lokacija:** Sistem > Dovoljenja

Omejite, katere skupine lahko dostopajo do posameznega modula:
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
Za uporabo kliknite **"Shrani"**.

### Nastavite dovoljenja za vsebino

Nadzor dostopa do določene vsebine:

Primer – članek z novicami:
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
### Najboljše prakse dovoljenj
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
## Upravljanje registracije uporabnikov

### Obravnava zahteve za registracijo

Če je omogočena možnost »Odobritev skrbnika«:

1. Pojdite na **Uporabniki > Uporabniške zahteve**
2. Oglejte si čakajoče registracije:
   - Uporabniško ime
   - E-pošta
   - Datum registracije
   - Stanje zahteve

3. Za vsako zahtevo:
   - Kliknite za pregled
   - Za aktivacijo kliknite **"Odobri"**
   - Za zavrnitev kliknite **"Zavrni"**

### Pošlji registracijsko e-pošto

Ponovno pošlji welcome/verification e-pošto:

1. Pojdite na **Uporabniki > Uporabniki**
2. Kliknite uporabnik
3. Kliknite **»Pošlji e-pošto«** ali **»Ponovno pošlji potrditev«**
4. E-poštno sporočilo, poslano uporabniku

## Spremljanje spletnih uporabnikov

### Oglejte si trenutno povezane uporabnike

Sledite aktivnim obiskovalcem spletnega mesta:

**Lokacija:** Uporabniki > Spletni uporabniki

Oddaje:
- Trenutni spletni uporabniki
- Gostje obiskovalci štejejo
- Čas zadnje dejavnosti
- naslov IP
- Lokacija brskanja

### Spremljajte dejavnost uporabnika

Razumeti vedenje uporabnikov:
```
Active Users: 12
Registered: 8
Anonymous: 4

Recent Activity:
- User1 - Forum post (2 min ago)
- User2 - Comment (5 min ago)
- User3 - Page view (8 min ago)
```
## Prilagajanje uporabniškega profila

### Omogoči uporabniške profile

Konfigurirajte možnosti uporabniškega profila:

**Skrbnik > Sistem > Nastavitve > Uporabniške nastavitve**
```
Allow User Profiles: ☑ Yes
Show Member List: ☑ Yes
Users Can Edit Profile: ☑ Yes
Show User Avatar: ☑ Yes
Show Last Online: ☑ Yes
Show Email Address: ☐ Yes / ☑ No
```
### Polja profila

Konfigurirajte, kaj lahko uporabniki dodajo v profile:

Primer polj profila:
- Pravo ime
- Spletna stran URL
- Biografija
- Lokacija
- Avatar (slika)
- Podpis
- Zanimanja
- Povezave do družbenih medijev

Prilagodite v nastavitvah modula.

## Preverjanje pristnosti uporabnika

### Omogoči dvostopenjsko avtentikacijo

Možnost izboljšane varnosti (če je na voljo):

**Skrbnik > Uporabniki > Nastavitve**
```
Two-Factor Authentication: ☑ Enabled

Methods:
☑ Email
☑ SMS
☑ Authenticator App
```
Uporabniki morajo preveriti z drugo metodo.

### Politika gesel

Uveljavi močna gesla:

**Skrbnik > Sistem > Nastavitve > Uporabniške nastavitve**
```
Minimum Password Length: 8 characters
Require Uppercase: ☑ Yes
Require Numbers: ☑ Yes
Require Special Chars: ☑ Yes

Password Expiration: 90 days
Force Change on First Login: ☑ Yes
```
### Poskusi prijave

Preprečite napade s surovo silo:
```
Lock After Failed Attempts: 5
Lock Duration: 15 minutes
Log All Attempts: ☑ Yes
Notify Admin: ☑ Yes
```
## Upravljanje uporabniške e-pošte

### Pošlji množično e-pošto skupini

Pošlji sporočilo več uporabnikom:

1. Pojdite na **Uporabniki > Uporabniki**
2. Izberite več uporabnikov (potrditvena polja)
3. Kliknite **"Pošlji e-pošto"**
4. Sestavite sporočilo:
   - Zadeva
   - Telo sporočila
   - Vključi podpis
5. Kliknite **"Pošlji"**

### Nastavitve e-poštnih obvestil

Konfigurirajte, katera e-poštna sporočila prejemajo uporabniki:

**Skrbnik > Sistem > Nastavitve > Nastavitve e-pošte**
```
New Registration: ☑ Send welcome email
Password Reset: ☑ Send reset link
Comments: ☑ Notify on replies
Messages: ☑ Notify new messages
Notifications: ☑ Site announcements
Frequency: ☐ Immediate / ☑ Daily / ☐ Weekly
```
## Statistika uporabnikov

### Oglejte si poročila uporabnikov

Spremljajte uporabniške meritve:

**Skrbnik > Sistem > Nadzorna plošča**
```
User Statistics:
├── Total Users: 256
├── Active Users: 189
├── New This Month: 24
├── Registration Requests: 3
├── Currently Online: 12
└── Last 24h Posts: 45
```
### Sledenje rasti uporabnikov

Spremljajte trende registracije:
```
Registrations Last 7 Days: 12 users
Registrations Last 30 Days: 48 users
Active Users (30 days): 156
Inactive Users (30+ days): 100
```
## Pogoste naloge upravljanja uporabnikov

### Ustvari skrbniškega uporabnika

1. Ustvarite novega uporabnika (zgornji koraki)
2. Dodelite skupini **Spletni skrbniki** ali **Skrbniki**
3. Dodelite dovoljenja v System > Permissions
4. Preverite, ali skrbniški dostop deluje

### Ustvari moderatorja

1. Ustvarite novega uporabnika
2. Dodelite skupini **Moderatorji**
3. Konfigurirajte dovoljenja za moderiranje določenih modulov
4. Uporabnik lahko odobri vsebino, upravlja komentarje

### Nastavite urejevalnike vsebine

1. Ustvarite skupino **Urejevalniki vsebine**
2. Ustvarite uporabnike, dodelite skupini
3. Dodelite dovoljenja za:
   - Create/edit strani
   - Create/edit objave
   - Zmerni komentarji
4. Omejite dostop do skrbniške plošče

### Ponastavi pozabljeno geslo

Uporabnik je pozabil geslo:

1. Pojdite na **Uporabniki > Uporabniki**
2. Poiščite uporabnika
3. Kliknite uporabniško ime
4. Kliknite **"Ponastavi geslo"** ali polje za urejanje gesla
5. Nastavite začasno geslo
6. Obvesti uporabnika (pošlji e-pošto)
7. Uporabnik se prijavi, spremeni geslo

### Uporabniki množičnega uvoza

Uvoz seznama uporabnikov (napredno):

Številne plošče za gostovanje ponujajo orodja za:
1. Pripravite datoteko CSV z uporabniškimi podatki
2. Naložite prek skrbniške plošče
3. Množično ustvarjanje računov

Ali pa za uvoz uporabite script/plugin po meri.

## Zasebnost uporabnika

### Spoštujte zasebnost uporabnikov

Najboljše prakse glede zasebnosti:
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
### GDPR Skladnost

Če služi uporabnikom EU:

1. Pridobite soglasje za zbiranje podatkov
2. Dovolite uporabnikom, da prenesejo svoje podatke
3. Navedite možnost brisanja računa
4. Ohranite politiko zasebnosti
5. Dejavnosti obdelave podatkov dnevnika

## Odpravljanje uporabniških težav

### Uporabnik se ne more prijaviti

**Težava:** Uporabnik je pozabil geslo ali ne more dostopati do računa

**Rešitev:**
1. Preverite, ali je uporabniški račun "aktiven"
2. Ponastavite geslo:
   - Skrbnik > Uporabniki > Poišči uporabnika
   - Nastavite novo začasno geslo
   - Pošlji uporabniku po e-pošti
3. Počistite uporabnika cookies/cache
4. Preverite, ali račun ni zaklenjen

### Registracija uporabnika je zastala

**Težava:** Uporabnik ne more dokončati registracije

**Rešitev:**
1. Registracija čekov je dovoljena:
   - Skrbnik > Sistem > Nastavitve > Uporabniške nastavitve
   - Omogoči registracijo
2. Preverite delovanje e-poštnih nastavitev
3. Če je potrebno preverjanje e-pošte:
   - Ponovno pošlji potrditveno e-pošto
   - Preverite mapo z vsiljeno pošto
4. Nižje zahteve za geslo, če so prestroge

### Podvojeni računi

**Težava:** Uporabnik ima več računov

**Rešitev:**
1. Identificirajte podvojene račune na seznamu uporabnikov
2. Ohranite primarni račun
3. Če je mogoče, spojite podatke
4. Izbrišite podvojene račune
5. V nastavitvah omogočite »Prepreči podvojeno e-pošto«.

## Kontrolni seznam za upravljanje uporabnikov

Za začetno nastavitev:- [ ] Nastavite vrsto registracije uporabnika (instant/email/admin)
- [ ] Ustvari zahtevane skupine uporabnikov
- [ ] Konfigurirajte dovoljenja skupine
- [ ] Nastavite politiko gesel
- [ ] Omogoči uporabniške profile
- [ ] Konfigurirajte e-poštna obvestila
- [ ] Nastavite možnosti uporabniškega avatarja
- [ ] Postopek registracije testa
- [ ] Ustvari testne račune
- [ ] Preverite, ali dovoljenja delujejo
- [ ] Struktura skupine dokumentov
- [ ] Načrtujte vključitev uporabnika

## Naslednji koraki

Po nastavitvi uporabnikov:

1. Namestite module, ki jih potrebujejo uporabniki
2. Ustvarite vsebino za uporabnike
3. Zavarujte uporabniške račune
4. Raziščite več skrbniških funkcij
5. Konfigurirajte sistemske nastavitve

---

**Oznake:** #uporabniki #skupine #dovoljenja #administracija #nadzor dostopa

**Povezani članki:**
- Pregled skrbniške plošče
- Namestitev modulov
- ../Configuration/Security-Configuration
- ../Configuration/System-Settings