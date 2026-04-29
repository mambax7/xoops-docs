---
title: "Gebruikers beheren"
description: "Uitgebreide handleiding voor gebruikersbeheer in XOOPS, inclusief het aanmaken van gebruikers, gebruikersgroepen, machtigingen en gebruikersrollen"
---
# Gebruikers beheren in XOOPS

Leer hoe u gebruikersaccounts kunt maken, gebruikers in groepen kunt indelen en machtigingen kunt beheren in XOOPS.

## Overzicht gebruikersbeheer

XOOPS biedt uitgebreid gebruikersbeheer met:

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

## Toegang tot gebruikersbeheer

### Navigatie op het beheerderspaneel

1. Meld u aan bij beheerder: `http://your-domain.com/xoops/admin/`
2. Klik op **Gebruikers** in de linkerzijbalk
3. Kies uit opties:
   - **Gebruikers:** Beheer individuele accounts
   - **Groepen:** Beheer gebruikersgroepen
   - **Online gebruikers:** Bekijk momenteel actieve gebruikers
   - **Gebruikersverzoeken:** Registratieverzoeken verwerken

## Gebruikersrollen begrijpen

XOOPS wordt geleverd met vooraf gedefinieerde gebruikersrollen:

| Groep | Rol | Mogelijkheden | Gebruiksscenario |
|---|---|---|---|
| **Webmasters** | Beheerder | Volledige sitecontrole | Hoofdbeheerders |
| **Beheerders** | Beheerder | Beperkte beheerderstoegang | Vertrouwde gebruikers |
| **Moderators** | Inhoudscontrole | Inhoud goedkeuren | Communitymanagers |
| **Redactie** | Contentcreatie | Inhoud maken/bewerken | Inhoud personeel |
| **Geregistreerd** | Lid | Posten, reageren, profiel | Vaste gebruikers |
| **Anoniem** | Bezoeker | Alleen lezen | Niet-ingelogde gebruikers |

## Gebruikersaccounts aanmaken

### Methode 1: Beheerder maakt gebruiker aan

**Stap 1: Toegang tot het maken van gebruikers**

1. Ga naar **Gebruikers > Gebruikers**
2. Klik op **"Nieuwe gebruiker toevoegen"** of **"Gebruiker maken"**

**Stap 2: Voer gebruikersinformatie in**

Gebruikersgegevens invullen:

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

**Stap 3: Gebruikersinstellingen configureren**

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

**Stap 4: Extra opties**

```
Notify User: ☑ Send welcome email
Allow Avatar: ☑ Yes
User Theme: [Default theme]
Show Email: ☐ Public / ☑ Private
```

**Stap 5: Account aanmaken**

Klik op **"Gebruiker toevoegen"** of **"Maken"**

Bevestiging:
```
User created successfully!
Username: john_smith
Email: john@example.com
Groups: Registered Users
```

### Methode 2: Zelfregistratie van gebruikers

Sta gebruikers toe zichzelf te registreren:

**Beheerderspaneel > Systeem > Voorkeuren > Gebruikersinstellingen**

```
Allow User Registration: ☑ Yes

Registration Type:
☐ Instant (Approve automatically)
☑ Email Verification (Email confirmation)
☐ Admin Approval (You approve each)

Send Verification Email: ☑ Yes
```

Dan:
1. Gebruikers bezoeken de registratiepagina
2. Vul basisgegevens in
3. E-mail verifiëren of wachten op goedkeuring
4. Account geactiveerd

## Gebruikersaccounts beheren

### Bekijk alle gebruikers

**Locatie:** Gebruikers > Gebruikers

Toont gebruikerslijst met:
- Gebruikersnaam
- E-mailadres
- Registratiedatum
- Laatste login
- Gebruikersstatus (actief/inactief)
- Groepslidmaatschap

### Gebruikersaccount bewerken

1. Klik in de gebruikerslijst op gebruikersnaam
2. Wijzig een veld:
   - E-mailadres
   - Wachtwoord
   - Echte naam
   - Gebruikersgroepen
   - Status

3. Klik op **"Opslaan"** of **"Bijwerken"**

### Gebruikerswachtwoord wijzigen

1. Klik op gebruiker in lijst
2. Scroll naar het gedeelte 'Wachtwoord wijzigen'
3. Voer een nieuw wachtwoord in
4. Bevestig het wachtwoord
5. Klik op **"Wachtwoord wijzigen"**

De gebruiker zal bij de volgende login een nieuw wachtwoord gebruiken.

### Gebruiker deactiveren/opschorten

Account tijdelijk uitschakelen zonder verwijdering:

