---
title: "XOOPS-Glossar"
description: "Definitionen von XOOPS-spezifischen Begriffen und Konzepten"
---

> Umfassendes Glossar der XOOPS-spezifischen Terminologie und Konzepte.

---

## A

### Admin Framework
Das standardisierte Verwaltungsschnittstellen-Framework, das in XOOPS 2.3 eingeführt wurde, bietet konsistente Admin-Seiten über Module.

### Autoloading
Das automatische Laden von PHP-Klassen bei Bedarf unter Verwendung von PSR-4-Standard in modernem XOOPS.

---

## B

### Block
Eine in sich geschlossene Inhaltseinheit, die in Design-Regionen positioniert werden kann. Blöcke können Modul-Inhalte, benutzerdefiniertes HTML oder dynamische Daten anzeigen.

```php
// Block-Definition
$modversion['blocks'][] = [
    'file'      => 'myblock.php',
    'name'      => 'My Block',
    'show_func' => 'mymodule_block_show'
];
```

### Bootstrap
Der Prozess der Initialisierung von XOOPS Core vor der Ausführung von Modul-Code, typischerweise über `mainfile.php` und `header.php`.

---

## C

### Criteria / CriteriaCompo
Klassen zum Erstellen von Datenbankabfrage-Bedingungen auf objekt-orientierte Weise.

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 1));
```

### CSRF (Cross-Site Request Forgery)
Ein Sicherheitsangriff, der in XOOPS durch Sicherheits-Tokens via `XoopsFormHiddenToken` verhindert wird.

---

## D

### DI (Dependency Injection)
Ein Design-Pattern, das für XOOPS 4.0 geplant ist, wobei Abhängigkeiten injiziert werden, anstatt intern erstellt zu werden.

### Dirname
Der Verzeichnisname eines Moduls, verwendet als eindeutige Kennzeichnung im gesamten System.

### DTYPE (Data Type)
Konstanten, die definieren, wie XoopsObject-Variablen gespeichert und bereinigt werden:
- `XOBJ_DTYPE_INT` - Integer
- `XOBJ_DTYPE_TXTBOX` - Text (einzelne Zeile)
- `XOBJ_DTYPE_TXTAREA` - Text (mehrere Zeilen)
- `XOBJ_DTYPE_EMAIL` - E-Mail-Adresse

---

## E

### Event
Ein Ereignis im XOOPS-Lebenszyklus, das benutzerdefinierte Code durch Preloads oder Hooks triggern kann.

---

## F

### Framework
Siehe XMF (XOOPS Module Framework).

### Form Element
Eine Komponente des XOOPS-Formular-Systems, die ein HTML-Formular-Feld darstellt.

---

## G

### Group
Eine Sammlung von Benutzern mit gemeinsamen Berechtigungen. Core-Gruppen umfassen: Webmasters, Registered Users, Anonymous.

---

## H

### Handler
Eine Klasse, die CRUD-Operationen für XoopsObject-Instanzen verwaltet.

```php
$handler = xoops_getModuleHandler('item', 'mymodule');
$item = $handler->get($id);
```

### Helper
Eine Utility-Klasse, die einfachen Zugang zu Modul-Handlern, Konfigurationen und Diensten bietet.

```php
$helper = \XoopsModules\MyModule\Helper::getInstance();
```

---

## K

### Kernel
Die Core-XOOPS-Klassen, die grundlegende Funktionalität bereitstellen: Datenbankzugriff, Benutzerverwaltung, Sicherheit usw.

---

## L

### Language File
PHP-Dateien, die Konstanten für Internationalisierung enthalten, gespeichert in `language/[code]/` Verzeichnissen.

---

## M

### mainfile.php
Die primäre Konfigurationsdatei für XOOPS, die Datenbank-Anmeldeinformationen und Pfad-Definitionen enthält.

### MCP (Model-Controller-Presenter)
Ein Architektur-Pattern ähnlich MVC, oft in XOOPS-Modul-Entwicklung verwendet.

### Middleware
Software, die zwischen Request und Response sitzt, geplant für XOOPS 4.0 unter Verwendung von PSR-15.

### Module
Ein in sich geschlossenes Paket, das die XOOPS-Funktionalität erweitert, installiert im `modules/`-Verzeichnis.

### MOC (Map of Content)
Ein Obsidian-Konzept für Übersichts-Notizen, die mit verwandtem Inhalt verlinkt sind.

---

## N

### Namespace
PHP-Funktion zur Organisation von Klassen, verwendet in XOOPS 2.5+:
```php
namespace XoopsModules\MyModule;
```

### Notification
Das XOOPS-System zum Warnen von Benutzern über Ereignisse via E-Mail oder PM.

---

## O

### Object
Siehe XoopsObject.

---

## P

### Permission
Zugriffskontrolle, verwaltet durch Gruppen und Berechtigungs-Handler.

### Preload
Eine Klasse, die in XOOPS-Ereignisse hookt, automatisch aus `preloads/`-Verzeichnis geladen.

### PSR (PHP Standards Recommendation)
Standards von PHP-FIG, die XOOPS 4.0 vollständig implementieren wird.

---

## R

### Renderer
Eine Klasse, die Formular-Elemente oder andere UI-Komponenten in spezifischen Formaten ausgegeben (Bootstrap, usw.).

---

## S

### Smarty
Die Template-Engine, die von XOOPS verwendet wird, um die Präsentation von der Logik zu trennen.

```smarty
<{$variable}>
<{foreach item=item from=$items}>
    <{$item.title}>
