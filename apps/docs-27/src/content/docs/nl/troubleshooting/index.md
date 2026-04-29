---
title: "Problemen oplossen"
description: "Oplossingen voor veelvoorkomende XOOPS-problemen, foutopsporingstechnieken en FAQ"
---
> Oplossingen voor veelvoorkomende problemen en foutopsporingstechnieken voor XOOPS CMS.

---

## 📋 Snelle diagnose

Voordat u ingaat op specifieke problemen, controleert u deze veelvoorkomende oorzaken:

1. **Bestandsrechten** - Mappen hebben 755 nodig, bestanden 644
2. **PHP-versie** - Zorg ervoor dat PHP 7.4+ (8.x aanbevolen)
3. **Foutlogboeken** - Controleer de foutenlogboeken van `xoops_data/logs/` en PHP
4. **Cache** - Cache wissen in Beheerder → Systeem → Onderhoud

---

## 🗂️ Sectie-inhoud

### Veelvoorkomende problemen
- Wit scherm des doods (WSOD)
- Databaseverbindingsfouten
- Toestemming geweigerde fouten
- Module-installatiefouten
- Sjablooncompilatiefouten

### FAQ
- Installatie FAQ
- Module FAQ
- Thema FAQ
- Prestaties FAQ

### Foutopsporing
- Debug-modus inschakelen
- Ray Debugger gebruiken
- Foutopsporing in databasequery's
- Smarty-sjabloonfoutopsporing

---

## 🚨 Veelvoorkomende problemen en oplossingen

### Wit scherm des doods (WSOD)

**Symptomen:** Lege witte pagina, geen foutmelding

**Oplossingen:**

1. **Schakel de PHP-foutweergave tijdelijk in:**
   
```php
   // Add to mainfile.php temporarily
   error_reporting(E_ALL);
   ini_set('display_errors', 1);
   
```

2. **Controleer het foutenlogboek PHP:**
   
```bash
   tail -f /var/log/php/error.log
   
```

3. **Veelvoorkomende oorzaken:**
   - Geheugenlimiet overschreden
   - Fatale syntaxisfout PHP
   - Ontbrekende vereiste extensie

4. **Geheugenproblemen oplossen:**
   
```php
   // In mainfile.php or php.ini
   ini_set('memory_limit', '256M');
   
```

---

### Databaseverbindingsfouten

**Symptomen:** "Kan geen verbinding maken met de database" of iets dergelijks

**Oplossingen:**

1. **Verifieer de inloggegevens in mainfile.php:**
   
```php
   define('XOOPS_DB_HOST', 'localhost');
   define('XOOPS_DB_USER', 'your_username');
   define('XOOPS_DB_PASS', 'your_password');
   define('XOOPS_DB_NAME', 'your_database');
   
```

2. **Verbinding handmatig testen:**
   
```php
   <?php
   $conn = new mysqli('localhost', 'user', 'pass', 'database');
   if ($conn->connect_error) {
       die("Connection failed: " . $conn->connect_error);
   }
   echo "Connected successfully";
   
```

3. **Controleer de MySQL-service:**
   
```bash
   sudo systemctl status mysql
   sudo systemctl restart mysql
   
```

4. **Verifieer gebruikersrechten:**
   
```sql
   GRANT ALL PRIVILEGES ON xoops.* TO 'user'@'localhost';
   FLUSH PRIVILEGES;
   
```

---

### Fouten met geweigerde toestemming

**Symptomen:** Kan geen bestanden uploaden, kan instellingen niet opslaan

**Oplossingen:**

1. **Stel de juiste rechten in:**
   
```bash
   # Directories
   find /path/to/xoops -type d -exec chmod 755 {} \;

   # Files
   find /path/to/xoops -type f -exec chmod 644 {} \;

   # Writable directories
   chmod -R 777 xoops_data/
   chmod -R 777 uploads/
   
```

2. **Stel het juiste eigendom in:**
   
```bash
   chown -R www-data:www-data /path/to/xoops
   
```

3. **Controleer SELinux (CentOS/RHEL):**
   
```bash
   # Check status
   sestatus

   # Allow httpd to write
   setsebool -P httpd_unified 1
   
```

---

### Fouten bij het installeren van modules

**Symptomen:** Module kan niet worden geïnstalleerd, SQL-fouten

**Oplossingen:**

1. **Controleer de modulevereisten:**
   - Compatibiliteit met PHP-versie
   - Vereiste PHP-extensies
   - Compatibiliteit met XOOPS-versie

2. **Handmatige SQL-installatie:**
   
```bash
   mysql -u user -p database < modules/mymodule/sql/mysql.sql
   
```

3. **Modulecache wissen:**
   
```php
   // In xoops_data/caches/
   rm -rf xoops_cache/*
   rm -rf smarty_cache/*
   rm -rf smarty_compile/*
   
```