1. Klik op gebruiker in lijst
2. Stel **Gebruikersstatus** in op "Inactief"
3. Klik op **"Opslaan"**

Gebruiker kan niet inloggen terwijl hij inactief is.

### Gebruiker opnieuw activeren

1. Klik op gebruiker in lijst
2. Stel **Gebruikersstatus** in op "Actief"
3. Klik op **"Opslaan"**

Gebruiker kan opnieuw inloggen.

### Gebruikersaccount verwijderen

Gebruiker permanent verwijderen:

1. Klik op gebruiker in lijst
2. Scroll naar beneden
3. Klik op **"Gebruiker verwijderen"**
4. Bevestigen: "Gebruiker en alle gegevens verwijderen?"
5. Klik op **"Ja"**

**Waarschuwing:** Verwijdering is definitief!

### Bekijk gebruikersprofiel

Bekijk de details van het gebruikersprofiel:

1. Klik op gebruikersnaam in de gebruikerslijst
2. Bekijk profielinformatie:
   - Echte naam
   - E-mail
   - Website
   - Datum van aanmelding
   - Laatste login
   - Gebruikersbiografie
   - Avatar
   - Berichten/bijdragen

## Gebruikersgroepen begrijpen

### Standaard gebruikersgroepen

XOOPS bevat standaardgroepen:

| Groep | Doel | Speciaal | Bewerken |
|---|---|---|---|
| **Anoniem** | Niet-ingelogde gebruikers | Vast | Nee |
| **Geregistreerde gebruikers** | Vaste leden | Standaard | Ja |
| **Webmasters** | Sitebeheerders | Beheerder | Ja |
| **Beheerders** | Beperkte beheerders | Beheerder | Ja |
| **Moderators** | Contentmoderators | Aangepast | Ja |

### Aangepaste groep maken

Groep maken voor specifieke rol:

**Locatie:** Gebruikers > Groepen

1. Klik op **"Nieuwe groep toevoegen"**
2. Groepsgegevens invoeren:

```
Group Name: Content Editors
Group Description: Users who can create and edit content

Display Group: ☑ Yes (Show in member profiles)
Group Type: ☑ Regular / ☐ Admin
```

3. Klik op **"Groep maken"**

### Beheer groepslidmaatschap

Gebruikers toewijzen aan groepen:

**Optie A: uit gebruikerslijst**

1. Ga naar **Gebruikers > Gebruikers**
2. Klik op gebruiker
3. Schakel groepen in/uit in de sectie "Gebruikersgroepen".
4. Klik op **"Opslaan"**

**Optie B: Van groepen**

1. Ga naar **Gebruikers > Groepen**
2. Klik op groepsnaam
3. Ledenlijst bekijken/bewerken
4. Voeg gebruikers toe of verwijder ze
5. Klik op **"Opslaan"**### Groepseigenschappen bewerken

Groepsinstellingen aanpassen:

1. Ga naar **Gebruikers > Groepen**
2. Klik op groepsnaam
3. Wijzigen:
   - Groepsnaam
   - Groepsbeschrijving
   - Weergavegroep (toon/verberg)
   - Groepstype
4. Klik op **"Opslaan"**

## Gebruikersrechten

### Machtigingen begrijpen

Drie toestemmingsniveaus:

| Niveau | Reikwijdte | Voorbeeld |
|---|---|---|
| **Moduletoegang** | Kan module zien/gebruiken | Heeft toegang tot Forummodule |
| **Inhoudsrechten** | Kan specifieke inhoud bekijken | Kan gepubliceerd nieuws lezen |
| **Functierechten** | Kan acties uitvoeren | Kan reacties plaatsen |

### Moduletoegang configureren

**Locatie:** Systeem > Machtigingen

Beperk welke groepen toegang hebben tot elke module:

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

Klik op **"Opslaan"** om te solliciteren.

### Inhoudsrechten instellen

Beheer de toegang tot specifieke inhoud:

Voorbeeld - Nieuwsartikel:
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

### Beste praktijken voor toestemming

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

## Beheer van gebruikersregistratie

### Registratieverzoeken afhandelen

Als "Admin Goedkeuring" is ingeschakeld:

1. Ga naar **Gebruikers > Gebruikersverzoeken**
2. Bekijk lopende registraties:
   - Gebruikersnaam
   - E-mail
   - Registratiedatum
   - Status opvragen

3. Voor elk verzoek:
   - Klik om te beoordelen
   - Klik op **"Goedkeuren"** om te activeren
   - Klik op **"Afwijzen"** om te weigeren

### Registratie-e-mail verzenden

