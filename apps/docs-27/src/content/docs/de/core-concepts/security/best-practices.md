---
title: "Sicherheits-Best-Practices"
description: "Umfassender Sicherheitsleitfaden für XOOPS-Modulentwicklung"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::tip[Sicherheits-APIs sind über Versionen stabil]
Die hier dokumentierten Sicherheitspraktiken und APIs funktionieren sowohl in XOOPS 2.5.x als auch in XOOPS 4.0.x. Die Core-Sicherheitsklassen (`XoopsSecurity`, `MyTextSanitizer`) bleiben stabil.
:::

Dieses Dokument bietet umfassende Sicherheits-Best-Practices für XOOPS-Modulentwickler. Die Befolgung dieser Richtlinien trägt dazu bei, dass Ihre Module sicher sind und keine Sicherheitslücken in XOOPS-Installationen entstehen.

## Sicherheitsprinzipien

Jeder XOOPS-Entwickler sollte diese grundlegenden Sicherheitsprinzipien befolgen:

1. **Defense in Depth**: Mehrere Sicherheitsebenen implementieren
2. **Least Privilege**: Nur minimale erforderliche Zugriffsrechte gewähren
3. **Eingabevalidierung**: Benutzereingabe niemals vertrauen
4. **Standardmäßig sicher**: Sicherheit sollte die Standardkonfiguration sein
5. **Einfachheit bewahren**: Komplexe Systeme sind schwerer zu sichern

## Verwandte Dokumentation

- CSRF-Protection - Token-System und XoopsSecurity-Klasse
- Input-Sanitization - MyTextSanitizer und Validierung
- SQL-Injection-Prevention - Datenbanksicherheitspraktiken

## Schnellreferenz-Checkliste

Vor der Veröffentlichung Ihres Moduls überprüfen Sie:

- [ ] Alle Formulare enthalten XOOPS-Token
- [ ] Alle Benutzereingaben sind validiert und bereinigt
- [ ] Alle Ausgaben sind ordnungsgemäß escaped
- [ ] Alle Datenbankabfragen verwenden parametrisierte Anweisungen
- [ ] Datei-Uploads sind ordnungsgemäß validiert
- [ ] Authentifizierungs- und Autorisierungsprüfungen sind vorhanden
- [ ] Fehlerbehandlung offenbart keine sensiblen Informationen
- [ ] Sensible Konfiguration ist geschützt
- [ ] Bibliotheken von Drittanbietern sind aktuell
- [ ] Sicherheitstests wurden durchgeführt

## Authentifizierung und Autorisierung

### Überprüfung der Benutzerauthentifizierung

```php
// Check if user is logged in
if (!is_object($GLOBALS['xoopsUser'])) {
    redirect_header(XOOPS_URL, 3, _NOPERM);
    exit();
}
```

### Überprüfung von Benutzergenehmigungen

```php
// Überprüfen Sie, ob der Benutzer Zugriff auf dieses Modul hat
if (!$GLOBALS['xoopsUser']->isAdmin($xoopsModule->mid())) {
    redirect_header(XOOPS_URL, 3, _NOPERM);
    exit();
}

// Überprüfen Sie spezifische Berechtigung
$moduleHandler = xoops_getHandler('module');
$module = $moduleHandler->getByDirname('mymodule');
$moduleperm_handler = xoops_getHandler('groupperm');
$groups = $GLOBALS['xoopsUser']->getGroups();

if (!$moduleperm_handler->checkRight('mymodule_view', $item_id, $groups, $module->getVar('mid'))) {
    redirect_header(XOOPS_URL, 3, _NOPERM);
    exit();
}
```

### Modulberechtigungen einrichten

```php
// Genehmigung in der Installations-/Update-Funktion erstellen
$gpermHandler = xoops_getHandler('groupperm');
$gpermHandler->deleteByModule($module->getVar('mid'), 'mymodule_view');

// Berechtigung für alle Gruppen hinzufügen
$groups = [XOOPS_GROUP_ADMIN, XOOPS_GROUP_USERS, XOOPS_GROUP_ANONYMOUS];
foreach ($groups as $group_id) {
    $gpermHandler->addRight('mymodule_view', 1, $group_id, $module->getVar('mid'));
}
```

