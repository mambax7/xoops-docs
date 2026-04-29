---
title: "XOOPS szószedet"
description: "A XOOPS-specifikus kifejezések és fogalmak meghatározásai"
---
> Átfogó szószedet a XOOPS-specifikus terminológiáról és fogalmakról.

---

## A

### Admin Framework
A XOOPS 2.3-ban bevezetett szabványos adminisztrációs felület keretrendszer, amely egységes adminisztrátori oldalakat biztosít a modulok között.

### Automatikus betöltés
A PHP osztályok automatikus betöltése, amikor szükség van rájuk, a PSR-4 szabvány használatával a modern XOOPS-ban.

---

## B

### Blokkolás
Önálló tartalmi egység, amely témarégiókba helyezhető. A blokkok megjeleníthetik a modul tartalmát, egyéni HTML vagy dinamikus adatokat.

```php
// Block definition
$modversion['blocks'][] = [
    'file'      => 'myblock.php',
    'name'      => 'My Block',
    'show_func' => 'mymodule_block_show'
];
```

### Bootstrap
A XOOPS mag inicializálási folyamata a modulkód végrehajtása előtt, jellemzően a `mainfile.php` és `header.php` segítségével.

---

## C

### Criteria / CriteriaCompo
Osztályok adatbázis-lekérdezési feltételek objektumorientált felépítéséhez.

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 1));
```

### CSRF (Site-site Request Forgery)
Egy biztonsági támadás megakadályozva a XOOPS-ban a `XOOPSFormHiddenToken`-n keresztüli biztonsági tokenekkel.

---

## D

### DI (Dependency Injection)
A XOOPS 4.0-hoz tervezett tervezési minta, ahol a függőségek beillesztésre kerülnek, nem pedig belsőleg.

### Dirname
Egy modul könyvtárneve, amely a rendszerben egyedi azonosítóként használatos.

### DTYPE (adattípus)
Az XOOPSObject változók tárolásának és megtisztításának módját meghatározó állandók:
- `XOBJ_DTYPE_INT` - Egész szám
- `XOBJ_DTYPE_TXTBOX` - Szöveg (egysoros)
- `XOBJ_DTYPE_TXTAREA` - Szöveg (többsoros)
- `XOBJ_DTYPE_EMAIL` - E-mail cím

---

## E

### Esemény
Előfordulás a XOOPS életciklusban, amely egyéni kódot válthat ki előtöltéseken vagy hookokon keresztül.

---

## F

### Keretrendszer
Lásd: XMF (XOOPS modulkeret).

### Űrlapelem
A XOOPS űrlaprendszer egyik összetevője, amely egy HTML űrlapmezőt képvisel.

---

## G

### Csoport
Megosztott engedélyekkel rendelkező felhasználók gyűjteménye. A fő csoportok a következők: Webmesterek, Regisztrált felhasználók, Névtelen.

---

## H

### Kezelő
Osztály, amely kezeli a CRUD műveleteket XOOPSObject példányokhoz.

```php
$handler = xoops_getModuleHandler('item', 'mymodule');
$item = $handler->get($id);
```

### Segítő
Egy segédprogram osztály, amely egyszerű hozzáférést biztosít a modulkezelőkhöz, konfigurációkhoz és szolgáltatásokhoz.

```php
$helper = \XoopsModules\MyModule\Helper::getInstance();
```

---

## K

### Kernel
Az alapvető XOOPS osztályok alapvető funkciókat biztosítanak: adatbázis-hozzáférés, felhasználókezelés, biztonság stb.

---

## L

### Nyelvi fájl
PHP fájlok, amelyek nemzetközivé tételhez szükséges állandókat tartalmaznak, `language/[code]/` könyvtárakban tárolva.

---

## M

### mainfile.php
A XOOPS elsődleges konfigurációs fájlja, amely adatbázis hitelesítő adatokat és elérési út-definíciókat tartalmaz.

### MCP (modell-vezérlő-előadó)
A MVC-hoz hasonló építészeti minta, amelyet gyakran használnak a XOOPS modulfejlesztésben.

### Köztes szoftver
Szoftver, amely a kérés és a válasz között helyezkedik el, a XOOPS 4.0-hoz tervezett PSR-15 használatával.

### modul
Egy önálló csomag, amely kiterjeszti a XOOPS funkciót, telepítve a `modules/` könyvtárba.

### MOC (Tartalomtérkép)
Obszidián koncepció a kapcsolódó tartalomra hivatkozó áttekintő jegyzetekhez.

---

## N

### Névtér
PHP funkció az órák szervezéséhez, a XOOPS 2.5+ verzióban használatos:
```php
namespace XoopsModules\MyModule;
```

### Értesítés
A XOOPS rendszer a felhasználók értesítésére az eseményekről e-mailben vagy PM-ben.

---

## O

### Objektum
Lásd: XOOPSObject.

---

## P

### Engedély
A hozzáférés-vezérlés csoportokon és engedélykezelőkön keresztül kezelhető.

### Előtöltés
Osztály, amely a XOOPS eseményekhez kapcsolódik, és automatikusan betöltődik a `preloads/` könyvtárból.

### PSR (PHP szabványok ajánlása)
A PHP-FIG szabványok, amelyeket a XOOPS 4.0 teljes mértékben megvalósítanak.

---

## R

### Renderer
Osztály, amely űrlapelemeket vagy más felhasználói felület-összetevőket adott formátumban (Bootstrap stb.) ad ki.

---

## S

### Okos
A XOOPS által használt sablonmotor a prezentáció és a logika elválasztására.

```smarty
<{$variable}>
<{foreach item=item from=$items}>
    <{$item.title}>
