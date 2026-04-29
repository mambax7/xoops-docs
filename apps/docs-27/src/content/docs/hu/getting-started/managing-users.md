---
title: "Felhasználók kezelése"
description: "Átfogó útmutató a felhasználók adminisztrációjához XOOPS-ban, beleértve a felhasználók, felhasználói csoportok, engedélyek és felhasználói szerepkörök létrehozását"
---
# Felhasználók kezelése a XOOPS-ban

Ismerje meg, hogyan hozhat létre felhasználói fiókokat, hogyan szervezheti a felhasználókat csoportokba, és hogyan kezelheti az engedélyeket a XOOPS-ban.

## Felhasználókezelés áttekintése

A XOOPS átfogó felhasználókezelést biztosít:

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

## A Felhasználókezelés elérése

### Navigáció a Felügyeleti panelen

1. Jelentkezzen be az adminisztrátorba: `http://your-domain.com/xoops/admin/`
2. Kattintson a **Felhasználók** elemre a bal oldalsávon
3. Válasszon a lehetőségek közül:
   - **Felhasználók:** Egyéni fiókok kezelése
   - **Csoportok:** Felhasználói csoportok kezelése
   - **Online felhasználók:** A jelenleg aktív felhasználók megtekintése
   - **Felhasználói kérések:** Regisztrációs kérések feldolgozása

## A felhasználói szerepkörök megértése

A XOOPS előre meghatározott felhasználói szerepköröket tartalmaz:

| Csoport | Szerep | Képességek | Használati eset |
|---|---|---|---|
| **Webmesterek** | Adminisztrátor | Teljes helyszíni ellenőrzés | Fő adminok |
| **Adminisztrátorok** | Adminisztrátor | Korlátozott rendszergazdai hozzáférés | Megbízható felhasználók |
| **Moderátorok** | Tartalomvezérlés | Tartalom jóváhagyása | Közösségi menedzserek |
| **Szerkesztők** | Tartalomkészítés | Create/edit tartalom | Tartalom munkatársai |
| **Regisztrált** | Tag | Bejegyzés, megjegyzés, profil | Rendszeres felhasználók |
| **Anonymous** | Látogató | Csak olvasható | Nem bejelentkezett felhasználók |

## Felhasználói fiókok létrehozása

### 1. módszer: Az adminisztrátor létrehozza a felhasználót

**1. lépés: Hozzáférés a felhasználói létrehozáshoz**

1. Lépjen a **Felhasználók > Felhasználók** oldalra.
2. Kattintson az **"Új felhasználó hozzáadása"** vagy a **"Felhasználó létrehozása"** lehetőségre.

**2. lépés: Adja meg a felhasználói adatokat**

Töltse ki a felhasználói adatokat:

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

**3. lépés: A felhasználói beállítások konfigurálása**

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

**4. lépés: További lehetőségek**

```
Notify User: ☑ Send welcome email
Allow Avatar: ☑ Yes
User Theme: [Default theme]
Show Email: ☐ Public / ☑ Private
```

**5. lépés: Fiók létrehozása**

Kattintson a **"Felhasználó hozzáadása"** vagy a **"Létrehozás"** lehetőségre.

Megerősítés:
```
User created successfully!
Username: john_smith
Email: john@example.com
Groups: Registered Users
```

### 2. módszer: Felhasználói önregisztráció

A felhasználók regisztrálhatják magukat:

**Felügyeleti panel > Rendszer > Beállítások > Felhasználói beállítások**

```
Allow User Registration: ☑ Yes

Registration Type:
☐ Instant (Approve automatically)
☑ Email Verification (Email confirmation)
☐ Admin Approval (You approve each)

Send Verification Email: ☑ Yes
```

Aztán:
1. A felhasználók felkeresik a regisztrációs oldalt
2. Töltse ki az alapvető információkat
3. Igazolja e-mail címét, vagy várja meg a jóváhagyást
4. Fiók aktiválva

## Felhasználói fiókok kezelése

### Összes felhasználó megtekintése

**Helyszín:** Felhasználók > Felhasználók

