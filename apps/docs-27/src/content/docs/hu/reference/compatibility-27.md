---
title: "XOOPS 2.7.0 kompatibilitási áttekintés ehhez az útmutatóhoz"
---
Ez a dokumentum felsorolja a lerakaton szükséges változtatásokat, így a Telepítési útmutató megfelel a XOOPS 2.7.0-nak.

A felülvizsgálat alapja:

- Jelenlegi útmutató tárháza: `L:\GitHub\XOOPSDocs\xoops-installation-guide`
- XOOPS 2.7.0 mag felülvizsgálva: `L:\GitHub\MAMBAX7\CORE\XOOPSCore27`
- Elsődleges 2.7.0 ellenőrzött források:
  - `README.md`
  - `release_notes.txt`
  - `htdocs/install/language/english/welcome.php`
  - `htdocs/install/include/config.php`
  - `htdocs/install/include/page.php`
  - `htdocs/install/class/pathcontroller.php`
  - `htdocs/install/page_dbsettings.php`
  - `htdocs/install/page_configsave.php`
  - `htdocs/install/page_siteinit.php`
  - `htdocs/install/page_end.php`
  - `htdocs/mainfile.dist.php`
  - `upgrade/preflight.php`
  - `upgrade/README.md`
  - `upgrade/upd_2.5.11-to-2.7.0/index.php`

## Hatály

Ez a repo jelenleg a következőket tartalmazza:

- A fő útmutatóként használt gyökérszintű angol Markdown fájlok.
- Részleges `en/` másolat.
- Teljes `de/` és `fr/` könyvfák saját eszközökkel.

A gyökérszintű fájloknak első lépésre van szükségük. Ezt követően az egyenértékű változtatásokat tükrözni kell a `de/book/` és `fr/book/` formátumban. A `en/` fát szintén meg kell tisztítani, mert úgy tűnik, hogy csak részben van karbantartva.

## 1. A globális adattár változásai

### 1.1 Verziókezelés és metaadatok

Frissítse az összes útmutató szintű referenciát a XOOPS 2.5.x verzióról a XOOPS 2.7.0 verzióra.

Érintett fájlok:

- `README.md`
- `SUMMARY.md` — elsődleges élő TOC a gyökérvezetőhöz; a navigációs címkéknek és a szakaszok címsorainak meg kell egyeznie az új fejezetcímekkel és az átnevezett Történelmi frissítési megjegyzésekkel
- `en/README.md`
- `en/SUMMARY.md`
- `de/README.md`
- `de/SUMMARY.md`
- `fr/README.md`
- `fr/SUMMARY.md`
- `chapter-2-introduction.md`
- `about-xoops-cms.md`
- `appendix-1-working-with-the-new-admin-gui-our-dashboard.md`
- `appendix-5-increase-security-of-your-xoops-installation.md`
- lokalizált `de/book/*.md` és `fr/book/*.md`

Szükséges változtatások:

- Cserélje ki a `for XOOPS 2.5.7.x`-t `for XOOPS 2.7.0`-ra.
- A szerzői jog évének frissítése `2018`-ról `2026`-ra.
- Cserélje ki a régi XOOPS 2.5.x és 2.6.0 hivatkozásokat, ahol az aktuális kiadást írják le.
- Cserélje ki a SourceForge-korszak letöltési útmutatóját GitHub-kiadásokkal:
  - `https://github.com/XOOPS/XOOPSCore27/releases`

### 1.2 Linkfrissítés

A `about-xoops-cms.md` és a lokalizált `10aboutxoops.md` fájlok továbbra is a régi 2.5.x és 2.6.0 GitHub helyekre mutatnak. Ezeket a hivatkozásokat frissíteni kell a jelenlegi 2.7.x projekthelyekre.

### 1.3 Képernyőkép frissítése

