---
title: "Odpravljanje težav"
description: "Rešitve za pogoste XOOPS težave, tehnike odpravljanja napak in FAQ"
---
> Rešitve pogostih težav in tehnike odpravljanja napak za XOOPS CMS.

---

## 📋 Hitra diagnoza

Preden se poglobite v določene težave, preverite te pogoste vzroke:

1. **Dovoljenja za datoteke** - imeniki potrebujejo 755, datoteke potrebujejo 644
2. **PHP Različica** - Zagotovite PHP 7.4+ (priporočeno 8.x)
3. **Dnevniki napak** - Preverite dnevnike napak `xoops_data/logs/` in PHP
4. **Predpomnilnik** - Počistite predpomnilnik v Skrbnik → Sistem → Vzdrževanje

---

## 🗂️ Vsebina razdelka

### Pogoste težave
- Beli zaslon smrti (WSOD)
- Napake povezave z bazo podatkov
- Napake zavrnjenega dovoljenja
- Napake pri namestitvi modula
- Napake pri prevajanju predloge

### FAQ
- Namestitev FAQ
- Modul FAQ
- Tema FAQ
- Zmogljivost FAQ

### Odpravljanje napak
- Omogočanje načina za odpravljanje napak
- Uporaba Ray Debuggerja
- Razhroščevanje poizvedb v bazi podatkov
- Odpravljanje napak v predlogi Smarty

---

## 🚨 Pogoste težave in rešitve

### Beli zaslon smrti (WSOD)

**Simptomi:** Prazna bela stran, brez sporočila o napaki

**Rešitve:**

1. **Začasno omogočite prikaz napak PHP:**   
```php
   // Add to mainfile.php temporarily
   error_reporting(E_ALL);
   ini_set('display_errors', 1);
   
```
2. **Preverite PHP dnevnik napak:**   
```bash
   tail -f /var/log/php/error.log
   
```
3. **Pogosti vzroki:**
   - Omejitev pomnilnika je presežena
   - Usodna sintaksna napaka PHP
   - Manjka zahtevana razširitev

4. **Odpravite težave s pomnilnikom:**   
```php
   // In mainfile.php or php.ini
   ini_set('memory_limit', '256M');
   
```
---

### Napake povezave z bazo podatkov

**Simptomi:** "Ni mogoče vzpostaviti povezave z bazo podatkov" ali podobno

**Rešitve:**

1. **Preverite poverilnice v mainfile.php:**   
```php
   define('XOOPS_DB_HOST', 'localhost');
   define('XOOPS_DB_USER', 'your_username');
   define('XOOPS_DB_PASS', 'your_password');
   define('XOOPS_DB_NAME', 'your_database');
   
```
2. **Ročno preizkusite povezavo:**   
```php
   <?php
   $conn = new mysqli('localhost', 'user', 'pass', 'database');
   if ($conn->connect_error) {
       die("Connection failed: " . $conn->connect_error);
   }
   echo "Connected successfully";
   
```
3. **Preverite storitev MySQL:**   
```bash
   sudo systemctl status mysql
   sudo systemctl restart mysql
   
```
4. **Preverite uporabniška dovoljenja:**   
```sql
   GRANT ALL PRIVILEGES ON xoops.* TO 'user'@'localhost';
   FLUSH PRIVILEGES;
   
```
---

### Napake zavrnjenega dovoljenja

**Simptomi:** Ni mogoče naložiti datotek, ni mogoče shraniti nastavitev

**Rešitve:**

1. **Nastavite pravilna dovoljenja:**   
```bash
   # Directories
   find /path/to/xoops -type d -exec chmod 755 {} \;

   # Files
   find /path/to/xoops -type f -exec chmod 644 {} \;

   # Writable directories
   chmod -R 777 xoops_data/
   chmod -R 777 uploads/
   
```
2. **Nastavite pravilno lastništvo:**   
```bash
   chown -R www-data:www-data /path/to/xoops
   
```
3. **Preverite SELinux (CentOS/RHEL):**   
```bash
   # Check status
   sestatus

   # Allow httpd to write
   setsebool -P httpd_unified 1
   
```
---

### Napake pri namestitvi modula

**Simptomi:** Modul se ne namesti, SQL napak

**Rešitve:**

1. **Preverite zahteve modula:**
   - Združljivost različice PHP
   - Zahtevane razširitve PHP
   - Združljivost različice XOOPS

2. **Ročna SQL namestitev:**   
```bash
   mysql -u user -p database < modules/mymodule/sql/mysql.sql
   
```
3. **Počisti predpomnilnik modula:**   
```php
   // In xoops_data/caches/
   rm -rf xoops_cache/*
   rm -rf smarty_cache/*
   rm -rf smarty_compile/*
   
```
4. **Preverite xoops_version.php syntax:**   
```bash
   php -l modules/mymodule/xoops_version.php
   
```
---