Welkomst-/verificatie-e-mail opnieuw verzenden:

1. Ga naar **Gebruikers > Gebruikers**
2. Klik op gebruiker
3. Klik op **"E-mail verzenden"** of **"Verificatie opnieuw verzenden"**
4. E-mail verzonden naar gebruiker

## Online gebruikersmonitoring

### Bekijk momenteel online gebruikers

Volg actieve sitebezoekers:

**Locatie:** Gebruikers > Onlinegebruikers

Toont:
- Huidige online gebruikers
- Gastbezoekers tellen mee
- Laatste activiteitstijd
- IP-adres
- Browselocatie

### Monitor gebruikersactiviteit

Begrijp gebruikersgedrag:

```
Active Users: 12
Registered: 8
Anonymous: 4

Recent Activity:
- User1 - Forum post (2 min ago)
- User2 - Comment (5 min ago)
- User3 - Page view (8 min ago)
```

## Aanpassing van gebruikersprofiel

### Gebruikersprofielen inschakelen

Configureer gebruikersprofielopties:

**Beheerder > Systeem > Voorkeuren > Gebruikersinstellingen**

```
Allow User Profiles: ☑ Yes
Show Member List: ☑ Yes
Users Can Edit Profile: ☑ Yes
Show User Avatar: ☑ Yes
Show Last Online: ☑ Yes
Show Email Address: ☐ Yes / ☑ No
```

### Profielvelden

Configureer wat gebruikers aan profielen kunnen toevoegen:

Voorbeeld profielvelden:
- Echte naam
- Website URL
- Biografie
- Locatie
- Avatar (foto)
- Handtekening
- Interesses
- Sociale medialinks

Aanpassen in module-instellingen.

## Gebruikersauthenticatie

### Tweefactorauthenticatie inschakelen

Verbeterde beveiligingsoptie (indien beschikbaar):

**Beheerder > Gebruikers > Instellingen**

```
Two-Factor Authentication: ☑ Enabled

Methods:
☑ Email
☑ SMS
☑ Authenticator App
```

Gebruikers moeten verifiëren met de tweede methode.

### Wachtwoordbeleid

Sterke wachtwoorden afdwingen:

**Beheerder > Systeem > Voorkeuren > Gebruikersinstellingen**

```
Minimum Password Length: 8 characters
Require Uppercase: ☑ Yes
Require Numbers: ☑ Yes
Require Special Chars: ☑ Yes

Password Expiration: 90 days
Force Change on First Login: ☑ Yes
```

### Inlogpogingen

Voorkom brute force-aanvallen:

```
Lock After Failed Attempts: 5
Lock Duration: 15 minutes
Log All Attempts: ☑ Yes
Notify Admin: ☑ Yes
```

## E-mailbeheer van gebruikers

### Bulk-e-mail verzenden naar groep

Stuur meerdere gebruikers een bericht:

1. Ga naar **Gebruikers > Gebruikers**
2. Selecteer meerdere gebruikers (selectievakjes)
3. Klik op **"E-mail verzenden"**
4. Bericht opstellen:
   - Onderwerp
   - Berichttekst
   - Inclusief handtekening
5. Klik op **"Verzenden"**

### Instellingen voor e-mailmeldingen

Configureer welke e-mails gebruikers ontvangen:

**Beheerder > Systeem > Voorkeuren > E-mailinstellingen**

```
New Registration: ☑ Send welcome email
Password Reset: ☑ Send reset link
Comments: ☑ Notify on replies
Messages: ☑ Notify new messages
Notifications: ☑ Site announcements
Frequency: ☐ Immediate / ☑ Daily / ☐ Weekly
```

## Gebruikersstatistieken

### Bekijk gebruikersrapporten

Gebruikersstatistieken monitoren:

**Beheerder > Systeem > Dashboard**

```
User Statistics:
├── Total Users: 256
├── Active Users: 189
├── New This Month: 24
├── Registration Requests: 3
├── Currently Online: 12
└── Last 24h Posts: 45
```

### Bijhouden van gebruikersgroei

Volg registratietrends:

```
Registrations Last 7 Days: 12 users
Registrations Last 30 Days: 48 users
Active Users (30 days): 156
Inactive Users (30+ days): 100
```

## Algemene gebruikersbeheertaken

### Beheerdergebruiker aanmaken

1. Nieuwe gebruiker aanmaken (bovenstaande stappen)
2. Wijs toe aan de groep **Webmasters** of **Admins**
3. Verleen machtigingen in Systeem > Machtigingen
4. Controleer of de beheerderstoegang werkt

### Moderator maken