A telepítőt, a frissítési felhasználói felületet, a rendszergazdai vezérlőpultot, a témaválasztót, a modulválasztót és a telepítés utáni képernyőket bemutató összes képernyőkép elavult.

Az érintett vagyonfák:

- `.gitbook/assets/`
- `en/assets/`
- `de/assets/`
- `fr/assets/`

Ez egy teljes frissítés, nem részleges. A 2.7.0 telepítő eltérő Bootstrap alapú elrendezést és eltérő vizuális struktúrát használ.

## 2. 2. fejezet: Bevezetés

Fájl:

- `chapter-2-introduction.md`

### 2.1 A rendszerkövetelményeket át kell írni

Az aktuális fejezetben csak az Apache, MySQL és PHP szerepel. A XOOPS 2.7.0 explicit minimumokkal rendelkezik:

| Alkatrész | 2.7.0 minimum | 2.7.0 ajánlás |
| --- | --- | --- |
| PHP | 8.2.0 | 8,4+ |
| MySQL | 5.7.8 | 8,4+ |
| Webszerver | Bármely szerver, amely támogatja a szükséges PHP | Apache vagy Nginx ajánlott |

Hozzáadandó megjegyzések:

- A IIS továbbra is szerepel a telepítőben, de az Apache és az Nginx az ajánlott példa.
- A kiadási megjegyzések a MySQL 9.0 kompatibilitást is jelzik.

### 2.2 Adja hozzá a szükséges és ajánlott PHP kiterjesztési ellenőrzőlistát

A 2.7.0 telepítő mostantól elkülöníti a szigorú követelményeket az ajánlott bővítményektől.

A telepítő által mutatott kötelező ellenőrzések:

- MySQLi
- Session
- PCRE
- szűrő
- `file_uploads`
- fájlinformáció

Javasolt bővítmények:

- mbstring
- intl
- ikonv
- xml
- zlib
- gd
- exif
- göndör

### 2.3 Távolítsa el az ellenőrző összegre vonatkozó utasításokat

Az aktuális 5. lépés a `checksum.php` és `checksum.mdi` leírást írja le. Ezek a fájlok nem részei a XOOPS 2.7.0-nak.

Művelet:

- Teljesen távolítsa el az ellenőrzőösszeg-ellenőrző részt.

### 2.4 Frissítse a csomagot és a feltöltési utasításokat

Tartsa meg a `docs/`, `extras/`, `htdocs/`, `upgrade/` csomagelrendezés leírását, de frissítse a feltöltési és előkészítési szöveget, hogy az tükrözze a jelenlegi írási útvonallal kapcsolatos elvárásokat:- `mainfile.php`
- `uploads/`
- `uploads/avatars/`
- `uploads/files/`
- `uploads/images/`
- `uploads/ranks/`
- `uploads/smilies/`
- `xoops_data/caches/`
- `xoops_data/caches/xoops_cache/`
- `xoops_data/caches/smarty_cache/`
- `xoops_data/caches/smarty_compile/`
- `xoops_data/configs/`
- `xoops_data/configs/captcha/`
- `xoops_data/configs/textsanitizer/`
- `xoops_data/data/`
- `xoops_data/protector/`

Az útmutató ezt jelenleg alábecsüli.

### 2.5 A SourceForge translation/download nyelv cseréje

A jelenlegi szöveg továbbra is azt mondja, hogy más nyelvi csomagokért keresse fel a XOOPS webhelyet a SourceForge-on. Ezt le kell cserélni a jelenlegi project/community letöltési útmutatóval.

## 3. 3. fejezet: Kiszolgálókonfiguráció ellenőrzése

Fájl:

- `chapter-3-server-configuration-check.md`

Szükséges változtatások:

- Írja át az oldal leírását a jelenlegi kétblokkos elrendezés köré:
  - Követelmények
  - Ajánlott kiterjesztések
- Cserélje ki a régi képernyőképet.
- A fent felsorolt ​​követelmény-ellenőrzéseket kifejezetten dokumentálja.

