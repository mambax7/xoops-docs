---
title: "Rješavanje problema"
description: "Rješenja za uobičajene probleme XOOPS, tehnike otklanjanja pogrešaka i FAQ"
---
> Rješenja uobičajenih problema i tehnike otklanjanja pogrešaka za XOOPS CMS.

---

## 📋 Brza dijagnoza

Prije nego što se upustite u određene probleme, provjerite ove uobičajene uzroke:

1. **dozvole za datoteke** - Direktoriji trebaju 755, datoteke trebaju 644
2. **Verzija PHP** - Osigurajte PHP 7.4+ (8.x preporučeno)
3. **Evidencije grešaka** - Provjerite zapise grešaka `xoops_data/logs/` i PHP
4. **predmemorija** - Obrišite cache u Admin → Sustav → Održavanje

---

## 🗂️ Sadržaj odjeljka

### Uobičajeni problemi
- Bijeli ekran smrti (WSOD)
- Pogreške veze s bazom podataka
- Pogreške odbijene dozvole
- Greške pri instalaciji modula
- Pogreške kompilacije predloška

### FAQ
- Često postavljana pitanja o instalaciji
- modul FAQ
- Česta pitanja o temi
- Česta pitanja o izvedbi

### Otklanjanje pogrešaka
- Omogućivanje načina otklanjanja pogrešaka
- Korištenje Ray Debuggera
- Otklanjanje pogrešaka upita baze podataka
- Smarty Otklanjanje pogrešaka predloška

---

## 🚨 Uobičajeni problemi i rješenja

### Bijeli ekran smrti (WSOD)

**Simptomi:** Prazna bijela stranica, nema poruke o pogrešci

**Rješenja:**

1. **Privremeno omogućite prikaz pogreške PHP:**
   ```php
   // Add to mainfile.php temporarily
   error_reporting(E_ALL);
   ini_set('display_errors', 1);
   ```

2. **Provjerite zapisnik grešaka PHP:**
   ```bash
   tail -f /var/log/php/error.log
   ```

3. **Uobičajeni uzroci:**
   - Ograničenje memorije premašeno
   - Fatalna sintaktička pogreška PHP
   - Nedostaje potrebno proširenje

4. **Rješavanje problema s memorijom:**
   ```php
   // In mainfile.php or php.ini
   ini_set('memory_limit', '256M');
   ```

---

### Pogreške veze s bazom podataka

**Simptomi:** "Ne mogu se povezati s bazom podataka" ili slično

**Rješenja:**

1. **Provjerite vjerodajnice u mainfile.php:**
   ```php
   define('XOOPS_DB_HOST', 'localhost');
   define('XOOPS_DB_USER', 'your_username');
   define('XOOPS_DB_PASS', 'your_password');
   define('XOOPS_DB_NAME', 'your_database');
   ```

2. **Ručno testirajte vezu:**
   ```php
   <?php
   $conn = new mysqli('localhost', 'user', 'pass', 'database');
   if ($conn->connect_error) {
       die("Connection failed: " . $conn->connect_error);
   }
   echo "Connected successfully";
   ```

3. **Provjerite uslugu MySQL:**
   ```bash
   sudo systemctl status mysql
   sudo systemctl restart mysql
   ```

4. **Provjerite korisničke dozvole:**
   
   ```sql
   GRANT ALL PRIVILEGES ON xoops.* TO 'user'@'localhost';
   FLUSH PRIVILEGES;
   ```

---

### Pogreške odbijene dozvole

**Simptomi:** Ne mogu učitati datoteke, ne mogu spremiti postavke

**Rješenja:**

1. **Postavite ispravna dopuštenja:**
   ```bash
   # Directories
   find /path/to/xoops -type d -exec chmod 755 {} \;

   # Files
   find /path/to/xoops -type f -exec chmod 644 {} \;

   # Writable directories
   chmod -R 777 xoops_data/
   chmod -R 777 uploads/
   ```

2. **Postavite ispravno vlasništvo:**
   ```bash
   chown -R www-data:www-data /path/to/xoops
   ```

3. **Provjerite SELinux (CentOS/RHEL):**
   ```bash
   # Check status
   sestatus

   # Allow httpd to write
   setsebool -P httpd_unified 1
   ```

---

### Greške pri instalaciji modula

**Simptomi:** modul se ne instalira, greške SQL

**Rješenja:**

1. **Provjerite zahtjeve modula:**
   - Kompatibilnost verzije PHP
   - Potrebna proširenja PHP
   - Kompatibilnost verzije XOOPS

2. **Ručna instalacija SQL:**
   ```bash
   mysql -u user -p database < modules/mymodule/sql/mysql.sql
   ```
   ```php
   // In xoops_data/caches/
   rm -rf xoops_cache/*
   rm -rf smarty_cache/*
   rm -rf smarty_compile/*
   ```