1. Maak een nieuwe gebruiker aan
2. Toewijzen aan de groep **Moderators**
3. Configureer machtigingen om specifieke modules te modereren
4. De gebruiker kan inhoud goedkeuren en opmerkingen beheren

### Inhoudseditors instellen

1. Maak de groep **Inhoudseditors** aan
2. Gebruikers aanmaken, toewijzen aan groep
3. Verleen machtigingen voor:
   - Pagina's maken/bewerken
   - Berichten maken/bewerken
   - Matige opmerkingen
4. Beperk de toegang tot het beheerderspaneel

### Vergeten wachtwoord opnieuw instellen

Gebruiker is zijn wachtwoord vergeten:

1. Ga naar **Gebruikers > Gebruikers**
2. Zoek gebruiker
3. Klik op gebruikersnaam
4. Klik op **"Wachtwoord opnieuw instellen"** of bewerk het wachtwoordveld
5. Stel een tijdelijk wachtwoord in
6. Gebruiker op de hoogte stellen (e-mail verzenden)
7. Gebruiker logt in, wijzigt wachtwoord

### Gebruikers in bulk importeren

Gebruikerslijst importeren (geavanceerd):

Veel hostingpanelen bieden hulpmiddelen om:
1. Bereid het CSV-bestand met gebruikersgegevens voor
2. Upload via het beheerderspaneel
3. Maak massaal accounts aan

Of gebruik een aangepast script/plug-in voor import.

## Gebruikersprivacy### Respecteer de privacy van gebruikers

Praktische tips op het gebied van privacy:

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

### GDPR-naleving

Als u EU-gebruikers bedient:

1. Vraag toestemming voor het verzamelen van gegevens
2. Sta gebruikers toe hun gegevens te downloaden
3. Geef de optie Account verwijderen op
4. Handhaaf het privacybeleid
5. Log gegevensverwerkingsactiviteiten

## Problemen met gebruikers oplossen

### Gebruiker kan niet inloggen

**Probleem:** Gebruiker is wachtwoord vergeten of heeft geen toegang tot account

**Oplossing:**
1. Controleer of het gebruikersaccount "Actief" is
2. Wachtwoord opnieuw instellen:
   - Beheerder > Gebruikers > Gebruiker zoeken
   - Stel een nieuw tijdelijk wachtwoord in
   - Verzenden naar gebruiker via e-mail
3. Wis gebruikerscookies/cache
4. Controleer of het account niet is vergrendeld

### Gebruikersregistratie vastgelopen

**Probleem:** Gebruiker kan de registratie niet voltooien

**Oplossing:**
1. Chequeregistratie is toegestaan:
   - Beheerder > Systeem > Voorkeuren > Gebruikersinstellingen
   - Registratie inschakelen
2. Controleer of de e-mailinstellingen werken
3. Als e-mailverificatie vereist is:
   - Verificatie-e-mail opnieuw verzenden
   - Controleer de spammap
4. Lagere wachtwoordvereisten als deze te streng zijn

### Dubbele accounts

**Probleem:** Gebruiker heeft meerdere accounts

**Oplossing:**
1. Identificeer dubbele accounts in de Gebruikerslijst
2. Behoud het primaire account
3. Voeg gegevens samen indien mogelijk
4. Verwijder dubbele accounts
5. Schakel 'Dubbele e-mail voorkomen' in de instellingen in

## Controlelijst voor gebruikersbeheer

Voor de eerste installatie:

- [ ] Gebruikersregistratietype instellen (direct/e-mail/admin)
- [ ] Vereiste gebruikersgroepen aanmaken
- [ ] Groepsrechten configureren
- [ ] Wachtwoordbeleid instellen
- [ ] Gebruikersprofielen inschakelen
- [ ] Configureer e-mailmeldingen
- [ ] Opties voor gebruikersavatar instellen
- [ ] Testregistratieproces
- [ ] Testaccounts aanmaken
- [ ] Controleer of de machtigingen werken
- [ ] Documentgroepstructuur
- [ ] Onboarding van gebruikers plannen

## Volgende stappen

Na het instellen van gebruikers:

1. Installeer modules die gebruikers nodig hebben
2. Creëer inhoud voor gebruikers
3. Beveiligde gebruikersaccounts
4. Ontdek meer beheerdersfuncties
5. Configureer systeembrede instellingen

---

**Tags:** #users #groups #permissions #administration #access-control

**Gerelateerde artikelen:**
- Beheerderspaneel-overzicht
- Modules installeren
- ../Configuratie/Veiligheidsconfiguratie
- ../Configuratie/Systeeminstellingen