## 4. 4. fejezet: Menj a helyes úton

Fájl:

- `chapter-4-take-the-right-path.md`

Szükséges változtatások:

- Adja hozzá az új `Cookie Domain` mezőt.
- Frissítse az elérési út mezőinek nevét és leírását, hogy megfeleljen a 2.7.0-s verziónak:
  - XOOPS gyökérútvonal
  - XOOPS adatútvonal
  - XOOPS könyvtár elérési útja
  - XOOPS URL
  - Cookie Domain
- Vegye figyelembe, hogy a könyvtár elérési útjának módosításához érvényes Composer automatikus betöltőre van szükség a `vendor/autoload.php` címen.

Ez egy valódi kompatibilitási ellenőrzés a 2.7.0-ban, és egyértelműen dokumentálni kell. A jelenlegi útmutató egyáltalán nem említi a zeneszerzőt.

## 5. 5. fejezet: Adatbázis-kapcsolatok

Fájl:

- `chapter-5-database-connections.md`

Szükséges változtatások:

- Tartsa meg azt az állítást, hogy csak a MySQL támogatott.
- Frissítse az adatbázis konfigurációs szakaszát, hogy tükrözze:
  - az alapértelmezett karakterkészlet most `utf8mb4`
  - A leválogatás kiválasztása dinamikusan frissül, amikor a karakterkészlet változik
- Cserélje ki az adatbázis-kapcsolati és a konfigurációs oldalak képernyőképeit.

A jelenlegi szöveg, amely szerint a karakterkészlet és a leválogatás nem igényel figyelmet, túl gyenge a 2.7.0-hoz. Legalább meg kell említeni az új `utf8mb4` alapértelmezést és a dinamikus leválogatás választót.

## 6. 6. fejezet: Végső rendszerkonfiguráció

Fájl:

- `chapter-6-final-system-configuration.md`

### 6.1 A generált konfigurációs fájlok megváltoztak

Az útmutató jelenleg azt írja, hogy a telepítő `mainfile.php` és `secure.php`.

A 2.7.0-s verzióban konfigurációs fájlokat is telepít a `xoops_data/configs/` fájlba, beleértve:

- `xoopsconfig.php`
- captcha konfigurációs fájlok
- textsanitizer konfigurációs fájlok

### 6.2 A `xoops_data/configs/` meglévő konfigurációs fájlok nem íródnak felül

A felülírás nélküli viselkedés **hatókörű**, nem globális. Két különböző kódútvonal a `page_configsave.php` konfigurációs fájlok írásában:

- `writeConfigurationFile()` (az 59-es és 66-os vonalon hívják) **mindig** a `xoops_data/data/secure.php` és `mainfile.php` újragenerálása a varázsló bemenetéről. Nincs létezésellenőrzés; egy meglévő példányt lecserélünk.
- A `copyConfigDistFiles()` (a 62. sorban hívható, a 317. sorban meghatározott) csak a `xoops_data/configs/` fájlokat másolja (`xoopsconfig.php`, a captcha konfigurációk, a textsanitizer konfigurációk) **ha a cél még nem létezik**.

A fejezet átírásának egyértelműen tükröznie kell mindkét viselkedést:

- `mainfile.php` és `secure.php` esetén: Figyelmeztetés, hogy ezeknek a fájloknak a kézi szerkesztése felülíródik a telepítő újbóli futtatásakor.
- A `xoops_data/configs/` fájlok esetében: magyarázza el, hogy a helyi testreszabások megmaradnak az újrafuttatások és frissítések során, és hogy a szállított alapértékek visszaállításához a fájl törlését és újbóli futtatását szükséges (vagy a megfelelő `.dist.php` kézi másolását).

Ne általánosítsa a „meglévő fájlok megőrzését” az összes telepítő által írt konfigurációs fájlban – ez helytelen, és félrevezetné a `mainfile.php` vagy `secure.php` fájlokat szerkesztő rendszergazdákat.

