---
title: "Upravljanje korisnicima"
description: "Opsežni vodič za korisnika administration u XOOPS uključujući stvaranje korisnika, korisničkih grupa, dopuštenja i korisničkih uloga"
---
# Upravljanje korisnicima u XOOPS

Naučite kako kreirati korisničke račune, organizirati korisnike u grupe i upravljati dopuštenjima u XOOPS.

## Pregled upravljanja korisnicima

XOOPS pruža sveobuhvatno upravljanje korisnicima uz:

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

## Pristup upravljanju korisnicima

### Navigacija administrativne ploče

1. Prijavite se na admin: `http://your-domain.com/xoops/admin/`
2. Kliknite **Korisnici** na lijevoj bočnoj traci
3. Odaberite jednu od opcija:
   - **Korisnici:** Upravljanje pojedinačnim računima
   - **Grupe:** Upravljanje korisničkim grupama
   - **Mrežni korisnici:** Pogledajte trenutno aktivne korisnike
   - **Korisnički zahtjevi:** Obradite zahtjeve za registraciju

## Razumijevanje korisničkih uloga

XOOPS dolazi s unaprijed definiranim korisničkim ulogama:

| Grupa | Uloga | Mogućnosti | Slučaj upotrebe |
|---|---|---|---|
| **Webmasteri** | Administrator | Potpuna kontrola stranice | Glavni admins |
| **Admini** | Administrator | Ograničeni pristup admin | Pouzdani korisnici |
| **Moderatori** | Kontrola sadržaja | Odobri sadržaj | Menadžeri zajednice |
| **Urednici** | Stvaranje sadržaja | Stvaranje/uređivanje sadržaja | Sadržajno osoblje |
| **Registrirano** | Član | Objava, komentar, profil | Redoviti korisnici |
| **Anonimno** | Posjetitelj | Samo za čitanje | Neprijavljeni korisnici |

## Stvaranje korisničkih računa

### Metoda 1: Administrator stvara korisnika

**1. korak: Pristupite izradi korisnika**

1. Idite na **Korisnici > Korisnici**
2. Kliknite **"Dodaj novog korisnika"** ili **"Izradi korisnika"**

**Korak 2: Unesite podatke o korisniku**

Ispunite podatke o korisniku:

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

**Korak 3: Konfigurirajte korisničke postavke**

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

**Korak 4: Dodatne opcije**

```
Notify User: ☑ Send welcome email
Allow Avatar: ☑ Yes
User Theme: [Default theme]
Show Email: ☐ Public / ☑ Private
```

**Korak 5: Izradite račun**

Kliknite **"Dodaj korisnika"** ili **"Izradi"**

Potvrda:
```
User created successfully!
Username: john_smith
Email: john@example.com
Groups: Registered Users
```

### Metoda 2: Samoregistracija korisnika

Dopustite korisnicima da se sami registriraju:

**administratorska ploča > Sustav > Postavke > Korisničke postavke**

```
Allow User Registration: ☑ Yes

Registration Type:
☐ Instant (Approve automatically)
☑ Email Verification (Email confirmation)
☐ Admin Approval (You approve each)

Send Verification Email: ☑ Yes
```

Zatim:
1. Korisnici posjećuju stranicu za registraciju
2. Ispunite osnovne podatke
3. Potvrdite e-poštu ili pričekajte odobrenje
4. Račun aktiviran

## Upravljanje korisničkim računima

### Prikaži sve korisnike

**Lokacija:** Korisnici > Korisnici

Prikazuje popis korisnika sa:
- Korisničko ime
- Adresa e-pošte
- Datum registracije
- Zadnja prijava
- Korisnički status (aktivan/neaktivan)
- Članstvo u grupi

### Uredi korisnički račun

1. Na popisu korisnika kliknite korisničko ime
2. Izmijenite bilo koje polje:
   - Adresa e-pošte
   - Lozinka
   - Pravo ime
   - Grupe korisnika
   - Status

3. Kliknite **"Spremi"** ili **"Ažuriraj"**

### Promjena korisničke lozinke

1. Pritisnite korisnika na popisu
2. Dođite do odjeljka "Promijeni lozinku".
3. Unesite novu lozinku
4. Potvrdite lozinku
5. Kliknite **"Promijeni lozinku"**

Korisnik će koristiti novu lozinku prilikom sljedeće prijave.

### Deaktiviraj/Suspendiraj korisnika

Privremeno onemogućite račun bez brisanja:

