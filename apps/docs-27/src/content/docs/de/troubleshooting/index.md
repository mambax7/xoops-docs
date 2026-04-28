---
title: "Fehlerbehebung"
description: "Lösungen für häufige XOOPS-Probleme, Debugging-Techniken und FAQ"
---

> Lösungen für häufige Probleme und Debugging-Techniken für XOOPS CMS.

---

## Schnelle Diagnose

Bevor Sie sich in spezifische Probleme vertiefen, überprüfen Sie diese häufigen Ursachen:

1. **Dateiberechtigungen** - Verzeichnisse benötigen 755, Dateien benötigen 644
2. **PHP-Version** - Stellen Sie sicher, dass PHP 7.4+ (8.x empfohlen)
3. **Fehler-Logs** - Überprüfen Sie `xoops_data/logs/` und PHP-Fehler-Logs
4. **Cache** - Löschen Sie Cache unter Admin → System → Maintenance

---

## Abschnitt Inhalte

### Häufige Probleme
- White Screen of Death (WSOD)
- Datenbankverbindungsfehler
- Permission Denied Fehler
- Modull-Installationsfehler
- Template-Kompilierungsfehler

### FAQ
- Installations-FAQ
- Modul-FAQ
- Design-FAQ
- Leistungs-FAQ

### Debugging
- Debug-Modus aktivieren
- Ray Debugger verwenden
- Datenbank-Abfrage-Debugging
- Smarty-Template-Debugging

---

## Häufige Probleme & Lösungen

### White Screen of Death (WSOD)

**Symptome:** Leere weiße Seite, keine Fehlermeldung

**Lösungen:**

1. **PHP-Fehleranzeige temporär aktivieren:**
   ```php
   // Add to mainfile.php temporarily
   error_reporting(E_ALL);
   ini_set('display_errors', 1);
   ```

2. **Überprüfen Sie das PHP-Fehler-Log:**
   ```bash
   tail -f /var/log/php/error.log
   ```

3. **Häufige Ursachen:**
   - Speicherlimit überschritten
   - Fatale PHP-Syntax-Fehler
   - Fehlende erforderliche Erweiterung

4. **Speicherprobleme beheben:**
   ```php
   // In mainfile.php or php.ini
   ini_set('memory_limit', '256M');
   ```

---

### Datenbankverbindungsfehler

**Symptome:** "Unable to connect to database" oder ähnlich

**Lösungen:**

1. **Überprüfen Sie Anmeldeinformationen in mainfile.php:**
   ```php
   define('XOOPS_DB_HOST', 'localhost');
   define('XOOPS_DB_USER', 'your_username');
   define('XOOPS_DB_PASS', 'your_password');
   define('XOOPS_DB_NAME', 'your_database');
   ```

2. **Testen Sie die Verbindung manuell:**
   ```php
   <?php
   $conn = new mysqli('localhost', 'user', 'pass', 'database');
   if ($conn->connect_error) {
       die("Connection failed: " . $conn->connect_error);
   }
   echo "Connected successfully";
   ```

3. **Überprüfen Sie den MySQL-Service:**
   ```bash
   sudo systemctl status mysql
   sudo systemctl restart mysql
   ```

4. **Überprüfen Sie die Benutzerberechtigungen:**
   ```sql
   GRANT ALL PRIVILEGES ON xoops.* TO 'user'@'localhost';
   FLUSH PRIVILEGES;
   ```

---

### Permission Denied Fehler

**Symptome:** Dateien können nicht hochgeladen werden, Einstellungen können nicht gespeichert werden

**Lösungen:**

1. **Legen Sie die richtigen Berechtigungen fest:**
   ```bash
   # Directories
   find /path/to/xoops -type d -exec chmod 755 {} \;

   # Files
   find /path/to/xoops -type f -exec chmod 644 {} \;

   # Writable directories
   chmod -R 777 xoops_data/
   chmod -R 777 uploads/
   ```

2. **Legen Sie die richtige Eigentumsschaft fest:**
   ```bash
   chown -R www-data:www-data /path/to/xoops
   ```

3. **Überprüfen Sie SELinux (CentOS/RHEL):**
   ```bash
   # Check status
   sestatus

   # Allow httpd to write
   setsebool -P httpd_unified 1
   ```

---

### Modull-Installationsfehler

**Symptome:** Modul wird nicht installiert, SQL-Fehler

**Lösungen:**

1. **Überprüfen Sie Modul-Anforderungen:**
   - PHP-Versionskompatibilität
   - Erforderliche PHP-Erweiterungen
   - XOOPS-Versionskompatibilität

2. **Manuelle SQL-Installation:**
   ```bash
   mysql -u user -p database < modules/mymodule/sql/mysql.sql
   ```

3. **Löschen Sie den Modul-Cache:**
   ```php
   // In xoops_data/caches/
   rm -rf xoops_cache/*
   rm -rf smarty_cache/*
   rm -rf smarty_compile/*
   ```