4. **Controleer de syntaxis van xoops_version.php:**
   
```bash
   php -l modules/mymodule/xoops_version.php
   
```

---

### Fouten bij het compileren van sjablonen

**Symptomen:** Smarty-fouten, sjabloon niet gevonden

**Oplossingen:**

1. **Smarty-cache wissen:**
   
```bash
   rm -rf xoops_data/caches/smarty_cache/*
   rm -rf xoops_data/caches/smarty_compile/*
   
```

2. **Controleer de syntaxis van de sjabloon:**
   
```smarty
   {* Correct *}
   {$variable}

   {* Incorrect - missing $ *}
   {variable}
   
```

3. **Controleer of de sjabloon bestaat:**
   
```bash
   ls modules/mymodule/templates/
   
```

4. **Sjablonen opnieuw genereren:**
   - Beheerder → Systeem → Onderhoud → Sjablonen → Opnieuw genereren

---

## 🐛 Foutopsporingstechnieken

### XOOPS-foutopsporingsmodus inschakelen

```php
// In mainfile.php
define('XOOPS_DEBUG_LEVEL', 2);

// Levels:
// 0 = Off
// 1 = PHP debug
// 2 = PHP + SQL debug
// 3 = PHP + SQL + Smarty templates
```

### Ray Debugger gebruiken

Ray is een uitstekende foutopsporingstool voor PHP:

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

### Smarty-foutopsporingsconsole

```smarty
{* Enable in template *}
{debug}

{* Or in PHP *}
$xoopsTpl->debugging = true;
```

### Logboekregistratie van databasequery's

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

## ❓ Veelgestelde vragen

### Installatie

**V: Installatiewizard toont lege pagina**
A: Controleer de foutenlogboeken van PHP, zorg ervoor dat PHP voldoende geheugen heeft en controleer de bestandsrechten.

**V: Kan niet schrijven naar mainfile.php tijdens installatie**
A: Stel machtigingen in: `chmod 666 mainfile.php` tijdens de installatie, daarna `chmod 444` daarna.

**V: Databasetabellen zijn niet gemaakt**
A: Controleer of de MySQL-gebruiker CREATE TABLE-rechten heeft, controleer of de database bestaat.

### Modules

**V: Modulebeheerpagina is leeg**
A: Wis de cache, controleer de admin/menu.php van de module op syntaxisfouten.

**V: Moduleblokken worden niet weergegeven**
A: Controleer de blokmachtigingen in Beheerder → Blokken, controleer of het blok aan pagina's is toegewezen.

**V: Module-update mislukt**
A: Maak een back-up van de database, probeer handmatige SQL-updates, controleer de versievereisten.

### Thema's

**V: Thema wordt niet correct toegepast**
A: Wis de Smarty-cache, controleer of theme.html bestaat, verifieer de themarechten.

**V: Aangepaste CSS wordt niet geladen**
A: Controleer het bestandspad, wis de browsercache, verifieer de syntaxis van CSS.

**V: Afbeeldingen worden niet weergegeven**
A: Controleer de afbeeldingspaden en verifieer de machtigingen voor de uploadmap.

### Prestatie**V: Site is erg traag**
A: Schakel caching in, optimaliseer de database, controleer op langzame queries, schakel OpCache in.

**V: Hoog geheugengebruik**
A: Verhoog de geheugenlimiet, optimaliseer grote zoekopdrachten, implementeer paginering.

---

## 🔧 Onderhoudsopdrachten

### Wis alle caches

```bash
#!/bin/bash
# clear_cache.sh
rm -rf xoops_data/caches/xoops_cache/*
rm -rf xoops_data/caches/smarty_cache/*
rm -rf xoops_data/caches/smarty_compile/*
echo "Cache cleared!"
```

### Database-optimalisatie

```sql
-- Optimize all tables
OPTIMIZE TABLE xoops_config;
OPTIMIZE TABLE xoops_users;
OPTIMIZE TABLE xoops_session;
-- Repeat for other tables

-- Or optimize all at once
mysqlcheck -o -u user -p database
```

### Controleer de bestandsintegriteit

```bash
# Compare against fresh install
diff -r /path/to/xoops /path/to/fresh-xoops
```

---

## 🔗 Gerelateerde documentatie

- Aan de slag
- Beste praktijken op het gebied van beveiliging
- XOOPS 4.0-routekaart

---

## 📚 Externe bronnen

- [XOOPS-forums](https://xoops.org/modules/newbb/)
- [GitHub-problemen](https://github.com/XOOPS/XoopsCore27/issues)
- [PHP foutreferentie](https://www.php.net/manual/en/errorfunc.constants.php)

---

#xoops #troubleshooting #debugging #faq #errors #solutions