---
title: "5. függelék: Növelje XOOPS telepítésének biztonságát"
---
A XOOPS 2.7.0 telepítése után hajtsa végre a következő lépéseket a felület keményítéséhez. Mindegyik lépés külön-külön nem kötelező, de együtt jelentősen növelik a telepítés alapszintű biztonságát.

## 1. Telepítse és konfigurálja a Protector modult

A mellékelt `protector` modul a XOOPS tűzfal. Ha nem telepítette a kezdeti varázsló során, telepítse most az Adminisztráció → modulok képernyőről.

![](/xoops-docs/2.7/img/installation/img_73.jpg)

Nyissa meg a Protector adminisztrációs paneljét, és tekintse át a megjelenő figyelmeztetéseket. A régebbi PHP direktívák, például a `register_globals` már nem léteznek (a PHP 8.2+ eltávolította őket), így ezek a figyelmeztetések többé nem jelennek meg. A jelenlegi figyelmeztetések általában a címtárengedélyekre, a munkamenet-beállításokra és a megbízhatósági útvonal konfigurációjára vonatkoznak.

## 2. Zárja le a `mainfile.php` és `secure.php`

Amikor a telepítő befejeződik, megpróbálja mindkét fájlt csak olvashatóként megjelölni, de egyes gazdagépek visszaállítják az engedélyeket. Ellenőrizze és szükség esetén jelentkezzen újra:

- `mainfile.php` → `0444` (tulajdonos, csoport, egyéb csak olvasható)
- `xoops_data/data/secure.php` → `0444`

A `mainfile.php` meghatározza az útvonalkonstansokat (`XOOPS_ROOT_PATH`, `XOOPS_PATH`, `XOOPS_VAR_PATH`, `XOOPS_URL`, QZXPH00006, QZXPH00006, `XOOPS_COOKIE_DOMAIN_USE_PSL`) és a gyártási zászlók. A `secure.php` tartalmazza az adatbázis hitelesítő adatait:

- A 2.5.x verzióban az adatbázis hitelesítő adatai a `mainfile.php`-ban éltek. Ezek most a `xoops_data/data/secure.php`-ban vannak tárolva, amelyet a `mainfile.php` tölt be futás közben. Ha a `secure.php`-t a `xoops_data/`-n belül tartja – egy olyan könyvtárban, amelyet a dokumentum gyökerén kívülre kell helyezni –, sokkal nehezebbé teszi a támadók számára a hitelesítő adatok elérését a HTTP-n keresztül.

## 3. Helyezze át a `xoops_lib/` és `xoops_data/` elemet a dokumentum gyökerén kívülre

Ha még nem tette meg, helyezze át ezt a két könyvtárat egy szinttel a webgyökér fölé, és nevezze át őket. Ezután frissítse a megfelelő állandókat a `mainfile.php`-ban:

```php
define('XOOPS_ROOT_PATH', '/home/you/www');
define('XOOPS_PATH',      '/home/you/zubra_mylib');
define('XOOPS_VAR_PATH',  '/home/you/zubra_mydata');
define('XOOPS_TRUST_PATH', XOOPS_PATH);
```

Ha ezeket a könyvtárakat a dokumentumgyökéren kívül helyezi el, megakadályozza a közvetlen hozzáférést a Composer `vendor/` fájához, a gyorsítótárazott sablonokhoz, munkamenetfájlokhoz, feltöltött adatokhoz és a `secure.php` adatbázis hitelesítő adataihoz.

## 4. Cookie domain konfiguráció

A XOOPS 2.7.0 két cookie-domain állandót vezet be a `mainfile.php`-ban:

```php
// Use the Public Suffix List (PSL) to derive the registrable domain.
define('XOOPS_COOKIE_DOMAIN_USE_PSL', true);

// Explicit cookie domain; may be blank, the full host, or the registrable domain.
define('XOOPS_COOKIE_DOMAIN', '');
```

Irányelvek:

- Hagyja üresen a `XOOPS_COOKIE_DOMAIN` mezőt, ha a XOOPS-t egyetlen gazdagépnévről vagy IP-ről szolgálja ki.
- Használja a teljes gazdagépet (pl. `www.example.com`), hogy a cookie-kat csak az adott gazdagépnévre terjedjen ki.
- Használja a regisztrálható domaint (pl. `example.com`), ha cookie-kat szeretne megosztani a `www.example.com`, `blog.example.com` stb. között.
- A `XOOPS_COOKIE_DOMAIN_USE_PSL = true` lehetővé teszi a XOOPS számára az összetett TLD-k (`co.uk`, `com.au`, …) helyes felosztását ahelyett, hogy véletlenül cookie-t állítana be a hatékony QZXPH000094HPX.

## 5. Gyártási jelzők a `mainfile.php`-ban

A `mainfile.dist.php`-t a következő két jelzővel szállítjuk a `false`-ra állítva a gyártáshoz:

```php
define('XOOPS_DB_LEGACY_LOG', false); // disable legacy SQL usage logging
define('XOOPS_DEBUG',         false); // disable debug notices
```

Hagyja őket a gyártásban. Ideiglenesen engedélyezze őket fejlesztői vagy átmeneti környezetben, ha a következőket szeretné:

- levadászni az elhúzódó örökölt adatbázishívásokat (`XOOPS_DB_LEGACY_LOG = true`);
- felületi `E_USER_DEPRECATED` megjegyzések és egyéb hibakereső kimenet (`XOOPS_DEBUG = true`).

## 6. Törölje a telepítőt

A telepítés befejezése után:

1. Töröljön minden átnevezett `install_remove_*` könyvtárat a webgyökérből.
2. Töröljön minden `install_cleanup_*.php` szkriptet, amelyet a varázsló hozott létre a tisztítás során.
3. Győződjön meg arról, hogy a `install/` könyvtár már nem érhető el a HTTP-n keresztül.

A letiltott, de meglévő telepítőkönyvtár elhagyása csekély súlyosságú, de elkerülhető kockázat.

## 7. Tartsa naprakészen a XOOPS-t és a modulokat

XOOPS szabályos patch ütemet követ. Iratkozzon fel a XOOPSCore27 GitHub adattárra a kiadási értesítésekért, és frissítse webhelyét és bármely harmadik fél modulját, amikor új kiadás érkezik. A 2.7.x biztonsági frissítéseit a lerakat Kiadások oldalán teszik közzé.