### 6.3 HTTPS és a fordított proxy kezelése megváltozott

Az előállított `mainfile.php` mostantól szélesebb körű protokollérzékelést támogat, beleértve a fordított proxy fejléceket is. Az útmutatónak ezt meg kell említenie ahelyett, hogy csak közvetlen `http` vagy `https` észlelést írna elő.

### 6.4 A táblázatok száma hibás

Az aktuális fejezet szerint egy új webhely `32` táblákat hoz létre.

A XOOPS 2.7.0 `33` táblákat hoz létre. A hiányzó táblázat a következő:

- `tokens`

Művelet:

- Frissítse a számot 32-ről 33-ra.
- Adja hozzá a `tokens`-t a táblázatlistához.## 7. 7. fejezet: Adminisztrációs beállítások

Fájl:

- `chapter-7-administration-settings.md`

### 7.1 A jelszó felhasználói felületének leírása elavult

A telepítő továbbra is tartalmazza a jelszógenerálást, de most a következőket is tartalmazza:

- zxcvbn alapú jelszó erősségmérő
- vizuális erősségű címkék
- 16 karakteres generátor és másolási folyamat

Frissítse a szöveget és a képernyőképeket az aktuális jelszópanel leírásához.

### 7.2 Az e-mail-ellenőrzés most kényszerítve van

Az adminisztrátori e-mail-címet a `FILTER_VALIDATE_EMAIL` hitelesíti. A fejezetnek meg kell említenie, hogy az érvénytelen e-mail értékeket a rendszer elutasítja.

### 7.3 A Licenckulcs szakasz hibás

Ez az egyik legfontosabb tényjavítás.

A jelenlegi útmutató szerint:

- van egy `License System Key`
- a `/include/license.php`-ban van tárolva
- A `/include/license.php`-nak írhatónak kell lennie a telepítés során

Ez már nem pontos.

Mit csinál a 2.7.0 valójában:

- a telepítés kiírja a licencadatokat a `xoops_data/data/license.php`-ba
- A `htdocs/include/license.php` már csak egy elavult burkoló, amely betölti a fájlt a `XOOPS_VAR_PATH`-ból
- el kell távolítani a `/include/license.php` írhatóvá tételére vonatkozó régi megfogalmazást

Művelet:

- Törlés helyett írja át ezt a részt.
- Frissítse az elérési utat `/include/license.php`-tól `xoops_data/data/license.php`-ig.

### 7.4 A témalista elavult

A jelenlegi útmutató továbbra is a Zetagenesisre és a régebbi, 2,5-ös korszak témakészletére hivatkozik.

A XOOPS 2.7.0 verzióban jelen lévő témák:

- `default`
- `xbootstrap`
- `xbootstrap5`
- `xswatch4`
- `xswatch5`
- `xtailwind`
- `xtailwind2`

Megjegyzés:

- `xswatch4` a telepítői adatok által beillesztett aktuális alapértelmezett téma.
- A Zetagenesis már nem része a csomagolt témalistának.

### 7.5 A modullista elavult

A 2.7.0 csomagban található modulok:

- `system` – automatikusan telepítve van a táblázatkitöltés / adatbeillesztés lépései során. Mindig jelen van, soha nem látható a válogatóban.
- `debugbar` – kiválasztható a telepítési lépésben.
- `pm` – kiválasztható a telepítési lépésben.
- `profile` – kiválasztható a telepítési lépésben.
- `protector` – kiválasztható a telepítési lépésben.

Fontos: a modultelepítő oldal (`htdocs/install/page_moduleinstaller.php`) úgy állítja össze a jelöltlistát, hogy a `XOOPSLists::getmodulesList()` felett iterál, és **kiszűr mindent, ami már a modulok táblázatában található** (a 95-102. sorok a `$listed_mods` sorokat gyűjtik össze, amelyek a listában jelen vannak, az 11. sor pedig kihagyja). Mivel a `system` e lépés lefutása előtt telepítve van, soha nem jelenik meg jelölőnégyzetként.

