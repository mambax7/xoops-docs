---
title: "Hibaelhárítás"
description: "Megoldások a gyakori XOOPS-problémákra, hibakeresési technikák és GYIK"
---
> Megoldások gyakori problémákra és hibakeresési technikák XOOPS CMS.

---

## 📋 Gyors diagnózis

Mielőtt konkrét problémákba merülne, ellenőrizze az alábbi gyakori okokat:

1. **Fájlengedélyek** - A könyvtáraknak 755, a fájloknak 644-re van szükségük
2. **PHP verzió** – Győződjön meg arról, hogy PHP 7.4+ (8.x ajánlott)
3. **Hibanaplók** - Ellenőrizze a `xoops_data/logs/` és PHP hibanaplókat
4. **Gyorsítótár** - Törölje a gyorsítótárat az Adminisztrálás → Rendszer → Karbantartás menüpontban

---

## 🗂️ A szakasz tartalma

### Gyakori problémák
- A halál fehér képernyője (WSOD)
- Adatbázis-kapcsolati hibák
- Engedély megtagadott hibák
- modul telepítési hibák
- Sablonfordítási hibák

### FAQ
- Telepítés FAQ
- FAQ modul
- FAQ téma
- Teljesítmény FAQ

### Hibakeresés
- Hibakeresési mód engedélyezése
- Ray Debugger használata
- Adatbázis-lekérdezés hibakeresés
- Smarty sablon hibakeresés

---

## 🚨 Gyakori problémák és megoldások

### A halál fehér képernyője (WSOD)

**Tünetek:** Üres fehér oldal, nincs hibaüzenet

**Megoldások:**

1. **A PHP hibakijelzés ideiglenes engedélyezése:**
   
   ```php
   // Add to mainfile.php temporarily
   error_reporting(E_ALL);
   ini_set('display_errors', 1);
   ```

2. **Ellenőrizze a PHP hibanaplót:**
   
   ```bash
   tail -f /var/log/php/error.log
   ```

3. **Gyakori okok:**
   - Túllépte a memóriakorlátot
   - Végzetes PHP szintaktikai hiba
   - Hiányzik a szükséges bővítmény

4. **Javítsa ki a memóriaproblémákat:**
   
   ```php
   // In mainfile.php or php.ini
   ini_set('memory_limit', '256M');
   ```

---

### Adatbázis-kapcsolati hibák

**Tünetek:** "Nem lehet csatlakozni az adatbázishoz" vagy hasonló

**Megoldások:**

1. **Ellenőrizze a hitelesítési adatokat a mainfile.php-ban:**
   
   ```php
   define('XOOPS_DB_HOST', 'localhost');
   define('XOOPS_DB_USER', 'your_username');
   define('XOOPS_DB_PASS', 'your_password');
   define('XOOPS_DB_NAME', 'your_database');
   ```

2. **Kapcsolat tesztelése manuálisan:**
   
   ```php
   <?php
   $conn = new mysqli('localhost', 'user', 'pass', 'database');
   if ($conn->connect_error) {
       die("Connection failed: " . $conn->connect_error);
   }
   echo "Connected successfully";
   ```

3. **Ellenőrizze a MySQL szervizt:**
   
   ```bash
   sudo systemctl status mysql
   sudo systemctl restart mysql
   ```

4. **Ellenőrizze a felhasználói engedélyeket:**
   
   ```sql
   GRANT ALL PRIVILEGES ON xoops.* TO 'user'@'localhost';
   FLUSH PRIVILEGES;
   ```

---

### Engedély megtagadva hibák

**Jelenségek:** Nem lehet fájlokat feltölteni, nem lehet menteni a beállításokat

**Megoldások:**

1. **A megfelelő engedélyek beállítása:**
   
   ```bash
   # Directories
   find /path/to/xoops -type d -exec chmod 755 {} \;

   # Files
   find /path/to/xoops -type f -exec chmod 644 {} \;

   # Writable directories
   chmod -R 777 xoops_data/
   chmod -R 777 uploads/
   ```

2. **Helyes tulajdonjog beállítása:**
   
   ```bash
   chown -R www-data:www-data /path/to/xoops
   ```

3. **Ellenőrizze a SELinuxot (CentOS/RHEL):**
   
   ```bash
   # Check status
   sestatus

   # Allow httpd to write
   setsebool -P httpd_unified 1
   ```

---

### modultelepítési hibák

**Tünetek:** A modul nem települ, SQL hibák

**Megoldások:**

1. **Ellenőrizze a modul követelményeit:**
   - PHP verzió kompatibilitás
   - Szükséges PHP bővítmények
   - XOOPS verzió kompatibilitás

2. **Kézi SQL telepítés:**
   
   ```bash
   mysql -u user -p database < modules/mymodule/sql/mysql.sql
   ```

3. **modul-gyorsítótár törlése:**
   
   ```php
   // In xoops_data/caches/
   rm -rf xoops_cache/*
   rm -rf smarty_cache/*
   rm -rf smarty_compile/*
   ```

4. **Ellenőrizze a xoops_version.php szintaxist:**
   
   ```bash
   php -l modules/mymodule/xoops_version.php
   ```

---

### Sablonfordítási hibák

**Tünetek:** Okos hibák, sablon nem található

**Megoldások:**