4. **Überprüfen Sie xoops_version.php Syntax:**
   ```bash
   php -l modules/mymodule/xoops_version.php
   ```

---

### Template-Kompilierungsfehler

**Symptome:** Smarty-Fehler, Template nicht gefunden

**Lösungen:**

1. **Löschen Sie den Smarty-Cache:**
   ```bash
   rm -rf /path/to/xoops/xoops_data/caches/smarty_cache/*
   rm -rf /path/to/xoops/xoops_data/caches/smarty_compile/*
   ```

2. **Überprüfen Sie die Template-Syntax:**
   ```smarty
   {* Correct *}
   {$variable}

   {* Incorrect - missing $ *}
   {variable}
   ```

3. **Überprüfen Sie, ob die Template existiert:**
   ```bash
   ls modules/mymodule/templates/
   ```

4. **Regenerieren Sie Templates:**
   - Admin → System → Maintenance → Templates → Regenerate

---

## Debugging-Techniken

### Aktivieren Sie den XOOPS-Debug-Modus

```php
// In mainfile.php
define('XOOPS_DEBUG_LEVEL', 2);

// Levels:
// 0 = Off
// 1 = PHP debug
// 2 = PHP + SQL debug
// 3 = PHP + SQL + Smarty templates
```

### Verwenden Sie Ray Debugger

Ray ist ein hervorragendes Debugging-Tool für PHP:

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

### Smarty-Debug-Konsole

```smarty
{* Enable in template *}
{debug}

{* Or in PHP *}
$xoopsTpl->debugging = true;
```

### Datenbankabfrage-Logging

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

## Häufig gestellte Fragen

### Installation

**F: Der Installations-Assistent zeigt eine leere Seite**
A: Überprüfen Sie PHP-Fehler-Logs, stellen Sie sicher, dass PHP genug Speicher hat, überprüfen Sie Dateiberechtigungen.

**F: Kann mainfile.php während der Installation nicht schreiben**
A: Setzen Sie Berechtigungen: `chmod 666 mainfile.php` während der Installation, dann `chmod 444` danach.

**F: Datenbanktabellen werden nicht erstellt**
A: Überprüfen Sie, ob der MySQL-Benutzer CREATE TABLE Berechtigungen hat, überprüfen Sie, ob die Datenbank existiert.

### Module

**F: Modul-Admin-Seite ist leer**
A: Löschen Sie Cache, überprüfen Sie das Module's admin/menu.php auf Syntax-Fehler.

**F: Modul-Blöcke werden nicht angezeigt**
A: Überprüfen Sie die Block-Berechtigungen unter Admin → Blocks, überprüfen Sie, ob Block den Seiten zugeordnet ist.

**F: Modul-Update schlägt fehl**
A: Sichern Sie die Datenbank, versuchen Sie manuelle SQL-Updates, überprüfen Sie Versionsanforderungen.

### Designs

**F: Design wird nicht korrekt angewendet**
A: Löschen Sie Smarty-Cache, überprüfen Sie, ob theme.html existiert, überprüfen Sie Design-Berechtigungen.

**F: Benutzerdefiniertes CSS wird nicht geladen**
A: Überprüfen Sie Dateipfad, löschen Sie Browser-Cache, überprüfen Sie CSS-Syntax.

**F: Bilder werden nicht angezeigt**
A: Überprüfen Sie Bildpfade, überprüfen Sie Uploads-Ordner-Berechtigungen.

### Leistung

**F: Webseite ist sehr langsam**
A: Aktivieren Sie Caching, optimieren Sie die Datenbank, überprüfen Sie auf langsame Abfragen, aktivieren Sie OpCache.

**F: Hohe Speichernutzung**
A: Erhöhen Sie memory_limit, optimieren Sie große Abfragen, implementieren Sie Pagination.

---

## Wartungs-Befehle

### Löschen Sie alle Caches

```bash
#!/bin/bash
# clear_cache.sh
rm -rf xoops_data/caches/xoops_cache/*
rm -rf xoops_data/caches/smarty_cache/*
rm -rf xoops_data/caches/smarty_compile/*
echo "Cache cleared!"
```

### Datenbankoptimierung

```sql
-- Optimize all tables
OPTIMIZE TABLE xoops_config;
OPTIMIZE TABLE xoops_users;
OPTIMIZE TABLE xoops_session;
-- Repeat for other tables

-- Or optimize all at once
mysqlcheck -o -u user -p database
```

### Überprüfen Sie die Datei-Integrität

```bash
# Compare against fresh install
diff -r /path/to/xoops /path/to/fresh-xoops
```

---

## Verwandte Dokumentation

- Getting Started
- Security Best Practices
- XOOPS 4.0 Roadmap

---

## Externe Ressourcen

- [XOOPS Forums](https://xoops.org/modules/newbb/)
- [GitHub Issues](https://github.com/XOOPS/XoopsCore27/issues)
- [PHP Error Reference](https://www.php.net/manual/en/errorfunc.constants.php)

---

#xoops #troubleshooting #debugging #faq #errors #solutions