## Sitzungssicherheit

### Best Practices für Session-Verwaltung

1. Speichern Sie keine sensiblen Informationen in der Sitzung
2. Regenerieren Sie Session-IDs nach Login/Berechtigungsänderungen
3. Validieren Sie Sitzungsdaten vor der Verwendung

```php
// Session-ID nach dem Login regenerieren
session_regenerate_id(true);

// Sitzungsdaten validieren
if (isset($_SESSION['mymodule_user_id'])) {
    $user_id = (int)$_SESSION['mymodule_user_id'];
    // Überprüfen Sie, ob der Benutzer in der Datenbank existiert
}
```

### Verhinderung von Session-Fixierung

```php
// Nach erfolgreichem Login
session_regenerate_id(true);
$_SESSION['mymodule_user_ip'] = $_SERVER['REMOTE_ADDR'];

// Bei nachfolgenden Anfragen
if ($_SESSION['mymodule_user_ip'] !== $_SERVER['REMOTE_ADDR']) {
    // Möglicher Session-Hijacking-Versuch
    session_destroy();
    redirect_header('index.php', 3, 'Session error');
    exit();
}
```

## Datei-Upload-Sicherheit

### Validierung von Datei-Uploads

```php
// Check if file was uploaded properly
if (!isset($_FILES['userfile']) || $_FILES['userfile']['error'] != UPLOAD_ERR_OK) {
    redirect_header('index.php', 3, 'File upload error');
    exit();
}

// Check file size
if ($_FILES['userfile']['size'] > 1000000) { // 1MB limit
    redirect_header('index.php', 3, 'File too large');
    exit();
}

// Check file type
$allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
if (!in_array($_FILES['userfile']['type'], $allowed_types)) {
    redirect_header('index.php', 3, 'Invalid file type');
    exit();
}

// Validate file extension
$filename = $_FILES['userfile']['name'];
$ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
$allowed_extensions = ['jpg', 'jpeg', 'png', 'gif'];
if (!in_array($ext, $allowed_extensions)) {
    redirect_header('index.php', 3, 'Invalid file extension');
    exit();
}
```

### XOOPS Uploader verwenden

```php
include_once XOOPS_ROOT_PATH . '/class/uploader.php';

$allowed_mimetypes = ['image/gif', 'image/jpeg', 'image/png'];
$maxsize = 1000000; // 1MB
$maxwidth = 1024;
$maxheight = 768;
$upload_dir = XOOPS_ROOT_PATH . '/uploads/mymodule';

$uploader = new XoopsMediaUploader(
    $upload_dir,
    $allowed_mimetypes,
    $maxsize,
    $maxwidth,
    $maxheight
);

if ($uploader->fetchMedia('userfile')) {
    $uploader->setPrefix('mymodule_');

    if ($uploader->upload()) {
        $filename = $uploader->getSavedFileName();
        // Dateiname in der Datenbank speichern
    } else {
        echo $uploader->getErrors();
    }
} else {
    echo $uploader->getErrors();
}
```

### Sichere Speicherung hochgeladener Dateien

```php
// Definieren Sie das Upload-Verzeichnis außerhalb des Web-Root
$upload_dir = XOOPS_VAR_PATH . '/uploads/mymodule';

// Verzeichnis erstellen, falls es nicht existiert
if (!is_dir($upload_dir)) {
    mkdir($upload_dir, 0755, true);
}

// Hochgeladene Datei verschieben
move_uploaded_file($_FILES['userfile']['tmp_name'], $upload_dir . '/' . $safe_filename);
```

## Fehlerbehandlung und Protokollierung

### Sichere Fehlerbehandlung

```php
try {
    $result = someFunction();
    if (!$result) {
        throw new Exception('Operation failed');
    }
} catch (Exception $e) {
    // Fehler protokollieren
    xoops_error($e->getMessage());

    // Generische Fehlermeldung für den Benutzer anzeigen
    redirect_header('index.php', 3, 'An error occurred. Please try again later.');
    exit();
}
```