4. **Provjerite sintaksu xoops_version.php:**
   ```bash
   php -l modules/mymodule/xoops_version.php
   ```

---

### Pogreške kompilacije predloška

**Simptomi:** Smarty pogreške, predložak nije pronađen

**Rješenja:**

1. **Očisti Smarty cache:**
   ```bash
   rm -rf xoops_data/caches/smarty_cache/*
   rm -rf xoops_data/caches/smarty_compile/*
   ```

2. **Provjerite sintaksu predloška:**
   
   ```smarty
   {* Correct *}
   {$variable}

   {* Incorrect - missing $ *}
   {variable}
   ```

3. **Potvrdite da predložak postoji:**
   ```bash
   ls modules/mymodule/templates/
   ```

4. **Regeneriraj templates:**
   - Administrator → Sustav → Održavanje → predlošci → Ponovno generiraj

---

## 🐛 Tehnike otklanjanja pogrešaka

### Omogući XOOPS način otklanjanja pogrešaka

```php
// In mainfile.php
define('XOOPS_DEBUG_LEVEL', 2);

// Levels:
// 0 = Off
// 1 = PHP debug
// 2 = PHP + SQL debug
// 3 = PHP + SQL + Smarty templates
```

### Korištenje Ray Debuggera

Ray je izvrstan alat za otklanjanje pogrešaka za PHP:

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

### Smarty Konzola za otklanjanje pogrešaka

```smarty
{* Enable in template *}
{debug}

{* Or in PHP *}
$xoopsTpl->debugging = true;
```

### Bilježenje upita baze podataka

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

## ❓ Često postavljana pitanja

### Instalacija

**P: Čarobnjak za instalaciju prikazuje praznu stranicu**
O: Provjerite zapisnike pogrešaka PHP, provjerite ima li PHP dovoljno memorije, provjerite dozvole za datoteke.

**P: Ne mogu pisati na mainfile.php tijekom instalacije**
O: Postavite dopuštenja: `chmod 666 mainfile.php` tijekom instalacije, zatim `chmod 444` nakon.

**P: Tablice baze podataka nisu izrađene**
O: Provjerite MySQL korisnik ima privilegije CREATE TABLE, provjerite postoji li baza podataka.

### moduli

**P: Stranica modula admin je prazna**
O: Obrišite cache, provjerite admin/menu.php modula za pogreške u sintaksi.

**P: Blokovi modula se ne prikazuju**
O: Provjerite dopuštenja za blokiranje u Administrator → Blokovi, potvrdite da je blok dodijeljen stranicama.

**P: Ažuriranje modula nije uspjelo**
O: Sigurnosna kopija baze podataka, isprobajte ručna ažuriranja SQL, provjerite zahtjeve verzije.

### teme

**P: tema se ne primjenjuje ispravno**
O: Obrišite Smarty cache, provjerite postoji li theme.html, provjerite dopuštenja za temu.

**P: Prilagođeni CSS se ne učitava**
O: Provjerite put datoteke, očistite preglednik cache, provjerite sintaksu CSS.

**P: Slike se ne prikazuju**
O: Provjerite putanje slika, provjerite dozvole mape uploads.

### Izvedba

**P: Stranica je jako spora**
O: Omogućite predmemoriju, optimizirajte bazu podataka, provjerite ima li sporih upita, omogućite OpCache.

**P: Velika upotreba memorije**
O: Povećajte memory_limit, optimizirajte velike upite, implementirajte paginaciju.

---

## 🔧 Naredbe za održavanje

### Obriši sve predmemorije

```bash
#!/bin/bash
# clear_cache.sh
rm -rf xoops_data/caches/xoops_cache/*
rm -rf xoops_data/caches/smarty_cache/*
rm -rf xoops_data/caches/smarty_compile/*
echo "Cache cleared!"
```

### Optimizacija baze podataka

```sql
-- Optimize all tables
OPTIMIZE TABLE xoops_config;
OPTIMIZE TABLE xoops_users;
OPTIMIZE TABLE xoops_session;
-- Repeat for other tables

-- Or optimize all at once
mysqlcheck -o -u user -p database
```

### Provjerite integritet datoteke

```bash
# Compare against fresh install
diff -r /path/to/xoops /path/to/fresh-xoops
```

---

## 🔗 Povezana dokumentacija

- Početak rada
- Najbolje sigurnosne prakse
- XOOPS 4.0 Plan puta

---

## 📚 Vanjski resursi

- [XOOPS Forumi](https://xoops.org/modules/newbb/)
- [Problemi s GitHubom](https://github.com/XOOPS/XoopsCore27/issues)
- [PHP Referenca pogreške](https://www.php.net/manual/en/errorfunc.constants.php)

---

#xoops #troubleshooting #debugging #faq #errors #solutions