<{/foreach}>
```

### Service
Eine Klasse, die wiederverwendbare Geschäftslogik bereitstellt, typischerweise via Helper zugegriffen.

---

## T

### Template
Eine Smarty-Datei (`.tpl` oder `.html`), die die Präsentations-Schicht für Module definiert.

### Theme
Eine Sammlung von Templates und Vermögenswerten, die das visuelle Erscheinungsbild der Website definiert.

### Token
Ein Sicherheits-Mechanismus (CSRF-Schutz), der sicherstellt, dass Formular-Übermittlungen von legitimen Quellen stammen.

---

## U

### uid
User ID - die eindeutige Kennzeichnung für jeden Benutzer im System.

---

## V

### Variable (Var)
Ein Feld, das auf einem XoopsObject mit `initVar()` definiert ist.

---

## W

### Widget
Eine kleine, in sich geschlossene UI-Komponente, ähnlich Blöcken.

---

## X

### XMF (XOOPS Module Framework)
Eine Sammlung von Utilities und Klassen für moderne XOOPS-Modul-Entwicklung.

### XOBJ_DTYPE
Konstanten zum Definieren von Variablendatentypen in XoopsObject.

### XoopsDatabase
Die Datenbank-Abstraktionsschicht, die Abfrageausführung und Escaping bereitstellt.

### XoopsForm
Das Formular-Generierungs-System zum programmgesteuerten Erstellen von HTML-Formularen.

### XoopsObject
Die Basis-Klasse für alle Datenobjekte in XOOPS, bietet Variablenverwaltung und Bereinigung.

### xoops_version.php
Die Modul-Manifest-Datei, die Modul-Eigenschaften, Tabellen, Blöcke, Templates und Konfiguration definiert.

---

## Gemeinsame Akronyme

| Akronym | Bedeutung |
|---------|-----------|
| XOOPS | eXtensible Object-Oriented Portal System |
| XMF | XOOPS Module Framework |
| CSRF | Cross-Site Request Forgery |
| XSS | Cross-Site Scripting |
| ORM | Object-Relational Mapping |
| PSR | PHP Standards Recommendation |
| DI | Dependency Injection |
| MVC | Model-View-Controller |
| CRUD | Create, Read, Update, Delete |

---

## Verwandte Dokumentation

- Core Concepts
- API Reference
- External Resources

---

#xoops #glossary #reference #terminology #definitions