Felhasználói listát jelenít meg a következőkkel:
- Felhasználónév
- E-mail cím
- Regisztráció dátuma
- Utolsó bejelentkezés
- Felhasználói állapot (Active/Inactive)
- Csoporttagság

### Felhasználói fiók szerkesztése

1. A felhasználói listában kattintson a felhasználónévre
2. Módosítson bármely mezőt:
   - E-mail cím
   - Jelszó
   - Igazi név
   - Felhasználói csoportok
   - Állapot

3. Kattintson a **"Mentés"** vagy a **"Frissítés"** gombra.

### Felhasználói jelszó módosítása

1. Kattintson a felhasználóra a listában
2. Görgessen a „Jelszó módosítása” részhez
3. Írja be az új jelszót
4. Erősítse meg a jelszót
5. Kattintson a **"Jelszó módosítása"** lehetőségre.

A felhasználó a következő bejelentkezéskor új jelszót fog használni.

### Deactivate/Suspend Felhasználó

Fiók ideiglenes letiltása törlés nélkül:

1. Kattintson a felhasználóra a listában
2. Állítsa a **Felhasználói állapot** beállítást "Inaktív" értékre.
3. Kattintson a **"Mentés"** gombra.

A felhasználó inaktív állapotban nem tud bejelentkezni.

### Felhasználó újraaktiválása

1. Kattintson a felhasználóra a listában
2. Állítsa a **Felhasználói állapot** beállítást "Aktív" értékre.
3. Kattintson a **"Mentés"** gombra.

A felhasználó újra bejelentkezhet.

### Felhasználói fiók törlése

Felhasználó végleges eltávolítása:

1. Kattintson a felhasználóra a listában
2. Görgessen lefelé
3. Kattintson a **"Felhasználó törlése"** gombra.
4. Erősítse meg: "Törli a felhasználót és az összes adatot?"
5. Kattintson az **"Igen"** gombra.

**Figyelem:** A törlés végleges!

### Felhasználói profil megtekintése

Tekintse meg a felhasználói profil részleteit:

1. Kattintson a felhasználónévre a felhasználói listában
2. Tekintse át a profilinformációkat:
   - Igazi név
   - E-mail
   - Weboldal
   - Csatlakozás időpontja
   - Utolsó bejelentkezés
   - Felhasználói életrajz
   - Avatar
   - Posts/contributions

## A felhasználói csoportok megértése

### Alapértelmezett felhasználói csoportok

A XOOPS alapértelmezett csoportokat tartalmaz:

| Csoport | Cél | Különleges | Szerkesztés |
|---|---|---|---|
| **Anonymous** | Nem bejelentkezett felhasználók | Fix | Nem |
| **Regisztrált felhasználók** | Rendes tagok | Alapértelmezett | Igen |
| **Webmesterek** | Webhelyadminisztrátorok | Admin | Igen |
| **Adminisztrátorok** | Korlátozott adminisztrátorok | Admin | Igen |
| **Moderátorok** | Tartalom moderátorai | Egyedi | Igen |

### Egyéni csoport létrehozása

Csoport létrehozása egy adott szerepkörhöz:

**Helyszín:** Felhasználók > Csoportok

1. Kattintson az **"Új csoport hozzáadása"** gombra.
2. Adja meg a csoport adatait:

```
Group Name: Content Editors
Group Description: Users who can create and edit content

Display Group: ☑ Yes (Show in member profiles)
Group Type: ☑ Regular / ☐ Admin
```

3. Kattintson a **"Csoport létrehozása"** gombra.

### Csoporttagság kezelése

Felhasználók hozzárendelése csoportokhoz:

**A lehetőség: a felhasználók listájáról**

1. Lépjen a **Felhasználók > Felhasználók** oldalra.
2. Kattintson a felhasználóra
3. Check/uncheck csoportok a „Felhasználói csoportok” részben
4. Kattintson a **"Mentés"** gombra.

**B lehetőség: csoportokból**1. Lépjen a **Felhasználók > Csoportok** oldalra.
2. Kattintson a csoport nevére
3. View/edit taglista
4. Felhasználók hozzáadása vagy eltávolítása
5. Kattintson a **"Mentés"** gombra.