Az útmutató módosításai szükségesek:

- Ne mondd, hogy csak három modul van a csomagban.
- Írja le a telepítési lépést úgy, hogy **négy választható modult** mutat be (`debugbar`, `pm`, `profile`, `protector`), nem pedig ötöt.
- A `system`-t külön dokumentálja, mint a mindig telepített magmodult, amely nem jelenik meg a pickerben.
- Adja hozzá a `debugbar`-t a csomagban lévő modul leírásához újként a 2.7.0-ban.
- Vegye figyelembe, hogy a telepítő alapértelmezett modul-előválasztása üres; modulok választhatók, de a telepítő konfigurációja nem ellenőrzi őket.

## 8. 8. fejezet: Készen áll

Fájl:

- `chapter-8-ready-to-go.md`

### 8.1 A telepítési tisztítási folyamatot újra kell írni

Az aktuális útmutató szerint a telepítő átnevezi a telepítési mappát egyedi névre.

Ez továbbra is igaz, de a mechanizmus megváltozott:

- egy külső tisztító szkript jön létre a web gyökérben
- az utolsó oldal elindítja a tisztítást a AJAX segítségével
- a telepítési mappa átnevezve a következőre: `install_remove_<unique suffix>`
- továbbra is létezik a `cleanup.php` tartalék

Művelet:

- Frissítse a magyarázatot.
- A felhasználónak szóló utasítás legyen egyszerű: a telepítés után törölje az átnevezett telepítési könyvtárat.

### 8.2 Az adminisztrátori vezérlőpult függelék hivatkozásai elavultak

A 8. fejezet továbbra is a régi Oxygen-korszak rendszergazdai élménye felé irányítja az olvasókat. Ennek igazodnia kell a jelenlegi rendszergazdai témákhoz:

- `default`
- `dark`
- `modern`
- `transition`

### 8.3 A telepítés utáni elérési út szerkesztési útmutatója javításra szorul

A jelenlegi szöveg arra utasítja az olvasókat, hogy frissítsék a `secure.php`-t elérési út-definíciókkal. A 2.7.0-ban ezek az útvonalkonstansok a `mainfile.php`-ban vannak definiálva, míg a `secure.php` biztonságos adatokat tárol. A fejezet példablokkját ennek megfelelően javítani kell.

### 8.4 A gyártási beállításokat hozzá kell adniAz útmutatónak kifejezetten meg kell említenie a `mainfile.dist.php`-ban jelenleg jelen lévő gyártási alapértékeket:

- `XOOPS_DB_LEGACY_LOG` maradjon `false`
- `XOOPS_DEBUG` maradjon `false`

## 9. 9. fejezet: A meglévő XOOPS telepítés frissítése

Fájl:

- `chapter-9-upgrade-existing-xoops-installation.md`

Ez a fejezet a legnagyobb átírást igényli.

### 9.1 Kötelező Smarty 4 repülés előtti lépés hozzáadása

XOOPS 2.7.0 frissítési folyamata most kényszeríti az előzetes ellenőrzési folyamatot a frissítés befejezése előtt.

Új szükséges áramlás:

1. Másolja a `upgrade/` könyvtárat a webhely gyökérkönyvtárába.
2. Futtassa a `/upgrade/preflight.php` parancsot.
3. Olvassa be a `/themes/` és `/modules/` régi Smarty szintaxisát.
4. Adott esetben használja az opcionális javítási módot.
5. Futtassa újra, amíg tiszta nem lesz.
6. Folytassa a következővel: `/upgrade/`.

A jelen fejezet erről egyáltalán nem tesz említést, ami nem kompatibilis a 2.7.0-s útmutatásokkal.

