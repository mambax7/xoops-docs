---
title: "Az XOOPS 2.7.0 újdonságai"
---
A XOOPS 2.7.0 egy jelentős frissítés a 2.5.x sorozatból. Telepítés vagy frissítés előtt tekintse át az ezen az oldalon található módosításokat, hogy tudja, mire számíthat. Az alábbi lista a telepítést és a webhely adminisztrációját érintő elemekre összpontosít – a változtatások teljes listáját lásd a disztribúcióhoz mellékelt kiadási megjegyzésekben.

## PHP 8.2 az új minimum

A XOOPS 2.7.0 verzióhoz **PHP 8.2 vagy újabb** szükséges. A PHP 7.x és korábbi verziói már nem támogatottak. PHP 8.4 vagy újabb erősen ajánlott.

**Művelet:** Mielőtt elkezdené, győződjön meg arról, hogy a gazdagép PHP 8.2+ verziót kínál. Lásd: [Követelmények](installation/requirements.md).

## MySQL 5.7 az új minimum

Az új minimum **MySQL 5.7** (vagy egy kompatibilis MariaDB). MySQL 8.4 vagy újabb erősen ajánlott. A MySQL 9.0 szintén támogatott.

A PHP/MySQL 8 kompatibilitási problémákkal kapcsolatos régi figyelmeztetések már nem érvényesek, mert az érintett PHP verziókat a XOOPS már nem támogatja.

## A Smarty 4 felváltja a Smarty 3-at

Ez a legnagyobb változás a meglévő webhelyeken. A XOOPS 2.7.0 a **Smarty 4**-et használja sablonmotorként. A Smarty 4 szigorúbb a sablon szintaxisát illetően, mint a Smarty 3, és egyes egyéni témákat és modulsablonokat módosítani kell, mielőtt helyesen jelennek meg.

A problémák azonosítása és kijavítása érdekében a XOOPS 2.7.0 egy **preflight scannert** szállít a `upgrade/` könyvtárban, amely megvizsgálja a meglévő sablonokat ismert Smarty 4-kompatibilitások keresésére, és ezek közül sokat automatikusan kijavít.

**Teendő:** Ha a 2.5.x verzióról frissít, és egyéni témákkal vagy régebbi modulokkal rendelkezik, futtassa a [Futtatás előtti ellenőrzést](upgrading/upgrade/preflight.md) a fő frissítő futtatása előtt.

## Zeneszerző által kezelt függőségek

A XOOPS 2.7.0 a **Composer** segítségével kezeli PHP függőségeit. Ezek `xoops_lib/vendor/`-ban élnek. A korábban a magba vagy modulokba – PHPMailer, HTMLPurifier, Smarty és mások – csomagolt, harmadik féltől származó könyvtárakat most a Composer biztosítja.

**Teendő:** A legtöbb webhely üzemeltetőjének semmit sem kell tennie – a kibocsátott tarballokat a `vendor/` már feltöltött állapotában szállítják. Ha áthelyez vagy frissít egy webhelyet, másolja a teljes `xoops_lib/`-fát, beleértve a `vendor/`-t is. A git-tárat klónozó fejlesztőknek a `composer install`-t a `htdocs/xoops_lib/`-n belül kell futtatniuk. Lásd: [Megjegyzések fejlesztőknek](notes-for-developers/developers.md).

## Új keményített munkamenet-cookie-beállítások

A frissítés során két új beállítást adunk hozzá:

* **`session_cookie_samesite`** – a SameSite attribútumot vezérli a munkamenet-cookie-kon (`Lax`, `Strict` vagy `None`).
* **`session_cookie_secure`** – ha engedélyezve van, a munkamenet-cookie-k csak a HTTPS-n keresztül kerülnek elküldésre.

**Teendő:** A frissítés után tekintse át ezeket a Rendszerbeállítások → Beállítások → Általános beállítások alatt. Lásd: [A frissítés után](upgrading/upgrade/ustep-04.md).

## Új `tokens` asztal

A XOOPS 2.7.0 hozzáad egy `tokens` adatbázistáblát az általános hatókörű token tároláshoz. A frissítő automatikusan létrehozza ezt a táblázatot a 2.5.11 → 2.7.0 frissítés részeként.

## Modernizált jelszótárolás

A `bannerclient.passwd` oszlop `VARCHAR(255)`-ra bővült, így modern jelszókivonatokat tartalmazhat (bcrypt, argon2). A frissítő automatikusan kiszélesíti az oszlopot.

## Frissített téma és modul felállás

A XOOPS 2.7.0 frissített előtértémákkal érkezik:

* `default`, `xbootstrap` (örökölt), `xbootstrap5`, `xswatch4`, `xswatch5`, QZXPH000084PXZ5HPHQZ8P

Egy új **Modern** adminisztrátori téma is bekerült a meglévő Átmeneti téma mellé.

A Symfony VarDumper alapú új **DebugBar** modul az opcionálisan telepíthető modulok egyikeként érkezik. Hasznos a fejlesztéshez és a színpadra állításhoz, de általában nem telepítik nyilvános gyártási helyszínekre.

Lásd: [Téma kiválasztása](installation/installation/step-12.md) és [modulok telepítése](installation/installation/step-13.md).

## Az új kiadásban történő másolás már nem írja felül a konfigurációtKorábban egy új XOOPS disztribúció meglévő webhelyre másolása körültekintést igényelt a `mainfile.php` és más konfigurációs fájlok felülírásának elkerülése érdekében. A 2.7.0-s verzióban a másolási folyamat érintetlenül hagyja a meglévő konfigurációs fájlokat, ami észrevehetően biztonságosabbá teszi a frissítéseket.

Minden frissítés előtt továbbra is teljes biztonsági másolatot kell készítenie.

## Sablontúlterhelési lehetőség a rendszergazdai témákban

A XOOPS 2.7.0 rendszergazdai témái mostantól felülírhatják az egyes rendszergazdai sablonokat, megkönnyítve az adminisztrációs felület testreszabását a teljes rendszermodul elágazása nélkül.

## Mi nem változott

A biztonság kedvéért a XOOPS ezen részei ugyanúgy működnek a 2.7.0-ban, mint a 2.5.x-ben:

* A telepítő oldalának sorrendje és a teljes folyamat
* A `mainfile.php` plus `xoops_data/data/secure.php` konfigurációs felosztás
* A `xoops_data` és `xoops_lib` webgyökéren kívüli áthelyezésének javasolt gyakorlata
* A modul telepítési modellje és a `xoops_version.php` jegyzékformátum
* A webhely-áthelyezési munkafolyamat (mentés, `mainfile.php`/`secure.php` szerkesztése, SRDB vagy hasonló használata)

## Merre tovább

* Újra indul? Tovább a következőhöz: [Követelmények](installation/requirements.md).
* Frissítés a 2.5.x verzióról? Kezdje a [Frissítéssel](upgrading/upgrade/README.md), majd futtassa a [Futtatás előtti ellenőrzést](upgrading/upgrade/preflight.md).