### Csoporttulajdonságok szerkesztése

Csoportbeállítások testreszabása:

1. Lépjen a **Felhasználók > Csoportok** oldalra.
2. Kattintson a csoport nevére
3. Módosítsa:
   - Csoport neve
   - Csoportleírás
   - Megjelenítési csoport (show/hide)
   - Csoport típusa
4. Kattintson a **"Mentés"** gombra.

## Felhasználói engedélyek

### Az engedélyek értelmezése

Három engedélyszint:

| Szint | Hatály | Példa |
|---|---|---|
| **modul hozzáférés** | Lehet see/use modul | Hozzáférhet a Fórum modulhoz |
| **Tartalomengedélyek** | Megtekintheti az adott tartalmat | Elolvashatja a megjelent híreket |
| **Funkcióengedélyek** | Műveleteket tud végrehajtani | Hozzászólhat |

### modulhozzáférés konfigurálása

**Helyszín:** Rendszer > Engedélyek

Korlátozza, hogy mely csoportok férhetnek hozzá az egyes modulokhoz:

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

Kattintson a **"Mentés"** gombra a jelentkezéshez.

### Tartalomengedélyek beállítása

Adott tartalomhoz való hozzáférés szabályozása:

Példa – Hírcikk:
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

### Engedélyezési bevált gyakorlatok

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

## Felhasználói regisztráció kezelése

### Regisztrációs kérések kezelése

Ha az „Admin jóváhagyás” engedélyezve van:

1. Nyissa meg a **Felhasználók > Felhasználói kérelmek** oldalt.
2. Tekintse meg a függőben lévő regisztrációkat:
   - Felhasználónév
   - E-mail
   - Regisztráció dátuma
   - Állapot kérése

3. Minden kérésnél:
   - Kattintson az áttekintéshez
   - Kattintson a **"Jóváhagyás"** gombra az aktiváláshoz
   - Kattintson az **"Elutasítás"** gombra az elutasításhoz

### Regisztrációs e-mail küldése

welcome/verification e-mail újraküldése:

1. Lépjen a **Felhasználók > Felhasználók** oldalra.
2. Kattintson a felhasználóra
3. Kattintson az **"E-mail küldése"** vagy **"Ellenőrzés újraküldése"** lehetőségre.
4. E-mail elküldve a felhasználónak

## Online felhasználók megfigyelése

### Jelenleg online felhasználók megtekintése

Az aktív webhelylátogatók követése:

**Helyszín:** Felhasználók > Online felhasználók

Műsorok:
- Jelenlegi online felhasználók
- A vendéglátogatók számítanak
- Utolsó tevékenység ideje
- IP cím
- Böngészés helye

### Figyelje a felhasználói tevékenységet

A felhasználói viselkedés megértése:

```
Active Users: 12
Registered: 8
Anonymous: 4

Recent Activity:
- User1 - Forum post (2 min ago)
- User2 - Comment (5 min ago)
- User3 - Page view (8 min ago)
```

## Felhasználói profil testreszabása

### Felhasználói profilok engedélyezése

A felhasználói profil beállításainak konfigurálása:

**Adminisztráció > Rendszer > Beállítások > Felhasználói beállítások**

```
Allow User Profiles: ☑ Yes
Show Member List: ☑ Yes
Users Can Edit Profile: ☑ Yes
Show User Avatar: ☑ Yes
Show Last Online: ☑ Yes
Show Email Address: ☐ Yes / ☑ No
```

### Profilmezők

Állítsa be, hogy a felhasználók mit adhatnak hozzá a profilokhoz:

Példa profilmezőkre:
- Igazi név
- Webhely: URL
- Életrajz
- Helyszín
- Avatar (kép)
- Aláírás
- Érdeklődés
- Közösségi média linkek

Testreszabása a modul beállításaiban.

## Felhasználó hitelesítés

### Kéttényezős hitelesítés engedélyezése

Fokozott biztonsági opció (ha elérhető):