### 9.2 Cserélje ki a kézikönyv 2.5.2-es korszakának összevonási leírását

Az aktuális fejezet továbbra is egy kézi 2.5.2-es stílusú frissítést ír le keretösszevonásokkal, AltSys megjegyzésekkel és kézzel kezelt fájl-átalakítással. Ezt a `release_notes.txt` és `upgrade/README.md` tényleges 2.7.x frissítési sorozatára kell lecserélni.

Ajánlott fejezetvázlat:

1. Készítsen biztonsági másolatot a fájlokról és az adatbázisról.
2. Kapcsolja ki a webhelyet.
3. Másolja a `htdocs/` fájlt az élő gyökérre.
4. Másolja a `htdocs/xoops_lib` fájlt az aktív könyvtár elérési útjába.
5. Másolja a `htdocs/xoops_data` fájlt az aktív adatútvonalba.
6. Másolja a `upgrade/` fájlt a webgyökérbe.
7. Futtassa a `preflight.php` parancsot.
8. Futtassa a `/upgrade/` parancsot.
9. Töltse ki a frissítő utasításait.
10. Frissítse a `system` modult.
11. Frissítse a `pm`-t, a `profile`-t és a `protector`-t, ha telepítve van.
12. Törölje a `upgrade/` elemet.
13. Kapcsolja be újra a webhelyet.

### 9.3 Dokumentálja a valódi 2.7.0 frissítési változtatásokat

A 2.7.0-s frissítés legalább a következő konkrét változtatásokat tartalmazza:

- `tokens` tábla létrehozása
- a `bannerclient.passwd` kiterjesztése a modern jelszókivonatokhoz
- munkamenet cookie-beállítások hozzáadása
- távolítsa el az elavult kötegelt könyvtárakat

Az útmutatónak nem kell minden megvalósítási részletet felfednie, de abba kell hagynia azt, hogy a frissítés csak egy fájlmásolat plusz modulfrissítés.

## 10. Történelmi frissítési oldalak

Fájlok:

- `upgrading-from-xoops-2.4.5-easy-way.md`
- `upgrading-from-xoops-2.0.-above-2.0.14-and-2.2..md`
- `upgrading-from-any-xoops-2.0.7-to-2.0.13.2.md`
- `upgrading-a-non-utf-8-site.md`
- `upgrading-xoopseditor-package.md`

**Állapot:** a strukturális döntés már megtörtént – a gyökér `SUMMARY.md` áthelyezi ezeket egy dedikált **Historical Upgrade Notes** szakaszba, és minden fájl tartalmaz egy „Történelmi hivatkozás” feliratot, amely az olvasókat a 2.7.0-s frissítések 9. fejezetére irányítja. Ezek már nem első osztályú frissítési útmutatók.

**Fennmaradó munka (csak a következetesség):**

- Győződjön meg arról, hogy a `README.md` (root) ezeket a „Historical Upgrade Notes” címsor alatt sorolja fel, nem pedig az általános „Frissítések” fejléc alatt.
- Ugyanazt az elválasztást tükrözze a `de/README.md`, `de/SUMMARY.md`, `fr/README.md`, `fr/SUMMARY.md` és `en/SUMMARY.md`.
- Győződjön meg arról, hogy minden korábbi frissítési oldal (a gyökér és a lokalizált `de/book/upg*.md` / `fr/book/upg*.md` másolatok) tartalmaz egy elavult tartalmú kiemelést, amely a 9. fejezetre hivatkozik.

## 11. 1. függelék: Admin GUI

Fájl:

- `appendix-1-working-with-the-new-admin-gui-our-dashboard.md`

Ez a függelék az Oxygen admin GUI-hoz van kötve, és át kell írni.

Szükséges változtatások:

