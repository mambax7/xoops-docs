---
title: "Fejlfinding"
description: "Løsninger til almindelige XOOPS-problemer, fejlfindingsteknikker og FAQ"
---

> Løsninger på almindelige problemer og fejlfindingsteknikker for XOOPS CMS.

---

## 📋 Hurtig diagnose

Før du dykker ned i specifikke problemer, skal du kontrollere disse almindelige årsager:

1. **Filtilladelser** - Mapper skal have 755, filer skal have 644
2. **PHP version** - Sørg for, at PHP 7.4+ (8.x anbefales)
3. **Fejllogfiler** - Tjek `xoops_data/logs/` og PHP fejllogfiler
4. **Cache** - Ryd cache i Admin → System → Vedligeholdelse

---

## 🗂️ Indhold i afsnittet

### Almindelige problemer
- White Screen of Death (WSOD)
- Databaseforbindelsesfejl
- Tilladelse nægtet fejl
- Modulinstallationsfejl
- Skabelonkompileringsfejl

### FAQ
- Installation FAQ
- Modul FAQ
- Tema FAQ
- Ydeevne FAQ

### Fejlretning
- Aktivering af fejlretningstilstand
- Brug af Ray Debugger
- Fejlfinding af databaseforespørgsler
- Smart skabelonfejlfinding

---

## 🚨 Almindelige problemer og løsninger

### White Screen of Death (WSOD)

**Symptomer:** Tom hvid side, ingen fejlmeddelelse

**Løsninger:**

1. **Aktiver PHP fejlvisning midlertidigt:**
   
```php
   // Føj midlertidigt til mainfile.php
   fejlrapportering(E_ALL);
   ini_set('display_errors', 1);
   
```

2. **Tjek PHP fejllog:**
   
```bash
   hale -f /var/log/php/error.log
   
```

3. **Almindelige årsager:**
   - Hukommelsesgrænsen er overskredet
   - Fatal PHP syntaksfejl
   - Mangler nødvendig forlængelse

4. **Ret hukommelsesproblemer:**
   
```php
   // I mainfile.php eller php.ini
   ini_set('memory_limit', '256M');
   
```

---

### Databaseforbindelsesfejl

**Symptomer:** "Kan ikke oprette forbindelse til database" eller lignende

**Løsninger:**

1. **Bekræft legitimationsoplysninger i mainfile.php:**
   
```php
   define('XOOPS_DB_HOST', 'localhost');
   define('XOOPS_DB_USER', 'dit_brugernavn');
   define('XOOPS_DB_PASS', 'dit_adgangskode');
   define('XOOPS_DB_NAME', 'din_database');
   
```

2. **Test forbindelsen manuelt:**
   
```php
   <?php
   $conn = new mysqli('localhost', 'bruger', 'pass', 'database');
   if ($conn->connect_error) {
       die("Forbindelsen mislykkedes: " . $conn->connect_error);
   }
   echo "Forbundet med succes";
   
```

3. **Tjek MySQL-tjenesten:**
   
```bash
   sudo systemctl status mysql
   sudo systemctl genstart mysql
   
```

4. **Bekræft brugertilladelser:**
   
```sql
   GRANT ALL PRIVILEGES ON xoops.* TO 'user'@'localhost';
   FLUSH PRIVILEGES;
   
```

---

### Tilladelse nægtet fejl

**Symptomer:** Kan ikke uploade filer, kan ikke gemme indstillinger

**Løsninger:**

1. **Indstil korrekte tilladelser:**
   
```bash
   # Mapper
   find /path/to/xoops -type d -exec chmod 755 {} \;

   # Filer
   find /path/to/xoops -type f -exec chmod 644 {} \;

   # Skrivbare mapper
   chmod -R 777 xoops_data/
   chmod -R 777 uploads/
   
```

2. **Indstil korrekt ejerskab:**
   
```bash
   chown -R www-data:www-data /path/to/xoops
   
```

3. **Tjek SELinux (CentOS/RHEL):**
   
```bash
   # Tjek status
   sestatus

   # Tillad httpd at skrive
   setsebool -P httpd_unified 1
   
```

---

### Modulinstallationsfejl

**Symptomer:** Modulet installeres ikke, SQL fejl

**Løsninger:**

1. **Tjek modulkrav:**
   - PHP version kompatibilitet
   - Nødvendige PHP-udvidelser
   - XOOPS version kompatibilitet

2. **Manuel SQL installation:**
   
```bash
   mysql -u bruger -p database < modules/mymodule/sql/mysql.sql
   
```

3. **Ryd modulcache:**
   