**Adminisztrálás > Felhasználók > Beállítások**

```
Two-Factor Authentication: ☑ Enabled

Methods:
☑ Email
☑ SMS
☑ Authenticator App
```

A felhasználóknak a második módszerrel kell ellenőrizniük.

### Jelszóházirend

Erős jelszavak kényszerítése:

**Adminisztráció > Rendszer > Beállítások > Felhasználói beállítások**

```
Minimum Password Length: 8 characters
Require Uppercase: ☑ Yes
Require Numbers: ☑ Yes
Require Special Chars: ☑ Yes

Password Expiration: 90 days
Force Change on First Login: ☑ Yes
```

### Bejelentkezési kísérletek

A nyers erőszakos támadások megelőzése:

```
Lock After Failed Attempts: 5
Lock Duration: 15 minutes
Log All Attempts: ☑ Yes
Notify Admin: ☑ Yes
```

## Felhasználói e-mail-kezelés

### Tömeges e-mail küldése a csoportnak

Üzenet küldése több felhasználónak:

1. Lépjen a **Felhasználók > Felhasználók** oldalra.
2. Jelöljön ki több felhasználót (jelölőnégyzetek)
3. Kattintson az **"E-mail küldése"** gombra.
4. Üzenet írása:
   - Tárgy
   - Üzenet törzse
   - Tartalmazza az aláírást
5. Kattintson a **"Küldés"** gombra.

### E-mail értesítési beállítások

Állítsa be, hogy a felhasználók milyen e-maileket kapjanak:

**Adminisztráció > Rendszer > Beállítások > E-mail beállítások**

```
New Registration: ☑ Send welcome email
Password Reset: ☑ Send reset link
Comments: ☑ Notify on replies
Messages: ☑ Notify new messages
Notifications: ☑ Site announcements
Frequency: ☐ Immediate / ☑ Daily / ☐ Weekly
```

## Felhasználói statisztikák

### Felhasználói jelentések megtekintése

Felhasználói mutatók figyelése:

**Adminisztráció > Rendszer > Irányítópult**

```
User Statistics:
├── Total Users: 256
├── Active Users: 189
├── New This Month: 24
├── Registration Requests: 3
├── Currently Online: 12
└── Last 24h Posts: 45
```

### Felhasználói növekedés nyomon követése

A regisztrációs trendek nyomon követése:

```
Registrations Last 7 Days: 12 users
Registrations Last 30 Days: 48 users
Active Users (30 days): 156
Inactive Users (30+ days): 100
```

## Gyakori felhasználókezelési feladatok

### Adminisztrátori felhasználó létrehozása

1. Hozzon létre új felhasználót (a fenti lépések)
2. Rendelje hozzá a **Webmesterek** vagy **Adminisztrátorok** csoporthoz
3. Adjon engedélyeket a Rendszer > Engedélyek menüpontban
4. Ellenőrizze, hogy működik-e az adminisztrátori hozzáférés

### Moderátor létrehozása

1. Hozzon létre új felhasználót
2. Hozzárendelés a **Moderátorok** csoporthoz
3. Konfigurálja az engedélyeket bizonyos modulok moderálásához
4. A felhasználó jóváhagyhatja a tartalmat, kezelheti a megjegyzéseket

### Tartalomszerkesztők beállítása

1. Hozzon létre **Tartalomszerkesztők** csoportot
2. Felhasználók létrehozása, hozzárendelés a csoporthoz
3. Engedélyek megadása a következőkhöz:
   - Create/edit oldalak
   - Create/edit bejegyzések
   - Mérsékelt megjegyzések
4. Korlátozza az adminisztrációs panel hozzáférését

### Elfelejtett jelszó visszaállítása

A felhasználó elfelejtette jelszavát:

1. Lépjen a **Felhasználók > Felhasználók** oldalra.
2. Felhasználó keresése
3. Kattintson a felhasználónévre
4. Kattintson a **"Jelszó visszaállítása"** elemre, vagy módosítsa a jelszó mezőt
5. Állítsa be az ideiglenes jelszót
6. Felhasználó értesítése (e-mail küldése)
7. Felhasználó bejelentkezik, jelszót változtat