1. Pritisnite korisnika na popisu
2. Postavite **Status korisnika** na "Neaktivan"
3. Kliknite **"Spremi"**

Korisnik se ne može prijaviti dok nije aktivan.

### Ponovno aktiviraj korisnika

1. Pritisnite korisnika na popisu
2. Postavite **Status korisnika** na "Aktivan"
3. Kliknite **"Spremi"**

Korisnik se može ponovno prijaviti.

### Izbriši korisnički račun

Trajno ukloni korisnika:

1. Pritisnite korisnika na popisu
2. Pomaknite se do dna
3. Kliknite **"Izbriši korisnika"**
4. Potvrdite: "Izbrisati korisnika i sve podatke?"
5. Kliknite **"Da"**

**Upozorenje:** Brisanje je trajno!

### Pogledaj korisnički profil

Pogledajte detalje korisničkog profila:

1. Pritisnite korisničko ime na popisu korisnika
2. Pregledajte informacije o profilu:
   - Pravo ime
   - E-mail
   - Web stranica
   - Datum pridruživanja
   - Zadnja prijava
   - Biografija korisnika
   - Avatar
   - Postovi/doprinosi

## Razumijevanje korisničkih grupa

### Zadane grupe korisnikaXOOPS includes zadane grupe:

| Grupa | Svrha | Posebna | Uredi |
|---|---|---|---|
| **Anonimno** | Neprijavljeni korisnici | Popravljen | Ne |
| **Registrirani korisnici** | Redovni članovi | Zadano | Da |
| **Webmasteri** | Stranica administrators | Admin | Da |
| **Admini** | Ograničeno admins | Admin | Da |
| **Moderatori** | Moderatori sadržaja | Prilagođeno | Da |

### Stvorite prilagođenu grupu

Stvorite grupu za određenu ulogu:

**Lokacija:** Korisnici > Grupe

1. Kliknite **"Dodaj novu grupu"**
2. Unesite detalje grupe:

```
Group Name: Content Editors
Group Description: Users who can create and edit content

Display Group: ☑ Yes (Show in member profiles)
Group Type: ☑ Regular / ☐ Admin
```

3. Kliknite **"Stvori grupu"**

### Upravljanje članstvom u grupi

Dodijelite korisnike grupama:

**Opcija A: s popisa korisnika**

1. Idite na **Korisnici > Korisnici**
2. Pritisnite korisnik
3. Označite/odznačite grupe u odjeljku "Grupe korisnika".
4. Kliknite **"Spremi"**

**Opcija B: Iz grupa**

1. Idite na **Korisnici > Grupe**
2. Pritisnite naziv grupe
3. Pregledajte/uredite popis članova
4. Dodajte ili uklonite korisnike
5. Kliknite **"Spremi"**

### Uredite svojstva grupe

Prilagodite postavke grupe:

1. Idite na **Korisnici > Grupe**
2. Pritisnite naziv grupe
3. Izmijenite:
   - Naziv grupe
   - Opis grupe
   - Prikaz grupe (prikaži/sakrij)
   - Tip grupe
4. Kliknite **"Spremi"**

## Korisničke dozvole

### Razumijevanje dopuštenja

Tri razine dopuštenja:

| Razina | Opseg | Primjer |
|---|---|---|
| **Pristup modulu** | Može vidjeti/koristiti modul | Može pristupiti modulu Forum |
| **dozvole za sadržaj** | Može vidjeti određeni sadržaj | Može čitati objavljene vijesti |
| **dozvole za funkcije** | Može izvoditi akcije | Može objavljivati ​​komentare |

### Konfigurirajte pristup modulu

**Lokacija:** Sustav > dozvole

Ograničite koje grupe mogu pristupiti svakom modulu:

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

Kliknite **"Spremi"** za primjenu.

### Postavite dozvole za sadržaj

Kontrolirajte pristup određenom sadržaju:

Primjer - Novinski članak:
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

### Najbolji postupci za dozvole

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

## Upravljanje registracijom korisnika

### Rukovanje zahtjevima za registraciju

Ako je omogućeno "Administratorsko odobrenje":

1. Idite na **Korisnici > Zahtjevi korisnika**
2. Pregledajte registracije na čekanju:
   - Korisničko ime
   - E-mail
   - Datum registracije
   - Status zahtjeva

3. Za svaki zahtjev:
   - Kliknite za pregled
   - Kliknite **"Odobri"** za aktivaciju
   - Kliknite **"Odbaci"** za odbijanje