```php
   // I xoops_data/caches/
   rm -rf xoops_cache/*
   rm -rf smarty_cache/*
   rm -rf smarty_compile/*
   
```

4. **Tjek syntaks for xoops_version.php:**
   
```bash
   php -l modules/mymodule/xoops_version.php
   
```

---

### Skabelonkompileringsfejl

**Symptomer:** Smarte fejl, skabelon blev ikke fundet

**Løsninger:**1. **Ryd Smarty-cache:**
   
```bash
   rm -rf xoops_data/caches/smarty_cache/*
   rm -rf xoops_data/caches/smarty_compile/*
   
```

2. **Tjek skabelonsyntaks:**
   
```smarty
   {* Korrekt *}
   {$variable}

   {* Forkert - mangler $ *}
   {variabel}
   
```

3. **Bekræft, at skabelonen eksisterer:**
   
```bash
   ls moduler/mitmodul/skabeloner/
   
```

4. **Regenerer skabeloner:**
   - Admin → System → Vedligeholdelse → Skabeloner → Gendan

---

## 🐛 Fejlretningsteknikker

### Aktiver XOOPS Debug Mode

```php
// In mainfile.php
define('XOOPS_DEBUG_LEVEL', 2);

// Levels:
// 0 = Off
// 1 = PHP debug
// 2 = PHP + SQL debug
// 3 = PHP + SQL + Smarty templates
```

### Brug af Ray Debugger

Ray er et fremragende fejlfindingsværktøj til PHP:

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

### Databaseforespørgselslogning

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

## ❓ Ofte stillede spørgsmål

### Installation

**Sp: Installationsguiden viser tom side**
A: Tjek PHP fejllogfiler, sørg for, at PHP har nok hukommelse, bekræft filtilladelser.

**Sp: Kan ikke skrive til mainfile.php under installationen**
A: Indstil tilladelser: `chmod 666 mainfile.php` under installationen, derefter `chmod 444` efter.

**Sp: Databasetabeller er ikke oprettet**
A: Kontroller, at MySQL-brugeren har CREATE TABLE-privilegier, bekræft, at databasen eksisterer.

### Moduler

**Sp: Moduladministratorsiden er tom**
A: Ryd cache, tjek modulets admin/menu.php for syntaksfejl.

**Sp: Modulblokke vises ikke**
A: Kontroller blokeringstilladelser i Admin → Blokerer, bekræft blokering er tildelt sider.

**Sp: Modulopdatering mislykkes**
A: Sikkerhedskopier database, prøv manuelle SQL-opdateringer, tjek versionskravene.

### Temaer

**Sp.: Temaet gælder ikke korrekt**
A: Ryd Smarty cache, kontroller theme.html eksisterer, bekræft tematilladelser.

**Sp: Custom CSS indlæses ikke**
A: Tjek filstien, ryd browserens cache, bekræft CSS syntaks.

**Sp: Billeder vises ikke**
A: Tjek billedstier, bekræft upload-mappetilladelser.

### Ydeevne

**Sp: Siden er meget langsom**
A: Aktiver cachelagring, optimer databasen, tjek for langsomme forespørgsler, aktiver OpCache.

**Sp: Højt hukommelsesforbrug**
A: Forøg memory_limit, optimer store forespørgsler, implementer paginering.

---

## 🔧 Vedligeholdelseskommandoer

### Ryd alle caches

```bash
#!/bin/bash
# clear_cache.sh
rm -rf xoops_data/caches/xoops_cache/*
rm -rf xoops_data/caches/smarty_cache/*
rm -rf xoops_data/caches/smarty_compile/*
echo "Cache cleared!"
```

### Databaseoptimering

```sql
-- Optimize all tables
OPTIMIZE TABLE xoops_config;
OPTIMIZE TABLE xoops_users;
OPTIMIZE TABLE xoops_session;
-- Repeat for other tables

-- Or optimize all at once
mysqlcheck -o -u user -p database
```

### Tjek filintegritet

```bash
# Compare against fresh install
diff -r /path/to/xoops /path/to/fresh-xoops
```

---

## 🔗 Relateret dokumentation

- Kom godt i gang
- Bedste praksis for sikkerhed
- XOOPS 4.0 køreplan

---

## 📚 Eksterne ressourcer

- [XOOPS fora](https://xoops.org/modules/newbb/)
- [GitHub problemer](https://github.com/XOOPS/XoopsCore27/issues)
- [PHP fejlreference](https://www.php.net/manual/en/errorfunc.constants.php)

---

#xoops #fejlfinding #fejlfinding #faq #fejl #løsninger