### Felhasználók tömeges importálása

Felhasználólista importálása (speciális):Számos tárhelypanel biztosít eszközöket a következőkhöz:
1. Készítse elő a felhasználói adatokat tartalmazó CSV fájlt
2. Feltöltés az adminisztrációs panelen keresztül
3. Fiókok tömeges létrehozása

Vagy használjon egyéni script/plugin-t az importáláshoz.

## Felhasználói adatvédelem

### Tartsa tiszteletben a felhasználói adatvédelmet

Bevált adatvédelmi gyakorlatok:

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

### GDPR Megfelelőség

Ha EU-felhasználókat szolgál ki:

1. Kérjen hozzájárulást az adatgyűjtéshez
2. Engedélyezze a felhasználóknak adataik letöltését
3. Adja meg a fiók törlése opciót
4. Tartsa be az adatvédelmi szabályzatot
5. Napló adatfeldolgozási tevékenységek

## Felhasználói problémák hibaelhárítása

### A felhasználó nem tud bejelentkezni

**Probléma:** A felhasználó elfelejtette a jelszavát, vagy nem tud hozzáférni a fiókjához

**Megoldás:**
1. Ellenőrizze, hogy a felhasználói fiók "Aktív"-e
2. Jelszó visszaállítása:
   - Adminisztráció > Felhasználók > Felhasználó keresése
   - Állítson be új ideiglenes jelszót
   - Küldje el a felhasználónak e-mailben
3. Felhasználó törlése cookies/cache
4. Ellenőrizze, hogy a fiók nincs-e zárolva

### A felhasználói regisztráció elakadt

**Probléma:** A felhasználó nem tudja befejezni a regisztrációt

**Megoldás:**
1. A csekk regisztráció megengedett:
   - Adminisztráció > Rendszer > Beállítások > Felhasználói beállítások
   - Regisztráció engedélyezése
2. Ellenőrizze az e-mail beállítások működését
3. Ha e-mail-ellenőrzés szükséges:
   - Ellenőrző e-mail újraküldése
   - Ellenőrizze a spam mappát
4. Alacsonyabb jelszókövetelmények, ha túl szigorúak

### Ismétlődő fiókok

**Probléma:** A felhasználónak több fiókja van

**Megoldás:**
1. Azonosítsa a duplikált fiókokat a Felhasználók listában
2. Tartsa meg az elsődleges fiókot
3. Ha lehetséges, egyesítse az adatokat
4. Törölje az ismétlődő fiókokat
5. Engedélyezze a "Duplikált e-mailek megakadályozása" lehetőséget a beállításokban

## Felhasználókezelési ellenőrzőlista

A kezdeti beállításhoz:

- [ ](instant/email/admin) Felhasználó regisztrációs típusának beállítása
- [ ] Hozzon létre szükséges felhasználói csoportokat
- [ ] Csoportengedélyek konfigurálása
- [ ] Jelszóházirend beállítása
- [ ] Felhasználói profilok engedélyezése
- [ ] E-mail értesítések konfigurálása
- [ ] Felhasználói avatar opciók beállítása
- [ ] Teszt regisztrációs folyamat
- [ ] Tesztfiókok létrehozása
- [ ] Ellenőrizze az engedélyek működését
- [ ] Dokumentumcsoport felépítése
- [ ] Tervezze meg a felhasználói belépést

## Következő lépések

A felhasználók beállítása után:

1. Telepítse a felhasználóknak szükséges modulokat
2. Hozzon létre tartalmat a felhasználók számára
3. Biztonságos felhasználói fiókok
4. Fedezzen fel további adminisztrátori funkciókat
5. Konfigurálja a rendszerszintű beállításokat

---

**Címkék:** #felhasználók #csoportok #engedélyek #adminisztráció #hozzáférés-vezérlés

**Kapcsolódó cikkek:**
- Admin-Panel-Overview
- modulok telepítése
- ../Configuration/Security-Configuration
- ../Configuration/System-Settings
