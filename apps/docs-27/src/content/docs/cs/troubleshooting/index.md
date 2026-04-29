---
title: "Odstraňování problémů"
description: "Řešení pro běžné problémy XOOPS, techniky ladění a FAQ"
---

> Řešení běžných problémů a techniky ladění pro XOOPS CMS.

---

## 📋 Rychlá diagnostika

Než se ponoříte do konkrétních problémů, zkontrolujte tyto běžné příčiny:

1. **Oprávnění k souborům** – Adresáře potřebují 755, soubory 644
2. **Verze PHP** – Zajistěte PHP 7.4+ (doporučeno 8.x)
3. **Protokoly chyb** – Zkontrolujte protokoly chyb `xoops_data/logs/` a PHP
4. **Cache** – Vymazání mezipaměti v Admin → System → Maintenance

---

## 🗂️ Obsah sekce

### Běžné problémy
- Bílá obrazovka smrti (WSOD)
- Chyby připojení k databázi
- Chyby s povolením
- Selhání instalace modulu
- Chyby při kompilaci šablony

### FAQ
- Instalace FAQ
- Modul FAQ
- Motiv FAQ
- Výkon FAQ

### Ladění
- Povolení režimu ladění
- Použití Ray Debugger
- Ladění databázových dotazů
- Ladění šablony Smarty

---

## 🚨 Běžné problémy a řešení

### Bílá obrazovka smrti (WSOD)

**Příznaky:** Prázdná bílá stránka, žádná chybová zpráva

**Řešení:**

1. **Dočasně povolit zobrazení chyb PHP:**
   
```php
   // Add to mainfile.php temporarily
   error_reporting(E_ALL);
   ini_set('display_errors', 1);
   
```

2. **Zkontrolujte protokol chyb PHP:**
   
```bash
   tail -f /var/log/php/error.log
   
```

3. **Běžné příčiny:**
   - Překročen limit paměti
   - Závažná chyba syntaxe PHP
   - Chybí požadované rozšíření

4. **Oprava problémů s pamětí:**
   
```php
   // In mainfile.php or php.ini
   ini_set('memory_limit', '256M');
   
```

---

### Chyby připojení k databázi

**Příznaky:** „Nelze se připojit k databázi“ nebo podobně

**Řešení:**

1. **Ověřte přihlašovací údaje v mainfile.php:**
   
```php
   define('XOOPS_DB_HOST', 'localhost');
   define('XOOPS_DB_USER', 'your_username');
   define('XOOPS_DB_PASS', 'your_password');
   define('XOOPS_DB_NAME', 'your_database');
   
```

2. **Otestujte připojení ručně:**
   
```php
   <?php
   $conn = new mysqli('localhost', 'user', 'pass', 'database');
   if ($conn->connect_error) {
       die("Connection failed: " . $conn->connect_error);
   }
   echo "Connected successfully";
   
```

3. **Zkontrolujte službu MySQL:**
   
```bash
   sudo systemctl status mysql
   sudo systemctl restart mysql
   
```

4. **Ověřte uživatelská oprávnění:**
   
```sql
   GRANT ALL PRIVILEGES ON xoops.* TO 'user'@'localhost';
   FLUSH PRIVILEGES;
   
```

---

### Chyby odepření oprávnění

**Příznaky:** Nelze nahrát soubory, nelze uložit nastavení

**Řešení:**

1. **Nastavte správná oprávnění:**
   
```bash
   # Directories
   find /path/to/xoops -type d -exec chmod 755 {} \;

   # Files
   find /path/to/xoops -type f -exec chmod 644 {} \;

   # Writable directories
   chmod -R 777 xoops_data/
   chmod -R 777 uploads/
   
```

2. **Nastavte správné vlastnictví:**
   
```bash
   chown -R www-data:www-data /path/to/xoops
   
```

3. **Zkontrolujte SELinux (CentOS/RHEL):**
   
```bash
   # Check status
   sestatus

   # Allow httpd to write
   setsebool -P httpd_unified 1
   
```

---

### Selhání instalace modulu

**Příznaky:** Modul nelze nainstalovat, chyby SQL

**Řešení:**

1. **Zkontrolujte požadavky na modul:**
   - Kompatibilita verze PHP
   - Požadovaná rozšíření PHP
   - Kompatibilita verze XOOPS

2. **Manuální instalace SQL:**
   
```bash
   mysql -u user -p database < modules/mymodule/sql/mysql.sql
   
```

3. **Vymažte mezipaměť modulu:**
   
```php
   // In xoops_data/caches/
   rm -rf xoops_cache/*
   rm -rf smarty_cache/*
   rm -rf smarty_compile/*
   
```

4. **Zkontrolujte syntaxi xoops_version.php:**
   
```bash
   php -l modules/mymodule/xoops_version.php
   
```

---

### Chyby kompilace šablony

**Příznaky:** Chyby Smarty, šablona nebyla nalezena