1. **A Smarty gyorsítótár törlése:**
   
   ```bash
   rm -rf xoops_data/caches/smarty_cache/*
   rm -rf xoops_data/caches/smarty_compile/*
   ```

2. **Ellenőrizze a sablon szintaxisát:**
   
   ```smarty
   {* Correct *}
   {$variable}

   {* Incorrect - missing $ *}
   {variable}
   ```

3. **Sablon létezésének ellenőrzése:**
   
   ```bash
   ls modules/mymodule/templates/
   ```

4. **Sablonok újragenerálása:**
   - Admin → Rendszer → Karbantartás → Sablonok → Újragenerálás

---

## 🐛 Hibakeresési technikák

### Engedélyezze a XOOPS hibakeresési módot

```php
// In mainfile.php
define('XOOPS_DEBUG_LEVEL', 2);

// Levels:
// 0 = Off
// 1 = PHP debug
// 2 = PHP + SQL debug
// 3 = PHP + SQL + Smarty templates
```

### Ray Debugger használata

A Ray kiváló hibakereső eszköz a PHP számára:

```php
// Install via Composer
composer require spatie/ray --dev

// Usage in your code
ray($variable);
ray($object)->expand();
ray()->measure();

// Database queries
ray($sql)->label('Query');
```

### Smarty Debug Console

```smarty
{* Enable in template *}
{debug}

{* Or in PHP *}
$xoopsTpl->debugging = true;
```

### Adatbázis-lekérdezések naplózása

```php
// Enable query logging
$GLOBALS['xoopsDB']->setLogger(new XoopsLogger());

// Get all queries
$queries = $GLOBALS['xoopsLogger']->queries;
foreach ($queries as $query) {
    echo $query['sql'] . " - " . $query['time'] . "s\n";
}
```

---

## ❓ Gyakran Ismételt Kérdések

### Telepítés

**K: A telepítővarázsló üres oldalt jelenít meg**
V: Ellenőrizze a PHP hibanaplókat, győződjön meg arról, hogy a PHP elegendő memóriával rendelkezik, és ellenőrizze a fájlengedélyeket.

**K: Telepítés közben nem lehet írni a mainfile.php-ra**
V: Állítsa be az engedélyeket: `chmod 666 mainfile.php` a telepítés során, majd a `chmod 444` után.

**K: Az adatbázistáblák nincsenek létrehozva**
V: Ellenőrizze, hogy a MySQL felhasználó rendelkezik CREATE TABLE jogosultsággal, ellenőrizze az adatbázis létezését.

### modulok

**K: A modul adminisztrátori oldala üres**
V: Törölje a gyorsítótárat, ellenőrizze a modul admin/menu.php-ját szintaktikai hibákért.

**K: A modulblokkok nem jelennek meg**
V: Ellenőrizze a blokkolási jogosultságokat az Adminisztrálás → Letiltások menüpontban, és ellenőrizze, hogy a blokkolás hozzá van-e rendelve az oldalakhoz.

**K: A modul frissítése sikertelen**
V: Mentse az adatbázist, próbálja meg a SQL manuális frissítéseit, ellenőrizze a verziókövetelményeket.

### Témák

**K: A téma nem megfelelő**
V: Törölje a Smarty gyorsítótárat, ellenőrizze a theme.html létezését, ellenőrizze a téma engedélyeit.

**K: Az egyéni CSS nem töltődik be**
V: Ellenőrizze a fájl elérési útját, törölje a böngésző gyorsítótárát, ellenőrizze a CSS szintaxist.**K: A képek nem jelennek meg**
V: Ellenőrizze a kép elérési útját, ellenőrizze a feltöltési mappák engedélyeit.

### Teljesítmény

**K: A webhely nagyon lassú**
V: Gyorsítótárazás engedélyezése, adatbázis optimalizálása, lassú lekérdezések ellenőrzése, OpCache engedélyezése.

**K: Magas memóriahasználat**
V: Növelje a memóriakorlátot, optimalizálja a nagy lekérdezéseket, hajtsa végre a lapozást.

---

## 🔧 Karbantartási parancsok

### Törölje az összes gyorsítótárat

```bash
#!/bin/bash
# clear_cache.sh
rm -rf xoops_data/caches/xoops_cache/*
rm -rf xoops_data/caches/smarty_cache/*
rm -rf xoops_data/caches/smarty_compile/*
echo "Cache cleared!"
```

### Adatbázis optimalizálás

```sql
-- Optimize all tables
OPTIMIZE TABLE xoops_config;
OPTIMIZE TABLE xoops_users;
OPTIMIZE TABLE xoops_session;
-- Repeat for other tables

-- Or optimize all at once
mysqlcheck -o -u user -p database
```

### Ellenőrizze a fájl integritását

```bash
# Compare against fresh install
diff -r /path/to/xoops /path/to/fresh-xoops
```

---

## 🔗 Kapcsolódó dokumentáció

- Kezdő lépések
- Bevált biztonsági gyakorlatok
- XOOPS 4.0 ütemterv

---

## 📚 Külső források

- [XOOPS fórumok](https://xoops.org/modules/newbb/)
- [GitHub-problémák](https://github.com/XOOPS/XOOPSCore27/issues)
- [PHP hibahivatkozás](https://www.php.net/manual/en/errorfunc.constants.php)

---

#xoops #hibaelhárítás #hibakeresés #gyik #hibák #megoldások