### Pošalji e-mail za registraciju

Ponovno pošalji e-poruku dobrodošlice/potvrde:

1. Idite na **Korisnici > Korisnici**
2. Pritisnite korisnik
3. Kliknite **"Pošalji e-poštu"** ili **"Ponovo pošalji potvrdu"**
4. E-pošta poslana korisniku

## Praćenje online korisnika

### Pregled trenutno online korisnika

Pratite aktivne posjetitelje stranice:

**Lokacija:** Korisnici > Online korisnici

emisije:
- Trenutačni online korisnici
- Gosti posjetitelji se broje
- Vrijeme zadnje aktivnosti
- IP adresa
- Lokacija pregledavanja

### Pratite aktivnost korisnika

Razumijevanje ponašanja korisnika:

```
Active Users: 12
Registered: 8
Anonymous: 4

Recent Activity:
- User1 - Forum post (2 min ago)
- User2 - Comment (5 min ago)
- User3 - Page view (8 min ago)
```

## Prilagodba korisničkog profila

### Omogući korisničke profile

Konfigurirajte opcije korisničkog profila:

**Administrator > Sustav > Postavke > Korisničke postavke**

```
Allow User Profiles: ☑ Yes
Show Member List: ☑ Yes
Users Can Edit Profile: ☑ Yes
Show User Avatar: ☑ Yes
Show Last Online: ☑ Yes
Show Email Address: ☐ Yes / ☑ No
```

### Polja profila

Konfigurirajte što korisnici mogu dodati profilima:

Primjer polja profila:
- Pravo ime
- Web stranica URL
- Životopis
- Lokacija
- Avatar (slika)
- Potpis
- Interesi
- Veze na društvene mreže

Prilagodite u postavkama modula.

## Autentikacija korisnika

### Omogući dvofaktorsku provjeru autentičnosti

Opcija poboljšane sigurnosti (ako je dostupna):

**Administrator > Korisnici > Postavke**

```
Two-Factor Authentication: ☑ Enabled

Methods:
☑ Email
☑ SMS
☑ Authenticator App
```

Korisnici moraju potvrditi drugom metodom.

### Pravila zaporke

Nametnite snažne lozinke:

**Administrator > Sustav > Postavke > Korisničke postavke**

```
Minimum Password Length: 8 characters
Require Uppercase: ☑ Yes
Require Numbers: ☑ Yes
Require Special Chars: ☑ Yes

Password Expiration: 90 days
Force Change on First Login: ☑ Yes
```

### Pokušaji prijaveSpriječite napade grubom silom:

```
Lock After Failed Attempts: 5
Lock Duration: 15 minutes
Log All Attempts: ☑ Yes
Notify Admin: ☑ Yes
```

## Upravljanje korisničkom e-poštom

### Pošalji masovnu e-poštu grupi

Pošalji poruku većem broju korisnika:

1. Idite na **Korisnici > Korisnici**
2. Odaberite više korisnika (potvrdni okviri)
3. Kliknite **"Pošalji e-poštu"**
4. Sastavite poruku:
   - Predmet
   - Tijelo poruke
   - Uključite potpis
5. Kliknite **"Pošalji"**

### Postavke obavijesti putem e-pošte

Konfigurirajte koje e-poruke korisnici primaju:

**Administrator > Sustav > Postavke > Postavke e-pošte**

```
New Registration: ☑ Send welcome email
Password Reset: ☑ Send reset link
Comments: ☑ Notify on replies
Messages: ☑ Notify new messages
Notifications: ☑ Site announcements
Frequency: ☐ Immediate / ☑ Daily / ☐ Weekly
```

## Korisnička statistika

### Pogledajte izvješća korisnika

Pratite korisničke metrike:

**Administrator > Sustav > Nadzorna ploča**

```
User Statistics:
├── Total Users: 256
├── Active Users: 189
├── New This Month: 24
├── Registration Requests: 3
├── Currently Online: 12
└── Last 24h Posts: 45
```

### Praćenje rasta korisnika

Pratite trendove registracije:

```
Registrations Last 7 Days: 12 users
Registrations Last 30 Days: 48 users
Active Users (30 days): 156
Inactive Users (30+ days): 100
```

## Uobičajeni zadaci upravljanja korisnicima

### Stvorite administratorskog korisnika

1. Stvorite novog korisnika (gornji koraci)
2. Dodijelite grupi **Webmasteri** ili **Administratori**
3. Dodijelite dozvole u Sustav > dozvole
4. Provjerite radi li pristup admin