### Napake pri prevajanju predloge

**Simptomi:** Smarty napake, predloge ni mogoče najti

**Rešitve:**

1. **Počisti predpomnilnik Smarty:**   
```bash
   rm -rf xoops_data/caches/smarty_cache/*
   rm -rf xoops_data/caches/smarty_compile/*
   
```
2. **Preverite sintakso predloge:**   
```smarty
   {* Correct *}
   {$variable}

   {* Incorrect - missing $ *}
   {variable}
   
```
3. **Preverite, ali predloga obstaja:**   
```bash
   ls modules/mymodule/templates/
   
```
4. **Ponovno ustvarite predloge:**
   - Skrbnik → Sistem → Vzdrževanje → Predloge → Ponovno ustvari

---

## 🐛 Tehnike odpravljanja napak

### Omogoči XOOPS način odpravljanja napak
```php
// In mainfile.php
define('XOOPS_DEBUG_LEVEL', 2);

// Levels:
// 0 = Off
// 1 = PHP debug
// 2 = PHP + SQL debug
// 3 = PHP + SQL + Smarty templates
```
### Uporaba Ray Debuggerja

Ray je odlično orodje za odpravljanje napak za PHP:
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
### Beleženje poizvedb v bazi podatkov
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

## ❓ Pogosta vprašanja

### Namestitev

**V: Čarovnik za namestitev prikaže prazno stran**
O: Preverite dnevnike napak PHP, zagotovite, da ima PHP dovolj pomnilnika, preverite dovoljenja za datoteke.

**V: Ne morem pisati v glavno datoteko.php during installation**
O: Nastavite dovoljenja: `chmod 666 mainfile.php` med namestitvijo, nato `chmod 444` po njej.

**V: Tabele baze podatkov niso ustvarjene**
O: Preverite, ali ima uporabnik MySQL privilegije CREATE TABLE, preverite, ali baza podatkov obstaja.

### Moduli

**V: Skrbniška stran modula je prazna**
O: Počistite predpomnilnik, preverite modul admin/menu.php za sintaksne napake.

**V: Bloki modulov niso prikazani**
O: Preverite dovoljenja za blokiranje v Skrbnik → Bloki, preverite, ali je blok dodeljen stranem.

**V: Posodobitev modula ne uspe**
O: Varnostno kopirajte bazo podatkov, poskusite z ročnimi posodobitvami SQL, preverite zahteve glede različice.

### Teme

**V: Tema se ne uporablja pravilno**
O: Počistite predpomnilnik Smarty, preverite, ali theme.html obstaja, preverite dovoljenja za temo.

**V: Po meri CSS se ne nalaga**
O: Preverite pot datoteke, počistite predpomnilnik brskalnika, preverite sintakso CSS.

**V: Slike se ne prikažejo**
O: Preverite poti do slik, preverite dovoljenja mape za nalaganje.

### Zmogljivost

**V: Spletno mesto je zelo počasno**
O: Omogoči predpomnjenje, optimiziraj bazo podatkov, preveri počasne poizvedbe, omogoči OpCache.

**V: Velika poraba pomnilnika**
A: Povečajte memory_limit, optimizirajte velike poizvedbe, implementirajte paginacijo.---

## 🔧 Ukazi za vzdrževanje

### Počisti vse predpomnilnike
```bash
#!/bin/bash
# clear_cache.sh
rm -rf xoops_data/caches/xoops_cache/*
rm -rf xoops_data/caches/smarty_cache/*
rm -rf xoops_data/caches/smarty_compile/*
echo "Cache cleared!"
```
### Optimizacija baze podatkov
```sql
-- Optimize all tables
OPTIMIZE TABLE xoops_config;
OPTIMIZE TABLE xoops_users;
OPTIMIZE TABLE xoops_session;
-- Repeat for other tables

-- Or optimize all at once
mysqlcheck -o -u user -p database
```
### Preverite celovitost datoteke
```bash
# Compare against fresh install
diff -r /path/to/xoops /path/to/fresh-xoops
```
---

## 🔗 Povezana dokumentacija

- Začetek
- Najboljše varnostne prakse
- XOOPS 4.0 Načrt

---

## 📚 Zunanji viri

- [XOOPS Forumi](https://XOOPS.org/modules/newbb/)
- [Težave z GitHub](https://github.com/XOOPS/XoopsCore27/issues)
- [PHP Referenca napake](https://www.php.net/manual/en/errorfunc.constants.php)

---

#XOOPS #odpravljanje težav #debugging #faq #errors #solutions