<{/foreach}>
```

### Szolgáltatás
Újrafelhasználható üzleti logikát biztosító osztály, amely általában a Helperen keresztül érhető el.

---

## T### Sablon
Smarty-fájl (`.tpl` vagy `.html`), amely meghatározza a modulok megjelenítési rétegét.

### Téma
A webhely vizuális megjelenését meghatározó sablonok és elemek gyűjteménye.

### Token
Egy biztonsági mechanizmus (CSRF védelem), amely biztosítja, hogy az űrlapok legális forrásból származzanak.

---

## U

### uid
Felhasználó ID – a rendszer minden egyes felhasználójának egyedi azonosítója.

---

## V

### Változó (Var)
Egy XOOPSObject-en a `initVar()` használatával definiált mező.

---

## W

### Widget
Kicsi, önálló felhasználói felület komponens, hasonló a blokkokhoz.

---

## X

### XMF (XOOPS modulkeret)
Segédprogramok és osztályok gyűjteménye a modern XOOPS modulfejlesztéshez.

### XOBJ_DTYPE
Állandók a változó adattípusok meghatározásához az XOOPSObjectben.

### XOOPSDatabase
Az adatbázis-absztrakciós réteg, amely biztosítja a lekérdezések végrehajtását és a kilépést.

### XOOPSForm
Az űrlapgeneráló rendszer a HTML űrlapok programozott létrehozásához.

### XOOPSObject
A XOOPS összes adatobjektumának alaposztálya, amely változó kezelést és fertőtlenítést biztosít.

### xoops_version.php
A modul tulajdonságait, táblákat, blokkokat, sablonokat és konfigurációkat meghatározó moduljegyzékfájl.

---

## Gyakori mozaikszavak

| Betűszó | Jelentése |
|---------|----------|
| XOOPS | Bővíthető objektum-orientált portálrendszer |
| XMF | XOOPS modulkeret |
| CSRF | Site-request forgery |
| XSS | Webhelyek közötti szkriptelés |
| ORM | Objektum-relációs leképezés |
| PSR | PHP szabványok ajánlása |
| DI | Dependency Injection |
| MVC | Modell-View-Controller |
| CRUD | Létrehozás, olvasás, frissítés, törlés |

---

## 🔗 Kapcsolódó dokumentáció

- Alapvető fogalmak
- API Referencia
- Külső erőforrások

---

#xoops #szószedet #hivatkozás #terminológia #definíciók