### Stvori moderatora

1. Stvorite novog korisnika
2. Dodijelite grupi **Moderatori**
3. Konfigurirajte dopuštenja za moderiranje određenog modules
4. Korisnik može odobriti sadržaj, upravljati komentarima

### Postavite uređivače sadržaja

1. Napravite grupu **Uređivači sadržaja**
2. Stvorite korisnike, dodijelite grupi
3. Dodijelite dozvole za:
   - Stvaranje/uređivanje stranica
   - Stvaranje/uređivanje postova
   - Umjereni komentari
4. Ograničite pristup ploči admin

### Ponovno postavite zaboravljenu lozinku

Korisnik je zaboravio lozinku:

1. Idite na **Korisnici > Korisnici**
2. Pronađite korisnika
3. Pritisnite korisničko ime
4. Kliknite **"Reset Password"** ili polje za uređivanje lozinke
5. Postavite privremenu lozinku
6. Obavijestite korisnika (pošaljite email)
7. Korisnik se prijavljuje, mijenja lozinku

### Skupni uvoz korisnika

Uvoz popisa korisnika (napredno):

Mnogi hosting paneli pružaju alate za:
1. Pripremite CSV datoteku s korisničkim podacima
2. Učitaj putem ploče admin
3. Masovno kreirajte račune

Ili upotrijebite prilagođenu skriptu/dodatak za uvoz.

## Privatnost korisnika

### Poštujte privatnost korisnika

Najbolji primjeri iz prakse glede privatnosti:

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

### Sukladnost s GDPR-om

Ako služi korisnicima iz EU-a:

1. Dobiti privolu za prikupljanje podataka
2. Dopustite korisnicima preuzimanje svojih podataka
3. Omogućite opciju brisanja računa
4. Održavajte politiku privatnosti
5. Aktivnosti obrade podataka dnevnika

## Rješavanje korisničkih problema

### Korisnik se ne može prijaviti

**Problem:** Korisnik je zaboravio lozinku ili ne može pristupiti računu

**Rješenje:**
1. Provjerite je li korisnički račun "Aktivan"
2. Poništi lozinku:
   - Administrator > Korisnici > Pronađi korisnika
   - Postavite novu privremenu lozinku
   - Pošaljite korisniku putem e-pošte
3. Obrišite korisničke kolačiće/cache
4. Provjerite nije li račun zaključan

### Registracija korisnika je zapela

**Problem:** Korisnik ne može dovršiti registraciju

**Rješenje:**
1. Registracija čeka je dopuštena:
   - Administrator > Sustav > Postavke > Korisničke postavke
   - Omogućite registraciju
2. Provjerite rad postavki e-pošte
3. Ako je potrebna potvrda e-pošte:
   - Ponovno pošalji e-poruku za potvrdu
   - Provjerite mapu neželjene pošte
4. Smanjite zahtjeve za lozinku ako su prestrogi

### Duplicirani računi

**Problem:** Korisnik ima više računa

**Rješenje:**
1. Identificirajte duplicirane račune na popisu korisnika
2. Zadržite primarni račun
3. Spojite podatke ako je moguće
4. Izbrišite duple račune
5. Omogućite "Spriječi dupliciranu e-poštu" u postavkama

## Kontrolni popis za upravljanje korisnicima

Za početno postavljanje:- [ ] Postavite vrstu registracije korisnika (instant/e-mail/admin)
- [ ] Stvorite potrebne grupe korisnika
- [ ] Konfigurirajte dopuštenja grupe
- [ ] Postavite politiku lozinke
- [ ] Omogući korisničke profile
- [ ] Konfigurirajte obavijesti putem e-pošte
- [ ] Postavite opcije korisničkog avatara
- [ ] Postupak registracije testa
- [ ] Stvorite testne račune
- [ ] Provjerite rade li dozvole
- [ ] Struktura grupe dokumenata
- [ ] Planirajte integraciju korisnika

## Sljedeći koraci

Nakon postavljanja korisnika:

1. Instalirajte modules koji je potreban korisnicima
2. Kreirajte sadržaj za korisnike
3. Osigurajte korisničke račune
4. Istražite više značajki admin
5. Konfigurirajte postavke za cijeli sustav

---

**Oznake:** #korisnici #grupe #dozvole #administration #kontrola pristupa

**Povezani članci:**
- administratorska ploča - Pregled
- Instaliranje modula
- ../Configuration/Security-Configuration
- ../Configuration/System-Settings