**Řešení:**

1. **Vymažte mezipaměť Smarty:**
   
```bash
   rm -rf xoops_data/caches/smarty_cache/*
   rm -rf xoops_data/caches/smarty_compile/*
   
```

2. **Zkontrolujte syntaxi šablony:**
   
```smarty
   {* Correct *}
   {$variable}

   {* Incorrect - missing $ *}
   {variable}
   
```

3. **Ověřte existenci šablony:**
   
```bash
   ls modules/mymodule/templates/
   
```

4. **Regenerujte šablony:**
   - Správce → Systém → Údržba → Šablony → Obnovit

---

## 🐛 Techniky ladění

### Povolit režim ladění XOOPS

```php
// In mainfile.php
define('XOOPS_DEBUG_LEVEL', 2);

// Levels:
// 0 = Off
// 1 = PHP debug
// 2 = PHP + SQL debug
// 3 = PHP + SQL + Smarty templates
```

### Použití Ray Debugger

Ray je vynikající ladicí nástroj pro PHP:

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

### Konzola ladění Smarty

```smarty
{* Enable in template *}
{debug}

{* Or in PHP *}
$xoopsTpl->debugging = true;
```

### Protokolování databázových dotazů

```php
// Enable query logging
$GLOBALS['xoopsDB']->setLogger(new XOOPSLogger());

// Get all queries
$queries = $GLOBALS['xoopsLogger']->queries;
foreach ($queries as $query) {
    echo $query['sql'] . " - " . $query['time'] . "s\n";
}
```

---

## ❓ Často kladené otázky

### Instalace

**Otázka: Průvodce instalací zobrazuje prázdnou stránku**
Odpověď: Zkontrolujte protokoly chyb PHP, ujistěte se, že PHP má dostatek paměti, ověřte oprávnění k souboru.

**O: Během instalace nelze zapisovat do mainfile.php**
A: Nastavte oprávnění: `chmod 666 mainfile.php` během instalace, poté `chmod 444`.

**Otázka: Databázové tabulky nebyly vytvořeny**
Odpověď: Zkontrolujte, zda má uživatel MySQL oprávnění CREATE TABLE, ověřte existenci databáze.

### Moduly

**Otázka: Stránka správce modulu je prázdná**
A: Vymažte mezipaměť, zkontrolujte syntaktické chyby modulu admin/menu.php.

**Otázka: Bloky modulů se nezobrazují**
A: Zkontrolujte oprávnění blokování v Admin → Bloky, ověřte, zda je blokování přiřazeno stránkám.

**Otázka: Aktualizace modulu se nezdaří**
A: Zálohujte databázi, vyzkoušejte ruční aktualizace SQL, zkontrolujte požadavky na verzi.

### Motivy

**Otázka: Motiv se nepoužívá správně**
Odpověď: Vymažte mezipaměť Smarty, zkontrolujte, zda existuje theme.html, ověřte oprávnění k motivu.

**Otázka: Vlastní CSS se nenačítá**
Odpověď: Zkontrolujte cestu k souboru, vymažte mezipaměť prohlížeče, ověřte syntaxi CSS.

**Otázka: Obrázky se nezobrazují**
Odpověď: Zkontrolujte cesty k obrázkům, ověřte oprávnění složky pro nahrávání.

### Výkon

**Otázka: Stránka je velmi pomalá**
A: Povolit ukládání do mezipaměti, optimalizovat databázi, kontrolovat pomalé dotazy, povolit OpCache.**Otázka: Vysoké využití paměti**
A: Zvyšte memory_limit, optimalizujte velké dotazy, implementujte stránkování.

---

## 🔧 Příkazy údržby

### Vymazat všechny mezipaměti

```bash
#!/bin/bash
# clear_cache.sh
rm -rf xoops_data/caches/xoops_cache/*
rm -rf xoops_data/caches/smarty_cache/*
rm -rf xoops_data/caches/smarty_compile/*
echo "Cache cleared!"
```

### Optimalizace databáze

```sql
-- Optimize all tables
OPTIMIZE TABLE xoops_config;
OPTIMIZE TABLE xoops_users;
OPTIMIZE TABLE xoops_session;
-- Repeat for other tables

-- Or optimize all at once
mysqlcheck -o -u user -p database
```

### Zkontrolujte integritu souboru

```bash
# Compare against fresh install
diff -r /path/to/xoops /path/to/fresh-xoops
```

---

## 🔗 Související dokumentace

- Začínáme
- Nejlepší bezpečnostní postupy
- Plán XOOPS 4.0

---

## 📚 Externí zdroje

- [Fóra XOOPS](https://xoops.org/modules/newbb/)
- [Problémy GitHub](https://github.com/XOOPS/XOOPSCore27/issues)
- [PHP Chybová reference](https://www.php.net/manual/en/errorfunc.constants.php)

---

#xoops #odstraňování problémů #ladění #časté dotazy #chyby #řešení