### Sicherheitsereignisse protokollieren

```php
// Sicherheitsereignisse protokollieren
xoops_loadLanguage('logger', 'mymodule');
$GLOBALS['xoopsLogger']->addExtra('Security', 'Failed login attempt for user: ' . $username);
```

## Konfigurationssicherheit

### Speicherung von sensiblen Konfigurationsdaten

```php
// Definieren Sie den Konfigurationspfad außerhalb des Web-Root
$config_path = XOOPS_VAR_PATH . '/configs/mymodule/config.php';

// Konfiguration laden
if (file_exists($config_path)) {
    include $config_path;
} else {
    // Fehlende Konfiguration behandeln
}
```

### Schutz von Konfigurationsdateien

Verwenden Sie `.htaccess`, um Konfigurationsdateien zu schützen:

```apache
# In .htaccess
<Files "config.php">
    Order Allow,Deny
    Deny from all
</Files>
```

## Bibliotheken von Drittanbietern

### Auswahl von Bibliotheken

1. Wählen Sie aktiv gepflegte Bibliotheken
2. Überprüfen Sie auf Sicherheitslücken
3. Überprüfen Sie, ob die Lizenz der Bibliothek mit XOOPS kompatibel ist

### Aktualisierung von Bibliotheken

```php
// Bibliothekenversion überprüfen
if (version_compare(LIBRARY_VERSION, '1.2.3', '<')) {
    xoops_error('Please update the library to version 1.2.3 or higher');
}
```

### Isolierung von Bibliotheken

```php
// Bibliothek auf kontrollierte Weise laden
function loadLibrary($file)
{
    $allowed = ['parser.php', 'formatter.php'];

    if (!in_array($file, $allowed)) {
        return false;
    }

    include_once XOOPS_ROOT_PATH . '/modules/mymodule/libraries/' . $file;
    return true;
}
```

## Sicherheitstests

### Manuelle Test-Checkliste

1. Testen Sie alle Formulare mit ungültiger Eingabe
2. Versuchen Sie, Authentifizierung und Autorisierung zu umgehen
3. Testen Sie die Datei-Upload-Funktionalität mit böswilligen Dateien
4. Überprüfen Sie auf XSS-Sicherheitslücken in allen Ausgaben
5. Testen Sie auf SQL-Injection in allen Datenbankabfragen

### Automatisierte Tests

Verwenden Sie automatisierte Tools zum Scannen nach Sicherheitslücken:

1. Statische Code-Analyse-Tools
2. Web-Application-Scanner
3. Abhängigkeitsprüfer für Bibliotheken von Drittanbietern

## Ausgabe-Escaping

### HTML-Kontext

```php
// Für reguläre HTML-Inhalte
echo htmlspecialchars($variable, ENT_QUOTES, 'UTF-8');

// Verwendung von MyTextSanitizer
$myts = MyTextSanitizer::getInstance();
echo $myts->htmlSpecialChars($variable);
```

### JavaScript-Kontext

```php
// Für Daten, die in JavaScript verwendet werden
echo json_encode($variable);

// Für Inline-JavaScript
echo 'var data = ' . json_encode($variable) . ';';
```

### URL-Kontext

```php
// Für Daten, die in URLs verwendet werden
echo htmlspecialchars(urlencode($variable), ENT_QUOTES, 'UTF-8');
```

### Template-Variablen

```php
// Variablen dem Smarty-Template zuweisen
$GLOBALS['xoopsTpl']->assign('title', htmlspecialchars($title, ENT_QUOTES, 'UTF-8'));

// Für HTML-Inhalte, die unverändert angezeigt werden sollen
$GLOBALS['xoopsTpl']->assign('content', $myts->displayTarea($content, 1, 1, 1, 1, 1));
```

## Ressourcen

- [OWASP Top Ten](https://owasp.org/www-project-top-ten/)
- [PHP Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/PHP_Configuration_Cheat_Sheet.html)
- [XOOPS Documentation](https://xoops.org/)

---

#security #best-practices #xoops #module-development #authentication #authorization
