---
title: Frissítés XOOPS 2.5-ről 2.7-re
description: Útmutató lépésről lépésre a XOOPS-telepítés biztonságos frissítéséhez 2.5.x-ről 2.7.x-re.
---
:::vigyázat[Először készíts biztonsági másolatot]
Frissítés előtt mindig készítsen biztonsági másolatot adatbázisáról és fájljairól. Nincs kivétel.
:::

## Mi változott a 2.7-ben

- **PHP 8.2+ szükséges** — A PHP 7.x már nem támogatott
- **A zeneszerző által kezelt függőségek** - A `composer.json`-n keresztül kezelt alapvető könyvtárak
- **PSR-4 automatikus betöltés** - A modulosztályok használhatnak névtereket
- **Továbbfejlesztett XOOPSObject** — Új `getVar()` típusú biztonság, elavult `obj2Array()`
- **Bootstrap 5 adminisztrátor** - Bootstrap 5-tel újraépített adminisztrációs panel

## Frissítés előtti ellenőrzőlista

- [ ] PHP 8.2+ elérhető a szerverén
- [ ] Teljes adatbázis biztonsági mentés (`mysqldump -u user -p xoops_db > backup.sql`)
- [ ] A telepítés teljes fájlmentése
- [ ] A telepített modulok és verzióik listája
- [ ] Az egyéni téma külön mentve

## Frissítési lépések

### 1. Állítsa a webhelyet karbantartási módba

```php
// mainfile.php — add temporarily
define('XOOPS_MAINTENANCE', true);
```

### 2. Töltse le a XOOPS 2.7

```bash
wget https://github.com/XOOPS/XoopsCore27/releases/latest/download/xoops-2.7.x.zip
unzip xoops-2.7.x.zip
```

### 3. Cserélje ki az alapvető fájlokat

Töltse fel az új fájlokat, **kivéve**:
- `uploads/` – a feltöltött fájlok
- `xoops_data/` – az Ön konfigurációja
- `modules/` – a telepített modulok
- `themes/` – az Ön témái
- `mainfile.php` – a webhely konfigurációja

```bash
rsync -av --exclude='uploads/' --exclude='xoops_data/' \
  --exclude='modules/' --exclude='themes/' --exclude='mainfile.php' \
  xoops-2.7/ /var/www/html/
```

### 4. Futtassa a frissítési szkriptet

Keresse meg a `https://yourdomain.com/upgrade/` címet a böngészőjében.
A frissítési varázsló adatbázisáttelepítéseket fog alkalmazni.

### 5. Frissítse a modulokat

A XOOPS 2.7 moduloknak PHP 8.2-kompatibilisnek kell lenniük.
Ellenőrizze a [module Ecosystem](/xoops-docs/2.7/module-guide/introduction/) frissített verzióit.

Az Adminisztrálás → modulok részben kattintson a **Frissítés** lehetőségre minden telepített modulnál.

### 6. Távolítsa el a karbantartási módot, és tesztelje

Távolítsa el a `XOOPS_MAINTENANCE` vonalat a `mainfile.php`-ból, és
ellenőrizze, hogy minden oldal megfelelően betöltődött-e.

## Gyakori problémák

**„Az osztály nem található” hibaüzenet a frissítés után**
- Futtassa a `composer dump-autoload`-t a XOOPS gyökérben
- Törölje a `xoops_data/caches/` könyvtárat

**modul tönkrement a frissítés után**
- Ellenőrizze a modul GitHub-kiadásait a 2.7-kompatibilis verzióért
- Előfordulhat, hogy a modulnak kódmódosításra van szüksége a PHP 8.2 verzióhoz (elavult függvények, beírt tulajdonságok)

**Az adminisztrációs panel CSS elromlott**
- Törölje a böngésző gyorsítótárát
- Győződjön meg arról, hogy a `xoops_lib/` teljesen ki lett cserélve a fájlfeltöltés során