- cserélje ki az összes oxigénreferenciát
- cserélje ki a régi icon/menu képernyőképeket
- dokumentálja az aktuális rendszergazdai témákat:
  - alapértelmezett
  - sötét
  - modern
  - átmenet
- említse meg a jelenlegi 2.7.0 rendszergazdai képességeket a kiadási megjegyzésekben:
  - sablon túlterhelési képesség rendszergazdai témákban
  - frissített admin témakészlet

## 12. 2. függelék: XOOPS feltöltése a FTP-n keresztül

Fájl:

- `appendix-2-uploading-xoops-via-ftp.md`

Szükséges változtatások:

- távolítsa el a HostGator-specifikus és a cPanel-specifikus feltételezéseket
- a fájlfeltöltés szövegezésének korszerűsítése
- vegye figyelembe, hogy a `xoops_lib` mostantól tartalmazza a zeneszerzői függőségeket, így a feltöltések nagyobbak, és nem szabad szelektíven levágni

## 13. 5. függelék: Biztonság

Fájl:

- `appendix-5-increase-security-of-your-xoops-installation.md`

Szükséges változtatások:- távolítsa el a `register_globals` beszélgetést teljesen
- távolítsa el az elavult host-ticket nyelvet
- helyes engedélyszöveg `404`-tól `0444`-ig, ahol csak olvasható
- frissítse a `mainfile.php` és `secure.php` beszélgetést a 2.7.0 elrendezéshez
- adja hozzá az új cookie-domain biztonsággal kapcsolatos állandó kontextust:
  - `XOOPS_COOKIE_DOMAIN_USE_PSL`
  - `XOOPS_COOKIE_DOMAIN`
- gyártási útmutató hozzáadása a következőkhöz:
  - `XOOPS_DB_LEGACY_LOG`
  - `XOOPS_DEBUG`

## 14. Többnyelvű karbantartás hatása

A gyökérszintű angol fájlok javítása után megfelelő frissítésekre van szükség a következőkben:

- `de/book/`
- `fr/book/`
- `de/README.md`
- `fr/README.md`
- `de/SUMMARY.md`
- `fr/SUMMARY.md`

A `en/` fa is felülvizsgálatra szorul, mert külön README-t és eszközkészletet tartalmaz, de úgy tűnik, hogy csak részleges `book/` fát tartalmaz.

## 15. Elsőbbségi sorrend

### Kiadás előtt kritikus

1. Frissítse a repo/version hivatkozásokat 2.7.0-ra.
2. Írja át a 9. fejezetet a valódi 2.7.0 frissítési folyamat és a Smarty 4 előzetes ellenőrzése köré.
3. Frissítse a rendszerkövetelményeket a PHP 8.2+ és MySQL 5.7.8+ verzióra.
4. Javítsa ki a 7. fejezet licenckulcs fájl elérési útját.
5. Téma- és modulleltárak helyesbítése.
6. Javítsa ki a 6. fejezet táblázatainak számát 32-ről 33-ra.

### Fontos a pontosság szempontjából

7. Írja át az írható útvonal útmutatásait.
8. Adja hozzá a Composer automatikus betöltő követelményét az elérési út beállításához.
9. Frissítse az adatbázis-karakterkészlet útmutatóját a `utf8mb4` értékre.
10. Javítsa ki a 8. fejezet útvonal-szerkesztési útmutatóját, hogy az állandók a megfelelő fájlban legyenek dokumentálva.
11. Távolítsa el az ellenőrző összegre vonatkozó utasításokat.
12. Távolítsa el a `register_globals`-t és a többi elhalt PHP-vezetőt.

### Kiadási minőségű tisztítás

13. Cserélje ki az összes telepítői és adminisztrátori képernyőképet.
14. Helyezze ki a korábbi frissítési oldalakat a fő folyamatból.
15. Szinkronizálja a német és a francia másolatokat az angol nyelv javítása után.
16. Tisztítsa meg az elavult hivatkozásokat és a duplikált README sorokat.
